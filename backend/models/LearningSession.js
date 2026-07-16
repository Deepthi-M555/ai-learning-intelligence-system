const mongoose = require("mongoose");

const learningSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
            // required: true (Enable after authentication)
        },

        sessionId: {
            type: String,
            required: false
            // required: true
        },

        platform: {
            type: String,
            required: true
        },

        sourceType: {
            type: String,
            default: ""
        },

        title: {
            type: String,
            default: ""
        },

        url: {
            type: String,
            default: ""
        },

        content: {
            type: String,
            default: ""
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        activeStudyTime: {
            type: Number,
            default: 0
        },

        startedAt: Date,

        completedAt: Date,

        browser: {
            type: String,
            default: "Chrome"
        },

        device: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "LearningSession",
    learningSessionSchema
);