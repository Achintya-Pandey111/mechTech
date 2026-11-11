import prisma from "../configs/db.js";

export const createDepartment = async (data) => {
  return prisma.department.create({ data });
};

export const getAllDepartments = async () => {
  return prisma.department.findMany({
    include: {
      _count: { select: { users: true } },
    },
    orderBy: { name: "asc" },
  });
};

export const findDepartmentById = async (id) => {
  return prisma.department.findUnique({
    where: { id },
    include: { users: true },
  });
};

export const updateDepartment = async (id, data) => {
  return prisma.department.update({
    where: { id },
    data,
  });
};

export const deleteDepartment = async (id) => {
  return prisma.department.delete({
    where: { id },
  });
};

export default {
  createDepartment,
  getAllDepartments,
  findDepartmentById,
  updateDepartment,
  deleteDepartment,
};
