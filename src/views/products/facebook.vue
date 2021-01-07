<template>
  <v-container>
    <h2>create products from facebook post</h2>
    <div v-if="!access_token">
      <v-alert
        v-if="providers.includes('facebook.com')"
        type="warning"
        class="font-weight-bold"
      >
        ပြန်လည်ချိတ်ဆက်ရန် လိုအပ်သည်။
      </v-alert>
      <v-btn color="primary" @click="linkWithFacebook" class="font-weight-bold">
        <v-icon class="mr-2">mdi-facebook</v-icon>ဖေ့ဘွတ်အကောင့်နှင့်ချိတ်ဆက်ရန်
      </v-btn>
    </div>

    <div v-if="pages.length">
      <v-select label="Page" :item="pages.map((page) => page.name)"></v-select>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import firebase from "firebase/app";
import server from "@/app/server";
import config from "../../../config";

const testFacebookApi = (token) => {
  let url = new URL(server.facebook);
  url.pathname = "me";
  url.searchParams.append("access_token", token);
  return axios.get(url).then(({ data }) => data);
};

export default {
  name: "product-facebook",

  data: () => ({
    providers: [],
    access_token: null,
    pagesName: [],
    pages: [],
  }),

  methods: {
    choosePage({ access_token, id, name }) {
      //
    },
    linkWithFacebook() {
      let user = firebase.auth().currentUser;
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("public_profile,email,pages_read_engagement");
      user
        .reauthenticateWithPopup(provider)
        .then(({ credential, additionalUserInfo }) => {
          let access_token = credential.accessToken;
          let granted_scopes = additionalUserInfo.profile.granted_scopes;
          this.axios.post(
            server.session,
            {
              access_token,
              granted_scopes,
            },
            { headers: { "X-Access-Token": this.$root.user.token } }
          );
        });
      // .catch((err) => console.error(err));
    },
  },

  beforeMount() {
    let user = firebase.auth().currentUser;
    this.user = user;
    this.providers = user
      .toJSON()
      .providerData.map((provider) => provider.providerId);
    axios(`${server.session}/${user.uid}`).then(({ data }) => {
      if (!data.access_token) {
        return;
      }
      this.access_token = data.access_token;
      testFacebookApi(data.access_token)
        .then((me) => me.id)
        .then((id) => {
          let url = new URL(server.facebook);
          url.pathname = `${id}/accounts`;
          url.searchParams.append("fields", "name,access_token");
          url.searchParams.append("access_token", data.access_token);
          axios
            .get(url)
            .then(({ data }) => {
              this.pagesName = data.data.map((page) => page.name);
              console.log(this.pagesName);
              this.pages = data.data;
            })
            .catch((err) => {
              this.access_token = null;
            });
        });
    });
  },
};
</script>
