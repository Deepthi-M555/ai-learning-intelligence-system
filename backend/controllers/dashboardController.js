const dashboardService = require("../services/dashboardService");

const createTrack = async (req, res) => {
    try {
        const track = await dashboardService.createManualTrack(
            req.user.id,
            req.body.name
        );

        res.status(201).json(track);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getTracks = async (req, res) => {
    try {
        const tracks =
            await dashboardService.getDashboardTracks(
                req.user.id
            );

        res.status(200).json(tracks);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getTopics = async (req, res) => {
    try {
        const topics =
            await dashboardService.getTopicsInTrack(
                req.user.id,
                req.params.trackId
            );

        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getTopicTimeline = async (req, res) => {
    try {
        const timeline =
            await dashboardService.getTopicTimeline(
                req.user.id,
                req.params.topicId
            );

        res.status(200).json(timeline);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createTrack,
    getTracks,
    getTopics,
    getTopicTimeline,
};