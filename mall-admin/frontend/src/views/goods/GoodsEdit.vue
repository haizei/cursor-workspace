<template>
  <div class="page-container">
    <div class="form-container">
      <h3>{{ form.id ? '编辑商品' : '新增商品' }}</h3>
      
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="margin-top: 20px;"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.1"
          />
        </el-form-item>
        
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        
        <el-form-item label="商品主图" prop="main_image">
          <el-upload
            class="image-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{ type: 'goods' }"
            :show-file-list="false"
            :on-success="handleMainImageSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.main_image" :src="form.main_image" class="image-preview" />
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="商品描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        
        <el-form-item label="是否推荐">
          <el-switch v-model="form.is_recommend" :active-value="1" :inactive-value="0" />
        </el-form-item>
        
        <el-form-item v-if="form.is_recommend" label="推荐排序">
          <el-input-number v-model="form.recommend_sort" :min="0" />
        </el-form-item>
        
        <el-form-item label="商品状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getGoodsDetail, saveGoods } from '../../api/goods';
import { getCategoryList } from '../../api/category';

export default {
  name: 'GoodsEdit',
  data() {
    return {
      form: {
        id: null,
        name: '',
        category_id: '',
        price: 0,
        stock: 0,
        main_image: '',
        description: '',
        sort: 0,
        is_recommend: 0,
        recommend_sort: 0,
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
      },
      categories: [],
      loading: false,
      uploadUrl: '/admin/upload/image',
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  },
  created() {
    this.loadCategories();
    
    const id = this.$route.params.id;
    if (id) {
      this.loadData(id);
    }
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategoryList();
        this.categories = res.data;
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    },
    async loadData(id) {
      try {
        const res = await getGoodsDetail(id);
        this.form = res.data;
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        this.$message.error('只能上传图片文件！');
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过 5MB！');
      }
      return isImage && isLt5M;
    },
    handleMainImageSuccess(res) {
      if (res.code === 200) {
        this.form.main_image = res.data.url;
        this.$message.success('上传成功');
      } else {
        this.$message.error(res.message || '上传失败');
      }
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        
        this.loading = true;
        try {
          await saveGoods(this.form);
          this.$message.success('保存成功');
          this.$router.push('/goods/list');
        } catch (error) {
          console.error('保存失败:', error);
        } finally {
          this.loading = false;
        }
      });
    },
    handleCancel() {
      this.$router.back();
    }
  }
};
</script>
