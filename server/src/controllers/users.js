import pool from "../db/index.js";

export const getUser = async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.username,
        u.name,
        u.bio,
        u.avatar_url,
        u.created_at,

        (
          SELECT COUNT(*)
          FROM follows f
          WHERE f.following_id = u.id
        ) AS followers_count,

        (
          SELECT COUNT(*)
          FROM follows f
          WHERE f.follower_id = u.id
        ) AS following_count,

        EXISTS (
          SELECT 1
          FROM follows f
          WHERE f.follower_id = $2
            AND f.following_id = u.id
        ) AS is_following

      FROM users u
      WHERE u.username = $1
      `,
      [username, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const editUser = async (req, res) => {
  const userId = req.user.id;
  const { name, username: newUsername, bio, avatar_url } = req.body;

  try {
    if (newUsername) {
      const taken = await pool.query(
        "SELECT id FROM users WHERE username = $1 AND id != $2",
        [newUsername, userId],
      );

      if (taken.rows.length > 0) {
        return res.status(409).json({
          error: "Username already taken",
        });
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           username = COALESCE($2, username),
           bio = COALESCE($3, bio),
           avatar_url = COALESCE($4, avatar_url)
       WHERE id = $5
       RETURNING id, name, username, email, bio, avatar_url, created_at`,
      [name, newUsername, bio, avatar_url, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getFollowers = async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
         u.id, 
         u.username, 
         u.name, 
         u.avatar_url,
         EXISTS (
           SELECT 1 FROM follows 
           WHERE follower_id = $2 AND following_id = u.id
         ) AS is_following
       FROM follows f
       JOIN users u ON u.id = f.follower_id
       WHERE f.following_id = (
         SELECT id FROM users WHERE username = $1
       )
       ORDER BY f.created_at DESC
       LIMIT $3 OFFSET $4`,
      [username, userId, limit + 1, offset],
    );

    const hasMore = result.rows.length > limit;
    const users = hasMore ? result.rows.slice(0, limit) : result.rows;

    res.json({
      users,
      page,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getFollowing = async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
         u.id, 
         u.username, 
         u.name, 
         u.avatar_url,
         EXISTS (
           SELECT 1 FROM follows 
           WHERE follower_id = $2 AND following_id = u.id
         ) AS is_following
       FROM follows f
       JOIN users u ON u.id = f.following_id
       WHERE f.follower_id = (
         SELECT id FROM users WHERE username = $1
       )
       ORDER BY f.created_at DESC
       LIMIT $3 OFFSET $4`,
      [username, userId, limit + 1, offset],
    );

    const hasMore = result.rows.length > limit;
    const users = hasMore ? result.rows.slice(0, limit) : result.rows;

    res.json({
      users,
      page,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const followUser = async (req, res) => {
  const { username } = req.params;
  const followerId = req.user.id;

  try {
    const target = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );

    if (target.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const followingId = target.rows[0].id;

    if (followerId === followingId)
      return res.status(400).json({ error: "You cannot follow yourself" });

    await pool.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)",
      [followerId, followingId],
    );

    res.status(201).json({ message: "Followed" });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "Already following" });
    res.status(500).json({ error: "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
  const { username } = req.params;
  const followerId = req.user.id;

  try {
    const target = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username],
    );

    if (target.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const followingId = target.rows[0].id;

    await pool.query(
      "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId],
    );

    res.json({ message: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getWhoToFollow = async (req, res) => {
  const userId = req.user.id;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
         id, 
         name, 
         username, 
         avatar_url, 
         bio,
         false AS is_following
       FROM users
       WHERE id != $1
       AND id NOT IN (
         SELECT following_id FROM follows WHERE follower_id = $1
       )
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit + 1, offset],
    );

    const hasMore = result.rows.length > limit;
    const users = hasMore ? result.rows.slice(0, limit) : result.rows;

    res.json({
      users,
      page,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
export const searchUsers = async (req, res) => {
  const userId = req.user.id;
  const query = (req.query.q || "").trim();

  if (!query) {
    return res.json({ users: [], page: 1, hasMore: false });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
         u.id, 
         u.username, 
         u.name, 
         u.avatar_url,
         u.bio,
         EXISTS (
           SELECT 1 FROM follows 
           WHERE follower_id = $1 AND following_id = u.id
         ) AS is_following
       FROM users u
       WHERE (u.username ILIKE $2 OR u.name ILIKE $2)
         AND u.id != $1
       ORDER BY 
         -- Exact match on username first
         CASE WHEN LOWER(u.username) = LOWER($3) THEN 0
              -- Starts with query next
              WHEN LOWER(u.username) LIKE LOWER($4) THEN 1
              ELSE 2
         END,
         u.username ASC
       LIMIT $5 OFFSET $6`,
      [userId, `%${query}%`, query, `${query}%`, limit + 1, offset],
    );

    const hasMore = result.rows.length > limit;
    const users = hasMore ? result.rows.slice(0, limit) : result.rows;

    res.json({
      users,
      page,
      hasMore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
