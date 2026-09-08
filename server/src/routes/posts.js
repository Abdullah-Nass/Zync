import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createPost,
  deletePost,
  getLikedPosts,
  getPost,
  getUserPosts,
  likePost,
  unlikePost,
} from "../controllers/posts.js";

const router = Router();

router.use(authenticate);

router.post("/", createPost);
router.delete("/:id", deletePost);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.get("/liked/:username", getLikedPosts);
router.post("/:id/like", likePost);
router.delete("/:id/like", unlikePost);

export default router;
