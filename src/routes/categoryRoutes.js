const express = require("express");
const { createCategory, getAllCategories } = require("../controllers/categoryController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createCategory);
router.get("/", getAllCategories);

module.exports = router;
