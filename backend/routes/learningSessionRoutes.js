const express = require("express");

const router = express.Router();

const {

    createLearningSession,

    getLearningSessions

} = require("../controllers/learningSessionController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(

    "/learning-session",
    //protect,

    createLearningSession

);


router.get(

    "/learning-session",

    getLearningSessions

);

module.exports = router;