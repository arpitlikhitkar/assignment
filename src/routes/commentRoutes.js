const express = require("express");
const { addComment, getCommentsByPost } = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, addComment);
router.get("/post/:postId", getCommentsByPost);

module.exports = router;
