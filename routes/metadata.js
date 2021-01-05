const { Router } = require("express");
const { database } = require("firebase-admin");
const router = Router();
const Guard = require("../src/guard");
const databaseName = process.env.FIREBASE_DATABASE_NAME;
const response = { products: 0, categories: 0, inventory: 0 };

router.get("/", Guard.allows("admin", "moderator"), async (req, res) => {
  const dbRef = database().ref(`${databaseName}/metadata/collection`);
  const snapshot = await dbRef.get();
  if (!snapshot.exists()) return res.json(response).end();
  const data = snapshot.val();
  response.categories = (data.categories && data.categories.count) || 0;
  response.products = (data.products && data.products.count) || 0;
  response.inventory = (data.inventory && data.inventory.count) || 0;
  res.json(response).end();
});

module.exports = router;
