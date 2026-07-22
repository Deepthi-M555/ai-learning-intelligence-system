const Dashboard = require("../models/Dashboard");
const Activity = require("../models/Activity");
/*
Create dashboard if it does not exist
*/
const getOrCreateDashboard = async (userId) => {
    let dashboard = await Dashboard.findOne({ userId });

    if (!dashboard) {
        dashboard = await Dashboard.create({
            userId,
            tracks: [],
        });
    }

    return dashboard;
};

/*
Manual Track Creation
Frontend:
+ Add Track
*/
const createManualTrack = async (userId, trackName) => {

    const dashboard = await getOrCreateDashboard(userId);

    const existingTrack = dashboard.tracks.find(
        (track) =>
            track.name.toLowerCase() ===
            trackName.toLowerCase()
    );

    if (existingTrack) {
        throw new Error("Track already exists");
    }

    dashboard.tracks.push({
        name: trackName,
        isManual: true,
        topics: [],
    });

    await dashboard.save();

    return dashboard.tracks[
        dashboard.tracks.length - 1
    ];
};

/*
Dashboard Cards
*/
const getDashboardTracks = async (userId) => {

    const dashboard = await getOrCreateDashboard(userId);

    return dashboard.tracks.map((track) => ({
        id: track._id,

        name: track.name,

        isManual: track.isManual,

        topicCount: track.topics.length,

        lastActive:
            track.topics.length > 0
                ? track.topics.reduce(
                      (latest, topic) =>
                          topic.lastActive > latest
                              ? topic.lastActive
                              : latest,
                      track.topics[0].lastActive
                  )
                : null,
    }));
};

/*
Open Track
Topics are created later by AI.
Frontend:
DSA
↓
Arrays
Trees
Graphs
*/
const getTopicsInTrack = async (
    userId,
    trackId
) => {

    const dashboard = await getOrCreateDashboard(userId);

    const track = dashboard.tracks.id(trackId);

    if (!track) {
        throw new Error("Track not found");
    }

    return track.topics.map((topic) => ({
        id: topic._id,

        name: topic.name,

        activityCount:
            topic.activities.length,

        lastActive: topic.lastActive,
    }));
};

/*
Open Topic Timeline
Frontend:
Arrays
↓
15 June → Sliding Window
14 June → Kadane
*/
const getTopicTimeline = async (
    userId,
    topicId
) => {
    const dashboard =
        await getOrCreateDashboard(userId);

    let targetTopic = null;
    let targetTrack = null;

    for (const track of dashboard.tracks) {
        const topic = track.topics.id(topicId);

        if (topic) {
            targetTopic = topic;
            targetTrack = track;
            break;
        }
    }

    if (!targetTopic) {
        throw new Error("Topic not found");
    }

    const activityIds =
        targetTopic.activities.map(
            (item) => item.activityId
        );

    const activities = await Activity.find({
        _id: {
            $in: activityIds,
        },
        userId,
    }).sort({
        startedAt: -1,
    });

    return {
        track: {
            id: targetTrack._id,
            name: targetTrack.name,
        },

        topic: {
            id: targetTopic._id,
            name: targetTopic.name,
        },

        activityCount: activities.length,

        activities: activities.map(
            (activity) => ({
                id: activity._id,

                title: activity.title,

                url: activity.url,

                platform: activity.platform,

                sourceType:
                    activity.sourceType,

                duration:
                    activity.duration,

                activeStudyTime:
                    activity.activeStudyTime,

                startedAt:
                    activity.startedAt,

                completedAt:
                    activity.completedAt,

                classification:
                    activity.classification,
            })
        ),
    };
};

/*
These functions are NOT used now.
AI Layer will use them later.
*/

/*
AI:
Creates Topics
*/
const addTopicToTrack = async (
    userId,
    trackId,
    topicName
) => {

    const dashboard = await getOrCreateDashboard(userId);

    const track = dashboard.tracks.id(trackId);

    if (!track) {
        throw new Error("Track not found");
    }

    const existingTopic = track.topics.find(
        (topic) =>
            topic.name.toLowerCase() ===
            topicName.toLowerCase()
    );

    if (existingTopic) {
        return existingTopic;
    }

    track.topics.push({
        name: topicName,
        activities: [],
    });

    await dashboard.save();

    return track.topics[
        track.topics.length - 1
    ];
};

/*
AI:
Links Activities
*/
const linkActivityToTopic = async (
    userId,
    topicId,
    activityId,
    summaryId = null
) => {

    const dashboard = await getOrCreateDashboard(userId);

    let targetTopic = null;

    dashboard.tracks.forEach((track) => {

        const topic = track.topics.id(topicId);

        if (topic) {
            targetTopic = topic;
        }
    });

    if (!targetTopic) {
        throw new Error("Topic not found");
    }

    targetTopic.activities.push({
        activityId,
        summaryId,
    });

    targetTopic.lastActive = new Date();

    await dashboard.save();

    return targetTopic;
};


const getOrCreateAITrack = async (
    userId,
    trackName
) => {
    const dashboard =
        await getOrCreateDashboard(userId);

    let track = dashboard.tracks.find(
        (track) =>
            track.name.toLowerCase() ===
            trackName.toLowerCase()
    );

    if (!track) {
        dashboard.tracks.push({
            name: trackName,
            isManual: false,
            topics: [],
        });

        await dashboard.save();

        track =
            dashboard.tracks[
                dashboard.tracks.length - 1
            ];
    }

    return track;
};

/*
AI Classification → Dashboard Integration

classification:
{
    track: "Data Structures & Algorithms",
    topic: "Graph Traversal",
    ...
}
*/
const integrateClassification = async (
    userId,
    activityId,
    classification
) => {
    if (
        !classification?.track ||
        !classification?.topic
    ) {
        throw new Error(
            "Classification track and topic are required"
        );
    }

    const dashboard =
        await getOrCreateDashboard(userId);

    /*
    STEP 1:
    Find AI/manual track with same name.
    */
    let track = dashboard.tracks.find(
        (track) =>
            track.name.toLowerCase() ===
            classification.track.toLowerCase()
    );

    /*
    STEP 2:
    Create track if it doesn't exist.
    */
    if (!track) {
        dashboard.tracks.push({
            name: classification.track,
            isManual: false,
            topics: [],
        });

        track =
            dashboard.tracks[
                dashboard.tracks.length - 1
            ];
    }

    /*
    STEP 3:
    Find topic inside track.
    */
    let topic = track.topics.find(
        (topic) =>
            topic.name.toLowerCase() ===
            classification.topic.toLowerCase()
    );

    /*
    STEP 4:
    Create topic if needed.
    */
    if (!topic) {
        track.topics.push({
            name: classification.topic,
            activities: [],
            lastActive: new Date(),
        });

        topic =
            track.topics[
                track.topics.length - 1
            ];
    }

    /*
    STEP 5:
    Prevent duplicate activity linking.

    Important because callbacks/manual sync
    can potentially run more than once.
    */
    const alreadyLinked =
        topic.activities.some(
            (item) =>
                item.activityId.toString() ===
                activityId.toString()
        );

    if (!alreadyLinked) {
        topic.activities.push({
            activityId,
            summaryId: null,
            linkedAt: new Date(),
        });
    }

    topic.lastActive = new Date();

    await dashboard.save();

    return {
        track,
        topic,
    };
};

module.exports = {
    getOrCreateDashboard,
    createManualTrack,
    getDashboardTracks,
    getTopicsInTrack,
    getTopicTimeline,
    integrateClassification,

    // ai only
    getOrCreateAITrack,
    addTopicToTrack,
    linkActivityToTopic,
};