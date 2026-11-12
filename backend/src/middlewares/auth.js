import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/generateToken.js";
import prisma from "../configs/db.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication token is missing or malformed");
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        student: true,
        alumni: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "User belonging to this token no longer exists");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account has been deactivated. Please contact support");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
