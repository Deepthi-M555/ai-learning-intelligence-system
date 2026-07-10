const User = require("../models/User");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =======================
// SIGNUP
// =======================
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Validate full name
    if (fullName.trim().length < 2) {
      return res.status(400).json({
        message: "Full name must be at least 2 characters long",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
    });

    const token = generateToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =======================
// LOGIN
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        message: `Please sign in with ${user.authProvider}`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    user.password = undefined;

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Google ID token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email.toLowerCase().trim();
    const fullName = payload.name;

    let user = await User.findOne({ email });

    // Create account if first time
    if (!user) {
      user = await User.create({
        fullName,
        email,
        authProvider: "google",
      });
    }

    const token = generateToken(user._id);

    user.password = undefined;

    res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};


// POST /api/auth/github
const githubLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        message: "GitHub access token is required",
      });
    }

    // Get user profile
    const githubUser = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Get user email
    const githubEmails = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const primaryEmail = githubEmails.data.find(
      (email) => email.primary
    )?.email;

    if (!primaryEmail) {
      return res.status(400).json({
        message: "No primary email found in GitHub account",
      });
    }

    let user = await User.findOne({
      email: primaryEmail.toLowerCase(),
    });

    if (!user) {
      user = await User.create({
        fullName: githubUser.data.name || githubUser.data.login,
        email: primaryEmail.toLowerCase().trim(),
        authProvider: "github",
      });
    }

    const token = generateToken(user._id);

    user.password = undefined;

    res.status(200).json({
      message: "GitHub login successful",
      token,
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "GitHub authentication failed",
    });
  }
};

// =======================
// LOGOUT
// =======================
const logout = async (req, res) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
};

// =======================
// FORGOT PASSWORD
// =======================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Placeholder for future email service

    return res.status(200).json({
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// =======================
// RESET PASSWORD
// =======================
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        message: `Password reset is not available for ${user.authProvider} accounts`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const jwt = require("jsonwebtoken");

// POST /api/auth/refresh
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newToken = generateToken(decoded.id);

    res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleLogin,
  githubLogin,
};