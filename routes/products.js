const express = require("express");
const { database } = require("firebase-admin");
const router = express.Router();
const Product = require("../src/Product");
const Guard = require("../src/guard");
const databaseName = process.env.FIREBASE_DATABASE_NAME;

router.get("/", Guard.allows("moderator", "admin"), async (req, res) => {
  try {
    const dbRef = database().ref(databaseName).child("products");
    let snapshot = await dbRef.get();
    let products = snapshot.exists() ? Object.entries(snapshot.val()) : [];
    let response = [];
    for (let [id, data] of products) {
      let product = new Product({ id, ...data });
      response.push(product);
      await product.fetch({ stocks: true, imageUrl: true });
    }
    return res.json(response).end();
  } catch (e) {
    console.error(e);
    res.status(e.code || 400).end();
  }
});

router.get("/:id", Guard.allows("admin", "moderator"), async (req, res) => {
  let { id } = req.params;
  try {
    let dbRef = database().ref(databaseName).child("products").child(id);
    let snapshot = await dbRef.get();
    if (!snapshot.exists()) {
      throw { code: 404 };
    }
    let product = new Product({
      id: snapshot.key,
      ...snapshot.toJSON(),
    });
    await product.fetch({ owner: true, stocks: true, imageUrl: true });
    res.json(product).end();
  } catch (e) {
    console.error(e);
    res.status(e.code || 400);
  }
  res.end();
});

module.exports = router;
