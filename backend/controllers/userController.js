const User = require("../models/User");

// GET /api/users/me
const getUserMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /api/users/me
const updateUserMe = async (req, res) => {
  try {
   const user = await User.findById(req.user.id);

// Update only allowed fields
      if (req.body.fullName) {
        user.fullName = req.body.fullName.trim();
      }

      if (req.body.bio !== undefined) {
        user.bio = req.body.bio;
      }

      // Do NOT update email here
      await user.save();

      user.password = undefined;

      res.status(200).json({
        message: "Profile updated successfully",
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/users/me
const deleteUserMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getUserMe,
  updateUserMe,
  deleteUserMe,
};