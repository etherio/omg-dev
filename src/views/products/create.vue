<template>
  <v-container>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-form ref="form" @submit.prevent="onSubmit">
      <v-row>
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
            outlined
            id="input-name"
          >
            <template v-slot:label>
              <div>ကုန်ပစ္စည်းအမည်<b>*</b></div>
            </template>
          </v-text-field>
        </v-col>

        <!-- Item Code -->
        <v-col cols="6">
          <v-text-field
            v-model="select.code"
            :rules="rules.code"
            @input="select.code = (select.code || '').toUpperCase()"
            outlined
            id="input-code"
            counter="13"
          >
            <template v-slot:label>
              <div>ကုတ်နံပါတ်<b>*</b></div>
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
            outlined
            required
            id="input-price"
          >
            <template v-slot:label>
              <div>စျေးနှုန်း<b>*</b></div>
            </template>
          </v-text-field>
        </v-col>

        <!-- Description -->
        <v-col cols="12">
          <v-textarea
            v-model="select.description"
            outlined
            label="အကြောင်းအရာ သို့မဟုတ်် မှတ်ချက်"
            rows="4"
          />
        </v-col>

        <!-- Category -->
        <v-col cols="12" sm="5">
          <v-combobox
            v-model="select.category"
            :items="categories.map((category) => category.title)"
            label="ကုန်ပစ္စည်းအမျိုးအစား"
            outlined
          />
        </v-col>

        <!-- Colors -->
        <v-col cols="12" sm="7">
          <v-combobox
            v-model="select.colors"
            :items="colors.map((color) => color.title)"
            label="​ရရှိနိုင်သောအရောင်များ"
            hide-selected
            multiple
            outlined
            persistent-hint
            clearable
            small-chips
          />
        </v-col>

        <!-- Image -->
        <v-col cols="12">
          <v-text-field
            label="ဓာတ်ပုံလင့်ခ်"
            v-model="select.imageURL"
            v-show="uploadFromUrl"
            prepend-icon="mdi-camera"
          />
          <v-file-input
            v-show="!uploadFromUrl"
            v-model="select.image"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="ကုန်ပစ္စည်းဓာတ််ပုံ"
          />
          <!-- upload from url button -->
          <v-btn
            small
            outlined
            color="primary"
            @click="uploadFromUrl = !uploadFromUrl"
            v-text="uploadFromUrl ? 'ဓာတ်ပုံဖိုင်တင်ရန' : 'URL မှပုံတင်ရန်'"
          />
        </v-col>

        <!-- age group -->
        <v-col cols="12">
          <v-label></v-label>
          <v-range-slider
            class="mt-5 mx-10"
            v-model="select.ageGroup"
            step=".5"
            max="15"
            label="အသက်အရွယ်"
          />
          <!-- label for selected age -->
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

        <!-- submit button -->
        <v-col cols="12">
          <v-card-actions>
            <v-btn type="submit" text color="primary" block outlined large>
              သိမ်းဆည်းရန်
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import server from "@/app/server";
import { translateAge } from "@/app/burmese";
import FormData from "form-data";

export default {
  name: "product-create",
  data: () => ({
    loading: false,
    connecting: false,
    uploadFromUrl: false,
    select: {
      name: null,
      code: null,
      price: null,
      description: null,
      category: null,
      colors: [],
      image: null,
      imageURL: null,
      ageGroup: [null, null],
    },
    rules: {
      name: [(value) => value != null],
      code: [(value) => value != null],
      price: [(value) => value != null, (value) => Number(value) >= 0],
    },
    colors: [],
    categories: [],
  }),

  methods: {
    async onSubmit(event) {
      if (!this.$refs.form.validate()) {
        return this.goToRequiredField();
      }
      this.loading = true;
      const data = new FormData();
      let product = {
        name: this.select.name,
        code: this.select.code,
        price: parseInt(this.select.price),
        description: this.select.description,
        category: this.select.category,
        colors: this.select.colors.filter((c) => !!c),
        minAge: this.select.ageGroup[0],
        maxAge: this.select.ageGroup[1],
      };
      if (this.uploadFromUrl && this.select.imageURL) {
        let { data } = await this.axios.get(this.select.imageURL, {
          responseType: "blob",
        });
        this.select.image = data;
      }
      if (this.select.image) {
        data.append("image", this.select.image);
      }
      for (let [key, value] of Object.entries(product)) {
        data.append(key, value);
      }
      this.axios({
        data,
        method: "POST",
        url: server.products,
        headers: {
          Accept: "application/json",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          "X-Access-Token": this.$root.user.token,
        },
      })
        .then(() => {
          this.$router.push({ path: "/products" });
        })
        .catch((err) => {
          console.error(err);
          this.error = "ကုန်ပစ္စည်းအားသိမ်းဆည်းမှုမအောင်မြင်ပါ။";
        });
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

  beforeMount() {
    this.axios
      .get(server.combo, {
        headers: { "X-Access-Token": this.$root.user.token },
      })
      .then(({ data }) => {
        this.categories = data.categories;
        this.colors = data.colors;
      });
  },
};
</script>

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
