<template>
  <div class="page-container">
    <div class="page-content">
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 工具栏 -->
      <div class="toolbar">
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增商品</el-button>
          <el-button type="danger" icon="el-icon-delete" :disabled="selections.length === 0" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>
      
      <!-- 表格 -->
      <el-table
        :data="tableData"
        class="custom-table"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.main_image"
              :preview-src-list="[scope.row.main_image]"
              class="image-preview"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="category_name" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
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
        <el-table-column label="推荐" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_recommend" type="success">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" style="color: #F56C6C;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods, batchDeleteGoods, setGoodsStatus } from '@/api/goods';
import { getCategoryList } from '@/api/category';

export default {
  name: 'GoodsList',
  
  data() {
    return {
      searchForm: {
        keyword: '',
        categoryId: '',
        status: ''
      },
      
      tableData: [],
      categories: [],
      selections: [],
      loading: false,
      
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  
  mounted() {
    this.loadCategories();
    this.loadData();
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
      this.loading = true;
      try {
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...this.searchForm
        };
        
        const res = await getGoodsList(params);
        this.tableData = res.data.list;
        this.pagination.total = res.data.total;
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
      this.searchForm = {
        keyword: '',
        categoryId: '',
        status: ''
      };
      this.handleSearch();
    },
    
    handleAdd() {
      this.$router.push('/goods/edit');
    },
    
    handleEdit(row) {
      this.$router.push(`/goods/edit/${row.id}`);
    },
    
    handleDelete(row) {
      this.$confirm('确定要删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteGoods(row.id);
          this.$message.success('删除成功');
          this.loadData();
        } catch (error) {
          console.error('删除失败:', error);
        }
      });
    },
    
    handleBatchDelete() {
      this.$confirm(`确定要删除选中的${this.selections.length}个商品吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const ids = this.selections.map(item => item.id);
          await batchDeleteGoods(ids);
          this.$message.success('批量删除成功');
          this.loadData();
        } catch (error) {
          console.error('批量删除失败:', error);
        }
      });
    },
    
    async handleStatusChange(row) {
      try {
        await setGoodsStatus({ id: row.id, status: row.status });
        this.$message.success('状态更新成功');
      } catch (error) {
        console.error('状态更新失败:', error);
        row.status = row.status === 1 ? 0 : 1;
      }
    },
    
    handleSelectionChange(selections) {
      this.selections = selections;
    },
    
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.loadData();
    },
    
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.loadData();
    }
  }
};
</script>
