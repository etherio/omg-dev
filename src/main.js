import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import User from "./app/User";
import server from "./app/server";
import { firebaseConfig } from "../config";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueAxios, axios);

Vue.config.productionTip = true;

firebase.initializeApp(firebaseConfig);
firebase
  .auth()
  .getRedirectResult()
  .then((result) => {
    if (result && result.credential) {
      // const { credential } = result;
      axios.post(server.session, result);
    }
  });

new Vue({
  data: { loaded: false, user: null, overlay: () => null },
  router,
  vuetify,
  render(h) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user && this.$route.path !== "/login") {
        this.$router.push({ path: "/login" }).then(() => {
          this.loaded = true;
        });
      } else {
        User.resolve(user).then(async (user) => {
          this.user = user;
          this.loaded = true;
        });
      }
    });

    return h(App);
  },
}).$mount("#app");
