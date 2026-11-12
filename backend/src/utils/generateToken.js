import jwt from "jsonwebtoken";
import env from "../configs/env.js";

export const generateToken = (payload, expiresIn = env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export default {
  generateToken,
  verifyToken,
};
