<template>
  <div class="page-container">
    <div class="page-content">
      <div class="toolbar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增轮播图</el-button>
      </div>
      
      <el-table :data="tableData" class="custom-table" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="轮播图" width="200">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.image"
              :preview-src-list="[scope.row.image]"
              class="image-preview"
              style="width: 160px; height: 90px;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="link" label="链接" />
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
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" style="color: #F56C6C;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="轮播图" prop="image">
            <image-upload v-model="form.image" />
          </el-form-item>
          
          <el-form-item label="名称">
            <el-input v-model="form.name" />
          </el-form-item>
          
          <el-form-item label="链接">
            <el-input v-model="form.link" placeholder="商品ID或外部链接" />
          </el-form-item>
          
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
          
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
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
import { getBannerList, saveBanner, deleteBanner, setBannerStatus } from '@/api/banner';
import ImageUpload from '@/components/Upload/ImageUpload.vue';

export default {
  name: 'BannerList',
  
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
        link: '',
        sort: 0,
        status: 1
      },
      
      rules: {
        image: [{ required: true, message: '请上传轮播图', trigger: 'change' }]
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
        const res = await getBannerList({ page: 1, pageSize: 100 });
        this.tableData = res.data.list;
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    handleAdd() {
      this.dialogTitle = '新增轮播图';
      this.form = {
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
      this.dialogTitle = '编辑轮播图';
      this.form = { ...row };
      this.dialogVisible = true;
    },
    
    handleDelete(row) {
      this.$confirm('确定要删除该轮播图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteBanner(row.id);
          this.$message.success('删除成功');
          this.loadData();
        } catch (error) {
          console.error('删除失败:', error);
        }
      });
    },
    
    async handleStatusChange(row) {
      try {
        await setBannerStatus({ id: row.id, status: row.status });
        this.$message.success('状态更新成功');
      } catch (error) {
        console.error('状态更新失败:', error);
        row.status = row.status === 1 ? 0 : 1;
      }
    },
    
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.submitting = true;
          try {
            await saveBanner(this.form);
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
