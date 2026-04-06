const User = require("../models/User");
const generateToken = require("../utils/jwt");
const { BadRequestError, UnauthorizedError } = require("../utils/appError");
const getPagination = require("../utils/pagination");

const register = async (req, res, next) => {
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
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateToken({ userId: user._id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const allUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const users = await User.find().skip(skip).limit(limit).select("-password");
    const totalUser = await User.countDocuments();
    res.status(200).json({
      success: true,
      data: users,
      totalUser
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  allUsers,
};
