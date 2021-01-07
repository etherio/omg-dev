<script>
import firebase from "firebase/app";

export default {
  beforeMount() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.$root.user = null;
        this.$root.loaded = false;
        this.$router.push("/login");
      });
  },
};
</script>
