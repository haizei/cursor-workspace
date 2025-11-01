<template>
  <div class="page-container">
    <div class="page-content">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待支付" :value="0" />
            <el-option label="待发货" :value="1" />
            <el-option label="已发货" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已关闭" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" class="custom-table" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="order_no" label="订单号" width="180" />
        <el-table-column prop="user_nickname" label="用户" width="120" />
        <el-table-column prop="total_amount" label="订单金额" width="100">
          <template slot-scope="scope">
            {{ scope.row.total_amount | formatMoney }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status | orderStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receiver_name" label="收货人" width="100" />
        <el-table-column prop="receiver_phone" label="联系电话" width="120" />
        <el-table-column prop="create_time" label="下单时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="scope.row.status === 1" type="text" @click="handleDeliver(scope.row)">发货</el-button>
            <el-button v-if="scope.row.status < 3" type="text" style="color: #F56C6C;" @click="handleClose(scope.row)">关闭</el-button>
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
import { getOrderList, deliverOrder, closeOrder } from '@/api/order';

export default {
  name: 'OrderList',
  
  data() {
    return {
      searchForm: {
        orderNo: '',
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
        
        const res = await getOrderList(params);
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
        orderNo: '',
        status: ''
      };
      this.handleSearch();
    },
    
    handleDetail(row) {
      this.$router.push(`/order/detail/${row.id}`);
    },
    
    handleDeliver(row) {
      this.$confirm('确定要发货该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deliverOrder({ id: row.id });
          this.$message.success('发货成功');
          this.loadData();
        } catch (error) {
          console.error('发货失败:', error);
        }
      });
    },
    
    handleClose(row) {
      this.$confirm('确定要关闭该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await closeOrder({ id: row.id });
          this.$message.success('订单已关闭');
          this.loadData();
        } catch (error) {
          console.error('关闭失败:', error);
        }
      });
    },
    
    getStatusType(status) {
      const types = ['warning', 'primary', 'info', 'success', 'danger'];
      return types[status] || 'info';
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
