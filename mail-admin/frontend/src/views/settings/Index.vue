<template>
  <div class="settings-container">
    <el-card>
      <template #header>
        <span>系统设置</span>
      </template>

      <el-card>
        <template #header>
          <span>修改密码</span>
        </template>
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="120px"
          style="max-width: 500px"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入旧密码"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码（至少6位）"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleChangePassword" :loading="loading">
              修改密码
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '../api/auth'

export default {
  name: 'Settings',
  setup() {
    const passwordFormRef = ref(null)
    const loading = ref(false)

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
      ]
    }

    const handleChangePassword = () => {
      passwordFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          authApi.changePassword({
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword
          }).then(() => {
            ElMessage.success('密码修改成功')
            passwordFormRef.value.resetFields()
          }).finally(() => {
            loading.value = false
          })
        }
      })
    }

    return {
      passwordFormRef,
      passwordForm,
      passwordRules,
      loading,
      handleChangePassword
    }
  }
}
</script>

<style scoped>
.settings-container {
  padding: 0;
}
</style>
