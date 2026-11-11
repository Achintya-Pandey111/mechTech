import app from "./app.js";
import env from "./configs/env.js";
import prisma from "./configs/db.js";

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 AlumniConnect Backend running in ${env.NODE_ENV} mode`);
  console.log(`🌐 Server listening at: http://localhost:${PORT}`);
  console.log(`🩺 Health check at: http://localhost:${PORT}/api/v1/health`);
});

const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    await prisma.$disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
