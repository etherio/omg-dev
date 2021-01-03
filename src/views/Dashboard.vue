<script>
import { database } from "../firebase";
import { translateNumber } from "../app/burmese";

export default {
  data: () => ({
    products: 0,
    categories: 0,
    inventory: 0,
  }),

  methods: {
    num: translateNumber,
  },

  async created() {
    const zero = "၀";
    const dbRef = database.child("metadata/collection");
    const dbSnap = await dbRef.get();
    this.products = zero;
    this.categories = zero;
    this.inventory = zero;
    if (!dbSnap.exists()) return;
    const { products, categories, inventory } = dbSnap.val();
    const updateData = {};
    this.products = products.count;
    this.categories = categories.count;
    this.inventory = inventory.count;
    if (this.products < 0) {
      updateData.products = { count: 0 };
      this.products = 0;
    }
    if (this.categories < 0) {
      updateData.categories = { count: 0 };
      this.categories = 0;
    }
    if (this.inventory < 0) {
      updateData.inventory = { count: 0 };
      this.inventory = 0;
    }
    if (Object.keys(updateData).length) {
      dbRef.update(updateData);
    }
  },
};
</script>

<template>
  <v-container>
    <h2>မင်္ဂလာပါ‌</h2>
    <v-row>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4">
        <v-card color="blue darken-2" dark :to="{ path: '/products' }">
          <v-card-title>ကုန်ပစ္စည်း</v-card-title>
          <v-card-subtitle>အမျိုးပေါင်း</v-card-subtitle>
          <v-card-text
            ><h2>{{ num(products) }}</h2></v-card-text
          >
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4">
        <v-card color="red darken-2" dark :to="{ path: '/products' }">
          <v-card-title>ကုန်ပစ္စည်း</v-card-title>
          <v-card-subtitle>စုစုပေါင်း</v-card-subtitle>
          <v-card-text>
            <h2>{{ num(inventory) }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="6" lg="4" xl="4">
        <v-card color="yellow darken-4" dark :to="{ path: '/categories' }">
          <v-card-title>ကုန်ပစ္စည်းအမျိုးအစား</v-card-title>
          <v-card-subtitle>စုစုပေါင်း</v-card-subtitle>
          <v-card-text>
            <h2>{{ num(categories) }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
