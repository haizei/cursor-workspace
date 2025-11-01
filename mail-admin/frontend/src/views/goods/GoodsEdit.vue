<template>
  <div class="goods-edit-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑商品' : '新增商品' }}</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="form.price" :precision="2" :min="0" style="width: 100%" />
        </el-form-item>

        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
        </el-form-item>

        <el-form-item label="商品主图" prop="main_image">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleMainImageSuccess"
            :show-file-list="false"
          >
            <el-image
              v-if="form.main_image"
              :src="form.main_image"
              style="width: 120px; height: 120px; margin-right: 10px"
              fit="cover"
            />
            <el-button v-else>上传主图</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品轮播图">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleImagesSuccess"
            :file-list="imageList"
            list-type="picture-card"
            :on-remove="handleRemoveImage"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>

        <el-form-item label="上架状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否推荐" prop="is_recommend">
          <el-radio-group v-model="form.is_recommend">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
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
import { Plus } from '@element-plus/icons-vue'
import { goodsApi } from '../../api/goods'
import { categoryApi } from '../../api/category'
import { uploadApi } from '../../api/upload'
import store from '../../store'

export default {
  name: 'GoodsEdit',
  components: {
    Plus
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)
    const categories = ref([])
    const imageList = ref([])

    const isEdit = computed(() => !!route.params.id)

    const form = reactive({
      name: '',
      category_id: '',
      price: 0,
      stock: 0,
      main_image: '',
      images: [],
      description: '',
      sort: 0,
      status: 1,
      is_recommend: 0
    })

    const rules = {
      name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
      price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
      stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
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
      goodsApi.getDetail(route.params.id).then(res => {
        Object.assign(form, res.data)
        if (res.data.images && Array.isArray(res.data.images)) {
          imageList.value = res.data.images.map((url, index) => ({
            uid: index,
            name: `image${index}.jpg`,
            url: url
          }))
        }
      }).finally(() => {
        loading.value = false
      })
    }

    const handleMainImageSuccess = (res) => {
      form.main_image = res.data.url
      ElMessage.success('上传成功')
    }

    const handleImagesSuccess = (res) => {
      imageList.value.push({
        uid: imageList.value.length,
        name: res.data.filename,
        url: res.data.url
      })
      form.images = imageList.value.map(item => item.url)
      ElMessage.success('上传成功')
    }

    const handleRemoveImage = (file) => {
      const index = imageList.value.findIndex(item => item.uid === file.uid)
      if (index > -1) {
        imageList.value.splice(index, 1)
        form.images = imageList.value.map(item => item.url)
      }
    }

    const handleSubmit = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          const submitData = {
            ...form,
            images: form.images
          }

          const promise = isEdit.value
            ? goodsApi.update(route.params.id, submitData)
            : goodsApi.save(submitData)

          promise.then(() => {
            ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
            router.push('/goods/list')
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
      imageList,
      isEdit,
      form,
      rules,
      uploadUrl,
      uploadHeaders,
      handleMainImageSuccess,
      handleImagesSuccess,
      handleRemoveImage,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.goods-edit-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
