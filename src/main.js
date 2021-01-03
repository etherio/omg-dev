import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import User from "./app/User";
import { app, auth } from "./firebase";

const data = {
  loaded: false,
  user: null,
  overlay: () => null,
};

if (process.env.NODE_ENV === "production") {
  app.analytics();
  app.performance();
}

auth().onAuthStateChanged((user) => {
  User.resolve(user).then(async (user) => {
    data.user = user;
    data.loaded = true;
  });
});

Vue.config.productionTip = true;

new Vue({
  data,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
