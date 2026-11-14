import prisma from "../configs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../models/department.model.js";
import { getAllUsers, updateUser } from "../models/user.model.js";

// Departments
export const addDepartment = async (req, res, next) => {
  try {
    const { name, collegeName } = req.body;
    if (!name) throw new ApiError(400, "Department name is required");

    const department = await createDepartment({
      name: name.trim(),
      ...(collegeName && { collegeName: collegeName.trim() }),
    });
    return res.status(201).json(new ApiResponse(201, { department }, "Department created"));
  } catch (error) {
    next(error);
  }
};

export const listDepartments = async (req, res, next) => {
  try {
    const departments = await getAllDepartments();
    return res.status(200).json(new ApiResponse(200, { departments }, "Departments retrieved"));
  } catch (error) {
    next(error);
  }
};

export const editDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, collegeName } = req.body;

    const department = await updateDepartment(id, {
      ...(name && { name: name.trim() }),
      ...(collegeName && { collegeName: collegeName.trim() }),
    });
    return res.status(200).json(new ApiResponse(200, { department }, "Department updated"));
  } catch (error) {
    next(error);
  }
};

export const removeDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteDepartment(id);
    return res.status(200).json(new ApiResponse(200, null, "Department deleted"));
  } catch (error) {
    next(error);
  }
};

// Users management
export const listAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const { users, total } = await getAllUsers({ role, skip, take, search });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Users retrieved"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const toggleUserActiveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      throw new ApiError(400, "isActive boolean is required");
    }

    const updatedUser = await updateUser(id, { isActive: Boolean(isActive) });
    const { passwordHash: _, ...safeUser } = updatedUser;

    return res.status(200).json(new ApiResponse(200, { user: safeUser }, "User status updated"));
  } catch (error) {
    next(error);
  }
};

// Platform Stats & Aggregations (Lectures 4 & 5: COUNT, Group By)
export const getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalAlumni,
      totalDepartments,
      totalPosts,
      totalOpportunities,
      totalApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "ALUMNI" } }),
      prisma.department.count(),
      prisma.post.count(),
      prisma.opportunity.count(),
      prisma.application.count(),
    ]);

    // Lecture 5: Multi-column Grouping Showcase
    const usersByDepartmentAndRole = await prisma.user.groupBy({
      by: ["departmentId", "role"],
      _count: { id: true },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalUsers,
          totalStudents,
          totalAlumni,
          totalDepartments,
          totalPosts,
          totalOpportunities,
          totalApplications,
          usersByDepartmentAndRole,
        },
        "Platform statistics retrieved"
      )
    );
  } catch (error) {
    next(error);
  }
};

export default {
  addDepartment,
  listDepartments,
  editDepartment,
  removeDepartment,
  listAllUsers,
  toggleUserActiveStatus,
  getPlatformStats,
};
