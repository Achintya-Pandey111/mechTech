import { Router } from "express";
import authRoutes from "./auth.route.js";
import profileRoutes from "./profile.route.js";
import userRoutes from "./user.route.js";
import forumRoutes from "./forum.route.js";
import mentorshipRoutes from "./mentorship.route.js";
import opportunityRoutes from "./opportunity.route.js";
import adminRoutes from "./admin.route.js";

const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AlumniConnect Backend API",
  });
});

// Modular Routes for 8 Core Tables
apiRouter.use("/auth", authRoutes);
apiRouter.use("/profiles", profileRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/forum", forumRoutes);
apiRouter.use("/mentorships", mentorshipRoutes);
apiRouter.use("/opportunities", opportunityRoutes);
apiRouter.use("/admin", adminRoutes);

export default apiRouter;
