const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    logActivity,
    getActivities,
    getTodayActivities,
    syncActivityAIResult,
    receiveAIProcessingCallback,
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


/*
POST /api/activities/ai-callback

Called automatically by Celery.
Do NOT use normal user JWT middleware here.
*/
router.post(
    "/ai-callback",
    receiveAIProcessingCallback
);


/*
GET /api/activities/:activityId/ai-result

Manual fallback/debug endpoint.
*/
router.get(
    "/:activityId/ai-result",
    syncActivityAIResult
);


module.exports = router;