import { Router } from "express";
import {
  addDepartment,
  listDepartments,
  editDepartment,
  removeDepartment,
  listAllUsers,
  toggleUserActiveStatus,
  getPlatformStats,
} from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/role.js";

const router = Router();

// Protect all admin routes with authentication and ADMIN role check
router.use(authenticate, authorizeRoles("ADMIN"));

// Platform Stats
router.get("/stats", getPlatformStats);

// Departments
router.get("/departments", listDepartments);
router.post("/departments", addDepartment);
router.put("/departments/:id", editDepartment);
router.delete("/departments/:id", removeDepartment);

// Users Management
router.get("/users", listAllUsers);
router.patch("/users/:id/status", toggleUserActiveStatus);

export default router;
