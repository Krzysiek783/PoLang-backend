const express = require('express');
const admin = require('firebase-admin');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
const db = admin.firestore();

// Utility do mieszania
function shuffle(arr = []) {
    if (!Array.isArray(arr)) {
      console.warn('❗ Błąd: shuffle() otrzymało nie-tablicę:', arr);
      return [];
    }
    return arr.sort(() => 0.5 - Math.random());
  }

router.post('/start', verifyToken, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();
    const level = userSnap.data()?.level || 'A1';

    // 📘 Flashcards – 5 słówek
    const vocabSnap = await db.collection('Material').doc('Vocabulary').collection(level).get();
    const vocab = shuffle(vocabSnap.docs).slice(0, 5).map(doc => {
      const d = doc.data();
      return {
        type: 'flashcard',
        word: d.word,
        options: shuffle([
            d.translation,
            ...shuffle(vocabSnap.docs
              .filter(other => other.id !== doc.id)
              .slice(0, 3)
              .map(other => other.data().translation))
          ]),
          
        correctAnswer: d.translation
      };
    });

    // 🎧 Listening – 1 nagranie
    const listeningSnap = await db.collection('Material').doc('Listening').collection(level).get();
    const listening = shuffle(listeningSnap.docs).slice(0, 1).map(doc => {
      const d = doc.data();
      return {
        type: 'listening',
        audioUrl: d.audioUrl,
        question: d.questions[0]?.question,
        options: d.questions[0]?.options,
        correctAnswer: d.questions[0]?.correctAnswer
      };
    });

    // ✏️ Fill in the blank – 4 zadania
    const grammarSnap = await db.collection('Material').doc('Fill-Blank').collection(level).get();
    const grammar = shuffle(grammarSnap.docs).slice(0, 4).map(doc => {
      const d = doc.data();
      return {
        type: 'grammar',
        sentence: d.sentence,
        options: d.options,
        correctAnswer: d.correctAnswer
      };
    });

    const test = [...vocab, ...grammar, ...listening];

    res.json({
      duration: 180, // ⏱️ limit czasu w sekundach
      questions: shuffle(test)
    });

  } catch (err) {
    console.error('❌ Błąd testu:', err);
    res.status(500).json({ error: 'Błąd serwera przy generowaniu testu' });
  }
});

module.exports = router;
