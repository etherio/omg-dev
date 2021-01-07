<template>
  <v-container>
    <h2>create products from facebook post</h2>

    <div v-if="access_token">
      <v-row>
        <v-spacer></v-spacer>
        <v-btn small outlined color="primary" @click="reauthenticate">
          <v-icon small class="mr-2">mdi-facebook</v-icon>
          ပြန်လည်ချိတ်ဆက်ရန်
        </v-btn>
      </v-row>

      <!-- list facebook pages -->
      <v-select
        v-if="pages.length"
        label="Page"
        v-model="page"
        :items="pages.map((page) => page.name)"
      ></v-select>
    </div>

    <!-- link with facebook -->
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
  </v-container>
</template>

<script>
import axios from "axios";
import firebase from "firebase/app";
import server from "@/app/server";
import config from "../../../config";

const parseAttachments = (attachments, subattachments) => {
  let images = [];
  if (attachments) {
    images.push(attachments.media.image.src);
  }
  if (subattachments) {
    subattachments.map(({ media }) => {
      images.push(media.image.src);
    });
  }
  return images;
};

const parseMessage = (message) => {
  let title, price, ageRange;
  message = message
    .split("\n")
    .filter((m) => !!m)
    .slice(0, 3);

  message = message.map((msg) =>
    msg
      .split("")
      .filter((m) => m.charCodeAt() < 6000)
      .join("")
  );

  return message;
};

const testFacebookApi = (token) => {
  let url = new URL(server.facebook);
  url.pathname = "me";
  url.searchParams.append("access_token", token);
  return axios.get(url).then(({ data }) => data);
};

const renderPost = (vm, { id, message, attachments }) => {
  if (!message) return;
  message = parseMessage(message);
  attachments = attachments && attachments.data && attachments.data[0];
  let subattachments =
    attachments &&
    attachments.subattachments &&
    attachments.subattachments.data;
  let images = parseAttachments(attachments, subattachments);
  return { id, message, images };
};

export default {
  name: "product-facebook",

  data: () => ({
    providers: [],
    access_token: null,
    pages: [],
    page: null,
  }),

  methods: {
    choosePage({ access_token, id, name }) {
      //
    },

    reauthenticate() {
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
        })
        .then(() => window.location.reload())
        .catch((err) => console.error(err));
    },

    linkWithFacebook() {
      let user = firebase.auth().currentUser;
      let providers = user.providerData.map((provider) => provider.providerId);
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("public_profile,email,pages_read_engagement");

      if (providers.includes("facebook.com")) {
        this.reauthenticate();
      } else {
        user
          .linkWithPopup(provider)
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
          })
          .then(() => window.location.reload())
          .catch((err) => console.error(err));
      }
    },
  },

  beforeMount() {
    let user = firebase.auth().currentUser;
    this.providers = user
      .toJSON()
      .providerData.map((provider) => provider.providerId);
    if (
      this.providers.includes("facebook.com") &&
      this.$root.user.access_token
    ) {
      this.access_token = this.$root.user.access_token;
      testFacebookApi(this.$root.user.access_token)
        .then(({ id }) => id)
        .then((id) => {
          let url = new URL(server.facebook);
          url.pathname = `${id}/accounts`;
          url.searchParams.append("fields", "name,access_token");
          url.searchParams.append("access_token", this.access_token);
          axios
            .get(url)
            .then(({ data }) => {
              this.pages = data.data;
            })
            .catch((err) => {
              this.access_token = null;
            });
        });
      return;
    }
    axios
      .get(server.session, {
        headers: { "X-Access-Token": this.$root.user.token },
      })
      .then(({ data }) => {
        if (!data.access_token) {
          return;
        }
        this.access_token = data.access_token;
        testFacebookApi(data.access_token)
          .then(({ id }) => id)
          .then((id) => {
            let url = new URL(server.facebook);
            url.pathname = `${id}/accounts`;
            url.searchParams.append("fields", "name,access_token");
            url.searchParams.append("access_token", data.access_token);
            axios
              .get(url)
              .then(({ data }) => {
                this.pages = data.data;
              })
              .catch((err) => {
                this.access_token = null;
              });
          });
      });
  },
  watch: {
    page(value) {
      if (!value) return;
      let page = this.pages.find((page) => page.name === value);
      if (!page || !page.id) return;
      let url = new URL(server.facebook);
      url.pathname = `${page.id}/feed`;
      url.searchParams.append(
        "fields",
        "message,created_at,updated_at,attachments,sub_attachments"
      );
      url.searchParams.append("access_token", page.access_token);
      axios.get(url).then(({ data }) => {
        let payload = {};
        let posts = data.data;
        posts
          .map((post) => renderPost(this, post))
          .filter((p) => !!p && p.images && p.images.length)
          .map(({ message, images, id }) => {
            payload[id] = { message, images };
          });
        axios({
          method: "POST",
          url: server.review,
          data: payload,
          headers: {
            "X-Access-Token": this.$root.user.token,
          },
        }).then(() => {
          this.$router.push({ path: "/reviews" });
        });
      });
    },
  },
};
</script>
