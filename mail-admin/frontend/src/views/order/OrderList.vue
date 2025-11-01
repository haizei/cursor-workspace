<template>
  <div class="order-list-container">
    <el-card>
      <template #header>
        <span>订单列表</span>
      </template>

      <el-form :inline="true" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.order_no" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待支付" :value="0" />
            <el-option label="待发货" :value="1" />
            <el-option label="已发货" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已关闭" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="order_no" label="订单号" width="200" />
        <el-table-column prop="user_nickname" label="用户昵称" width="120" />
        <el-table-column prop="total_amount" label="订单金额" width="120">
          <template #default="{ row }">¥{{ row.total_amount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receiver_name" label="收货人" width="120" />
        <el-table-column prop="receiver_phone" label="联系电话" width="150" />
        <el-table-column prop="create_time" label="下单时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === 1"
              type="success"
              link
              @click="handleDeliver(row)"
            >
              发货
            </el-button>
            <el-button
              v-if="row.status !== 4"
              type="danger"
              link
              @click="handleClose(row)"
            >
              关闭
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderApi } from '../api/order'

export default {
  name: 'OrderList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const tableData = ref([])

    const searchForm = reactive({
      order_no: '',
      status: ''
    })

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

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
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchForm
      }
      
      orderApi.getList(params).then(res => {
        tableData.value = res.data.list || []
        pagination.total = res.data.total || 0
      }).finally(() => {
        loading.value = false
      })
    }

    const handleSearch = () => {
      pagination.page = 1
      loadData()
    }

    const handleReset = () => {
      Object.assign(searchForm, {
        order_no: '',
        status: ''
      })
      handleSearch()
    }

    const handleDetail = (row) => {
      router.push(`/order/detail/${row.id}`)
    }

    const handleDeliver = (row) => {
      ElMessageBox.confirm('确定要发货吗？', '提示', {
        type: 'warning'
      }).then(() => {
        orderApi.deliver(row.id).then(() => {
          ElMessage.success('发货成功')
          loadData()
        })
      })
    }

    const handleClose = (row) => {
      ElMessageBox.confirm('确定要关闭该订单吗？', '提示', {
        type: 'warning'
      }).then(() => {
        orderApi.close(row.id).then(() => {
          ElMessage.success('订单已关闭')
          loadData()
        })
      })
    }

    const handleSizeChange = () => {
      loadData()
    }

    const handlePageChange = () => {
      loadData()
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      tableData,
      searchForm,
      pagination,
      getStatusText,
      getStatusType,
      handleSearch,
      handleReset,
      handleDetail,
      handleDeliver,
      handleClose,
      handleSizeChange,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.order-list-container {
  padding: 0;
}

.search-form {
  margin-bottom: 20px;
}
</style>
