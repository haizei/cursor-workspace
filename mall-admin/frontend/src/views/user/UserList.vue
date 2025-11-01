<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="用户昵称">
        <el-input v-model="searchForm.nickname" placeholder="请输入用户昵称" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="全部" value="" />
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template slot-scope="scope">
            <el-avatar :size="50" :src="scope.row.avatar" v-if="scope.row.avatar" />
            <el-avatar :size="50" icon="el-icon-user-solid" v-else />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="150" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            {{ ['未知', '男', '女'][scope.row.gender] || '未知' }}
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
        <el-table-column label="注册时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.row.id)">详情</el-button>
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
    
    <!-- 用户详情对话框 -->
    <el-dialog title="用户详情" :visible.sync="detailVisible" width="600px">
      <el-descriptions :column="2" border v-if="currentUser">
        <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ currentUser.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentUser.phone || '未绑定' }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ ['未知', '男', '女'][currentUser.gender] || '未知' }}
        </el-descriptions-item>
        <el-descriptions-item label="订单数">{{ currentUser.order_count || 0 }}</el-descriptions-item>
        <el-descriptions-item label="地址数">{{ currentUser.address_count || 0 }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentUser.status ? 'success' : 'danger'">
            {{ currentUser.status ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ currentUser.create_time | formatDate }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getUserDetail, setUserStatus } from '../../api/user';

export default {
  name: 'UserList',
  data() {
    return {
      searchForm: {
        nickname: '',
        phone: '',
        status: ''
      },
      tableData: [],
      loading: false,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      detailVisible: false,
      currentUser: null
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = {
          ...this.searchForm,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
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
        nickname: '',
        phone: '',
        status: ''
      };
      this.pagination.page = 1;
      this.loadData();
    },
    async handleDetail(id) {
      try {
        const res = await getUserDetail(id);
        this.currentUser = res.data;
        this.detailVisible = true;
      } catch (error) {
        console.error('加载用户详情失败:', error);
      }
    },
    async handleStatusChange(row) {
      try {
        await setUserStatus(row.id, row.status);
        this.$message.success(row.status ? '启用成功' : '禁用成功');
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
