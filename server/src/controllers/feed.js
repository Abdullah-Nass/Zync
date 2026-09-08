import pool from "../db/index.js";

export const getFeed = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const query = `
      SELECT 
        p.*, 
        u.username, 
        u.name, 
        u.avatar_url,
        COUNT(l.post_id)::int AS like_count,
        EXISTS (
          SELECT 1 FROM likes
          WHERE post_id = p.id AND user_id = $1
        ) AS liked_by_me
      FROM posts p
      JOIN users u ON u.id = p.user_id
      JOIN follows f ON f.following_id = p.user_id AND f.follower_id = $1
      LEFT JOIN likes l ON l.post_id = p.id
      GROUP BY p.id, u.username, u.name, u.avatar_url
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;

    const result = await pool.query(query, [userId, limit, offset]);

    res.json({
      posts: result.rows,
      page,
      hasMore: result.rows.length === limit,
    });
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
