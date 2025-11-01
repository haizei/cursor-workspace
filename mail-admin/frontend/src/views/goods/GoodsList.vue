<template>
  <div class="goods-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
          <el-button type="primary" @click="handleAdd">新增商品</el-button>
        </div>
      </template>

      <el-form :inline="true" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category_id" placeholder="请选择分类" clearable>
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="主图" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.main_image"
              style="width: 60px; height: 60px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="category_name" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="batch-actions" v-if="selectedRows.length > 0">
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
        <el-button type="success" @click="handleBatchOn">批量上架</el-button>
        <el-button type="warning" @click="handleBatchOff">批量下架</el-button>
      </div>

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
import { goodsApi } from '../api/goods'
import { categoryApi } from '../api/category'

export default {
  name: 'GoodsList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const tableData = ref([])
    const categories = ref([])
    const selectedRows = ref([])

    const searchForm = reactive({
      name: '',
      category_id: '',
      status: ''
    })

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const loadCategories = () => {
      categoryApi.getList().then(res => {
        categories.value = res.data || []
      })
    }

    const loadData = () => {
      loading.value = true
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...searchForm
      }
      
      goodsApi.getList(params).then(res => {
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
        name: '',
        category_id: '',
        status: ''
      })
      handleSearch()
    }

    const handleAdd = () => {
      router.push('/goods/edit')
    }

    const handleEdit = (row) => {
      router.push(`/goods/edit/${row.id}`)
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
        type: 'warning'
      }).then(() => {
        goodsApi.delete(row.id).then(() => {
          ElMessage.success('删除成功')
          loadData()
        })
      })
    }

    const handleSelectionChange = (selection) => {
      selectedRows.value = selection
    }

    const handleBatchDelete = () => {
      if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要删除的商品')
        return
      }
      ElMessageBox.confirm('确定要批量删除选中的商品吗？', '提示', {
        type: 'warning'
      }).then(() => {
        goodsApi.batchOperation({
          ids: selectedRows.value.map(row => row.id),
          action: 'delete'
        }).then(() => {
          ElMessage.success('批量删除成功')
          loadData()
        })
      })
    }

    const handleBatchOn = () => {
      if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要上架的商品')
        return
      }
      goodsApi.batchOperation({
        ids: selectedRows.value.map(row => row.id),
        action: 'on'
      }).then(() => {
        ElMessage.success('批量上架成功')
        loadData()
      })
    }

    const handleBatchOff = () => {
      if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要下架的商品')
        return
      }
      goodsApi.batchOperation({
        ids: selectedRows.value.map(row => row.id),
        action: 'off'
      }).then(() => {
        ElMessage.success('批量下架成功')
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
      loadCategories()
      loadData()
    })

    return {
      loading,
      tableData,
      categories,
      selectedRows,
      searchForm,
      pagination,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSelectionChange,
      handleBatchDelete,
      handleBatchOn,
      handleBatchOff,
      handleSizeChange,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.goods-list-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.batch-actions {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
