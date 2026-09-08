import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getUser,
  editUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getWhoToFollow,
  searchUsers,
} from "../controllers/users.js";

const router = Router();

router.use(authenticate);

router.get("/suggestions", getWhoToFollow);
router.get("/search", searchUsers);
router.put("/edit", editUser);
router.get("/:username/followers", getFollowers);
router.get("/:username/following", getFollowing);
router.post("/:username/follow", followUser);
router.delete("/:username/follow", unfollowUser);
router.get("/:username", getUser);

export default router;
