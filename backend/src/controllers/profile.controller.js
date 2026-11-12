import prisma from "../configs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        studentNumber: true,
        batchYear: true,
        graduationYear: true,
        currentCompany: true,
        jobTitle: true,
        skills: true,
        createdAt: true,
        department: { select: { id: true, name: true, collegeName: true } },
      },
    });

    if (!user) {
      throw new ApiError(404, "Profile not found");
    }

    return res.status(200).json(new ApiResponse(200, { profile: user }, "Profile retrieved"));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      studentNumber,
      batchYear,
      graduationYear,
      currentCompany,
      jobTitle,
      skills,
      departmentId,
    } = req.body;

    const data = {};
    if (name) data.name = name.trim();
    if (studentNumber !== undefined) data.studentNumber = studentNumber;
    if (batchYear !== undefined) data.batchYear = batchYear ? Number(batchYear) : null;
    if (graduationYear !== undefined) data.graduationYear = graduationYear ? Number(graduationYear) : null;
    if (currentCompany !== undefined) data.currentCompany = currentCompany;
    if (jobTitle !== undefined) data.jobTitle = jobTitle;
    if (skills !== undefined) data.skills = skills;
    if (departmentId !== undefined) data.departmentId = departmentId;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      include: { department: true },
    });

    const { passwordHash: _, ...safeUser } = updated;
    return res.status(200).json(new ApiResponse(200, { user: safeUser }, "Profile updated"));
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
};
