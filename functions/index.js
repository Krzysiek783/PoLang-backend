const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔁 Import route'ów
const userRoutes = require("./routes/userRoutes");
const leaderboardRoutes = require("./routes/leaderboard");
const lessonRoutes = require("./routes/lessonsRoutes");
const wordRoutes = require("./routes/wordRoutes");
const flashcardsRoutes = require("./routes/flashcards");
const listeningRoutes = require("./routes/listeningRoutes");
const recordingRoutes = require("./routes/randomrecord");
const grammarRoutes = require("./routes/FillBlankRoutes");
const adminAuthRoutes = require("./routes/adminAuth");
const testRoutes = require("./routes/testRoutes");

// 🔁 Użycie route'ów
app.use("/api/user", userRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/words", wordRoutes);
app.use("/api", flashcardsRoutes);
app.use("/api/listening", listeningRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/grammar", grammarRoutes);
app.use("/api", adminAuthRoutes);
app.use("/api/test", testRoutes);

// 🔁 Eksport do Firebase
exports.api = functions.https.onRequest(app);
