const express = require("express");
const {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  getTopUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/top-posters", getTopUsers);
router.get("/:id", getSingleUser);
router.delete("/:id", deleteUser);

module.exports = router;
