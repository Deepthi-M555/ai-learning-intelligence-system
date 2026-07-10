const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    logActivity,
    getActivities,
    getTodayActivities,
} = require("../controllers/activityController");

/*
POST /api/activities
Log new activity
*/
router.post("/", protect, logActivity);

/*
GET /api/activities
Get all user activities
*/
router.get("/", protect, getActivities);

/*
GET /api/activities/today
Get today's activities
*/
router.get("/today", protect, getTodayActivities);

module.exports = router;