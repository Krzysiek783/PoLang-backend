const express = require('express');
const router = express.Router();

router.post('/admin-login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Brak hasła' });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  res.status(401).json({ error: 'Nieprawidłowe hasło' });
});

module.exports = router;
