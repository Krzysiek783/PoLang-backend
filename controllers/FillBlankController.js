const admin = require("firebase-admin");
const db = admin.firestore();

// ✅ pomocnicza walidacja
function isValidTask(task) {
  return (
    task.sentence &&
    Array.isArray(task.options) &&
    task.options.length === 4 &&
    typeof task.correctAnswer === "string" &&
    task.options.includes(task.correctAnswer)
  );
}

exports.addFillBlank = async (req, res) => {
  const { level } = req.params;
  const task = req.body;

  if (!isValidTask(task)) {
    return res.status(400).json({ error: "Niepoprawna struktura zadania" });
  }

  try {
    await db
      .collection("Material")
      .doc("Fill-Blank")
      .collection(level)
      .add({
        ...task,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(`✅ Dodano 1 zadanie do poziomu ${level}`);
    res.status(200).json({ message: "Zapisano zadanie" });
  } catch (err) {
    console.error("❌ Błąd:", err);
    res.status(500).json({ error: "Błąd zapisu" });
  }
};

exports.bulkFillBlank = async (req, res) => {
  const { level } = req.params;
  const tasks = req.body;

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: "Dane muszą być tablicą" });
  }

  const validTasks = tasks.filter(isValidTask);

  if (validTasks.length === 0) {
    return res.status(400).json({ error: "Brak poprawnych zadań" });
  }

  const colRef = db.collection("Material").doc("Fill-Blank").collection(level);
  const batch = db.batch();

  try {
    validTasks.forEach((task) => {
      const docRef = colRef.doc();
      batch.set(docRef, {
        ...task,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`✅ Zaimportowano ${validTasks.length} poprawnych zadań do poziomu ${level}`);
    res.status(200).json({ message: "Import zakończony", added: validTasks.length });
  } catch (err) {
    console.error("❌ Błąd przy imporcie:", err);
    res.status(500).json({ error: "Import nieudany" });
  }
};
