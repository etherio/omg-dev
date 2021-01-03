<template>
  <v-container fluid>
    <h2>User Profile</h2>
    <v-divider class="mt-2 py-5"></v-divider>
    <v-alert v-if="error" dense outlined type="error" v-html="error"></v-alert>

    <v-row justify="space-between" align="start">
      <v-col lg="4" xl="4" sm="4" cols="12">
        <v-avatar class="profile" color="grey" size="200">
          <v-img :src="avatar"></v-img>
        </v-avatar>
      </v-col>
      <v-col lg="8" xl="8" sm="8" cols="12">
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
      <v-col cols="12">
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

  created() {
    this.name = this.$root.user.displayName || " ";
    this.email = this.$root.user.email || " ";
    this.phone = this.$root.user.phoneNumber || " ";
    this.avatar = this.$root.user.photoURL || placeholder;
  },
};
</script>

<style></style>
