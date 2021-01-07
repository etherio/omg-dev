<script>
import server from "@/app/server";
import { translateNumber, translateAge } from "@/app/burmese";
import placeholder from "@/assets/img/image.png";

export default {
  name: "Products",
  data: () => ({
    error: null,
    snackbar: false,
    snackbarMessage: null,
    loading: true,
    products: [],
  }),
  methods: {
    num(value) {
      return translateNumber(parseInt(value)) || "-";
    },
    price(value) {
      return translateNumber(parseInt(value).toLocaleString());
    },

    age(value) {
      return translateAge(parseInt(value));
    },

    viewProduct(id) {
      this.$router.replace(["product", id].join("/"));
    },
  },

  beforeMount() {
    this.axios
      .get(server.products, {
        headers: { "X-Access-Token": this.$root.user.token },
      })
      .then(({ data }) => {
        return data.map((product) => {
          product.photoURL = placeholder;
          if (product.images && product.images.length) {
            product.photoURL = product.images[0];
          }
          return product;
        });
      })
      .then((products) => {
        this.products = products;
        if (!this.products.length) {
          this.snackbar = true;
          this.snackbarMessage = "ကုန်ပစ္စည်းများရှာမတွေ့ပါ။";
        }
      })
      .catch((err) => {
        console.error(err);
        this.snackbar = true;
        this.error = this.snackbarMessage =
          "တစ်ခုခုမှားယွင်းနေပါတယ်။ နောက်တစ်ခါထပ်မံကြိုးစားကြည့်ပါ။";
      })
      .then(() => {
        this.loading = false;
      });
  },
};
</script>

<template>
  <div class="products">
    <!-- <product-create /> -->
    <v-card :loading="loading">
      <v-card-actions>
        <v-card-title>ကုန်ပစ္စည်းများ</v-card-title>
        <v-spacer />
        <v-btn text :to="{ path: '/products/new' }">
          <v-icon>mdi-plus</v-icon>
          အသစ်ထည့်ရန်
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-simple-table>
          <template>
            <thead>
              <tr>
                <th class="text-left">အကြောင်းအရာ</th>
                <th class="text-center">စျေးနှုန်း</th>
                <th class="text-center">အမျိုးအစား</th>
                <th class="text-center">အသက်အရွယ်</th>
                <th class="text-center">‌ရေတွက်</th>
              </tr>
            </thead>
            <tbody v-if="products.length">
              <tr
                v-for="(product, index) in products"
                :key="index"
                @click="$router.push({ path: `/products/${product.id}` })"
              >
                <td class="text-left">
                  <v-row>
                    <v-col class="ma-1">
                      <v-img :src="product.photoURL" width="120">
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-col>
                    <v-col>
                      <b>{{ product.name }}</b>
                    </v-col>
                  </v-row>
                </td>
                <td class="text-center">{{ price(product.price) }} ကျပ်</td>
                <td class="text-center">
                  {{ product.category }}
                </td>
                <td class="text-center">
                  <span v-if="product.minAge">
                    {{ age(product.minAge) }} မှ
                  </span>
                  <span v-if="product.maxAge">
                    {{ age(product.maxAge) }}ထိ
                  </span>
                </td>
                <td class="text-center">{{ num(product.stocks) }}</td>
              </tr>
            </tbody>
            <tbody v-if="snackbarMessage">
              <tr>
                <td colspan="5">
                  {{ snackbarMessage }} အသစ်တစ်ခုထည့်သွင်းရန်
                  <v-btn
                    text
                    rounded
                    color="primary"
                    class="font-weight-bold"
                    to="/products/new"
                    >ဒီကိုနှိပ်</v-btn
                  >ပါ။
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" timeout="5000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
          class="font-weight-bold text--lighten-2"
        >
          ပိတ်
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
