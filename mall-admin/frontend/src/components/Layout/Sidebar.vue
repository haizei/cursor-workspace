<template>
  <div class="sidebar-container" :class="{ 'collapsed': collapse }">
    <div class="logo">
      <img v-if="!collapse" src="@/assets/logo.png" alt="Logo" class="logo-img" />
      <h1 v-if="!collapse" class="logo-title">商城管理</h1>
      <i v-else class="el-icon-s-shop logo-icon"></i>
    </div>
    
    <el-menu
      :default-active="activeMenu"
      :collapse="collapse"
      :unique-opened="true"
      :collapse-transition="false"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
    >
      <template v-for="route in menuRoutes">
        <!-- 单级菜单 -->
        <el-menu-item
          v-if="!route.children || route.children.length === 0"
          :key="route.path"
          :index="route.path"
        >
          <i :class="route.meta.icon"></i>
          <span slot="title">{{ route.meta.title }}</span>
        </el-menu-item>
        
        <!-- 多级菜单 -->
        <el-submenu
          v-else
          :key="route.path"
          :index="route.path"
        >
          <template slot="title">
            <i :class="route.meta.icon"></i>
            <span>{{ route.meta.title }}</span>
          </template>
          
          <el-menu-item
            v-for="child in route.children.filter(c => !c.meta.hidden)"
            :key="child.path"
            :index="route.path + '/' + child.path"
          >
            <i v-if="child.meta.icon" :class="child.meta.icon"></i>
            <span slot="title">{{ child.meta.title }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      
      return path;
    },
    
    menuRoutes() {
      // 从路由配置中获取菜单
      const routes = this.$router.options.routes;
      const layoutRoute = routes.find(r => r.path === '/');
      
      if (layoutRoute && layoutRoute.children) {
        // 过滤掉不显示在菜单中的路由
        return layoutRoute.children.filter(route => {
          return route.meta && route.meta.title && !route.meta.hidden;
        });
      }
      
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: #304156;
  transition: width 0.3s;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;
  
  &.collapsed {
    width: 64px;
  }
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2b3a4b;
    
    .logo-img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
    
    .logo-title {
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
    }
    
    .logo-icon {
      font-size: 32px;
      color: #409EFF;
    }
  }
  
  .el-menu {
    border-right: none;
  }
  
  // 滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
}
</style>
