<template>
  <div class="page-container">
    <div class="page-card">
      <!-- 搜索栏 -->
      <el-form :inline="true" class="search-bar">
        <el-form-item>
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="请输入分类名称" 
            clearable
            @clear="handleSearch"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增分类</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        
        <el-table-column label="分类图片" width="100">
          <template slot-scope="scope">
            <el-image 
              v-if="scope.row.image"
              :src="scope.row.image" 
              :preview-src-list="[scope.row.image]"
              class="table-image"
            ></el-image>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="分类名称" min-width="200"></el-table-column>
        
        <el-table-column prop="goods_count" label="商品数量" width="100">
          <template slot-scope="scope">
            <el-tag type="info">{{ scope.row.goods_count }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'" size="small">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right;"
      >
      </el-pagination>
    </div>
    
    <!-- 编辑对话框 -->
    <el-dialog 
      :title="editForm.id ? '编辑分类' : '新增分类'" 
      :visible.sync="dialogVisible" 
      width="600px"
    >
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        
        <el-form-item label="分类图片">
          <el-upload
            class="image-uploader"
            :action="uploadAction"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="editForm.image" :src="editForm.image" class="image-preview">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input-number v-model="editForm.sort" :min="0" style="width: 100%;"></el-input-number>
          <div class="form-tip">数字越小越靠前</div>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-switch 
            v-model="editForm.status" 
            :active-value="1" 
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
      </el-form>
      
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, saveCategory, deleteCategory } from '@/api/category';
import { getToken } from '@/utils/auth';

export default {
  name: 'CategoryList',
  data() {
    return {
      searchForm: {
        keyword: ''
      },
      tableData: [],
      loading: false,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      submitLoading: false,
      editForm: {
        id: null,
        name: '',
        image: '',
        parent_id: 0,
        sort: 0,
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      uploadAction: '/api/upload/image',
      uploadHeaders: {
        Authorization: `Bearer ${getToken()}`
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          keyword: this.searchForm.keyword
        };
        
        const res = await getCategoryList(params);
        if (res.success) {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.pagination.page = 1;
      this.loadData();
    },
    handleReset() {
      this.searchForm.keyword = '';
      this.pagination.page = 1;
      this.loadData();
    },
    handleAdd() {
      this.editForm = {
        id: null,
        name: '',
        image: '',
        parent_id: 0,
        sort: 0,
        status: 1
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.editForm = { ...row };
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
    handleImageSuccess(res) {
      if (res.success) {
        this.editForm.image = res.data.url;
        this.$message.success('上传成功');
      } else {
        this.$message.error(res.message || '上传失败');
      }
    },
    handleSubmit() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        
        try {
          this.submitLoading = true;
          await saveCategory(this.editForm);
          this.$message.success(this.editForm.id ? '编辑成功' : '新增成功');
          this.dialogVisible = false;
          this.loadData();
        } catch (error) {
          console.error('保存失败:', error);
        } finally {
          this.submitLoading = false;
        }
      });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.page = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.loadData();
    }
  }
};
</script>

<style scoped>
.table-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
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
</style>
