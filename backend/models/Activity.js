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
        classificationStatus: {
            type: String,
            enum: [
                "NOT_STARTED",
                "PROCESSING",
                "COMPLETED",
                "FAILED",
            ],
            default: "NOT_STARTED",
        },

        classificationTaskId: {
            type: String,
            default: null,
        },

        classification: {
            track: {
                type: String,
                default: null,
            },

            topic: {
                type: String,
                default: null,
            },

            subtopics: {
                type: [String],
                default: [],
            },

            resource_type: {
                type: String,
                default: null,
            },

            problem_difficulty: {
                type: String,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Activity", ActivitySchema);