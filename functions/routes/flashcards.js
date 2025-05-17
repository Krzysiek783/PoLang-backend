const express = require('express');
const router = express.Router();
const { db } = require('../services/firebaseService'); // <- dopasuj ścieżkę do siebie

router.get('/flashcards', async (req, res) => {
  const level = req.query.level || 'A1';
  const limit = parseInt(req.query.limit) || 10;

  try {
    const ref = db.collection('Material').doc('Vocabulary').collection(level);
    const snapshot = await ref.get(); // ← bez limitu, pobiera wszystkie słówka

    const allWords = snapshot.docs.map(doc => doc.data());

    if (allWords.length === 0) {
      return res.status(404).json({ message: "Brak słówek dla tego poziomu" });
    }

    const selectedWords = allWords
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);

    const flashcards = selectedWords.map((word) => {
      const correct = word.translation;

      const incorrectOptions = allWords
        .filter(w => w.translation !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.translation);

      const options = [...incorrectOptions, correct].sort(() => 0.5 - Math.random());

      return {
        word: word.word,
        options,
        correctAnswer: correct
      };
    });

    res.json(flashcards);
  } catch (error) {
    console.error('❌ Błąd generowania fiszek:', error);
    res.status(500).json({ error: 'Nie udało się pobrać fiszek' });
  }
});

module.exports = router;
