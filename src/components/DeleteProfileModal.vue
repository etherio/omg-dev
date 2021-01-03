<template>
  <v-container>
    <v-btn color="error" class="pl-8 pr-10" @click="dialog = !dialog">
      <v-icon class="pr-2">mdi-delete</v-icon> အကောင့်ဖျက်သိမ်းရန်
    </v-btn>

    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          အကောင့်ဖျက်သိမ်းခြင်း
        </v-card-title>
        <v-card-text>
          သင်၏အကောင့်ဆိုင်ရာခွင့်ပြုချက်များကို
          <b>အပြီးတိုင်ပယ်ဖျက်သွားမည်</b>ဖြစ်သည်။ ဤလုပ်ဆောင်ချက်ကို
          လုပ်ဆောင်ပြီးနောက် ဘွာတေးလုပ်လို့မရပါ။
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="dialog = false">
            ပယ်ဖျက်ရန်
          </v-btn>
          <v-btn color="red" text @click="deleteAccount">
            ဖျက်သိမ်းရန်
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase/app";

export default {
  name: "DeleteProfileModal",
  data: () => ({
    dialog: false,
  }),
  methods: {
    async deleteAccount() {
      this.dialog = false;
      try {
        await firebase.auth().currentUser.delete();
        this.$root.role = null;
        this.$root.user = null;
      } catch (e) {
        document.documentElement.scrollTo(0, 0);
        switch (e.code) {
          case "auth/requires-recent-login":
            this.$parent.error =
              "<b>Unable to delete your account!</b><br>Try to re-login your account to delete your account.";
            break;
          default:
            this.$parent.error = e.message;
        }
      }
    },
  },
};
</script>

<style>
html,
body {
  scroll-behavior: smooth;
}
</style>
