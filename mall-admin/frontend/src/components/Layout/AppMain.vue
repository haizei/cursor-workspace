<template>
  <div class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  // 页面切换动画
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.3s;
  }
  
  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }
  
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
