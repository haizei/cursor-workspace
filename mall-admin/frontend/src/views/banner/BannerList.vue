<template>
  <div class="page-container">
    <div class="table-container">
      <div class="toolbar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增轮播图</el-button>
      </div>
      
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="轮播图" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="width: 120px; height: 60px; object-fit: cover;" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="link" label="跳转链接" min-width="200" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
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
      :title="dialogForm.id ? '编辑轮播图' : '新增轮播图'"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="form" :model="dialogForm" :rules="rules" label-width="100px">
        <el-form-item label="轮播图" prop="image">
          <el-upload
            class="image-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :data="{ type: 'banner' }"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="dialogForm.image" :src="dialogForm.image" class="image-preview" />
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="名称">
          <el-input v-model="dialogForm.name" placeholder="请输入名称" />
        </el-form-item>
        
        <el-form-item label="跳转链接">
          <el-input v-model="dialogForm.link" placeholder="请输入跳转链接" />
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input-number v-model="dialogForm.sort" :min="0" />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-radio-group v-model="dialogForm.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
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
import { getBannerList, saveBanner, deleteBanner, setBannerStatus } from '../../api/banner';

export default {
  name: 'BannerList',
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
        link: '',
        sort: 0,
        status: 1
      },
      rules: {
        image: [{ required: true, message: '请上传轮播图', trigger: 'change' }]
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
        const res = await getBannerList();
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
        link: '',
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
      this.$confirm('确定要删除该轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteBanner(id);
          this.$message.success('删除成功');
          this.loadData();
        } catch (error) {
          console.error('删除失败:', error);
        }
      }).catch(() => {});
    },
    async handleStatusChange(row) {
      try {
        await setBannerStatus(row.id, row.status);
        this.$message.success(row.status ? '上架成功' : '下架成功');
      } catch (error) {
        console.error('状态修改失败:', error);
        row.status = row.status ? 0 : 1;
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
          await saveBanner(this.dialogForm);
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
