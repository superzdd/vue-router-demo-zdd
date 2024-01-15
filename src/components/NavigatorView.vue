<template>
  <div id="nav" class="banner">
    <router-link class="logo" to="/">Home</router-link>
    <router-link
      v-for="item in destinations"
      :key="item.name"
      :to="`/destination/${item.slug}`"
      >{{ item.name }}</router-link
    >
    <router-link to="/about">About</router-link>
  </div>
</template>
<script>
import sourceData from "@/data.json";
export default {
  data() {
    return {
      destinations: sourceData.destinations,
    };
  },
};
</script>

<style lang="css">
#nav a.nav-active {
  color: red;
  text-decoration: underline;
}
</style>
