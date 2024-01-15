<template>
  <NavigatorView />
  <div>
    <!-- router-view的各种实现 -->

    <!-- router-view一行满足版 -->
    <!-- 下面这一行，就是router-view的全部了，非常简单 -->
    <router-view></router-view>

    <!-- router-view官方动画版 -->
    <!-- 下面这个写法是为了加入router配套的动画 -->
    <!-- <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path"></component>
      </transition>
    </router-view> -->
  </div>
</template>
<script>
import NavigatorView from "@/components/NavigatorView.vue";
export default {
  components: { NavigatorView },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
