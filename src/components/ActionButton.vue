<template>
  <v-menu bottom left>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item v-for="(action, i) in actions" :key="i">
        <v-list-item-title
          class="action-link"
          @click="action.callback && action.callback(i)"
        >
          {{ action.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: ["actions"],
};
</script>

<style scoped>
.action-link {
  cursor: pointer;
}
</style>
