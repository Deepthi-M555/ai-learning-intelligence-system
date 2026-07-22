const activityService = require("../services/activityService");

const {
    syncAIProcessingResult,
    handleAIProcessingCallback,
} = require("../services/aiResultService");


const logActivity = async (req, res) => {
    try {
        console.log("REQ USER:", req.user);

        const activity =
            await activityService.createActivity(
                req.user.id,
                req.body
            );

        return res.status(201).json(activity);

    } catch (error) {
        console.error(
            "Failed to create activity:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getActivities = async (req, res) => {
    try {
        const activities =
            await activityService.getActivities(
                req.user.id
            );

        return res.status(200).json(activities);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getTodayActivities = async (req, res) => {
    try {
        const activities =
            await activityService.getTodayActivities(
                req.user.id
            );

        return res.status(200).json(activities);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/*
Manual fallback endpoint.

GET /api/activities/:activityId/ai-result
*/
const syncActivityAIResult = async (req, res) => {
    try {
        const { activityId } = req.params;

        const result =
            await syncAIProcessingResult(activityId);

        return res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error(
            "Failed to sync AI result:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


/*
Automatic Celery callback.

POST /api/activities/ai-callback
*/
const receiveAIProcessingCallback = async (
    req,
    res
) => {
    try {
        const {
            activityId,
            taskId,
            status,
            classification,
        } = req.body;

        if (!activityId || !status) {
            return res.status(400).json({
                success: false,
                message:
                    "activityId and status are required",
            });
        }

        const activity =
            await handleAIProcessingCallback({
                activityId,
                taskId,
                status,
                classification,
            });

        console.log(
            `AI callback processed for activity ${activityId}`
        );

        return res.status(200).json({
            success: true,
            message:
                "AI callback processed successfully",
            data: {
                activity,
            },
        });

    } catch (error) {
        console.error(
            "AI callback failed:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    logActivity,
    getActivities,
    getTodayActivities,
    syncActivityAIResult,
    receiveAIProcessingCallback,
};