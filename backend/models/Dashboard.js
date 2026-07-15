const mongoose = require("mongoose");

/*
Activity Reference Schema
Represents timeline items inside a topic
*/
const ActivityReferenceSchema = new mongoose.Schema(
    {
        activityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
            required: true,
        },

        summaryId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        linkedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: true,
    }
);

/*
Topic Schema
Represents Arrays, Trees, React Hooks, etc.
*/
const TopicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        lastActive: {
            type: Date,
            default: Date.now,
        },

        activities: [ActivityReferenceSchema],
    },
    {
        _id: true,
    }
);

/*
Track Schema
Represents DSA, Web Development, ML, etc.
*/
const TrackSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        isManual: {
            type: Boolean,
            default: false,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        topics: [TopicSchema],
    },
    {
        _id: true,
    }
);

/*
Dashboard Schema
One Dashboard document per user
*/
const DashboardSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },

        tracks: [TrackSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Dashboard", DashboardSchema);