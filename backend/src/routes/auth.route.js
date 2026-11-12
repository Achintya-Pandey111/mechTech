import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);

export default router;
