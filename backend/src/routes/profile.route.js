import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.get("/me", getProfile);
router.get("/:userId", getProfile);
router.put("/", updateProfile);
router.put("/student", updateProfile);
router.put("/alumni", updateProfile);

export default router;
