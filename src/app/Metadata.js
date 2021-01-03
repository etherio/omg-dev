import Model from "./Model";

class Metadata extends Model {
  getCollection() {
    return "metadata/collection";
  }

  defineProperties() {
    return {
      count: 0,
    };
  }
}

export default Metadata;
