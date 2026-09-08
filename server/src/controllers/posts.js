import pool from "../db/index.js";

export const createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim() === "")
    return res.status(400).json({ error: "Content is required" });

  if (content.length > 500)
    return res.status(400).json({ error: "Post cannot exceed 500 characters" });

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, content)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, content],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Post not found or not yours" });

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT p.*, u.username, u.name, u.avatar_url,
              COUNT(l.post_id) AS like_count,
              EXISTS (
                SELECT 1 FROM likes
                WHERE post_id = p.id AND user_id = $2
              ) AS liked_by_me
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN likes l ON l.post_id = p.id
       WHERE p.id = $1
       GROUP BY p.id, u.username, u.name, u.avatar_url`,
      [id, userId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Post not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserPosts = async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT p.*, u.username, u.name, u.avatar_url,
              COUNT(l.post_id) AS like_count,
              EXISTS (
                SELECT 1 FROM likes
                WHERE post_id = p.id AND user_id = $2
              ) AS liked_by_me
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN likes l ON l.post_id = p.id
       WHERE u.username = $1
       GROUP BY p.id, u.username, u.name, u.avatar_url
       ORDER BY p.created_at DESC
       LIMIT $3 OFFSET $4`,
      [username, userId, limit, offset],
    );

    res.json({
      posts: result.rows,
      page,
      hasMore: result.rows.length === limit,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await pool.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [
      userId,
      id,
    ]);

    res.status(201).json({ message: "Post liked" });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "Already liked" });
    res.status(500).json({ error: "Server error" });
  }
};

export const unlikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await pool.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [
      userId,
      id,
    ]);

    res.json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT p.*, u.username, u.name, u.avatar_url,
              COUNT(l.post_id) AS like_count,
              EXISTS (
                SELECT 1 FROM likes
                WHERE post_id = p.id AND user_id = $2
              ) AS liked_by_me
       FROM posts p
       JOIN users u ON u.id = p.user_id
       -- Inner join to filter only posts liked by the target user
       JOIN likes tl ON tl.post_id = p.id
       JOIN users tu ON tu.id = tl.user_id
       -- Left join to count total likes for the post
       LEFT JOIN likes l ON l.post_id = p.id
       WHERE tu.username = $1
       GROUP BY p.id, u.username, u.name, u.avatar_url, tl.created_at
       ORDER BY tl.created_at DESC
       LIMIT $3 OFFSET $4`,
      [username, userId, limit, offset],
    );

    res.json({
      posts: result.rows,
      page,
      hasMore: result.rows.length === limit,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
