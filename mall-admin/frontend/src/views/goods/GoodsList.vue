<template>
  <div class="page-container">
    <div class="page-card">
      <!-- 搜索栏 -->
      <el-form :inline="true" class="search-bar">
        <el-form-item>
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="请输入商品名称" 
            clearable
            @clear="handleSearch"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-select v-model="searchForm.categoryId" placeholder="选择分类" clearable>
            <el-option label="全部分类" value=""></el-option>
            <el-option 
              v-for="item in categories" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="全部状态" value=""></el-option>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增商品</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <el-image 
              v-if="scope.row.main_image"
              :src="scope.row.main_image" 
              :preview-src-list="[scope.row.main_image]"
              class="table-image"
            ></el-image>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="商品名称" min-width="200"></el-table-column>
        
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        
        <el-table-column prop="stock" label="库存" width="80"></el-table-column>
        
        <el-table-column prop="category_name" label="分类" width="120"></el-table-column>
        
        <el-table-column prop="is_recommend" label="推荐" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_recommend ? 'success' : 'info'" size="small">
              {{ scope.row.is_recommend ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'" size="small">
              {{ scope.row.status ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="sales" label="销量" width="80"></el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="mini" 
              :type="scope.row.status ? 'warning' : 'success'" 
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status ? '下架' : '上架' }}
            </el-button>
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
  </div>
</template>

<script>
import { getGoodsList, deleteGoods, setGoodsStatus } from '@/api/goods';
import { getAllCategories } from '@/api/category';

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
        const res = await getAllCategories();
        if (res.success) {
          this.categories = res.data;
        }
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    },
    async loadData() {
      try {
        this.loading = true;
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          keyword: this.searchForm.keyword,
          categoryId: this.searchForm.categoryId,
          status: this.searchForm.status
        };
        
        const res = await getGoodsList(params);
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
      this.searchForm = {
        keyword: '',
        categoryId: '',
        status: ''
      };
      this.pagination.page = 1;
      this.loadData();
    },
    handleAdd() {
      this.$router.push('/goods/add');
    },
    handleEdit(row) {
      this.$router.push(`/goods/edit/${row.id}`);
    },
    handleToggleStatus(row) {
      const newStatus = row.status ? 0 : 1;
      const text = newStatus ? '上架' : '下架';
      
      this.$confirm(`确定要${text}该商品吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await setGoodsStatus({ id: row.id, status: newStatus });
          this.$message.success(`${text}成功`);
          this.loadData();
        } catch (error) {
          console.error('设置状态失败:', error);
        }
      });
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
</style>
