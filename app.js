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


// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
//const flashcardRoutes = require("./routes/flashcardRoutes");

const activityRoutes = require("./routes/activityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
//app.use("/api/flashcards", flashcardRoutes);

app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Learning Intelligence System Backend Running...");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});