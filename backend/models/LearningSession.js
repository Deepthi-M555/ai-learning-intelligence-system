const mongoose = require("mongoose");

const learningSessionSchema = new mongoose.Schema(
    {
        user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
    //required: true
},

        sessionId: {
            type: String,
            required: false
            //required: true
    
        },

        platform: {
            type: String,
            required: true
        },

        title: String,
        url: String,
        content: String,
        activeStudyTime: Number,
        startedAt: Date,
        completedAt: Date,
        browser: String,
        device: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "LearningSession",
    learningSessionSchema
);