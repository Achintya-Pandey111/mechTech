import express from "express";
import cors from "cors";
import corsOptions from "./configs/cors.js";
import apiRouter from "./routes/index.js";
import errorHandler from "./middlewares/error.js";
import ApiError from "./utils/ApiError.js";

const app = express();

// Global Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to AlumniConnect API",
    docs: "/api/v1/health",
  });
});

// API Routes
app.use("/api/v1", apiRouter);

// Handle 404 - Not Found
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
