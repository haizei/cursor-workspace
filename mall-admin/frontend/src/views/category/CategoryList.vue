<template>
  <div class="page-container">
    <div class="page-content">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增分类</el-button>
      </div>
      
      <!-- 表格 -->
      <el-table :data="tableData" class="custom-table" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="分类图片" width="100">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.image"
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
              class="image-preview"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="goods_count" label="商品数量" width="100" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status ? 'success' : 'info'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" style="color: #F56C6C;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 编辑对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="600px"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          
          <el-form-item label="分类图片">
            <image-upload v-model="form.image" />
          </el-form-item>
          
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
          
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCategoryList, saveCategory, deleteCategory } from '@/api/category';
import ImageUpload from '@/components/Upload/ImageUpload.vue';

export default {
  name: 'CategoryList',
  
  components: {
    ImageUpload
  },
  
  data() {
    return {
      tableData: [],
      loading: false,
      
      dialogVisible: false,
      dialogTitle: '',
      submitting: false,
      
      form: {
        id: null,
        name: '',
        image: '',
        sort: 0,
        status: 1
      },
      
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    };
  },
  
  mounted() {
    this.loadData();
  },
  
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const res = await getCategoryList();
        this.tableData = res.data;
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    handleAdd() {
      this.dialogTitle = '新增分类';
      this.form = {
        id: null,
        name: '',
        image: '',
        sort: 0,
        status: 1
      };
      this.dialogVisible = true;
    },
    
    handleEdit(row) {
      this.dialogTitle = '编辑分类';
      this.form = { ...row };
      this.dialogVisible = true;
    },
    
    handleDelete(row) {
      this.$confirm('确定要删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteCategory(row.id);
          this.$message.success('删除成功');
          this.loadData();
        } catch (error) {
          console.error('删除失败:', error);
        }
      });
    },
    
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.submitting = true;
          
          try {
            await saveCategory(this.form);
            this.$message.success(this.form.id ? '更新成功' : '新增成功');
            this.dialogVisible = false;
            this.loadData();
          } catch (error) {
            console.error('保存失败:', error);
          } finally {
            this.submitting = false;
          }
        }
      });
    }
  }
};
</script>
