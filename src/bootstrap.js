const axios = require("axios").default;
const admin = require("firebase-admin");

let app;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

async function initializeApp() {
  if (app) return app;
  const url = `${process.env.GOOGLE_CLOUD_CREDENTIAL}?alt=media&token=${process.env.FIREBASE_STORAGE_TOKEN}`;
  const { data } = await axios.get(url);
  app = admin.initializeApp({
    credential: admin.credential.cert(data),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  return app;
}

module.exports = initializeApp;
