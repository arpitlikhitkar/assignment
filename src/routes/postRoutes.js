const express = require("express");
const {
  createPost,
  getAllPosts,
  updatePost,
  searchPosts,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllPosts);
router.get("/search", searchPosts);
router.post("/", protect, createPost);
router.patch("/:id", protect, updatePost);

module.exports = router;
