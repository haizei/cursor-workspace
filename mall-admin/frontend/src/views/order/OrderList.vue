<template>
  <div class="page-container">
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="订单号">
        <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="全部" value="" />
          <el-option label="待支付" :value="0" />
          <el-option label="待发货" :value="1" />
          <el-option label="已发货" :value="2" />
          <el-option label="已完成" :value="3" />
          <el-option label="已关闭" :value="4" />
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
        <el-table-column prop="order_no" label="订单号" width="180" />
        <el-table-column prop="user_nickname" label="用户昵称" width="120" />
        <el-table-column label="订单金额" width="120">
          <template slot-scope="scope">
            ¥{{ scope.row.total_amount | formatPrice }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="receiver_name" label="收货人" width="100" />
        <el-table-column prop="receiver_phone" label="联系电话" width="120" />
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.row.id)">详情</el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              @click="handleDeliver(scope.row.id)"
            >
              发货
            </el-button>
            <el-button
              v-if="scope.row.status < 3"
              size="mini"
              type="danger"
              @click="handleClose(scope.row.id)"
            >
              关闭
            </el-button>
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
import { getOrderList, deliverOrder, closeOrder } from '../../api/order';

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
      this.pagination.page = 1;
      this.loadData();
    },
    handleDetail(id) {
      this.$router.push(`/order/detail/${id}`);
    },
    handleDeliver(id) {
      this.$confirm('确定要发货吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deliverOrder(id);
          this.$message.success('发货成功');
          this.loadData();
        } catch (error) {
          console.error('发货失败:', error);
        }
      }).catch(() => {});
    },
    handleClose(id) {
      this.$confirm('确定要关闭该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await closeOrder(id);
          this.$message.success('订单已关闭');
          this.loadData();
        } catch (error) {
          console.error('关闭订单失败:', error);
        }
      }).catch(() => {});
    },
    getStatusText(status) {
      const statusMap = {
        0: '待支付',
        1: '待发货',
        2: '已发货',
        3: '已完成',
        4: '已关闭'
      };
      return statusMap[status] || '未知';
    },
    getStatusType(status) {
      const typeMap = {
        0: 'warning',
        1: 'primary',
        2: 'success',
        3: 'info',
        4: 'danger'
      };
      return typeMap[status] || 'info';
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
