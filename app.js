const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboard');
const lessonRoutes = require("./routes/lessonsRoutes");
const wordRoutes = require("./routes/wordRoutes");
const flashcardsRoutes = require('./routes/flashcards');
const listeningRoutes = require('./routes/listeningRoutes');
const recordingRoutes = require('./routes/randomrecord');
const grammarRoutes = require("./routes/FillBlankRoutes");
const fillBlankRoutes = require("./routes/FillBlankRoutes");
const adminAuthRoutes = require('./routes/adminAuth');
const testRoutes = require('./routes/testRoutes');











const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);

app.use('/leaderboard', leaderboardRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/words", wordRoutes);
app.use("/api",flashcardsRoutes); //sciezka dla frontu z losowymi słówkami DLA FLASHCARD
app.use('/api/listening', listeningRoutes);
app.use('/api/recordings', recordingRoutes);
app.use("/api/grammar", grammarRoutes);
app.use("/api/grammar", fillBlankRoutes);
app.use('/api', adminAuthRoutes);//Weryfikacja na polang admin
app.use('/api/test', testRoutes);









const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server działa na porcie ${PORT}`));
