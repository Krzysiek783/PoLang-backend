const express = require("express");
const router = express.Router();
const { addWord, bulkImport } = require("../controllers/wordController");

router.post("/:level", addWord);           // już działa z JSON-em
router.post("/bulk/:level", bulkImport);   // też już działa

module.exports = router;
