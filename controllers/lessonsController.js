const admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const db = admin.firestore();

exports.createLesson = async (req, res) => {
  console.log("✅ [BACKEND] Odebrano request do /api/lessons");
  console.log("➡️ Pliki:", req.files);
  console.log("➡️ Body:", req.body);

  if (!req.body.lessonData) {
    console.error("❌ Brak req.body.lessonData");
    return res.status(400).json({ error: "lessonData missing" });
  }

  try {
    const lessonData = JSON.parse(req.body.lessonData);
    const uploadedFiles = {};

    for (const file of req.files) {
      const fileRef = bucket.file(`lessons/${lessonData.level}/${lessonData.title}/${file.originalname}`);
      await fileRef.save(file.buffer, {
        contentType: file.mimetype,
      });

      uploadedFiles[file.originalname] = fileRef.name;
    }

    lessonData.activities.vocabulary = lessonData.activities.vocabulary.map((item) => ({
      ...item,
      imagePath: uploadedFiles[item.image] || null,
      audioPath: uploadedFiles[item.audio] || null,
    }));

    await db.collection("lessons").add(lessonData);

    res.status(200).json({ message: "Lesson saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving lesson" });
  }
};
