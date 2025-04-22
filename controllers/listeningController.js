const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.uploadLesson = async (req, res) => {
  try {
    const audioFile = req.files['audio']?.[0];
    const jsonFile = req.files['json']?.[0];
    const level = req.body.level || 'A1';

    if (!audioFile || !jsonFile) {
      console.warn('⚠️ Brakuje pliku audio lub JSON.');
      return res.status(400).json({ error: 'Brakuje pliku audio lub JSON.' });
    }

    console.log('⬆️ Rozpoczynam upload pliku audio...');
    const audioId = uuidv4();
    const audioName = `listening/${audioId}${path.extname(audioFile.originalname)}`;
    const file = bucket.file(audioName);

    await file.save(audioFile.buffer, {
      contentType: audioFile.mimetype,
      public: true,
      metadata: { firebaseStorageDownloadTokens: uuidv4() }
    });

    const audioUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(audioName)}?alt=media`;
    console.log(`✅ Plik audio zapisany w: ${audioUrl}`);

    const jsonData = JSON.parse(jsonFile.buffer.toString('utf8'));
    const { title, transcript, translation, questions } = jsonData;

    if (!title || !transcript || !translation || !questions) {
      console.warn('⚠️ Niekompletny JSON.');
      return res.status(400).json({ error: 'Brakuje wymaganych pól w JSON.' });
    }

    console.log('📦 Dane JSON sparsowane:');
    console.log(`📝 Tytuł: ${title}`);
    console.log(`🧠 Pytania: ${questions.length}`);
    console.log(`📃 Transkrypcja: ${transcript.length} linii`);

    const lessonId = uuidv4();
    const docRef = db.collection('Material').doc('Listening').collection(level).doc(lessonId);

    await docRef.set({
      id: lessonId,
      title,
      audioUrl,
      transcript,
      translation,
      questions,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Lekcja zapisania w Firestore pod ID: ${lessonId}`);
    res.status(200).json({ message: 'Lekcja przesłana ✅', id: lessonId });

  } catch (err) {
    console.error('❌ Błąd uploadu listening:', err);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera.' });
  }
};
