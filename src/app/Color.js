import Model from "./Model";

class Color extends Model {
  getCollection() {
    return "colors";
  }

  defineProperties() {
    return {
      title: null,
    };
  }
}

export default Color;
