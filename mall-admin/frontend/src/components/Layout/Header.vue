<template>
  <div class="header-container">
    <div class="header-left">
      <el-button
        type="text"
        icon="el-icon-s-fold"
        class="toggle-button"
        @click="handleToggleSidebar"
      />
      
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="index"
          :to="item.path"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" icon="el-icon-user-solid"></el-avatar>
          <span class="username">{{ userInfo ? userInfo.nickname || userInfo.username : '管理员' }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="password">
            <i class="el-icon-lock"></i> 修改密码
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <i class="el-icon-switch-button"></i> 退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  
  props: {
    sidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    ...mapGetters(['userInfo']),
    
    breadcrumbs() {
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      const breadcrumbs = [];
      
      matched.forEach(route => {
        if (route.meta && route.meta.title) {
          breadcrumbs.push({
            path: route.path,
            title: route.meta.title
          });
        }
      });
      
      return breadcrumbs;
    }
  },
  
  methods: {
    handleToggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('user/logout').then(() => {
            this.$router.push('/login');
            this.$message.success('退出登录成功');
          });
        }).catch(() => {});
      } else if (command === 'password') {
        this.$router.push('/settings/password');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .toggle-button {
      font-size: 20px;
      padding: 10px;
      margin-right: 20px;
      color: #606266;
      
      &:hover {
        color: #409EFF;
      }
    }
    
    .breadcrumb {
      line-height: 60px;
    }
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      .username {
        margin: 0 8px 0 12px;
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
