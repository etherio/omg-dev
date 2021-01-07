<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" v-for="(review, index) in reviews" :key="index">
        <v-card class="my-4">
          <v-img :src="review.images[0]"></v-img>
          <v-card-title>
            {{ review.message[0] }}
          </v-card-title>
          <v-card-text> </v-card-text>
          <v-card-actions>
            <v-btn text color="error">
              ပယ်ဖျက်ရန်
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="primary"> အတည်ပြုရန် </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import server from "@/app/server";
import ProductCreate from "@/components/product-create.vue";
export default {
  data: () => ({
    reviews: [],
  }),
  components: {
    ProductCreate,
  },
  beforeMount() {
    this.axios
      .get(server.review, {
        headers: {
          "X-Access-Token": this.$root.user.token,
        },
      })
      .then(({ data }) => {
        this.reviews = data;
      });
  },
};
</script>
