const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        platform: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        startedAt: {
            type: Date,
            required: true,
        },

        endedAt: {
            type: Date,
            required: true,
        },

        duration: {
            type: Number,
            required: true,
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

module.exports = mongoose.model("Activity", activitySchema);