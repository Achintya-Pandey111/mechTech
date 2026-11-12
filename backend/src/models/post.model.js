import prisma from "../configs/db.js";

export const createPost = async (data) => {
  return prisma.post.create({
    data,
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
  });
};

export const getAllPosts = async ({ skip = 0, take = 20, authorId }) => {
  const where = {};
  if (authorId) where.authorId = authorId;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take,
      include: {
        author: { select: { id: true, name: true, role: true } },
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total };
};

export const getPostById = async (id) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, role: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      likes: {
        select: { userId: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });
};

export const updatePost = async (id, data) => {
  return prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = async (id) => {
  return prisma.post.delete({
    where: { id },
  });
};

export default {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
