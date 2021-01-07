<script>
import server from "@/app/server";
import { translateAge } from "@/app/burmese";
import axios from "axios";
import FormData from "form-data";

const optimizeImage = async (code, file) => {
  let data = new FormData();
  data.append("code", code);
  data.append("image", file, file.fileName);
  let response = await axios({
    data,
    method: "POST",
    url: server.optimizeImage,
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    },
    responseType: "blob",
  });
  return response.data;
};

export default {
  name: "product-create",
  data: () => ({
    preload: false,
    loading: false,
    select: {
      name: null,
      code: null,
      price: null,
      description: null,
      category: null,
      colors: [],
      image: null,
      ageGroup: [null, null],
    },
    rules: {
      name: [(value) => value != null],
      code: [(value) => value != null],
      price: [(value) => value != null, (value) => Number(value) >= 0],
    },
    colors: [],
    categories: [],
    photoURL: null,
    imagePath: null,
  }),

  methods: {
    async onSubmit(event) {
      if (!this.$refs.form.validate()) {
        return this.goToRequiredField();
      }
      this.loading = true;
      let product = {
        name: this.select.name,
        code: this.select.code,
        price: parseInt(this.select.price),
        description: this.select.description,
        category: this.select.category,
        colors: this.select.colors,
        images: [],
        minAge: this.select.ageGroup[0],
        maxAge: this.select.ageGroup[1],
        uid: this.$root.user.uid,
        createdAt: ServerValue.TIMESTAMP,
      };
      let dt = new Date();
      let month = dt.getMonth() + 1;
      let year = dt.getYear() - 100;
      let imagePath = `${year}/${month}/${dt.getTime()}-${product.uid}`;
      if (this.photoURL) {
        product.images.push(this.imagePath);
      } else if (this.select.image) {
        let response = await optimizeImage(this.select.code, this.select.image);
        await storage.child(imagePath).put(response);
        product.images.push(imagePath);
      }
      let productRef = await Product.create(product, {
        categories: this.categories,
        colors: this.colors,
      });
      this.$router.push({ path: `/products/${productRef.key}` });
      this.loading = false;
    },

    goToRequiredField() {
      if (!this.select.name) {
        var el = document.querySelector("#input-name");
        el.select();
        return el.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
      if (!this.select.code) {
        var el = document.querySelector("#input-code");
        el.select();
        return el.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
      if (!this.select.price) {
        var el = document.querySelector("#input-price");
        el.select();
        return el.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    },
  },

  computed: {
    minAge() {
      return (
        (this.select.ageGroup[0] && translateAge(this.select.ageGroup[0])) ||
        "မွေးကင်းစ"
      );
    },
    maxAge() {
      return this.select.ageGroup[1] && translateAge(this.select.ageGroup[1]);
    },
    localePrice() {
      return (this.select.price || "").split(",").join("").toLocaleString();
    },
  },

  async created() {
    let colors = await colorsRef.get();
    let categories = await categoriesRef.get();

    if (colors.exists()) {
      colors = colors.val();
      Object.entries(colors).forEach(([key, value]) => {
        this.colors.push({ id: key, title: value.title });
      });
    }

    if (categories.exists()) {
      categories = categories.val();
      Object.entries(categories).forEach(([key, value]) => {
        this.categories.push({
          id: key,
          title: value.title,
          total: value.total,
        });
      });
    }

    /* fetching clone data */
    let url = new URL(server.getProduct);
    url.searchParams.append("dbname", databaseName);
    url.searchParams.append("id", this.$route.params.id);
    axios
      .get(url, {
        headers: {
          "X-Access-Token": this.$root.user.token,
        },
      })
      .then(({ data }) => {
        this.select.code = data.code;
        this.select.name = data.name;
        this.select.price = data.price;
        this.select.description = data.description;
        this.select.category = data.category;
        this.select.colors = data.colors || [];
        this.select.ageGroup = [data.minAge, data.maxAge];
        if (data.images instanceof Array && data.images.length) {
          storage
            .child(data.images[0])
            .getDownloadURL()
            .then((url) => {
              this.photoURL = url;
              this.imagePath = data.images[0];
            });
          console.log(data);
        }
        this.preload = false;
        this.loading = false;
      });

    // preload server
    server.preload();
  },
};
</script>

<template>
  <v-container>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-card :loading="preload" class="px-7">
      <v-form ref="form" @submit.prevent="onSubmit($event)">
        <v-row class="pt-4">
          <v-col cols="12">
            <v-btn icon @click="$router.back()">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <!-- Product Name -->
          <v-col cols="12">
            <v-text-field
              v-model="select.name"
              :rules="rules.name"
              :disabled="preload || loading"
              outlined
              id="input-name"
            >
              <template v-slot:label>
                <div>ကုန်ပစ္စည်းအမည် <b>*</b></div>
              </template>
            </v-text-field>
          </v-col>

          <!-- Item Code -->
          <v-col cols="6">
            <v-text-field
              v-model="select.code"
              :rules="rules.code"
              @input="select.code = (select.code || '').toUpperCase()"
              :disabled="preload || loading"
              outlined
              id="input-code"
              counter="13"
            >
              <template v-slot:label>
                <div>ကုတ်နံပါတ် <b>*</b></div>
              </template>
            </v-text-field>
          </v-col>

          <!-- Item Code -->
          <v-col cols="6">
            <v-text-field
              v-model="select.price"
              type="number"
              :rules="rules.price"
              @input="select.price = localePrice"
              suffix="ကျပ်"
              :disabled="preload || loading"
              outlined
              required
              id="input-price"
            >
              <template v-slot:label>
                <div>ရောင်းစျေး <b>*</b></div>
              </template>
            </v-text-field>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <v-textarea
              v-model="select.description"
              :disabled="preload || loading"
              outlined
              label="အကြောင်းအရာ/မှတ်ချက်"
              rows="4"
            />
          </v-col>

          <!-- Category -->
          <v-col cols="12" sm="5">
            <v-combobox
              v-model="select.category"
              :items="categories.map((category) => category.title)"
              :disabled="preload || loading"
              label="အမျိုးအစား"
              outlined
            />
          </v-col>

          <!-- Colors -->
          <v-col cols="12" sm="7">
            <v-combobox
              v-model="select.colors"
              :items="colors.map((color) => color.title)"
              :disabled="preload || loading"
              label="အရောင်များ"
              hide-selected
              multiple
              outlined
              persistent-hint
              small-chips
            />
          </v-col>
          <v-col cols="12">
            <v-img v-if="photoURL" :src="photoURL" width="240" height="240" />
            <v-file-input
              v-model="select.image"
              accept="image/png, image/jpeg, image/bmp"
              :disabled="preload || loading"
              prepend-icon="mdi-camera"
              :label="
                photoURL
                  ? 'ကုန်ပစ္စည်းဓာတ််ပုံထည့်ရန်'
                  : 'ကုန်ပစ္စည်းဓာတ််ပုံပြောင်းရန်'
              "
              @change="photoURL = imagePath = null"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-col cols="12">
          <v-range-slider
            class="mt-5 mx-10"
            v-model="select.ageGroup"
            step=".5"
            :disabled="preload || loading"
            max="15"
            label="အသက်အရွယ်"
          />
          <div
            v-if="select.ageGroup[0] || select.ageGroup[1]"
            class="text-center"
            style="height: 30px; width: 100%;"
          >
            <v-chip v-text="minAge" />
            မှ
            <v-chip v-text="maxAge" />
            ထိ
          </div>
          <div v-else style="height: 30px;"></div>
        </v-col>
        <v-col cols="12">
          <v-card-actions>
            <v-btn
              type="submit"
              text
              color="primary"
              block
              outlined
              large
              :disabled="preload || loading"
            >
              သိမ်းဆည်းရန်
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-form>
    </v-card>
  </v-container>
</template>

<style lang="scss">
html,
body {
  scroll-behavior: smooth;
}

.v-menu__content {
  .v-list-item {
    text-transform: capitalize;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
