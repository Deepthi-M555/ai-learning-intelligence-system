const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        sessionId: {
            type: String,
            required: true,
        },

        platform: {
            type: String,
            required: true,
        },

        sourceType: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            default: "",
        },

        metadata: {
            type: Object,
            default: {},
        },

        activeStudyTime: {
            type: Number,
            default: 0,
        },

        startedAt: {
            type: Date,
            required: true,
        },

        completedAt: {
            type: Date,
            required: true,
        },

        duration: {
            type: Number,
            required: true,
        },

        browser: {
            type: String,
            default: "",
        },

        device: {
            type: String,
            default: "",
        },

        processed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Activity", ActivitySchema);