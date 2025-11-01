<template>
  <div class="page-container">
    <div class="page-header">
      <h2>{{ isEdit ? '编辑商品' : '新增商品' }}</h2>
    </div>
    
    <div class="page-content">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <el-form-item label="商品分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择商品分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品主图" prop="main_image">
          <image-upload v-model="form.main_image" />
        </el-form-item>
        
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="form.price" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        
        <el-form-item label="商品描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        
        <el-form-item label="商品状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="是否推荐">
          <el-switch v-model="form.is_recommend" :active-value="1" :inactive-value="0" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getGoodsDetail, saveGoods } from '@/api/goods';
import { getCategoryList } from '@/api/category';
import ImageUpload from '@/components/Upload/ImageUpload.vue';

export default {
  name: 'GoodsEdit',
  
  components: {
    ImageUpload
  },
  
  data() {
    return {
      form: {
        name: '',
        category_id: '',
        main_image: '',
        price: 0,
        stock: 0,
        description: '',
        sort: 0,
        status: 1,
        is_recommend: 0
      },
      
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }]
      },
      
      categories: [],
      submitting: false
    };
  },
  
  computed: {
    isEdit() {
      return !!this.$route.params.id;
    }
  },
  
  mounted() {
    this.loadCategories();
    
    if (this.isEdit) {
      this.loadData();
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
    
    async loadData() {
      try {
        const res = await getGoodsDetail(this.$route.params.id);
        this.form = res.data;
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载商品信息失败');
      }
    },
    
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.submitting = true;
          
          try {
            const data = { ...this.form };
            if (this.isEdit) {
              data.id = this.$route.params.id;
            }
            
            await saveGoods(data);
            this.$message.success(this.isEdit ? '更新成功' : '新增成功');
            this.$router.push('/goods/list');
          } catch (error) {
            console.error('保存失败:', error);
          } finally {
            this.submitting = false;
          }
        }
      });
    },
    
    handleCancel() {
      this.$router.back();
    }
  }
};
</script>
