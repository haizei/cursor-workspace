<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in stats" :key="stat.key">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="30"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>今日数据</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="新增订单">{{ todayData.orders }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">¥{{ todayData.orderAmount }}</el-descriptions-item>
            <el-descriptions-item label="新增用户">{{ todayData.users }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>本月数据</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="新增订单">{{ monthData.orders }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">¥{{ monthData.orderAmount }}</el-descriptions-item>
            <el-descriptions-item label="新增用户">{{ monthData.users }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ShoppingCart,
  User,
  Goods,
  Money
} from '@element-plus/icons-vue'
import { statApi } from '../api/stat'

export default {
  name: 'Dashboard',
  components: {
    ShoppingCart,
    User,
    Goods,
    Money
  },
  setup() {
    const stats = ref([
      { key: 'orders', label: '订单总数', value: 0, icon: 'ShoppingCart', color: '#409eff' },
      { key: 'amount', label: '订单总金额', value: '¥0', icon: 'Money', color: '#67c23a' },
      { key: 'users', label: '用户总数', value: 0, icon: 'User', color: '#e6a23c' },
      { key: 'goods', label: '商品总数', value: 0, icon: 'Goods', color: '#f56c6c' }
    ])

    const todayData = ref({
      orders: 0,
      orderAmount: '0.00',
      users: 0
    })

    const monthData = ref({
      orders: 0,
      orderAmount: '0.00',
      users: 0
    })

    const loadData = () => {
      statApi.getDashboard().then(res => {
        const data = res.data
        stats.value[0].value = data.order_total || 0
        stats.value[1].value = `¥${(data.order_amount || 0).toFixed(2)}`
        stats.value[2].value = data.user_total || 0
        stats.value[3].value = data.goods_total || 0

        todayData.value = {
          orders: data.today_orders || 0,
          orderAmount: (data.today_order_amount || 0).toFixed(2),
          users: data.today_users || 0
        }

        monthData.value = {
          orders: data.month_orders || 0,
          orderAmount: (data.month_order_amount || 0).toFixed(2),
          users: data.month_users || 0
        }
      }).catch(() => {
        ElMessage.error('加载数据失败')
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      stats,
      todayData,
      monthData
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}
</style>
