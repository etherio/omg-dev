<template>
  <v-container>
    <v-row align="center" justify="center" class="pb-5">
      <v-col cols="12">
        <v-text-field
          label="Search"
          prepend-inner-icon="mdi-magnify"
          class="pb-0"
          clearable
          solo
        />
        <v-col cols="12" class="d-flex justify-end py-0">
          <v-checkbox v-model="filter.mode[0]" class="mr-4" label="In-stock" />
          <v-checkbox v-model="filter.mode[1]" label="Out of stock" />
        </v-col>
      </v-col>
      <v-btn
        :loading="loading"
        :disable="loading"
        color="primary"
        @click="search($event)"
        class="mx-2"
        large
      >
        Search
      </v-btn>
      <v-btn
        class="mx-2"
        :depressed="Boolean(panel.length)"
        @click="panel.length ? panel.pop() : panel.push(0)"
        large
      >
        <v-icon>mdi-filter</v-icon> Filter
      </v-btn>
    </v-row>
    <v-expansion-panels v-model="panel" class="mt-5" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header class="hidden"></v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="6">
              <v-select
                :items="categories.map((category) => category.title)"
                v-model="filter.categories"
                label="Categories"
                chips
                multiple
                solo
              />
            </v-col>
            <v-col cols="6">
              <v-select
                solo
                v-model="filter.colors"
                :items="colors.map((color) => color.title)"
                label="Colors"
                chips
                multiple
              />
            </v-col>
            <v-col cols="12">
              <v-label>Age Group</v-label>
              <v-range-slider
                class="mt-5 mx-10"
                v-model="filter.ageGroup"
                step=".5"
                :thumb-label="hover"
                @input="hover = false"
                max="15"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="ma-2"></div>
    <div v-if="queried.time">
      <p>
        showing {{ queried.size }} documents ({{
          (Number(queried.time) || 0).toFixed(2)
        }}
        seconds)
      </p>
      <v-divider class="my-5"></v-divider>
      <!-- search result -->
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="4"
          xl="3"
          v-for="(product, index) in results"
          :key="index"
        >
          <product-card :product="product" :removeProduct="removeProduct" />
        </v-col>
      </v-row>

      <!-- <div class="text-center">
        <v-pagination v-model="page" :length="paginate.length"></v-pagination>
      </div> -->
    </div>
  </v-container>
</template>

<script>
let MAX_SHOW_RESULTS = 15;
let products = [];

export default {
  name: "ProductSearch",

  data: () => ({
    loading: false,
    panel: [],
    filter: {
      ageGroup: [0, 15],
      categories: [],
      colors: [],
      mode: [true, false],
    },
    results: [],
    queried: {
      size: null,
      time: null,
    },
    page: null,
    paginate: {
      page: null,
      length: null,
      startAt: null,
      endAt: null,
    },
    categories: [],
    colors: [],
    hover: false,
  }),

  methods: {
    async search() {
      let started = Date.now();
      let queried = Product.orderByChild("createdAt");
      this.page = 0;
      this.loading = true;
      this.results = [];
      this.panel = [];

      queried = await queried.get();
      products = (await Product.make(queried)).reverse();

      this.page = 1;
      this.loading = false;
      this.queried.size = products.size;
      this.queried.time = (Date.now() - started) / 1000;
    },

    removeProduct(_id) {
      this.results = this.results.filter((r) => r._id !== _id);
      this.queried.size = this.results.length;
      this.queried.time = 0;
    },
  },

  computed: {
    ageGroupHint() {
      let [minAge, maxAge] = this.filter.ageGroup;
      if (minAge > 0 || maxAge < 15) {
        return `minimum age ${minAge} to ${maxAge} yrs.`;
      }
      return "";
    },

    fetchAllProducts() {
      return this.filter.mode[0] && this.filter.mode[1];
    },

    fetchInStockOnly() {
      return this.filter.mode[0] && !this.filter.mode[1];
    },

    fetchOutOfStockOnly() {
      return !this.filter.mode[0] && this.filter.mode[1];
    },
  },

  async beforeMount() {
    this.colors = await Color.all();
    this.categories = await Category.all();
  },

  watch: {
    page() {
      let p = this.page;
      this.paginate.page = p;
      this.paginate.endAt = MAX_SHOW_RESULTS * p;
      this.paginate.startAt = this.paginate.endAt - MAX_SHOW_RESULTS;
      this.results = products.slice(this.paginate.startAt, this.paginate.endAt);
    },
  },

  components: {
    ProductCard,
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
