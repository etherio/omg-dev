<script>
export default {
  name: "delete-product-modal",
  props: {
    loading: {
      type: Boolean,
      required: false,
    },
    deleteProduct: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
};
</script>

<template>
  <span>
    <v-btn text @click="dialog = true" color="red" dark>
      <v-icon>mdi-delete</v-icon>
      ဖျက်ရန်
    </v-btn>

    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline"> </v-card-title>
        <v-card-text>
          ကုန်ပစ္စည်းကို <b>ဖျက်ပစ်ရန်</b> သေချာပါသလား။
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="dialog = false" :disabled="loading">
            ပယ်ဖျက်ပါ
          </v-btn>
          <v-btn color="red" text @click="deleteProduct" :loading="loading">
            ဖျက်ပစ်ပါ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<style>
html,
body {
  scroll-behavior: smooth;
}
</style>
