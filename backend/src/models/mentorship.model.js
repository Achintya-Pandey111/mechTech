import prisma from "../configs/db.js";

export const createMentorshipRequest = async (data) => {
  return prisma.mentorship.create({
    data,
    include: {
      student: { select: { id: true, name: true, email: true, department: true } },
      alumni: { select: { id: true, name: true, email: true, currentCompany: true, jobTitle: true } },
    },
  });
};

export const findMentorshipById = async (id) => {
  return prisma.mentorship.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true, email: true, department: true } },
      alumni: { select: { id: true, name: true, email: true, currentCompany: true, jobTitle: true } },
    },
  });
};

export const getMentorshipsByStudent = async (studentId) => {
  return prisma.mentorship.findMany({
    where: { studentId },
    include: {
      alumni: {
        select: {
          id: true,
          name: true,
          email: true,
          currentCompany: true,
          jobTitle: true,
          graduationYear: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getMentorshipsByAlumni = async (alumniId) => {
  return prisma.mentorship.findMany({
    where: { alumniId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          batchYear: true,
          graduationYear: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateMentorshipStatus = async (id, status) => {
  return prisma.mentorship.update({
    where: { id },
    data: { status },
  });
};

export default {
  createMentorshipRequest,
  findMentorshipById,
  getMentorshipsByStudent,
  getMentorshipsByAlumni,
  updateMentorshipStatus,
};
