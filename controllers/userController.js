const getUserProfile = async (req, res) => {
    const user = req.user; // z tokena
    res.json({ uid: user.uid, email: user.email }); //podawanie info i profilu dla home screen
  };
   

const { bucket, db } = require('../services/firebaseService');

  const uploadAvatar = async (req, res) => {
    try {
      const file = req.file;
      const uid = req.user.uid;
  
      if (!file) {
        return res.status(400).json({ error: 'Brak pliku' });
      }
  
      const fileRef = bucket.file(`customAvatars/${uid}.jpg`);
      await fileRef.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
      });

      console.log("🧪 Otrzymano plik:", req.file);

  
      const publicUri = `https://storage.googleapis.com/${bucket.name}/${fileRef.name}`;
  
      // (opcjonalnie) Zapis do Firestore:
      await db.collection('users').doc(uid).update({ avatarUri: publicUri });
  
      res.json({ url: publicUri });
    } catch (err) {
      console.error('❌ Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  };
  
  module.exports = { uploadAvatar };
  