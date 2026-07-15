const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getNotifications,
  updateNotifications,
  getPreferences,
  updatePreferences,
} = require("../controllers/settingsController");

// Notifications
router.get("/notifications", protect, getNotifications);
router.patch("/notifications", protect, updateNotifications);

// Preferences
router.get("/preferences", protect, getPreferences);
router.patch("/preferences", protect, updatePreferences);

module.exports = router;