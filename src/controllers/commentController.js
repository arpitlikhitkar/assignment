const Comment = require("../models/Comment");
const Post = require("../models/Post");
const getPagination = require("../utils/pagination");
const validateObjectId = require("../utils/validateObjectId");
const { BadRequestError, NotFoundError } = require("../utils/appError");

const addComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      throw new BadRequestError("Content and postId are required");
    }

    validateObjectId(postId, "post id");

    const post = await Post.findById(postId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const comment = await Comment.create({
      content,
      post: postId,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentsByPost = async (req, res, next) => {
  try {
    validateObjectId(req.params.postId, "post id");

    const { page, limit, skip } = getPagination(req.query);
    const postExists = await Post.findById(req.params.postId);

    if (!postExists) {
      throw new NotFoundError("Post not found");
    }

    const [comments, totalDocuments] = await Promise.all([
      Comment.find({ post: req.params.postId })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ post: req.params.postId }),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
};
