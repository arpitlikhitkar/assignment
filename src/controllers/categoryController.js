const Category = require("../models/Category");
const getPagination = require("../utils/pagination");
const { BadRequestError } = require("../utils/appError");

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new BadRequestError("Category name is required");
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [categories, totalDocuments] = await Promise.all([
      Category.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Category.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};
