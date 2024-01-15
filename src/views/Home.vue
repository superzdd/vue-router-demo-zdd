<!-- 首页 -->
<template>
  <div class="home container">
    <h1>Click the banner links to try vue-router</h1>
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
