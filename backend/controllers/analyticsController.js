const analyticsService = require(
    "../services/analyticsService"
);

const getOverview = async (
    req,
    res
) => {
    try {
        const analytics =
            await analyticsService.getAnalyticsOverview(
                req.user.id
            );

        res.status(200).json(
            analytics
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getDistribution = async (
    req,
    res
) => {
    try {
        const distribution =
            await analyticsService.getStudyDistribution(
                req.user.id
            );

        res.status(200).json(
            distribution
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getOverview,
    getDistribution,
};