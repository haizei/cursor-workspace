<template>
  <div class="banner-edit-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑轮播图' : '新增轮播图' }}</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="轮播图名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入轮播图名称" />
        </el-form-item>

        <el-form-item label="轮播图片" prop="image">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleImageSuccess"
            :show-file-list="false"
          >
            <el-image
              v-if="form.image"
              :src="form.image"
              style="width: 200px; height: 100px; margin-right: 10px"
              fit="cover"
            />
            <el-button v-else>上传图片</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入跳转链接" />
        </el-form-item>

        <el-form-item label="链接类型" prop="link_type">
          <el-radio-group v-model="form.link_type">
            <el-radio :label="1">商品详情</el-radio>
            <el-radio :label="2">外部链接</el-radio>
          </el-radio-group>
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
import { bannerApi } from '../../api/banner'
import store from '../../store'

export default {
  name: 'BannerEdit',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref(null)
    const loading = ref(false)

    const isEdit = computed(() => !!route.params.id)

    const form = reactive({
      name: '',
      image: '',
      link: '',
      link_type: 1,
      sort: 0,
      status: 1
    })

    const rules = {
      image: [{ required: true, message: '请上传图片', trigger: 'change' }]
    }

    const uploadUrl = computed(() => {
      return `${process.env.VUE_APP_API_BASE_URL || '/api'}/admin/upload/image?type=banner`
    })

    const uploadHeaders = computed(() => {
      return {
        Authorization: `Bearer ${store.state.user.token}`
      }
    })

    const loadData = () => {
      if (!isEdit.value) return

      loading.value = true
      bannerApi.getDetail(route.params.id).then(res => {
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
            ? bannerApi.update(route.params.id, form)
            : bannerApi.save(form)

          promise.then(() => {
            ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
            router.push('/banner/list')
          }).finally(() => {
            loading.value = false
          })
        }
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      formRef,
      loading,
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
.banner-edit-container {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
