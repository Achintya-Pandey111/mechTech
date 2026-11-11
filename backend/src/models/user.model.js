import prisma from "../configs/db.js";

export const createUser = async (data) => {
  return prisma.user.create({
    data,
    include: { department: true },
  });
};

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: { department: true },
  });
};

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    include: { department: true },
  });
};

export const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    include: { department: true },
  });
};

export const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const getAllUsers = async ({ role, skip = 0, take = 20, search }) => {
  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
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
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
