<template>
  <v-container class="mt-5 pa-2">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8">
        <v-card :loading="loading" class="px-2" elevation="4">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title class="pt-6 pb-5">
              <span class="text-center" style="width: 100%;">
                လက်မှတ်ထိုးဝင်ပါ
              </span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="email"
                label="သင့်အီးမေးလ်ထည့်ပါ"
                type="email"
                :rules="rules.email"
                @keyup.enter="signInWithEmailAndPassword()"
                outlined
              />
              <v-text-field
                v-model="password"
                label="သင့်စကားဝှက်ထည့်ပါ"
                autocapitalize="off"
                :append-icon="showPassword ? '' : ''"
                :type="showPassword ? 'text' : 'password'"
                :rules="rules.password"
                @keyup.enter="signInWithEmailAndPassword()"
                outlined
              />
              <v-alert
                v-if="error"
                dense
                outlined
                type="error"
                v-text="error"
              ></v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                block
                @click="signInWithEmailAndPassword()"
              >
                ဝင်ရောက်ရန်
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-form>
          <v-card-subtitle class="text-center">
            <v-btn
              class="mt-5"
              color="red"
              dark
              @click="signInWithGoogle()"
              icon
              large
            >
              <v-icon>mdi-google</v-icon>
            </v-btn>

            <v-btn
              class="mt-5"
              color="blue"
              dark
              @click="signInWithFacebook()"
              icon
              large
            >
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from "../firebase";

export default {
  data: () => ({
    loading: false,
    error: null,
    valid: null,
    email: "",
    password: "",
    showPassword: false,
    rules: {
      email: [
        (value) =>
          !!(value || "").match(
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
          ) || "Enter a vaild email address",
      ],
      password: [(value) => !!value || "Password is required"],
    },
  }),
  methods: {
    signInWithEmailAndPassword() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.error = null;
      auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.loading = true;
        })
        .catch((err) => {
          this.loading = false;
          switch (err.code) {
            case "auth/user-not-found":
              this.error = "အကောင့်ရှာမတွေ့ပါ";
              break;
            case "auth/wrong-password":
              this.error = "Incorrect password";
              break;
            default:
              this.error = err.message || err.toString();
          }
        });
    },
    signInWithGoogle() {
      const provider = new auth.GoogleAuthProvider();
      this.loading = true;
      this.error = null;
      auth()
        .signInWithRedirect(provider)
        .then(() => (this.loading = false));
    },
    signInWithFacebook() {
      const provider = new auth.FacebookAuthProvider();
      this.loading = true;
      this.error = null;
      auth()
        .signInWithRedirect(provider)
        .then(() => (this.loading = false));
    },
  },
  beforeMount() {
    this.$root.overlay(false);
  },
};
</script>

<style></style>
