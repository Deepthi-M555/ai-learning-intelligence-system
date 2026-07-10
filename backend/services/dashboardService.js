const Dashboard = require("../models/Dashboard");

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

    return targetTopic.activities.sort(
        (a, b) =>
            new Date(b.linkedAt) -
            new Date(a.linkedAt)
    );
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

module.exports = {
    getOrCreateDashboard,

    createManualTrack,

    getDashboardTracks,

    getTopicsInTrack,

    getTopicTimeline,

    /*
    AI only
    */
    addTopicToTrack,

    linkActivityToTopic,
};