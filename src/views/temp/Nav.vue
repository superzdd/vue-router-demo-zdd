<template>
  <router-link
    v-for="destination in sourceData"
    :key="destination.id"
    :to="destination.id"
  ></router-link>
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
