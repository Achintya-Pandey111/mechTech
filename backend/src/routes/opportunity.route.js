import { Router } from "express";
import {
  addOpportunity,
  listOpportunities,
  getSingleOpportunity,
  editOpportunity,
  removeOpportunity,
  applyForOpportunity,
  listOpportunityApplications,
  getMyApplications,
  updateAppStatus,
} from "../controllers/opportunity.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/role.js";

const router = Router();

router.use(authenticate);

// Opportunities
router.get("/", listOpportunities);
router.post("/", authorizeRoles("ALUMNI", "ADMIN"), addOpportunity);

// Student Applications
router.get("/my-applications", authorizeRoles("STUDENT"), getMyApplications);

router.get("/:id", getSingleOpportunity);
router.put("/:id", authorizeRoles("ALUMNI", "ADMIN"), editOpportunity);
router.delete("/:id", authorizeRoles("ALUMNI", "ADMIN"), removeOpportunity);

router.post("/:id/apply", authorizeRoles("STUDENT"), applyForOpportunity);
router.get("/:id/applications", authorizeRoles("ALUMNI", "ADMIN"), listOpportunityApplications);
router.patch("/applications/:applicationId/status", authorizeRoles("ALUMNI", "ADMIN"), updateAppStatus);

export default router;
