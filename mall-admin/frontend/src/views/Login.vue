<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>商城管理后台</h1>
        <p>Mall Admin System</p>
      </div>
      
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            autocomplete="on"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        
        <el-button
          type="primary"
          :loading="loading"
          class="login-button"
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form>
      
      <div class="login-tip">
        <p>默认账号：admin</p>
        <p>默认密码：admin</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      },
      
      loading: false
    };
  },
  
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$message.success('登录成功');
              
              // 跳转到重定向页面或首页
              const redirect = this.$route.query.redirect || '/';
              this.$router.push(redirect);
            })
            .catch(() => {
              this.loading = false;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .login-box {
    width: 400px;
    padding: 40px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
      
      h1 {
        font-size: 28px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 8px;
      }
      
      p {
        font-size: 14px;
        color: #909399;
      }
    }
    
    .login-form {
      .el-form-item {
        margin-bottom: 22px;
      }
      
      .login-button {
        width: 100%;
        height: 44px;
        font-size: 16px;
        margin-top: 10px;
      }
    }
    
    .login-tip {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #EBEEF5;
      text-align: center;
      
      p {
        font-size: 13px;
        color: #909399;
        line-height: 22px;
      }
    }
  }
}
</style>
