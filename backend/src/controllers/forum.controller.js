import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
} from "../models/post.model.js";
import { createComment, deleteComment } from "../models/comment.model.js";
import { togglePostLike } from "../models/postLike.model.js";

export const addPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    if (!content) {
      throw new ApiError(400, "Content is required to create a post");
    }

    const post = await createPost({
      title: title?.trim() || null,
      content: content.trim(),
      authorId,
    });

    return res.status(201).json(new ApiResponse(201, { post }, "Post created successfully"));
  } catch (error) {
    next(error);
  }
};

export const listPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, authorId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const { posts, total } = await getAllPosts({ skip, take, authorId });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          posts,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        "Posts retrieved"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getSinglePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    return res.status(200).json(new ApiResponse(200, { post }, "Post details retrieved"));
  } catch (error) {
    next(error);
  }
};

export const removePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.authorId !== req.user.id && req.user.role !== "ADMIN") {
      throw new ApiError(403, "You do not have permission to delete this post");
    }

    await deletePost(id);
    return res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    if (!content) {
      throw new ApiError(400, "Comment content cannot be empty");
    }

    const comment = await createComment({
      postId,
      authorId,
      content: content.trim(),
    });

    return res.status(201).json(new ApiResponse(201, { comment }, "Comment added"));
  } catch (error) {
    next(error);
  }
};

export const removeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await deleteComment(commentId);
    return res.status(200).json(new ApiResponse(200, null, "Comment deleted"));
  } catch (error) {
    next(error);
  }
};

export const handleLike = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    const result = await togglePostLike(userId, postId);
    return res.status(200).json(new ApiResponse(200, result, result.liked ? "Liked post" : "Unliked post"));
  } catch (error) {
    next(error);
  }
};

export default {
  addPost,
  listPosts,
  getSinglePost,
  removePost,
  addComment,
  removeComment,
  handleLike,
};
