<template>
  <div class="category-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类列表</span>
          <el-button type="primary" @click="handleAdd">新增分类</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="分类图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.image"
              :src="row.image"
              style="width: 60px; height: 60px"
              fit="cover"
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="parent_id" label="父分类ID" width="120">
          <template #default="{ row }">
            {{ row.parent_id === 0 ? '一级分类' : row.parent_id }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
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
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryApi } from '../api/category'

export default {
  name: 'CategoryList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const tableData = ref([])

    const loadData = () => {
      loading.value = true
      categoryApi.getList().then(res => {
        tableData.value = res.data || []
      }).finally(() => {
        loading.value = false
      })
    }

    const handleAdd = () => {
      router.push('/category/edit')
    }

    const handleEdit = (row) => {
      router.push(`/category/edit/${row.id}`)
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
        type: 'warning'
      }).then(() => {
        categoryApi.delete(row.id).then(() => {
          ElMessage.success('删除成功')
          loadData()
        })
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      loading,
      tableData,
      handleAdd,
      handleEdit,
      handleDelete
    }
  }
}
</script>

<style scoped>
.category-list-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
