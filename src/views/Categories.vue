<template>
  <v-container class="mt-2">
    <h2 class="mb-3">ကုန်ပစ္စည်းအမျိုးအစားများ</h2>
    <v-card :loading="loading">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>အမျိုးအစား</th>
              <th class="text-center">ကုန်ပစ္စည်းများ</th>
              <th><span class="sr-only">actions</span></th>
            </tr>
          </thead>
          <tbody v-if="empty">
            <tr>
              <td colspan="3">
                အမျိုးအစားများထည့်သွင်းထားခြင်းမရှိသေးပါ။ အသစ်တစ်ခုထည့်သွင်းရန်
                <v-btn
                  text
                  rounded
                  color="primary"
                  class="font-weight-bold"
                  to="/products/new"
                >
                  ဒီကိုနှိပ်
                </v-btn>
                ပါ။
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(category, index) in categories" :key="index">
              <td class="text-capitalize">{{ category.title }}</td>
              <td class="text-center">{{ num(category.total) }} မျိုး</td>
              <td class="text-right">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item>
                      <v-list-item-title
                        class="action-link red--text"
                        @click="deleteCategory(category)"
                      >
                        <v-icon color="red">mdi-delete</v-icon> ဖျက်ရန်
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import { translateNumber } from "../app/burmese";
import AddCategory from "@/components/AddCategory.vue";

const zero = "၀";

const wrapper = (id, title, total) => ({ id, title, total });

export default {
  data: () => ({
    loading: true,
    empty: false,
    categories: [],
  }),
  components: {
    AddCategory,
  },
  methods: {
    num(value) {
      return translateNumber(parseInt(value) || 0);
    },
  },
  beforeMount() {
    //
  },
};
</script>
