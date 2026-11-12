import { Router } from "express";
import { listAlumniDirectory, getUserDetails } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.get("/alumni-directory", listAlumniDirectory);
router.get("/:id", getUserDetails);

export default router;
