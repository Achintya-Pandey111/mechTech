import { Router } from "express";
import {
  requestMentorship,
  getMyMentorships,
  respondToMentorship,
} from "../controllers/mentorship.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.post("/", requestMentorship);
router.get("/", getMyMentorships);
router.patch("/:id", respondToMentorship);

export default router;
