const LearningSession = require("../models/LearningSession");

const createLearningSession = async (req, res) => {

    try {

        const session = await LearningSession.create({

            ...req.body,

            //user: req.user.id
            user: null

        });

        res.status(201).json({

            success: true,

            data: session

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getLearningSessions = async (req, res) => {

    try {

        const sessions = await LearningSession
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: sessions.length,

            data: sessions

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    createLearningSession,

    getLearningSessions

};