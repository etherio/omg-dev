const { database, auth, storage } = require("firebase-admin");
const databaseName = process.env.FIREBASE_DATABASE_NAME;
// const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

class Product {
  constructor({
    id,
    code,
    name,
    price,
    createdAt,
    uid,
    images,
    colors,
    category,
    minAge,
    description,
    maxAge,
  }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.price = parseInt(price);
    this.createdAt = parseInt(createdAt);
    this.uid = uid;
    this.images = Object.values(images || {});
    this.colors = colors;
    this.category = category;
    this.description = description;
    this.minAge = minAge && parseFloat(minAge);
    this.maxAge = maxAge && parseFloat(maxAge);
  }

  async fetch({ owner, stocks, imageUrl }) {
    owner && (await this.getOwner());
    stocks && (await this.getStocks());
    imageUrl && (await this.getImageUrl());
  }

  async getImageUrl() {
    let images = [];
    if (!this.images instanceof Array) {
      return;
    }
    for (let image of this.images) {
      image = `databases/${databaseName}/${image}`;
      if (storage().bucket().exists(image)) {
        let snapshot = await storage().bucket().file(image).get();
        snapshot[0].makePublic();
        images.push(snapshot[0].publicUrl());
      }
    }
    this.images = images;
  }

  getOwner() {
    this.owner = null;

    return (
      this.uid &&
      auth()
        .getUser(this.uid)
        .then((user) => {
          this.owner = {
            name: user.displayName || null,
            email: user.email || null,
            phone: user.phoneNumber || null,
            role: (user.customClaims && user.customClaims.role) || null,
          };
        })
    );
  }

  getStocks() {
    this.stocks = 0;

    return database()
      .ref(databaseName)
      .child("inventory")
      .child(this.id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.stocks = snapshot.val().count;
        }
      });
  }
}

module.exports = Product;
