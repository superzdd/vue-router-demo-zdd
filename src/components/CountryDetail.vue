<!-- 国家（旅游目的地） 详情-->
<!-- 国家页面里，每个国家都包含几个旅游胜地 -->
<!-- 这个组件是单个旅游圣地的视图 -->
<template>
  <div class="card">
    <img :src="`/images/${exp.image}`" alt="exp.name" />
    <span class="card_text">{{ exp.name }}</span>
  </div>
</template>
<script>
export default {
  props: {
    exp: { type: Object, required: true },
  },
};
</script>
