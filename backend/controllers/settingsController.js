const User = require("../models/User");

// =========================
// GET Notification Settings
// =========================
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "notificationSettings"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user.notificationSettings);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =========================
// UPDATE Notification Settings
// =========================
const updateNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      studyReminder,
      flashcardReminder,
      weeklyReport,
    } = req.body;

    if (studyReminder !== undefined) {
      user.notificationSettings.studyReminder = studyReminder;
    }

    if (flashcardReminder !== undefined) {
      user.notificationSettings.flashcardReminder =
        flashcardReminder;
    }

    if (weeklyReport !== undefined) {
      user.notificationSettings.weeklyReport = weeklyReport;
    }

    await user.save();

    res.status(200).json({
      message: "Notification settings updated",
      notificationSettings: user.notificationSettings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =========================
// GET Preferences
// =========================
const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "preferences"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user.preferences);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =========================
// UPDATE Preferences
// =========================
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      preferredLanguage,
      dailyStudyGoal,
      timezone,
    } = req.body;

    if (preferredLanguage) {
      user.preferences.preferredLanguage =
        preferredLanguage;
    }

    if (dailyStudyGoal !== undefined) {
      user.preferences.dailyStudyGoal =
        dailyStudyGoal;
    }

    if (timezone) {
      user.preferences.timezone = timezone;
    }

    await user.save();

    res.status(200).json({
      message: "Preferences updated",
      preferences: user.preferences,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getNotifications,
  updateNotifications,
  getPreferences,
  updatePreferences,
};