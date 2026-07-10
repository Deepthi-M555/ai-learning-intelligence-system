const activityService = require("../services/activityService");

const logActivity = async (req, res) => {
    try {
        console.log("REQ USER:", req.user);
        const activity = await activityService.createActivity(
            req.user.id,
            req.body
        );

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getActivities = async (req, res) => {
    try {
        const activities = await activityService.getActivities(
            req.user.id
        );

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
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

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    logActivity,
    getActivities,
    getTodayActivities,
};