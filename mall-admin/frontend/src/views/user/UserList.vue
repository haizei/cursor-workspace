<template>
  <div class="page-container">
    <div class="page-card">
      <!-- 搜索栏 -->
      <el-form :inline="true" class="search-bar">
        <el-form-item>
          <el-input 
            v-model="searchForm.keyword" 
            placeholder="请输入用户昵称或手机号" 
            clearable
            @clear="handleSearch"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="全部状态" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        
        <el-table-column label="头像" width="80">
          <template slot-scope="scope">
            <el-avatar 
              v-if="scope.row.avatar" 
              :src="scope.row.avatar"
              :size="50"
            ></el-avatar>
            <el-avatar v-else :size="50" icon="el-icon-user-solid"></el-avatar>
          </template>
        </el-table-column>
        
        <el-table-column prop="nickname" label="昵称" width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        
        <el-table-column prop="gender" label="性别" width="80">
          <template slot-scope="scope">
            {{ getGenderText(scope.row.gender) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'" size="small">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="create_time" label="注册时间" width="160"></el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
            <el-button 
              size="mini" 
              :type="scope.row.status ? 'danger' : 'success'" 
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status ? '禁用' : '启用' }}
            </el-button>
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
      try {
        this.loading = true;
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          keyword: this.searchForm.keyword,
          status: this.searchForm.status
        };
        
        const res = await getUserList(params);
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
    getGenderText(gender) {
      const genderMap = {
        0: '未知',
        1: '男',
        2: '女'
      };
      return genderMap[gender] || '未知';
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
      this.pagination.page = 1;
      this.loadData();
    },
    handleDetail(row) {
      this.$router.push(`/user/detail/${row.id}`);
    },
    handleToggleStatus(row) {
      const newStatus = row.status ? 0 : 1;
      const text = newStatus ? '启用' : '禁用';
      
      this.$confirm(`确定要${text}该用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await setUserStatus({ id: row.id, status: newStatus });
          this.$message.success(`${text}成功`);
          this.loadData();
        } catch (error) {
          console.error('设置状态失败:', error);
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
