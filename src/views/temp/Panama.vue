<template>
  <div class="panama">
    <h5>{{ destination.name }}</h5>
    <img :src="`images/${destination.image}`" alt="destination.name" />
    <p>{{ destination.description }}</p>
  </div>
</template>
<script>
import sourceData from "@/data.json";
export default {
  computed: {
    destination() {
      return this.sourceData.find((item) => item.name === "Panama");
    },
  },
};
</script>
