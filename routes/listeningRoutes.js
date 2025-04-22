const express = require('express');
const router = express.Router();
const { uploadLesson } = require('../controllers/listeningController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/upload',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'json', maxCount: 1 }
  ]),
  uploadLesson
);

module.exports = router;
