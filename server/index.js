import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import rateLimit from "express-rate-limit";

import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/posts.js";
import userRoutes from "./src/routes/users.js";
import feedRoutes from "./src/routes/feed.js";
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later" },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://zync-app.netlify.app",
    credentials: true,
  }),
);
app.use(generalLimiter);
app.use("/auth", authLimiter);

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", true);

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/feed", feedRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
