const express = require("express");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  searchPosts,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllPosts);
router.get("/search", searchPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.patch("/:id", protect, updatePost);

module.exports = router;
