const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const getPagination = require("../utils/pagination");
const validateObjectId = require("../utils/validateObjectId");
const { BadRequestError, NotFoundError } = require("../utils/appError");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError("Name, email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("User already exists with this email");
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [users, totalDocuments] = await Promise.all([
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    validateObjectId(req.params.id, "user id");

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    validateObjectId(req.params.id, "user id");

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userPosts = await Post.find({ user: user._id }).select("_id");
    const postIds = userPosts.map((post) => post._id);

    await Promise.all([
      Comment.deleteMany({
        $or: [{ user: user._id }, { post: { $in: postIds } }],
      }),
      Post.deleteMany({ user: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    res.status(200).json({
      success: true,
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getTopUsers = async (req, res, next) => {
  try {
    const topUsers = await Post.aggregate([
      {
        $group: {
          _id: "$user",
          totalPosts: { $sum: 1 },
        },
      },
      { $sort: { totalPosts: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {$unwind: "$user"},
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          totalPosts: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  getTopUsers,
};
