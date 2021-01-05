const axios = require("axios").default;
const admin = require("firebase-admin");

let app;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

async function initializeApp() {
  if (app) return app;
  const url = new URL(process.env.GOOGLE_CLOUD_CREDENTIAL);
  url.searchParams.append("alt", "media");
  url.searchParams.append("token", process.env.FIREBASE_STORAGE_TOKEN);
  const { data: serviceAccount } = await axios.get(url.toString());
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  return app;
}

module.exports = initializeApp;
