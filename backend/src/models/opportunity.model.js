import prisma from "../configs/db.js";

export const createOpportunity = async (data) => {
  return prisma.opportunity.create({
    data,
    include: {
      postedBy: {
        select: { id: true, name: true, email: true, currentCompany: true, jobTitle: true },
      },
    },
  });
};

export const getAllOpportunities = async ({ type, search, skip = 0, take = 20 }) => {
  const where = {};
  if (type) where.type = type;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  const [opportunities, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      skip,
      take,
      include: {
        postedBy: {
          select: { id: true, name: true, currentCompany: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.opportunity.count({ where }),
  ]);

  return { opportunities, total };
};

export const getOpportunityById = async (id) => {
  return prisma.opportunity.findUnique({
    where: { id },
    include: {
      postedBy: {
        select: { id: true, name: true, email: true, currentCompany: true, jobTitle: true },
      },
      applications: {
        include: {
          student: {
            select: { id: true, name: true, email: true, department: true },
          },
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });
};

export const updateOpportunity = async (id, data) => {
  return prisma.opportunity.update({
    where: { id },
    data,
  });
};

export const deleteOpportunity = async (id) => {
  return prisma.opportunity.delete({
    where: { id },
  });
};

export default {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
};
