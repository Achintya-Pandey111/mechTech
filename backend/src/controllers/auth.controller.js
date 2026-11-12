import prisma from "../configs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "STUDENT",
      departmentId,
      graduationYear,
      batchYear,
      studentNumber,
      currentCompany,
      jobTitle,
      skills,
    } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    if (!["STUDENT", "ALUMNI", "ADMIN"].includes(role)) {
      throw new ApiError(400, "Role must be STUDENT, ALUMNI, or ADMIN");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    // Default to first department if not passed
    let assignedDeptId = departmentId;
    if (!assignedDeptId) {
      const defaultDept = await prisma.department.findFirst();
      assignedDeptId = defaultDept ? defaultDept.id : null;
    }

    if (!assignedDeptId) {
      throw new ApiError(400, "A valid departmentId is required");
    }

    const passwordHash = await hashPassword(password);

    // Single clean create query (No complex multi-table transaction needed!)
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        departmentId: assignedDeptId,
        studentNumber: studentNumber || null,
        batchYear: batchYear ? Number(batchYear) : null,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        currentCompany: currentCompany || null,
        jobTitle: jobTitle || null,
        skills: skills || null,
      },
      include: {
        department: true,
      },
    });

    const token = generateToken({ id: newUser.id, role: newUser.role, email: newUser.email });
    const { passwordHash: _, ...safeUser } = newUser;

    return res
      .status(201)
      .json(new ApiResponse(201, { user: safeUser, token }, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        department: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account is deactivated. Please contact an administrator.");
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken({ id: user.id, role: user.role, email: user.email });
    const { passwordHash: _, ...safeUser } = user;

    return res
      .status(200)
      .json(new ApiResponse(200, { user: safeUser, token }, "Logged in successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { passwordHash: _, ...safeUser } = req.user;
    return res.status(200).json(new ApiResponse(200, { user: safeUser }, "Current user retrieved"));
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getCurrentUser,
};
