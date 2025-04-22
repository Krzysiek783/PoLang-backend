const admin = require("firebase-admin");
const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.addWord = async (req, res) => {
    console.log("✅ [BACKEND] Odebrano request do /api/Words");
    console.log("➡️ Pliki:", req.files);
    console.log("➡️ Body:", req.body);
  try {
    const { word, translation } = req.body;
    const level = req.params.level;

    const uploadedFiles = {};

if (req.files.image) {
  const imageFile = req.files.image[0];
  const imageRef = bucket.file(`words/${level}/${imageFile.originalname}`);
  await imageRef.save(imageFile.buffer, { contentType: imageFile.mimetype });
  uploadedFiles.image = imageRef.name;
}

if (req.files.audio) {
  const audioFile = req.files.audio[0];
  const audioRef = bucket.file(`words/${level}/${audioFile.originalname}`);
  await audioRef.save(audioFile.buffer, { contentType: audioFile.mimetype });
  uploadedFiles.audio = audioRef.name;
}


    const colRef = db
      .collection("Material")
      .doc("Vocabulary")
      .collection(level);

    // Pobierz największy numer ID i inkrementuj
      const snapshot = await colRef.orderBy("id", "desc").limit(1).get();
      const lastId = snapshot.empty ? 0 : snapshot.docs[0].data()?.id || 0;
      const newId = lastId + 1;

      await colRef.doc(`${newId}`).set({
      id: newId,
      word,
      translation,
      imagePath: uploadedFiles.image || null,
      audioPath: uploadedFiles.audio || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Word saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving word" });
  }
};


exports.bulkImport = async (req, res) => {
  try {
    const level = req.params.level;
    const words = req.body;

    console.log("📥 [IMPORT] Nowa paczka słówek");
    console.log("🎯 Poziom:", level);
    console.log("📄 Liczba słówek:", words.length);

    if (!Array.isArray(words)) {
      console.warn("⚠️ Niepoprawny format JSON-a (nie tablica)");
      return res.status(400).json({ error: "Invalid format" });
    }

    let addedCount = 0;

    for (const word of words) {
      if (!word.word || !word.translation) {
        console.warn("❌ Pominięto niepełne słowo:", word);
        continue;
      }

      const colRef = db
        .collection("Material")
        .doc("Vocabulary")
        .collection(level);

      const snapshot = await colRef.orderBy("id", "desc").limit(1).get();
      const lastId = snapshot.empty ? 0 : snapshot.docs[0].data()?.id || 0;
      const newId = lastId + 1;

      await colRef.doc(`${newId}`).set({
        id: newId,
        word: word.word,
        translation: word.translation,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Dodano [${newId}]: ${word.word} → ${word.translation}`);
      addedCount++;
    }

    console.log(`✅✅ Zakończono import. Dodano słówek: ${addedCount}`);

    res.status(200).json({ message: "Import zakończony", added: addedCount });
  } catch (err) {
    console.error("❌ Błąd importu:", err);
    res.status(500).json({ error: "Błąd importu" });
  }
};
