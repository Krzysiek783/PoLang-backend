const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { addWord, bulkImport } = require("../controllers/wordController");

router.post("/:level", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]), addWord);


// import JSON-a z listą słówek (bez plików)
router.post("/bulk/:level", express.json(), bulkImport);


module.exports = router;
