<template>
  <div class="category-edit-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑分类' : '新增分类' }}</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="父分类" prop="parent_id">
          <el-select v-model="form.parent_id" placeholder="请选择父分类（一级分类选择0）" style="width: 100%">
            <el-option label="一级分类" :value="0" />
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="分类图片">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleImageSuccess"
            :show-file-list="false"
          >
            <el-image
              v-if="form.image"
              :src="form.image"
              style="width: 120px; height: 120px; margin-right: 10px"
              fit="cover"
            />
            <el-button v-else>上传图片</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { categoryApi } from '../../api/category'
import store from '../../store'

export default {
  name: 'CategoryEdit',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)
    const categories = ref([])

    const isEdit = computed(() => !!route.params.id)

    const form = reactive({
      name: '',
      parent_id: 0,
      image: '',
      sort: 0,
      status: 1
    })

    const rules = {
      name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
    }

    const uploadUrl = computed(() => {
      return `${process.env.VUE_APP_API_BASE_URL || '/api'}/admin/upload/image?type=goods`
    })

    const uploadHeaders = computed(() => {
      return {
        Authorization: `Bearer ${store.state.user.token}`
      }
    })

    const loadCategories = () => {
      categoryApi.getList().then(res => {
        categories.value = res.data || []
      })
    }

    const loadData = () => {
      if (!isEdit.value) return

      loading.value = true
      categoryApi.getDetail(route.params.id).then(res => {
        Object.assign(form, res.data)
      }).finally(() => {
        loading.value = false
      })
    }

    const handleImageSuccess = (res) => {
      form.image = res.data.url
      ElMessage.success('上传成功')
    }

    const handleSubmit = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          const promise = isEdit.value
            ? categoryApi.update(route.params.id, form)
            : categoryApi.save(form)

          promise.then(() => {
            ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
            router.push('/category/list')
          }).finally(() => {
            loading.value = false
          })
        }
      })
    }

    onMounted(() => {
      loadCategories()
      loadData()
    })

    return {
      formRef,
      loading,
      categories,
      isEdit,
      form,
      rules,
      uploadUrl,
      uploadHeaders,
      handleImageSuccess,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.category-edit-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
