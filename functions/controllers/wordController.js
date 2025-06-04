const { db, admin } = require("../services/firebaseService");
const { v4: uuidv4 } = require("uuid");

const addWord = async (req, res) => {
  const level = req.params.level;
  const { word, translation } = req.body;

  if (!word || !translation) {
    return res.status(400).json({ error: "Brakuje pola 'word' lub 'translation'" });
  }

  try {
    const id = uuidv4();

    await db.collection("Material").doc("Vocabulary").collection(level).doc(id).set({
      word,
      translation,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: "Słówko dodane!", id });
  } catch (err) {
    console.error("❌ Błąd dodawania słówka:", err);
    res.status(500).json({ error: "Błąd serwera przy dodawaniu słówka" });
  }
};

const bulkImport = async (req, res) => {
  // jeśli masz tę funkcję
};

module.exports = {
  addWord,
  bulkImport,
};
