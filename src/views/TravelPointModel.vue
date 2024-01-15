<!-- 旅游胜地 Travel Point -->
<template>
  <div class="experiences">
    <h5>{{ travelPointIns.name }} Page</h5>
    <div class="experience-details">
      <img :src="`/images/${travelPointIns.image}`" alt="exp.slug" />
      <p>{{ travelPointIns.description }}</p>
    </div>
  </div>
</template>
<script>
// the data below is the snapshot of sourceData
// "destinations": [
//     {
//       "name": "Brazil",
//       "slug": "brazil",
//       "image": "brazil.jpg",
//       "id": 1,
//       "description": "all about Brazil, ",
//       "experiences": [
//         {
//           "name": "Iguaçu Falls",
//           "slug": "iguacu-falls",
//           "image": "iguacu-falls.jpg",
//           "description":"Suspendisse"
//         },
import sourceData from "@/data.json";

export default {
  props: {
    country: { type: String, required: true },
    travelPoint: { type: String, required: true },
  },
  computed: {
    countryIns() {
      return sourceData.destinations.find(
        (item) => this.country === item.slug.toLowerCase()
      );
    },
    travelPointIns() {
      return this.countryIns.experiences.find(
        (item) => this.travelPoint === item.slug.toLowerCase()
      );
    },
  },
  mounted() {
    const logData = {
      country: this.country,
      travelPoint: this.travelPoint,
      routeParams: this.$route.params,
    };

    console.log(`[TravelPoint] mounted: ${JSON.stringify(logData)}`);
  },
};
</script>
