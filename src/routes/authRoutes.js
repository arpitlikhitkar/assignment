const express = require("express");
const { register, login, getProfile,allUsers } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);
router.get("/all-users", protect, allUsers);
module.exports = router;
