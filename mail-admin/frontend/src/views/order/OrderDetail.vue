<template>
  <div class="order-detail-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单详情</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions title="订单信息" :column="2" border v-if="orderData">
        <el-descriptions-item label="订单号">{{ orderData.order_no }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(orderData.status)">
            {{ getStatusText(orderData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ orderData.total_amount }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ orderData.create_time }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ orderData.pay_time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发货时间">{{ orderData.deliver_time || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="收货信息" :column="2" border style="margin-top: 20px" v-if="orderData">
        <el-descriptions-item label="收货人">{{ orderData.receiver_name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderData.receiver_phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ orderData.receiver_address }}</el-descriptions-item>
        <el-descriptions-item label="订单备注" :span="2">{{ orderData.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-card style="margin-top: 20px">
        <template #header>
          <span>商品明细</span>
        </template>
        <el-table :data="orderData?.items || []">
          <el-table-column prop="goods_name" label="商品名称" />
          <el-table-column label="商品图片" width="100">
            <template #default="{ row }">
              <el-image
                v-if="row.goods_image"
                :src="row.goods_image"
                style="width: 60px; height: 60px"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="goods_price" label="单价" width="120">
            <template #default="{ row }">¥{{ row.goods_price }}</template>
          </el-table-column>
          <el-table-column prop="count" label="数量" width="100" />
          <el-table-column prop="total_price" label="小计" width="120">
            <template #default="{ row }">¥{{ row.total_price }}</template>
          </el-table-column>
        </el-table>
      </el-card>

      <div style="margin-top: 20px" v-if="orderData && orderData.status === 1">
        <el-button type="success" @click="handleDeliver">发货</el-button>
        <el-button type="danger" @click="handleClose">关闭订单</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderApi } from '../../api/order'

export default {
  name: 'OrderDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const orderData = ref(null)

    const getStatusText = (status) => {
      const statusMap = {
        0: '待支付',
        1: '待发货',
        2: '已发货',
        3: '已完成',
        4: '已关闭'
      }
      return statusMap[status] || '未知'
    }

    const getStatusType = (status) => {
      const typeMap = {
        0: 'warning',
        1: 'info',
        2: 'primary',
        3: 'success',
        4: 'danger'
      }
      return typeMap[status] || 'info'
    }

    const loadData = () => {
      loading.value = true
      orderApi.getDetail(route.params.id).then(res => {
        orderData.value = res.data
      }).finally(() => {
        loading.value = false
      })
    }

    const handleDeliver = () => {
      ElMessageBox.confirm('确定要发货吗？', '提示', {
        type: 'warning'
      }).then(() => {
        orderApi.deliver(route.params.id).then(() => {
          ElMessage.success('发货成功')
          loadData()
        })
      })
    }

    const handleClose = () => {
      ElMessageBox.confirm('确定要关闭该订单吗？', '提示', {
        type: 'warning'
      }).then(() => {
        orderApi.close(route.params.id).then(() => {
          ElMessage.success('订单已关闭')
          loadData()
        })
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      orderData,
      getStatusText,
      getStatusType,
      handleDeliver,
      handleClose
    }
  }
}
</script>

<style scoped>
.order-detail-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
