const express = require("express");
const { getRandomRecording } = require("../controllers/randomizeRecording");
const  verifyFirebaseToken  = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/random", verifyFirebaseToken, getRandomRecording);

module.exports = router;
