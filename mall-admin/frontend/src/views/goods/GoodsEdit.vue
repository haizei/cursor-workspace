<template>
  <div class="page-container">
    <div class="page-card">
      <h3 style="margin-bottom: 20px;">{{ isEdit ? '编辑商品' : '新增商品' }}</h3>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="form" 
        label-width="100px"
        class="form-container"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        
        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%;">
            <el-option 
              v-for="item in categories" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" :min="0" style="width: 100%;"></el-input-number>
        </el-form-item>
        
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%;"></el-input-number>
        </el-form-item>
        
        <el-form-item label="商品主图" prop="main_image">
          <el-upload
            class="image-uploader"
            :action="uploadAction"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleMainImageSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.main_image" :src="form.main_image" class="image-preview">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
          <div class="form-tip">建议尺寸: 800x800px，支持jpg、png格式，大小不超过5MB</div>
        </el-form-item>
        
        <el-form-item label="商品轮播图">
          <div class="multi-image-uploader">
            <div v-for="(image, index) in form.images" :key="index" class="multi-image-item">
              <img :src="image" alt="">
              <button class="remove-btn" @click.prevent="removeImage(index)">×</button>
            </div>
            
            <el-upload
              v-if="form.images.length < 5"
              class="image-uploader"
              :action="uploadAction"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleImagesSuccess"
              :before-upload="beforeUpload"
            >
              <i class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="form-tip">最多上传5张，建议尺寸: 800x800px</div>
        </el-form-item>
        
        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="form.description" :rows="3" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        
        <el-form-item label="商品详情">
          <el-input type="textarea" v-model="form.detail" :rows="5" placeholder="请输入商品详情"></el-input>
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%;"></el-input-number>
          <div class="form-tip">数字越小越靠前</div>
        </el-form-item>
        
        <el-form-item label="上架状态">
          <el-switch 
            v-model="form.status" 
            :active-value="1" 
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
          ></el-switch>
        </el-form-item>
        
        <el-form-item label="是否推荐">
          <el-switch 
            v-model="form.is_recommend" 
            :active-value="1" 
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        
        <el-form-item label="推荐排序" v-if="form.is_recommend">
          <el-input-number v-model="form.recommend_sort" :min="0" style="width: 100%;"></el-input-number>
          <div class="form-tip">数字越小越靠前</div>
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
import { getGoodsDetail, saveGoods } from '@/api/goods';
import { getAllCategories } from '@/api/category';
import { getToken } from '@/utils/auth';

export default {
  name: 'GoodsEdit',
  data() {
    return {
      isEdit: false,
      form: {
        id: null,
        name: '',
        main_image: '',
        images: [],
        price: 0,
        stock: 0,
        category_id: '',
        description: '',
        detail: '',
        sort: 0,
        status: 1,
        is_recommend: 0,
        recommend_sort: 0
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
        main_image: [{ required: true, message: '请上传商品主图', trigger: 'change' }]
      },
      categories: [],
      loading: false,
      uploadAction: '/api/upload/image',
      uploadHeaders: {
        Authorization: `Bearer ${getToken()}`
      }
    };
  },
  mounted() {
    this.loadCategories();
    
    // 判断是新增还是编辑
    if (this.$route.params.id) {
      this.isEdit = true;
      this.loadDetail();
    }
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getAllCategories();
        if (res.success) {
          this.categories = res.data;
        }
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    },
    async loadDetail() {
      try {
        const res = await getGoodsDetail(this.$route.params.id);
        if (res.success) {
          this.form = res.data;
          // 确保images是数组
          if (!Array.isArray(this.form.images)) {
            this.form.images = [];
          }
        }
      } catch (error) {
        console.error('加载商品详情失败:', error);
      }
    },
    beforeUpload(file) {
      const isImage = /^image\/(jpeg|jpg|png|gif|webp)$/.test(file.type);
      const isLt5M = file.size / 1024 / 1024 < 5;
      
      if (!isImage) {
        this.$message.error('只能上传图片文件');
        return false;
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过5MB');
        return false;
      }
      return true;
    },
    handleMainImageSuccess(res) {
      if (res.success) {
        this.form.main_image = res.data.url;
        this.$message.success('上传成功');
      } else {
        this.$message.error(res.message || '上传失败');
      }
    },
    handleImagesSuccess(res) {
      if (res.success) {
        this.form.images.push(res.data.url);
        this.$message.success('上传成功');
      } else {
        this.$message.error(res.message || '上传失败');
      }
    },
    removeImage(index) {
      this.form.images.splice(index, 1);
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        
        try {
          this.loading = true;
          await saveGoods(this.form);
          this.$message.success(this.isEdit ? '编辑成功' : '新增成功');
          this.$router.push('/goods/list');
        } catch (error) {
          console.error('保存失败:', error);
        } finally {
          this.loading = false;
        }
      });
    },
    handleCancel() {
      this.$router.push('/goods/list');
    }
  }
};
</script>

<style scoped>
.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.image-uploader {
  display: inline-block;
}

.image-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader >>> .el-upload:hover {
  border-color: #409eff;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
  display: inline-block;
}

.image-preview {
  width: 148px;
  height: 148px;
  display: block;
  object-fit: cover;
}

.multi-image-uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.multi-image-item {
  position: relative;
  width: 148px;
  height: 148px;
}

.multi-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
}

.multi-image-item .remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
}

.multi-image-item .remove-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}
</style>
