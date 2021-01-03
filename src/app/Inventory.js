import Model from "./Model";
import Metadata from "./Metadata";

export default class Inventory extends Model {
  getCollection() {
    return "inventory";
  }

  async onUpdate() {
    await this.onSave();
  }

  async onSave() {
    let metadata = new Metadata({
      id: "inventory",
    });
    await metadata.get();
    if (this._data.stock) {
      if (this._data.stock > this.stock) {
        metadata.count -= this._data.stock - this.stock;
      } else {
        metadata.count += this.stock - this._data.stock;
      }
    } else {
      metadata.count += 1;
    }
    await metadata.update();
  }

  defineProperties() {
    return {
      stock: 0,
    };
  }

  beforeLoaded() {
    this.stock = Number(this.stock);
  }
}
