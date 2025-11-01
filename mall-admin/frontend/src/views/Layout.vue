<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="layout-aside">
      <div class="logo">
        <h1 v-if="!isCollapse">商城管理</h1>
        <h1 v-else>商</h1>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
          <i class="el-icon-s-home"></i>
          <span slot="title">仪表盘</span>
        </el-menu-item>
        
        <el-submenu index="goods">
          <template slot="title">
            <i class="el-icon-goods"></i>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/goods/list">商品列表</el-menu-item>
        </el-submenu>
        
        <el-menu-item index="/category/list">
          <i class="el-icon-menu"></i>
          <span slot="title">分类管理</span>
        </el-menu-item>
        
        <el-menu-item index="/banner/list">
          <i class="el-icon-picture"></i>
          <span slot="title">轮播图管理</span>
        </el-menu-item>
        
        <el-submenu index="order">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/order/list">订单列表</el-menu-item>
        </el-submenu>
        
        <el-menu-item index="/user/list">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="layout-header">
        <div class="header-left">
          <i
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            class="collapse-icon"
            @click="toggleCollapse"
          ></i>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar
                :size="36"
                :src="user.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
              ></el-avatar>
              <span class="username">{{ user.nickname || user.username }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 内容区 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
    
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="passwordVisible" width="400px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="passwordVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangePassword">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { changePassword } from '../api/auth';
import { getUser } from '../utils/auth';

export default {
  name: 'Layout',
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      isCollapse: false,
      user: getUser() || {},
      passwordVisible: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const { path } = route;
      return path;
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$message.info('个人中心功能待开发');
          break;
        case 'password':
          this.passwordVisible = true;
          break;
        case 'logout':
          this.handleLogout();
          break;
      }
    },
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('user/logout');
        this.$message.success('退出成功');
        this.$router.push('/login');
      }).catch(() => {});
    },
    handleChangePassword() {
      this.$refs.passwordForm.validate(async valid => {
        if (!valid) return;
        
        try {
          await changePassword(this.passwordForm);
          this.$message.success('密码修改成功，请重新登录');
          this.passwordVisible = false;
          await this.$store.dispatch('user/logout');
          this.$router.push('/login');
        } catch (error) {
          console.error('修改密码失败:', error);
        }
      });
    }
  }
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #304156;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #2b3a4b;
  color: #fff;
}

.logo h1 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.el-menu {
  border-right: none;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 24px;
  cursor: pointer;
  color: #5a5e66;
}

.collapse-icon:hover {
  color: #409EFF;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 10px;
}

.layout-main {
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>
