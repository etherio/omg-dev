<script>
import axios from "axios";
import server from "../app/server";
import Product from "../app/Product";
import placeholder from "../assets/img/image-dark.png";
import placeholderLight from "../assets/img/image.png";
import { database, databaseName, ServerValue, storage } from "../firebase";
import {
  translateAge,
  translateDateTime,
  translateNumber,
} from "../app/burmese";
import DeleteProductModal from "../components/DeleteProductModal.vue";

export default {
  components: {
    DeleteProductModal,
  },
  data: () => ({
    id: null,
    code: null,
    name: null,
    price: null,
    description: null,
    category: null,
    minAge: null,
    maxAge: null,
    images: [],
    colors: [],
    stock: 0,
    photoURL: null,
    createdAt: true,
    editing: false,
    placeholder,
    uid: null,
    loading: true,
  }),

  methods: {
    async deleteProduct() {
      if (this.loading) return;
      this.loading = true;
      this.dialog = true;
      await Product.delete(this);
      this.$router.push({ path: "/products" });
    },
  },

  beforeMount() {
    let id = this.$route.params.id;
    axios
      .get(`${server.products}/${id}`, {
        headers: {
          "X-Access-Token": this.$root.user.token,
        },
      })
      .then(({ data }) => {
        console.log(data);
        for (let key in data) {
          this[key] = data[key];
        }
        console.log(data);
        if (data.images.length) {
          storage
            .child(this.images[0])
            .getDownloadURL()
            .then((url) => {
              this.photoURL = url;
            });
        } else {
          this.photoURL = placeholderLight;
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        this.loading = false;
      });
  },

  computed: {
    priceInBurmese() {
      return translateNumber((this.price || 0).toLocaleString());
    },
    minAgeInBurmese() {
      return translateAge(this.minAge);
    },
    maxAgeInBurmese() {
      return translateAge(this.maxAge);
    },
    createdDateTime() {
      return translateDateTime(new Date(this.createdAt), "d-m-Y(Dနေ့)၊ A h:i");
    },
    ownerName() {
      return this.owner.name || this.owner.email;
    },
  },
};
</script>

<template>
  <v-container>
    <v-card :loading="loading">
      <v-card-title>
        <a
          :href="$router.resolve({ path: '/products' }).href"
          class="text-decoration-none"
        >
          <v-btn icon class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </a>
        <span v-if="name">
          {{ name }}
          <v-chip v-if="code" color="secondary" class="mx-1" small>
            {{ code }}
          </v-chip>
        </span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="5">
            <v-img :src="photoURL" :lazy-src="placeholder" alt="image">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
          <v-col cols="12" sm="7" v-if="price">
            <v-card-subtitle id="price" class="font-weight-bold">
              {{ priceInBurmese }}
            </v-card-subtitle>
            <p>
              <span v-if="owner">
                <a href="#">{{ ownerName }}</a> မှ
              </span>
              <a href="#">{{ createdDateTime }}</a> တွင် တင်ခဲ့သည်။
            </p>

            <v-chip v-if="category" color="primary" class="mx-1" small>
              {{ category }}
            </v-chip>
            <v-chip
              v-if="minAge"
              id="min-age"
              class="mx-1"
              small
              color="indigo lighten-1"
              dark
            >
              {{ minAgeInBurmese }}
            </v-chip>
            <v-chip
              v-if="maxAge"
              id="max-age"
              class="mx-1"
              small
              color="indigo lighten-1"
              dark
            >
              {{ maxAgeInBurmese }}
            </v-chip>
            <v-card-subtitle v-if="description">
              {{ description }}
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <delete-product-modal
          :deleteProduct="deleteProduct"
          :loading="loading"
        />
        <v-btn text color="primary darken-2" :href="photoURL" target="_blank">
          <v-icon class="mr-1">mdi-download</v-icon>
          ပုံယူရန်
        </v-btn>
        <v-btn
          text
          color="primary darken-2"
          :to="`/products/${$route.params.id}/clone`"
        >
          <v-icon class="mr-1">mdi-content-copy</v-icon>
          ပွားရန်
        </v-btn>
        <!-- <v-btn text :to="`/${$route.params.id}/edit`">
          <v-icon class="mr-1">mdi-pencil</v-icon>
          ပြင်ရန်
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
#price {
  font-size: 1.2em;
  letter-spacing: 2px;
}

#price::before {
  content: "ကျပ်";
}

#min-age::after {
  content: "မှ";
  /* padding-left: 5px; */
}

#max-age::after {
  content: "ထိ";
  /* padding-left: 5px; */
}
</style>
