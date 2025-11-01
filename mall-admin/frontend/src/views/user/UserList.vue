<template>
  <div class="page-container">
    <div class="page-content">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="昵称/手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" class="custom-table" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatar" icon="el-icon-user-solid" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            {{ ['未知', '男', '女'][scope.row.gender] }}
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
        <el-table-column prop="create_time" label="注册时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
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
import { getUserList, setUserStatus } from '@/api/user';

export default {
  name: 'UserList',
  
  data() {
    return {
      searchForm: {
        keyword: '',
        status: ''
      },
      
      tableData: [],
      loading: false,
      
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
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
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          ...this.searchForm
        };
        
        const res = await getUserList(params);
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
        status: ''
      };
      this.handleSearch();
    },
    
    handleDetail(row) {
      this.$router.push(`/user/detail/${row.id}`);
    },
    
    async handleStatusChange(row) {
      try {
        await setUserStatus({ id: row.id, status: row.status });
        this.$message.success('状态更新成功');
      } catch (error) {
        console.error('状态更新失败:', error);
        row.status = row.status === 1 ? 0 : 1;
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
