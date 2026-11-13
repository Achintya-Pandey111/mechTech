import prisma from "../configs/db.js";

export const togglePostLike = async (userId, postId) => {
  const existing = await prisma.postLike.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existing) {
    await prisma.postLike.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
    return { liked: false };
  } else {
    await prisma.postLike.create({
      data: { userId, postId },
    });
    return { liked: true };
  }
};

export const hasUserLikedPost = async (userId, postId) => {
  const like = await prisma.postLike.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });
  return Boolean(like);
};

export const getPostLikesCount = async (postId) => {
  return prisma.postLike.count({
    where: { postId },
  });
};

export default {
  togglePostLike,
  hasUserLikedPost,
  getPostLikesCount,
};
