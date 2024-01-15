<!-- 国家（旅游目的地） 页面 -->
<template>
  <div class="container">
    <button @click="goBack">go back</button>
    <h5>{{ destination.name }} Page</h5>
    <img :src="`/images/${destination.image}`" alt="destination.name" />
    <p>{{ destination.description }}</p>
    <div class="experiences">
      <div class="cards">
        <router-link
          v-for="exp in destination.experiences"
          :key="exp.slug"
          :to="{
            name: 'experience.show',
            params: { country: country.slug, travelPoint: exp.slug },
          }"
          ><CountryDetail :exp="exp"></CountryDetail>
        </router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import sourceData from "@/data.json";
import CountryDetail from "@/components/CountryDetail.vue";

export default {
  components: { CountryDetail },
  props: {
    country: { type: String, required: true },
  },
  mounted() {
    const logData = {
      country: this.country,
      routeParams: this.$route.params,
    };

    console.log(`[Country] mounted: ${JSON.stringify(logData)}`);
  },
  computed: {
    destination() {
      return sourceData.destinations.find(
        (item) => this.country === item.slug.toLowerCase()
      );
    },
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>
