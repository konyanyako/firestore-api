// index.js
const express = require('express');
const admin = require('firebase-admin');
const app = express();

// Firebase Admin SDK の初期化（環境変数から取得）
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

// APIエンドポイント：GET /api/place?name=多摩川の里
app.get('/api/place', async (req, res) => {
  const placeName = req.query.name || '多摩川の里';

  try {
    const docRef = db.collection('places').doc(placeName);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'ドキュメントが存在しません' });
    }

    const data = docSnap.data();
    res.json(data); // Alexaなど外部からアクセス可能に
  } catch (error) {
    res.status(500).json({ error: 'エラーが発生しました', details: error.message });
  }
});

// Vercel用にエクスポート
module.exports = app;
