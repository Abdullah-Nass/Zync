import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getFeed } from "../controllers/feed.js";

const router = Router();

router.use(authenticate);

router.get("/", getFeed);

export default router;
