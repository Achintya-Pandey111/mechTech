import { Router } from "express";
import {
  addPost,
  listPosts,
  getSinglePost,
  removePost,
  addComment,
  removeComment,
  handleLike,
} from "../controllers/forum.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.get("/posts", listPosts);
router.post("/posts", addPost);
router.get("/posts/:id", getSinglePost);
router.delete("/posts/:id", removePost);

router.post("/posts/:id/comments", addComment);
router.delete("/posts/comments/:commentId", removeComment);

router.post("/posts/:id/like", handleLike);

export default router;
