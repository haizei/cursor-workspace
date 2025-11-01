<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="商品名称">
        <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
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
          <el-option label="全部" value="" />
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 表格 -->
    <div class="table-container">
      <div class="toolbar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增商品</el-button>
      </div>
      
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.main_image" class="table-image" v-if="scope.row.main_image" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="category_name" label="分类" width="120" />
        <el-table-column label="价格" width="120">
          <template slot-scope="scope">
            ¥{{ scope.row.price | formatPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column label="推荐" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_recommend ? 'success' : 'info'" size="small">
              {{ scope.row.is_recommend ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
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
            <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
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
import { getGoodsList, deleteGoods, setGoodsStatus } from '../../api/goods';
import { getCategoryList } from '../../api/category';

export default {
  name: 'GoodsList',
  data() {
    return {
      searchForm: {
        name: '',
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
  created() {
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
          ...this.searchForm,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
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
        name: '',
        categoryId: '',
        status: ''
      };
      this.pagination.page = 1;
      this.loadData();
    },
    handleAdd() {
      this.$router.push('/goods/edit');
    },
    handleEdit(id) {
      this.$router.push(`/goods/edit/${id}`);
    },
    handleDelete(id) {
      this.$confirm('确定要删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteGoods(id);
          this.$message.success('删除成功');
          this.loadData();
        } catch (error) {
          console.error('删除失败:', error);
        }
      }).catch(() => {});
    },
    async handleStatusChange(row) {
      try {
        await setGoodsStatus(row.id, row.status);
        this.$message.success(row.status ? '上架成功' : '下架成功');
      } catch (error) {
        console.error('状态修改失败:', error);
        row.status = row.status ? 0 : 1;
      }
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
