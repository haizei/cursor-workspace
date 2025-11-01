<template>
  <div class="layout-container">
    <Sidebar :collapse="sidebarCollapsed" />
    <div class="main-container" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <Header 
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />
      <AppMain />
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import AppMain from './AppMain.vue';

export default {
  name: 'Layout',
  
  components: {
    Sidebar,
    Header,
    AppMain
  },
  
  data() {
    return {
      sidebarCollapsed: false
    };
  },
  
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-container {
  display: flex;
  height: 100%;
  background: #f0f2f5;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  transition: margin-left 0.3s;
  
  &.sidebar-collapsed {
    margin-left: 64px;
  }
}
</style>
