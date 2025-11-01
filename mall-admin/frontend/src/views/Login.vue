<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h2>商城管理后台</h2>
      </div>
      
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-tip">
        <p>默认账号：admin</p>
        <p>默认密码：admin</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return;
        
        this.loading = true;
        
        try {
          await this.$store.dispatch('user/login', this.loginForm);
          this.$message.success('登录成功');
          this.$router.push('/');
        } catch (error) {
          console.error('登录失败:', error);
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.login-tip {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-top: 20px;
}

.login-tip p {
  margin: 5px 0;
}
</style>
