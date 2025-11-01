<template>
  <div class="sidebar-container">
    <div class="logo">
      <h2 style="color: #fff; text-align: center; padding: 20px 0; margin: 0;">商城管理后台</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      :collapse="false"
      router
      :unique-opened="true"
    >
      <el-menu-item index="/dashboard">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据统计</span>
      </el-menu-item>
      
      <el-sub-menu index="/goods">
        <template #title>
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </template>
        <el-menu-item index="/goods/list">
          <el-icon><List /></el-icon>
          <span>商品列表</span>
        </el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="/category">
        <template #title>
          <el-icon><Menu /></el-icon>
          <span>分类管理</span>
        </template>
        <el-menu-item index="/category/list">
          <el-icon><List /></el-icon>
          <span>分类列表</span>
        </el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="/banner">
        <template #title>
          <el-icon><Picture /></el-icon>
          <span>轮播图管理</span>
        </template>
        <el-menu-item index="/banner/list">
          <el-icon><List /></el-icon>
          <span>轮播图列表</span>
        </el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="/order">
        <template #title>
          <el-icon><Tickets /></el-icon>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/order/list">
          <el-icon><List /></el-icon>
          <span>订单列表</span>
        </el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="/user">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/user/list">
          <el-icon><List /></el-icon>
          <span>用户列表</span>
        </el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  DataAnalysis,
  Goods,
  Menu,
  Picture,
  Tickets,
  User,
  Setting,
  List
} from '@element-plus/icons-vue'

export default {
  name: 'Sidebar',
  components: {
    DataAnalysis,
    Goods,
    Menu,
    Picture,
    Tickets,
    User,
    Setting,
    List
  },
  setup() {
    const route = useRoute()
    
    const activeMenu = computed(() => {
      return route.path
    })

    return {
      activeMenu
    }
  }
}
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  background-color: #304156;
}

.logo {
  border-bottom: 1px solid #434a55;
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 80px);
  overflow-y: auto;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 240px;
}

.sidebar-menu .el-icon {
  margin-right: 8px;
}
</style>
