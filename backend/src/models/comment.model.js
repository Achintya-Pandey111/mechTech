import prisma from "../configs/db.js";

export const createComment = async (data) => {
  return prisma.comment.create({
    data,
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
  });
};

export const getCommentsByPost = async (postId) => {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  });
};

export const deleteComment = async (id) => {
  return prisma.comment.delete({
    where: { id },
  });
};

export default {
  createComment,
  getCommentsByPost,
  deleteComment,
};
