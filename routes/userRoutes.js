const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const verifyFirebaseToken = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../controllers/userController');


router.get('/profile', verifyFirebaseToken, async (req, res) => {
  const user = req.user;
  res.json({
    message: 'Dane użytkownika z tokena',
    uid: user.uid,
    email: user.email,
  });
});


router.post('/test-upload', verifyFirebaseToken, (req, res) => {
  console.log("✅ Odebrano testowe żądanie!");
  res.json({ success: true });
});



router.post('/avatar', verifyFirebaseToken, upload.single('avatar'), uploadAvatar);


module.exports = router;
