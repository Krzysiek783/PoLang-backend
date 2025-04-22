const { db } = require("../services/firebaseService");



exports.getRandomFillBlank = async (req, res) => {
    const { level } = req.params;
    const count = parseInt(req.query.count) || 10;
  
    try {
      const snapshot = await db
        .collection("Material")
        .doc("Fill-Blank")
        .collection(level)
        .get();
  
      const allTasks = snapshot.docs.map(doc => doc.data());
  
      if (allTasks.length === 0) {
        return res.status(404).json({ message: "Brak zadań dla tego poziomu" });
      }
  
      // Losujemy
      const shuffled = allTasks.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
  
      res.json(selected);
    } catch (err) {
      console.error("❌ Błąd przy pobieraniu zadań:", err);
      res.status(500).json({ error: "Błąd serwera" });
    }
  };
  