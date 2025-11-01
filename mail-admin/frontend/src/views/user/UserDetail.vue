<template>
  <div class="user-detail-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户详情</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions title="用户信息" :column="2" border v-if="userData">
        <el-descriptions-item label="用户ID">{{ userData.id }}</el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ userData.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="头像">
          <el-avatar :src="userData.avatar" />
        </el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userData.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ userData.gender === 1 ? '男' : userData.gender === 2 ? '女' : '未知' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="userData.status === 1 ? 'success' : 'danger'">
            {{ userData.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ userData.create_time }}</el-descriptions-item>
        <el-descriptions-item label="订单数量">{{ userData.order_count || 0 }}</el-descriptions-item>
        <el-descriptions-item label="收货地址数量">{{ userData.address_count || 0 }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userApi } from '../../api/user'

export default {
  name: 'UserDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const userData = ref(null)

    const loadData = () => {
      loading.value = true
      userApi.getDetail(route.params.id).then(res => {
        userData.value = res.data
      }).finally(() => {
        loading.value = false
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      userData
    }
  }
}
</script>

<style scoped>
.user-detail-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
