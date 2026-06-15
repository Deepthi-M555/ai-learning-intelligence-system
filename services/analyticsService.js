const Activity = require("../models/Activity");
const Dashboard = require("../models/Dashboard");

/*
GET /analytics/overview
*/
const getAnalyticsOverview = async (userId) => {
    /*
    Total Study Hours
    */
    const activities = await Activity.find({ userId });

    const totalSeconds = activities.reduce(
        (sum, activity) => sum + activity.duration,
        0
    );

    const totalStudyHours = Number(
        (totalSeconds / 3600).toFixed(2)
    );

    /*
    Topics Studied
    */
    const dashboard = await Dashboard.findOne({ userId });

    let topicsStudied = 0;

    if (dashboard) {
        topicsStudied = dashboard.tracks.reduce(
            (count, track) =>
                count + track.topics.length,
            0
        );
    }

    /*
    Quiz Accuracy
    Quiz module not implemented yet
    */
    const quizAccuracy = 0;

    /*
    Study Streak
    */
    const uniqueDates = [
        ...new Set(
            activities.map((activity) =>
                new Date(activity.startedAt)
                    .toISOString()
                    .split("T")[0]
            )
        ),
    ];

    uniqueDates.sort();

    let studyStreak = 0;

    if (uniqueDates.length > 0) {
        studyStreak = 1;

        for (
            let i = uniqueDates.length - 1;
            i > 0;
            i--
        ) {
            const current = new Date(
                uniqueDates[i]
            );

            const previous = new Date(
                uniqueDates[i - 1]
            );

            const difference =
                (current - previous) /
                (1000 * 60 * 60 * 24);

            if (difference === 1) {
                studyStreak++;
            } else {
                break;
            }
        }
    }

    return {
        totalStudyHours,
        topicsStudied,
        quizAccuracy,
        studyStreak,
    };
};

/*
GET /analytics/distribution
*/
const getStudyDistribution = async (
    userId
) => {

    const dashboard = await Dashboard.findOne({
        userId,
    });

    if (!dashboard) {
        return [];
    }

    const activities = await Activity.find({
        userId,
    });

    const distribution = [];

    dashboard.tracks.forEach((track) => {

        let trackSeconds = 0;

        track.topics.forEach((topic) => {

            topic.activities.forEach(
                (topicActivity) => {

                    const activity =
                        activities.find(
                            (a) =>
                                a._id.toString() ===
                                topicActivity.activityId.toString()
                        );

                    if (activity) {
                        trackSeconds +=
                            activity.duration;
                    }
                }
            );
        });

        distribution.push({
            track: track.name,

            hours: Number(
                (
                    trackSeconds / 3600
                ).toFixed(2)
            ),
        });
    });

    return distribution;
};

module.exports = {
    getAnalyticsOverview,
    getStudyDistribution,
};