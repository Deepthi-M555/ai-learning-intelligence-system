const express = require("express");

const router = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    getOverview,
    getDistribution,
} = require(
    "../controllers/analyticsController"
);

/*
Analytics Overview
*/
router.get(
    "/overview",
    protect,
    getOverview
);

/*
Study Distribution
*/
router.get(
    "/distribution",
    protect,
    getDistribution
);

module.exports = router;