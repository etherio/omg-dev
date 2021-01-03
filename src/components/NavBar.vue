<template>
  <v-row align="center" justify="space-around">
    <slot></slot>

    <v-toolbar-title>
      <a href="/#/">
        <v-img
          id="logo"
          alt="OMG"
          class="shrink mr-2"
          contain
          :src="logo"
          :lazy-src="logo"
          transition="scale-transition"
          width="80"
      /></a>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- user logged in -->
    <div v-if="$root.user">
      <v-btn @click="showAccount = !showAccount" icon x-large class="mr-4">
        <v-avatar color="primary" size="30" id="avatar">
          <img
            v-if="$root.user.photoURL"
            :src="$root.user.photoURL"
            alt="profile"
          />
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
      </v-btn>

      <!-- dropdrop for account -->
      <div v-if="showAccount" class="account">
        <v-card elevation="12">
          <v-navigation-drawer floating permanent>
            <v-list dense rounded>
              <!-- go to profile -->
              <v-list-item @click="viewProfile()">
                <v-list-item-icon
                  ><v-icon>mdi-account</v-icon></v-list-item-icon
                >
                <v-list-item-content>
                  <v-list-item-title>အကောင့်ပရိုဖိုင်</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- sign out action -->
              <v-list-item @click="signOut()">
                <v-list-item-icon
                  ><v-icon>mdi-login-variant</v-icon></v-list-item-icon
                >
                <v-list-item-content>
                  <v-list-item-title>အကောင့်မှထွက်ရန်</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </div>
    </div>
  </v-row>
</template>

<script>
import logo from "../assets/img/logo.png";
import { auth } from "../firebase";

export default {
  name: "NavBar",
  data: () => ({
    logo,
    showAccount: false,
  }),
  methods: {
    viewProfile() {
      this.showAccount = false;
      if (this.$route.path === "/profile") {
        return;
      }
      this.$router.replace("/profile");
    },
    async signOut() {
      let { name } = this.$route;
      this.showAccount = false;
      await auth().signOut();
    },
  },
  watch: {
    showAccount(value) {
      this.$root.overlay(value);
    },
  },
};
</script>

<style scoped>
.d-flex.align-center {
  width: 100%;
}

.text-regular {
  text-transform: none;
  letter-spacing: normal;
  padding-left: 5px;
}

.account {
  position: absolute;
  top: 65px;
  right: 10px;
}

#avatar {
  box-shadow: 0 0 0 1px #fff;
  border-radius: 50%;
}
</style>
