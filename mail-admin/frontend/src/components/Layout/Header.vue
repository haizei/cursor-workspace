<template>
  <div class="header-container">
    <div class="header-left">
      <h3>商城管理后台</h3>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" :src="adminAvatar" />
          <span class="username">{{ adminNickname || '管理员' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { authApi } from '../../api/auth'

export default {
  name: 'Header',
  components: {
    ArrowDown
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const adminNickname = computed(() => {
      return store.state.user.admin?.nickname || '管理员'
    })

    const adminAvatar = computed(() => {
      return store.state.user.admin?.avatar || ''
    })

    const handleCommand = (command) => {
      if (command === 'logout') {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('logout')
          router.push('/login')
        })
      } else if (command === 'changePassword') {
        // 修改密码逻辑
        ElMessageBox.prompt('请输入新密码', '修改密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'password'
        }).then(({ value }) => {
          if (value && value.length >= 6) {
            authApi.changePassword({
              oldPassword: 'admin',
              newPassword: value
            }).then(() => {
              ElMessageBox.alert('密码修改成功', '提示', {
                type: 'success'
              })
            })
          } else {
            ElMessageBox.alert('密码长度至少6位', '提示', {
              type: 'warning'
            })
          }
        })
      }
    }

    return {
      adminNickname,
      adminAvatar,
      handleCommand
    }
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.header-left h3 {
  margin: 0;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}

.user-info .username {
  margin: 0 8px;
  color: #303133;
}

.user-info .el-icon {
  margin-left: 4px;
  color: #909399;
}
</style>
