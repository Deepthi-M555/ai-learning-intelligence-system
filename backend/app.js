const learningSessionRoutes = require("./routes/learningSessionRoutes");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", learningSessionRoutes);

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
//const flashcardRoutes = require("./routes/flashcardRoutes");

const activityRoutes = require("./routes/activityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const quizRoutes = require("./routes/quizRoutes");

const contentProcessingRoutes = require("./ai/contentProcessing/contentProcessingRoutes");
const classificationRoutes = require("./ai/classification/classificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
//app.use("/api/flashcards", flashcardRoutes);

app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/quizzes", quizRoutes);

app.use("/api/ai", contentProcessingRoutes);
app.use("/api/ai",classificationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Learning Intelligence System Backend Running...");
});

app.get("/api/health", (req, res) => {

    res.json({

        success: true

    });

});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});