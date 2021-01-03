import { database, ServerValue } from "../firebase";

const productsRef = database.child("products");
const categoriesRef = database.child("categories");
const metadataRef = database.child("metadata/collection");
const colorsRef = database.child("colors");

const addCategory = async (categories, category) => {
  let matched = categories ? categories.find((c) => c.title == category) : null;
  if (matched) {
    // increment total value
    await categoriesRef.child(`${matched.id}`).update({
      total: ServerValue.increment(1),
    });
  } else {
    // create new category
    await categoriesRef.push({
      title: category,
      total: 1,
    });
    // increment value to metadata
    await metadataRef.child("categories").set({
      count: ServerValue.increment(1),
    });
  }
};

const addColor = async (colors, color) => {
  if (!colors || !colors.find((c) => c.title == color)) {
    await colorsRef.push({ title: color });
  }
};

class Product {
  static async create(product, { categories, colors }) {
    product.colors = product.colors.filter((c) => !!c);
    if (product.category) {
      product.category = product.category.toLowerCase();
      await addCategory(categories, product.category);
    }
    if (product.colors.length) {
      product.colors.forEach(async (color) => await addColor(colors, color));
    }
    await metadataRef.child("products").update({
      count: ServerValue.increment(1),
    });
    return await productsRef.push(product);
  }

  static async delete(product) {
    const metaRef = database.child("metadata/collection");
    // check in inventory
    const inventoryData = database.child(`inventory/${product.id}`);
    const inventorySnapshot = await inventoryData.get();
    if (inventorySnapshot.exists()) {
      // store the value to subtract from metadata
      var { stock } = inventorySnapshot.val();
      // remove from inventory
      await inventoryData.remove();
      // substract deleted stocks from metadata
      await metaRef.child("inventory").update({
        count: ServerValue.increment(stock * -1),
      });
    }

    // check having category
    if (product.category) {
      const categoriesRef = database.child("categories");
      const categorySnapshot = await categoriesRef.get();
      if (categorySnapshot.exists()) {
        const category = Object.entries(categorySnapshot.val()).find(
          ([key, value]) => value.title == product.category
        );
        // decrement value
        category &&
          categoriesRef.child(category[0]).update({
            total: ServerValue.increment(-1),
          });
      }
    }

    // delete product
    await database.child(`products/${product.id}`).remove();

    // check meta for products
    await metaRef.child("products").update({
      count: ServerValue.increment(-1),
    });
  }
}

export default Product;
