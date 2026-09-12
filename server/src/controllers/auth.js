import pool from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const isProduction = process.env.NODE_ENV === "production";

// Defining the security and delivery rules
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

export const register = async (req, res) => {
  const { name, username, email, password } = req.body;

  // 1. Check existence and string types
  if (
    typeof name !== "string" ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const trimmedName = name.trim();
  const trimmedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if all fields exist
  if (!trimmedName || !trimmedUsername || !normalizedEmail || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (trimmedUsername.length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters" });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    return res
      .status(400)
      .json({ error: "Only letters, numbers and underscores" });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [normalizedEmail, trimmedUsername],
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email or username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, username, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, username, email, created_at`,
      [trimmedName, trimmedUsername, normalizedEmail, hashed],
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .cookie("token", token, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ safeUser: user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "All fields are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      normalizedEmail,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...safeUser } = user;
    res
      .cookie("token", token, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ safeUser });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS).json({ message: "Logged out" });
};

export const me = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.name,
        u.username,
        u.email,
        u.bio,
        u.avatar_url,
        u.created_at,
        COUNT(DISTINCT f1.follower_id) AS followers_count,
        COUNT(DISTINCT f2.following_id) AS following_count
       FROM users u
       LEFT JOIN follows f1 
         ON f1.following_id = u.id
       LEFT JOIN follows f2 
         ON f2.follower_id = u.id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ safeUser: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
