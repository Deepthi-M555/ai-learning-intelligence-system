const Activity = require("../models/Activity");
const Dashboard = require("../models/Dashboard");


/*
Helper:
Use active study time when available.

Fallback to duration for older activities
that may not contain activeStudyTime.
*/
const getStudySeconds = (activity) => {
    if (
        typeof activity.activeStudyTime === "number" &&
        activity.activeStudyTime > 0
    ) {
        return activity.activeStudyTime;
    }

    return activity.duration || 0;
};


/*
GET /analytics/overview
*/
const getAnalyticsOverview = async (userId) => {

    const [activities, dashboard] =
        await Promise.all([
            Activity.find({ userId }),
            Dashboard.findOne({ userId }),
        ]);


    /*
    1. Total Study Hours
    */
    const totalSeconds = activities.reduce(
        (sum, activity) =>
            sum + getStudySeconds(activity),
        0
    );

    const totalStudyHours = Number(
        (totalSeconds / 3600).toFixed(2)
    );


    /*
    2. Topics Studied

    Topics now come from the Dashboard,
    including AI-created topics.
    */
    let topicsStudied = 0;

    if (dashboard) {
        topicsStudied =
            dashboard.tracks.reduce(
                (count, track) =>
                    count + track.topics.length,
                0
            );
    }


    /*
    3. Quiz Accuracy

    Keep 0 until Quiz integration is done.
    Later this will come from the Quiz module.
    */
    const quizAccuracy = 0;


    /*
    4. Study Streak

    A current streak must contain
    today or yesterday.
    */
    const studyDates = [
        ...new Set(
            activities.map((activity) =>
                new Date(activity.startedAt)
                    .toISOString()
                    .split("T")[0]
            )
        ),
    ].sort();


    let studyStreak = 0;

    if (studyDates.length > 0) {

        const latestStudyDate =
            new Date(
                `${studyDates[
                    studyDates.length - 1
                ]}T00:00:00.000Z`
            );

        const today = new Date();

        today.setUTCHours(
            0,
            0,
            0,
            0
        );

        const daysSinceLatestStudy =
            Math.floor(
                (today - latestStudyDate) /
                (1000 * 60 * 60 * 24)
            );


        /*
        Streak is active only when
        user studied today or yesterday.
        */
        if (daysSinceLatestStudy <= 1) {

            studyStreak = 1;

            for (
                let i =
                    studyDates.length - 1;
                i > 0;
                i--
            ) {

                const current =
                    new Date(
                        `${studyDates[i]}T00:00:00.000Z`
                    );

                const previous =
                    new Date(
                        `${studyDates[i - 1]}T00:00:00.000Z`
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

Calculate study time grouped by
AI-created/manual dashboard tracks.
*/
const getStudyDistribution = async (
    userId
) => {

    const dashboard =
        await Dashboard.findOne({
            userId,
        });

    if (!dashboard) {
        return [];
    }


    /*
    Get only this user's activities.
    */
    const activities =
        await Activity.find({
            userId,
        });


    /*
    Map makes lookup faster than repeatedly
    searching the activities array.
    */
    const activityMap = new Map(
        activities.map((activity) => [
            activity._id.toString(),
            activity,
        ])
    );


    const distribution = [];


    for (const track of dashboard.tracks) {

        let trackSeconds = 0;


        for (const topic of track.topics) {

            for (
                const topicActivity
                of topic.activities
            ) {

                const activity =
                    activityMap.get(
                        topicActivity
                            .activityId
                            .toString()
                    );


                if (activity) {
                    trackSeconds +=
                        getStudySeconds(
                            activity
                        );
                }
            }
        }


        /*
        Don't return empty tracks
        in analytics distribution.
        */
        if (trackSeconds > 0) {
            distribution.push({
                track: track.name,

                hours: Number(
                    (
                        trackSeconds /
                        3600
                    ).toFixed(2)
                ),
            });
        }
    }


    return distribution;
};


module.exports = {
    getAnalyticsOverview,
    getStudyDistribution,
};