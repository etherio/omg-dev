<template>
  <div class="home">
    <product-search></product-search>
  </div>
</template>

<script>
import ProductSearch from "../components/ProductSearch.vue";

export default {
  name: "Home",
  components: {
    ProductSearch,
  },
};
</script>
