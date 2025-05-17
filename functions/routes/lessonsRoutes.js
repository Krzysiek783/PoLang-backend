const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createLesson } = require("../controllers/lessonsController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("files"), createLesson);

module.exports = router;
