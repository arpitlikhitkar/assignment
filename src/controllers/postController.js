const mongoose = require("mongoose");
const Post = require("../models/Post");
const Category = require("../models/Category");
const getPagination = require("../utils/pagination");
const validateObjectId = require("../utils/validateObjectId");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/appError");

const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      throw new BadRequestError("Title, content and category are required");
    }

    validateObjectId(category, "category id");

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new NotFoundError("Category not found");
    }

    const post = await Post.create({
      title,
      content,
      category,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const filter = {};

    if (req.query.category) {
      validateObjectId(req.query.category, "category id");
      filter.category = req.query.category;
    }

    const posts = await Post.find(filter)
      .populate("user", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    validateObjectId(req.params.id, "post id");

    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    if (post.user.toString() !== req.user._id.toString()) {
      throw new UnauthorizedError("You can update only your own post");
    }

    const { title, content, category } = req.body;

    if (category) {
      validateObjectId(category, "category id");
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        throw new NotFoundError("Category not found");
      }
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const searchPosts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const query = req.query.query || "";

    console.log(query);

    if (!query.trim()) {
      throw new BadRequestError("Search query is required");
    }

    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    const [posts, totalDocuments] = await Promise.all([
      Post.find(searchFilter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(searchFilter),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  searchPosts,
};
