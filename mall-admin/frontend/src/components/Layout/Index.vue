<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="layout-sidebar" :class="{ 'is-collapse': isCollapse }">
      <div class="logo">
        <i class="el-icon-s-shop"></i>
        <span v-show="!isCollapse">商城管理后台</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :router="true"
      >
        <!-- 数据统计 -->
        <el-menu-item index="/dashboard">
          <i class="el-icon-s-data"></i>
          <span slot="title">数据统计</span>
        </el-menu-item>
        
        <!-- 商品管理 -->
        <el-submenu index="goods">
          <template slot="title">
            <i class="el-icon-goods"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/goods/list">商品列表</el-menu-item>
          <el-menu-item index="/goods/add">新增商品</el-menu-item>
        </el-submenu>
        
        <!-- 分类管理 -->
        <el-submenu index="category">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>分类管理</span>
          </template>
          <el-menu-item index="/category/list">分类列表</el-menu-item>
        </el-submenu>
        
        <!-- 轮播图管理 -->
        <el-submenu index="banner">
          <template slot="title">
            <i class="el-icon-picture"></i>
            <span>轮播图管理</span>
          </template>
          <el-menu-item index="/banner/list">轮播图列表</el-menu-item>
        </el-submenu>
        
        <!-- 订单管理 -->
        <el-submenu index="order">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/order/list">订单列表</el-menu-item>
        </el-submenu>
        
        <!-- 用户管理 -->
        <el-submenu index="user">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/user/list">用户列表</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    
    <!-- 主内容区 -->
    <div class="layout-main" :class="{ 'is-collapse': isCollapse }">
      <!-- 顶部导航 -->
      <div class="layout-header">
        <div class="header-left">
          <i 
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" 
            class="toggle-icon"
            @click="toggleSidebar"
          ></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item 
              v-for="(item, index) in breadcrumbs" 
              :key="index"
              :to="item.path"
            >
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <i class="el-icon-user-solid"></i>
              {{ userInfo.nickname || '管理员' }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 内容区 -->
      <div class="layout-content">
        <router-view />
      </div>
    </div>
    
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="passwordDialogVisible" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码（至少6位）"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { changePassword } from '@/api/auth';

export default {
  name: 'Layout',
  data() {
    return {
      isCollapse: false,
      passwordDialogVisible: false,
      passwordLoading: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { 
            validator: (rule, value, callback) => {
              if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            }, 
            trigger: 'blur' 
          }
        ]
      }
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    activeMenu() {
      return this.$route.path;
    },
    breadcrumbs() {
      return this.$route.matched.filter(item => item.meta && item.meta.title);
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse;
    },
    handleCommand(command) {
      if (command === 'password') {
        this.passwordDialogVisible = true;
      } else if (command === 'logout') {
        this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('user/logout').then(() => {
            this.$router.push('/login');
          });
        });
      }
    },
    async handleChangePassword() {
      this.$refs.passwordForm.validate(async (valid) => {
        if (!valid) return;
        
        try {
          this.passwordLoading = true;
          await changePassword({
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          });
          
          this.$message.success('密码修改成功，请重新登录');
          this.passwordDialogVisible = false;
          
          // 退出登录
          setTimeout(() => {
            this.$store.dispatch('user/logout').then(() => {
              this.$router.push('/login');
            });
          }, 1000);
          
        } catch (error) {
          console.error('修改密码失败:', error);
        } finally {
          this.passwordLoading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.layout-sidebar {
  width: 200px;
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}

.layout-sidebar.is-collapse {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #2b3a4a;
}

.logo i {
  font-size: 24px;
  margin-right: 10px;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

/* 主内容区 */
.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  transition: margin-left 0.3s;
  width: calc(100% - 200px);
}

.layout-main.is-collapse {
  margin-left: 64px;
  width: calc(100% - 64px);
}

/* 顶部导航 */
.layout-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-icon {
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
  color: #5a5e66;
}

.toggle-icon:hover {
  color: #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  color: #5a5e66;
  font-size: 14px;
}

.user-info:hover {
  color: #409EFF;
}

/* 内容区 */
.layout-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar,
.layout-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-menu::-webkit-scrollbar-thumb,
.layout-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
