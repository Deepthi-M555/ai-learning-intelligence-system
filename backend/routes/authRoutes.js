const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleLogin,
  githubLogin,
} = require("../controllers/authController");
// Signup route
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refreshToken);
router.post("/google", googleLogin);
router.post("/github", githubLogin);

module.exports = router;