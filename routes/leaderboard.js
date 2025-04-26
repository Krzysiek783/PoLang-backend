const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');

const router = express.Router();
const db = getFirestore();

// 🧠 Pamięć podręczna
let cachedLeaderboard = [];
let cachedLeaderboardMap = {};  // Nowa zmienna!
let lastUpdate = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minut

// 🔁 Funkcja odświeżająca cache
async function updateLeaderboardCache() {
  console.log('[Leaderboard] Updating cache...');

  const usersSnap = await db.collection('users')
    .orderBy('points', 'desc')
    .get();

  const docs = usersSnap.docs;

  const leaderboard = docs.map((doc, index) => {
    const data = doc.data();

    return {
      uid: doc.id,
      nick: data.nick || '',
      level: data.level || '',
      points: data.points || 0,
      avatarPath: data.avatarUri || '',
      rank: index + 1, // 💯 działa jak trzeba
    };
  });

  const leaderboardMap = {};//Mapujemy wszystkich user aby pobierać zmienne
  leaderboard.forEach(user => {
  leaderboardMap[user.uid] = user;
  });

  cachedLeaderboard = leaderboard;
  cachedLeaderboardMap = leaderboardMap;
  lastUpdate = Date.now();
  console.log(`[Leaderboard] Cache updated with ${leaderboard.length} users`);
}

// ⏱️ Automatyczne odświeżanie co X minut
setInterval(() => {
  updateLeaderboardCache().catch(console.error);
}, CACHE_TTL_MS);

// 🔥 Pierwsze załadowanie przy starcie
updateLeaderboardCache().catch(console.error);

// 📡 Endpoint
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  const userId = req.query.userId;

  try {
    if (!cachedLeaderboard.length) {
      return res.status(503).json({ error: 'Leaderboard not ready yet' });
    }

    const top = cachedLeaderboard.slice(offset, offset + limit);
    //const currentUser = cachedLeaderboard.find(u => u.uid === userId) || null;     //Nie efektywne, bo przeszukujemy wszystkich userow narazie sobie to odpuszczamy
    const currentUser = cachedLeaderboardMap[userId] || null;


    res.json({
      top,
      currentUser,
      updatedAt: lastUpdate,
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
