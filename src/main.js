import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import User from "./app/User";
import { app, auth } from "./firebase";

const data = {
  loaded: false,
  user: null,
  overlay: () => null,
};

Vue.use(VueAxios, axios);
Vue.config.productionTip = true;

auth().onAuthStateChanged((user) => {
  User.resolve(user).then(async (user) => {
    data.user = user;
    data.loaded = true;
  });
});

if (process.env.NODE_ENV === "production") {
  app.analytics();
  app.performance();
}

new Vue({
  data,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
