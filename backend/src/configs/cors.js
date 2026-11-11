import env from "./env.js";

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (such as Electron desktop app, curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === "development") {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

export default corsOptions;
