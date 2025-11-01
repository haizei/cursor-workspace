<template>
  <div class="page-container">
    <div class="page-header">
      <h2>修改密码</h2>
    </div>
    
    <div class="page-content">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 600px;"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入旧密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            修改密码
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { changePassword } from '@/api/auth';

export default {
  name: 'ChangePassword',
  
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      
      submitting: false
    };
  },
  
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.submitting = true;
          
          try {
            await changePassword({
              oldPassword: this.form.oldPassword,
              newPassword: this.form.newPassword
            });
            
            this.$message.success('密码修改成功，请重新登录');
            
            // 清除登录状态并跳转到登录页
            setTimeout(() => {
              this.$store.dispatch('user/resetToken').then(() => {
                this.$router.push('/login');
              });
            }, 1500);
          } catch (error) {
            console.error('修改密码失败:', error);
          } finally {
            this.submitting = false;
          }
        }
      });
    },
    
    handleReset() {
      this.$refs.form.resetFields();
    }
  }
};
</script>
