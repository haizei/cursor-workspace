<template>
  <div class="page-container">
    <div class="table-container">
      <div class="toolbar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增分类</el-button>
      </div>
      
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="分类图片" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.image" class="table-image" v-if="scope.row.image" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'" size="small">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogForm.id ? '编辑分类' : '新增分类'"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="form" :model="dialogForm" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        
        <el-form-item label="分类图片">
          <el-upload
            class="image-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{ type: 'category' }"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="dialogForm.image" :src="dialogForm.image" class="image-preview" />
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input-number v-model="dialogForm.sort" :min="0" />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-radio-group v-model="dialogForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, saveCategory, deleteCategory } from '../../api/category';

export default {
  name: 'CategoryList',
  data() {
    return {
      tableData: [],
      loading: false,
      dialogVisible: false,
      submitLoading: false,
      dialogForm: {
        id: null,
        name: '',
        image: '',
        sort: 0,
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      uploadUrl: '/admin/upload/image',
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  },
  created() {
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
      this.dialogForm = {
        id: null,
        name: '',
        image: '',
        sort: 0,
        status: 1
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogForm = { ...row };
      this.dialogVisible = true;
    },
    handleDelete(id) {
      this.$confirm('确定要删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteCategory(id);
          this.$message.success('删除成功');
          this.loadData();
        } catch (error) {
          console.error('删除失败:', error);
        }
      }).catch(() => {});
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
    handleImageSuccess(res) {
      if (res.code === 200) {
        this.dialogForm.image = res.data.url;
        this.$message.success('上传成功');
      } else {
        this.$message.error(res.message || '上传失败');
      }
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        
        this.submitLoading = true;
        try {
          await saveCategory(this.dialogForm);
          this.$message.success('保存成功');
          this.dialogVisible = false;
          this.loadData();
        } catch (error) {
          console.error('保存失败:', error);
        } finally {
          this.submitLoading = false;
        }
      });
    }
  }
};
</script>
