<script>
export default {
  name: "AddCategory",
  props: ["label", "icon"],
  data: () => ({
    dialog: false,
    title: null,
  }),
  methods: {
    addCategory() {
      let category = new Category({ id: this.title.toLowerCase() });
      category.total = 0;
      category.save().then(() => {
        this.$parent.categories.push(category.toJSON());
        this.title = null;
        this.$refs.form.reset();
        this.dialog = false;
      });
    },
  },
};
</script>

<template>
  <v-dialog v-model="dialog" width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark :bind="attrs" v-on="on">
        <v-icon v-if="icon">{{ icon }}</v-icon>
        <span v-if="label">{{ label }}</span>
      </v-btn>
    </template>
    <v-form @submit.prevent="addCategory" ref="form">
      <v-card>
        <v-card-text class="pt-10">
          <v-text-field v-model="title" label="Category" autofocus outlined />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            text
            @click="$refs.form.reset() && (dialog = false)"
          >
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="addCategory">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
