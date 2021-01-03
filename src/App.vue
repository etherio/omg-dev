<template>
  <v-app v-if="$root.loaded">
    <v-overlay :value="overlay" />

    <v-navigation-drawer v-model="drawer" fixed temporary v-if="$root.user">
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <template v-for="(item, index) in items">
            <v-list-item :to="item.path" :key="index" v-if="can(item.visible)">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark v-if="$root.user">
      <nav-bar>
        <v-app-bar-nav-icon @click="drawer = true" />
      </nav-bar>
    </v-app-bar>

    <!-- contents -->
    <v-main>
      <v-container v-if="$root.user">
        <router-view v-if="$root.user.role" />
        <access-denied v-else />
      </v-container>
      <login-page v-else />
    </v-main>

    <!-- footer -->
    <v-footer padless>
      <v-col class="text-center" cols="12">
        &copy; {{ translateNumber(new Date().getFullYear()) }}
        <strong>OMG</strong>
      </v-col>
    </v-footer>
  </v-app>

  <!-- loading -->
  <v-container v-else>
    <div id="preload">
      <v-progress-circular size="70" indeterminate color="primary" />
    </div>
  </v-container>
</template>

<script>
import AccessDenied from "./components/AccessDenied.vue";
import NavBar from "./components/NavBar.vue";
import LoginPage from "./components/LoginPage.vue";
import { translateNumber } from "./app/burmese";
import { auth } from "./firebase";

export default {
  name: "App",

  data: () => ({
    overlay: false,
    drawer: false,
    group: null,
    items: [
      {
        icon: "mdi-apps",
        title: "မူလစာမျက်နှာ",
        path: "/",
      },
      {
        icon: "mdi-account-multiple",
        title: "အဆက်အသွယ်များ",
        path: "/customers",
        visible: ["admin", "moderator"],
      },
      {
        icon: "mdi-store",
        title: "ကုန်ပစ္စည်းများ",
        path: "/products",
        visible: ["admin", "moderator"],
      },
      {
        icon: "mdi-tag",
        title: "အမျိူးအစားများ",
        path: "/categories",
        visible: ["admin", "moderator"],
      },
      {
        icon: "mdi-truck",
        title: "အော်ဒါများ",
        path: "/orders",
        visible: ["admin", "moderator"],
      },
      {
        icon: "mdi-security",
        title: "ခွင့်ပြုချက်များ",
        path: "/users",
        visible: ["admin"],
      },
      {
        icon: " mdi-receipt",
        title: "မှတ်တမ်းများ",
        path: "/logs",
        visible: ["admin"],
      },
    ],
  }),

  components: {
    NavBar,
    LoginPage,
    AccessDenied,
  },

  methods: {
    translateNumber,

    can(visible) {
      let user = this.$root.user;
      return visible ? visible.includes(user && user.role) : true;
    },
  },

  created() {
    this.$root.overlay = (value) => {
      this.overlay = value;
    };

    auth()
      .getRedirectResult()
      .then((data) => {
        if (!data) return;
      });
  },
};
</script>

<style scoped>
#preload {
  display: flex;
  width: 100%;
  height: calc(100vh - 5rem);
  justify-content: center;
  align-items: center;
}
</style>
