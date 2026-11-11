import prisma from "../configs/db.js";

export const getAlumniDirectory = async ({
  departmentId,
  graduationYear,
  company,
  search,
  skip = 0,
  take = 20,
}) => {
  const where = {
    role: "ALUMNI",
    isActive: true,
  };

  if (departmentId) where.departmentId = departmentId;
  if (graduationYear) where.graduationYear = Number(graduationYear);
  if (company) {
    where.currentCompany = { contains: company, mode: "insensitive" };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { currentCompany: { contains: search, mode: "insensitive" } },
      { jobTitle: { contains: search, mode: "insensitive" } },
      { skills: { contains: search, mode: "insensitive" } },
    ];
  }

  const [alumni, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        graduationYear: true,
        currentCompany: true,
        jobTitle: true,
        skills: true,
        department: { select: { id: true, name: true, collegeName: true } },
      },
      orderBy: { graduationYear: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { alumni, total };
};

export default {
  getAlumniDirectory,
};
