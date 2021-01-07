<template>
  <v-container fluid>
    <h2>သုံးစွဲသူများ</h2>
    <v-divider class="my-4"></v-divider>
    <v-alert
      v-if="error"
      text
      prominent
      type="error"
      icon="mdi-bell-ring-outline"
    >
      {{ error }}
    </v-alert>
    <!-- list of all users -->
    <v-card :loading="loading">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>အမည်</th>
              <th>ထုတ်လုပ်သူ</th>
              <th>ရာထူး</th>
              <th>စတင်ပြုလုပ်ချိန်</th>
              <th><span class="sr-only">actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.uid">
              <td>
                <b v-html="user.displayName"></b>
                <a v-if="user.email" :href="'mailto:' + user.email">
                  {{ user.email }}
                </a>
                <a v-if="user.phoneNumber" :href="'tel:' + user.phoneNumber">
                  {{ num(user.phoneNumber) }}
                </a>
              </td>
              <td>
                <v-icon
                  v-for="(provider, index) in user.providers"
                  :key="index"
                  small
                  >{{ providers[provider].icon }}</v-icon
                >
              </td>
              <td>
                <v-chip
                  class="chip"
                  v-if="user.role"
                  small
                  :color="user.role == 'admin' ? 'primary' : ''"
                  v-html="user.role || 'user'"
                />
              </td>
              <td>
                {{ datetime(new Date(user.createdAt)) }}
              </td>
              <td>
                <v-btn
                  v-if="user.role && user.role != 'admin'"
                  small
                  icon
                  color="primary"
                  @click="setAdmin(user.uid)"
                  :disabled="loading"
                >
                  <v-icon>mdi-chess-king</v-icon>
                </v-btn>
                <v-btn
                  v-if="user.role != 'moderator'"
                  small
                  icon
                  color="primary"
                  @click="setModerator(user.uid)"
                  :disabled="loadingRole"
                >
                  <v-icon>mdi-chess-queen</v-icon>
                </v-btn>
                <v-btn
                  small
                  icon
                  color="error"
                  @click="deleteUser(user.uid)"
                  :disabled="loadingDelete"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import server from "../app/server";
import { translateNumber, translateDateTime } from "../app/burmese";

const providerIcons = {
  password: {
    icon: "mdi-key",
  },
  phone: {
    icon: "mdi-cellphone",
  },
  email: {
    icon: "mdi-email",
  },
  "google.com": {
    icon: "mdi-google",
  },
  "facebook.com": {
    icon: "mdi-facebook",
  },
};

export default {
  name: "Users",

  data: () => ({
    loading: true,
    loadingDelete: false,
    loadingRole: false,
    error: null,
    users: [],
    request_access: [],
    providers: providerIcons,
  }),

  methods: {
    num(datetime) {
      return translateNumber(datetime);
    },

    datetime(datetime) {
      return translateDateTime(datetime, "A h:s၊ d-m-Y (D) ");
    },

    setRole(uid, role) {
      this.error = null;
      this.loading = this.loadingRole = true;
      server
        .setRole({ uid, role })
        .then(
          ({ uid, role }) =>
            (this.users.find((user) => user.uid == uid).role = role)
        )
        .catch((e) => (this.error = e.message))
        .then(() => (this.loading = this.loadingRole = false));
    },

    setAdmin(uid) {
      this.setRole(uid, "admin");
    },

    setModerator(uid) {
      this.setRole(uid, "moderator");
    },

    setUser(uid) {
      this.setRole(uid, null);
    },

    deleteUser(uid) {
      this.loadingDelete = this.loading = true;
      let user = this.users.find((u) => u.uid == uid);
      if (user.role) return this.setUser(uid);
      axios
        .delete(`${server.users}/${uid}`, {
          headers: {
            "X-Access-Token": this.$root.user.stsTokenManager.accessToken,
          },
        })
        .then(() => {
          this.users = this.users.filter((user) => user.uid != uid);
          this.loadingDelete = this.loading = false;
        })
        .catch((e) => {
          console.error(e);
          this.error = "Unable to delete an user! Please try again...";
          this.loadingDelete = this.loading = false;
        });
    },
  },

  created() {
    axios
      .get(server.listUsers, {
        headers: {
          "X-Access-Token": this.$root.user.stsTokenManager.accessToken,
        },
      })
      .then(({ data }) => {
        this.users = data;
        this.loading = false;
      })
      .catch((e) => {
        this.error = "Something went wrong! Please reload this page...";
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.chip {
  text-transform: capitalize;
}

.sr-only {
  visibility: hidden;
}
</style>
