import prisma from "../configs/db.js";

export const createApplication = async (data) => {
  return prisma.application.create({
    data,
    include: {
      opportunity: true,
      student: { select: { id: true, name: true, email: true, department: true } },
    },
  });
};

export const getApplicationsByOpportunity = async (opportunityId) => {
  return prisma.application.findMany({
    where: { opportunityId },
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
    orderBy: { appliedAt: "desc" },
  });
};

export const getApplicationsByStudent = async (studentId) => {
  return prisma.application.findMany({
    where: { studentId },
    include: {
      opportunity: {
        include: {
          postedBy: {
            select: { id: true, name: true, currentCompany: true },
          },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
};

export const updateApplicationStatus = async (id, status) => {
  return prisma.application.update({
    where: { id },
    data: { status },
  });
};

export default {
  createApplication,
  getApplicationsByOpportunity,
  getApplicationsByStudent,
  updateApplicationStatus,
};
