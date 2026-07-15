const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getUserMe,
  updateUserMe,
  deleteUserMe,
} = require("../controllers/userController");

router.get("/me", protect, getUserMe);
router.patch("/me", protect, updateUserMe);
router.delete("/me", protect, deleteUserMe);

module.exports = router;