const Activity = require("../models/Activity");

const createActivity = async (userId, activityData) => {
    const {
        platform,
        url,
        title,
        startedAt,
        endedAt,
    } = activityData;

    // Prevent invalid activity durations
    if (new Date(endedAt) <= new Date(startedAt)) {
        throw new Error("Invalid activity duration");
    }

    const duration = Math.floor(
        (new Date(endedAt) - new Date(startedAt)) / 1000
    );

    return await Activity.create({
        userId,
        platform,
        url,
        title,
        startedAt,
        endedAt,
        duration,
    });
};

const getActivities = async (userId) => {
    return await Activity.find({
        userId,
    }).sort({
        startedAt: -1,
    });
};

const getTodayActivities = async (userId) => {
    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    return await Activity.find({
        userId,
        startedAt: {
            $gte: startOfDay,
        },
    }).sort({
        startedAt: -1,
    });
};

module.exports = {
    createActivity,
    getActivities,
    getTodayActivities,
};