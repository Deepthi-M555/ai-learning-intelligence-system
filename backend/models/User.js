const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    bio: {
      type: String,
      default: "",
    },
    notificationSettings: {
      studyReminder: {
        type: Boolean,
        default: true,
      },
      flashcardReminder: {
        type: Boolean,
        default: true,
      },
      weeklyReport: {
        type: Boolean,
        default: false,
      },
    },

    preferences: {
      preferredLanguage: {
        type: String,
        default: "English",
      },
      dailyStudyGoal: {
        type: Number,
        default: 3,
      },
      timezone: {
        type: String,
        default: "UTC+5:30",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);