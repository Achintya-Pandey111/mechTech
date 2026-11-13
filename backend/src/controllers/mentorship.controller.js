import prisma from "../configs/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createMentorshipRequest,
  findMentorshipById,
  getMentorshipsByStudent,
  getMentorshipsByAlumni,
  updateMentorshipStatus,
} from "../models/mentorship.model.js";

export const requestMentorship = async (req, res, next) => {
  try {
    const studentUser = req.user;
    if (studentUser.role !== "STUDENT") {
      throw new ApiError(403, "Only students can request mentorship");
    }

    const { alumniId, message } = req.body;
    if (!alumniId) {
      throw new ApiError(400, "alumniId is required");
    }

    const alumni = await prisma.user.findUnique({
      where: { id: alumniId },
    });

    if (!alumni || alumni.role !== "ALUMNI") {
      throw new ApiError(404, "Target alumnus not found");
    }

    // Check existing pending request
    const existing = await prisma.mentorship.findFirst({
      where: {
        studentId: studentUser.id,
        alumniId,
        status: "PENDING",
      },
    });

    if (existing) {
      throw new ApiError(409, "You already have a pending mentorship request with this alumnus");
    }

    const mentorship = await createMentorshipRequest({
      studentId: studentUser.id,
      alumniId,
      message: message?.trim() || null,
    });

    return res.status(201).json(new ApiResponse(201, { mentorship }, "Mentorship request sent"));
  } catch (error) {
    next(error);
  }
};

export const getMyMentorships = async (req, res, next) => {
  try {
    const user = req.user;
    let mentorships = [];

    if (user.role === "STUDENT") {
      mentorships = await getMentorshipsByStudent(user.id);
    } else if (user.role === "ALUMNI") {
      mentorships = await getMentorshipsByAlumni(user.id);
    } else {
      mentorships = await prisma.mentorship.findMany({
        include: {
          student: { select: { id: true, name: true, email: true } },
          alumni: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return res.status(200).json(new ApiResponse(200, { mentorships }, "Mentorships retrieved"));
  } catch (error) {
    next(error);
  }
};

export const respondToMentorship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED, REJECTED, COMPLETED

    if (!["ACCEPTED", "REJECTED", "COMPLETED"].includes(status)) {
      throw new ApiError(400, "Invalid status. Must be ACCEPTED, REJECTED, or COMPLETED");
    }

    const mentorship = await findMentorshipById(id);
    if (!mentorship) {
      throw new ApiError(404, "Mentorship request not found");
    }

    if (req.user.role === "ALUMNI" && req.user.id !== mentorship.alumniId) {
      throw new ApiError(403, "Not authorized to update this mentorship request");
    }

    // Single clean update query - easy to explain!
    const updated = await updateMentorshipStatus(id, status);

    return res
      .status(200)
      .json(new ApiResponse(200, { mentorship: updated }, `Mentorship ${status.toLowerCase()}`));
  } catch (error) {
    next(error);
  }
};

export default {
  requestMentorship,
  getMyMentorships,
  respondToMentorship,
};
