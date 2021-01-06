import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import User from "./app/User";
import { app, auth } from "./firebase";
import server from "./app/server";

const data = {
  loaded: false,
  user: null,
  overlay: () => null,
};

Vue.use(VueAxios, axios);
Vue.config.productionTip = true;

auth()
  .getRedirectResult()
  .then((result) => {
    if (result && result.credential) {
      // const { credential } = result;
      axios.post(server.session, result);
    }
  });

new Vue({
  data,
  router,
  vuetify,
  render(h) {
    auth().onAuthStateChanged((user) => {
      User.resolve(user).then(async (user) => {
        data.user = user;
        data.loaded = true;
        if (!user && this.$route.path !== "/login") {
          this.$router.push({ path: "/login" });
        }
      });
    });

    return h(App);
  },
}).$mount("#app");
