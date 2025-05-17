const admin = require("firebase-admin");
const db = admin.firestore();

exports.getRandomRecording = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();

    const level = userData?.level || "A1";

    const snapshot = await db.collection("Material")
      .doc("Listening")
      .collection(level)
      .get();

    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (all.length === 0) {
      return res.status(404).json({ error: "Brak nagrań dla tego poziomu" });
    }

    const random = all[Math.floor(Math.random() * all.length)];
    return res.status(200).json(random);

  } catch (err) {
    console.error("❌ Błąd podczas losowania nagrania:", err);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
};
