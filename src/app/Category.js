import Model from "./Model";
import Metadata from "./Metadata";

class Category extends Model {
  getCollection() {
    return "categories";
  }

  async onSave() {
    let metadata = new Metadata({
      id: "categories",
    });
    await metadata.get();
    metadata.count++;
    await metadata.update();
  }

  defineProperties() {
    return {
      title: null,
      total: 0,
    };
  }
}

export default Category;
