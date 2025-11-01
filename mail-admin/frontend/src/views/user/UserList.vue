<template>
  <div class="user-list-container">
    <el-card>
      <template #header>
        <span>用户列表</span>
      </template>

      <el-form :inline="true" class="search-form">
        <el-form-item label="用户昵称">
          <el-input v-model="searchForm.nickname" placeholder="请输入用户昵称" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户昵称" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="注册时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
            <el-button
              :type="row.status === 1 ? 'danger' : 'success'"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
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
import { ElMessage } from 'element-plus'
import { userApi } from '../api/user'

export default {
  name: 'UserList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const tableData = ref([])

    const searchForm = reactive({
      nickname: '',
      phone: '',
      status: ''
    })

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const loadData = () => {
      loading.value = true
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchForm
      }
      
      userApi.getList(params).then(res => {
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
        nickname: '',
        phone: '',
        status: ''
      })
      handleSearch()
    }

    const handleDetail = (row) => {
      router.push(`/user/detail/${row.id}`)
    }

    const handleToggleStatus = (row) => {
      userApi.toggleStatus(row.id).then(() => {
        ElMessage.success('操作成功')
        loadData()
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
      handleSearch,
      handleReset,
      handleDetail,
      handleToggleStatus,
      handleSizeChange,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.user-list-container {
  padding: 0;
}

.search-form {
  margin-bottom: 20px;
}
</style>
