<template>
  <v-container fluid>
    <h2>User Profile</h2>
    <v-divider class="mt-2 py-5"></v-divider>
    <v-alert v-if="error" dense outlined type="error" v-html="error"></v-alert>

    <v-row justify="space-between" align="start">
      <v-col sm="5" cols="12" class="text-center">
        <v-avatar class="profile" color="grey" size="200">
          <v-img :src="avatar"></v-img>
        </v-avatar>
      </v-col>
      <v-col sm="7" cols="12">
        <v-text-field v-model="name" label="Display Name" readonly outlined />
        <v-text-field v-model="email" label="Email Address" readonly outlined />
        <v-text-field v-model="phone" label="Phone Number" readonly outlined />
        <v-btn color="primary" large disabled>
          <v-icon class="pr-2">mdi-content-save</v-icon> Save
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-card-title>Created On</v-card-title>
        <v-card-text>{{ createdAt }}</v-card-text>
      </v-col>
      <v-col cols="6">
        <v-card-title>Last Login</v-card-title>
        <v-card-text>{{ lastLoginAt }}</v-card-text>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn
          v-if="!providers.includes('google.com')"
          class="mt-3 mb-3 font-weight-bold"
          color="red"
          dark
          block
        >
          <v-icon class="pr-2" small>mdi-google</v-icon> ဖြင့်ချိတ်ဆက်ရန်
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn
          v-if="!providers.includes('facebook.com')"
          class="mt-3 mb-3 font-weight-bold"
          color="blue darken-2"
          dark
          block
        >
          <v-icon small class="pr-2">mdi-facebook</v-icon> ဖြင့်ချိတ်ဆက်ရန်
        </v-btn>
      </v-col>
      <v-col cols="12">
        <div style="height: 60px;"></div>
        <delete-profile-modal />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from "../firebase";
import DeleteProfileModal from "../components/DeleteProfileModal.vue";
import placeholder from "../assets/img/image.png";

export default {
  name: "Profile",

  components: {
    DeleteProfileModal,
  },

  data: () => ({
    email: null,
    name: null,
    password: null,
    phone: null,
    error: null,
    providers: [],
  }),

  computed: {
    createdAt() {
      let dt = new Date();
      dt.setTime(this.$root.user.createdAt);
      return dt.toLocaleString();
    },

    lastLoginAt() {
      let dt = new Date();
      dt.setTime(this.$root.user.lastLoginAt);
      return dt.toLocaleString();
    },
  },

  beforeMount() {
    const user = this.$root.user;
    this.name = user.displayName || " ";
    this.email = user.email || " ";
    this.phone = user.phoneNumber || " ";
    this.avatar = user.photoURL || placeholder;
    this.providers = user.providerData.map((provider) => provider.providerId);
  },
};
</script>
