<template>
  <div class="banner-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>轮播图列表</span>
          <el-button type="primary" @click="handleAdd">新增轮播图</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="150">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              style="width: 120px; height: 60px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="link" label="跳转链接" />
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
import { bannerApi } from '../api/banner'

export default {
  name: 'BannerList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const tableData = ref([])

    const loadData = () => {
      loading.value = true
      bannerApi.getList().then(res => {
        tableData.value = res.data.list || []
      }).finally(() => {
        loading.value = false
      })
    }

    const handleAdd = () => {
      router.push('/banner/edit')
    }

    const handleEdit = (row) => {
      router.push(`/banner/edit/${row.id}`)
    }

    const handleDelete = (row) => {
      ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
        type: 'warning'
      }).then(() => {
        bannerApi.delete(row.id).then(() => {
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
.banner-list-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
