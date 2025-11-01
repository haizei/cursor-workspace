<template>
  <div class="page-container">
    <div class="page-card" v-loading="loading">
      <h3 style="margin-bottom: 20px;">订单详情</h3>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ orderData.order_no }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(orderData.status)" size="small">
            {{ getStatusText(orderData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ orderData.user_nickname }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">
          <span style="color: #f56c6c; font-weight: bold;">¥{{ orderData.total_amount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ orderData.create_time }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ orderData.pay_time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发货时间">{{ orderData.deliver_time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="完成时间">{{ orderData.finish_time || '-' }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider></el-divider>
      
      <h4>收货信息</h4>
      <el-descriptions :column="2" border style="margin-top: 10px;">
        <el-descriptions-item label="收货人">{{ orderData.receiver_name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderData.receiver_phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ orderData.receiver_address }}</el-descriptions-item>
        <el-descriptions-item label="订单备注" :span="2">{{ orderData.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      
      <el-divider></el-divider>
      
      <h4>商品信息</h4>
      <el-table :data="orderData.items" border stripe style="margin-top: 10px;">
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <el-image 
              v-if="scope.row.goods_image"
              :src="scope.row.goods_image" 
              :preview-src-list="[scope.row.goods_image]"
              class="table-image"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" min-width="200"></el-table-column>
        <el-table-column prop="goods_price" label="单价" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.goods_price }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="80"></el-table-column>
        <el-table-column prop="total_price" label="小计" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.total_price }}
          </template>
        </el-table-column>
      </el-table>
      
      <div style="margin-top: 20px; text-align: right;">
        <el-button @click="$router.back()">返回</el-button>
        <el-button 
          v-if="orderData.status === 1" 
          type="success" 
          @click="handleDeliver"
        >
          发货
        </el-button>
        <el-button 
          v-if="orderData.status < 2" 
          type="danger" 
          @click="handleClose"
        >
          关闭订单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetail, deliverOrder, closeOrder } from '@/api/order';

export default {
  name: 'OrderDetail',
  data() {
    return {
      orderData: {
        items: []
      },
      loading: false
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        const res = await getOrderDetail(this.$route.params.id);
        if (res.success) {
          this.orderData = res.data;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
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
    handleDeliver() {
      this.$confirm('确定要发货吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deliverOrder({ id: this.orderData.id });
          this.$message.success('发货成功');
          this.loadData();
        } catch (error) {
          console.error('发货失败:', error);
        }
      });
    },
    handleClose() {
      this.$confirm('确定要关闭该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await closeOrder({ id: this.orderData.id });
          this.$message.success('关闭订单成功');
          this.loadData();
        } catch (error) {
          console.error('关闭订单失败:', error);
        }
      });
    }
  }
};
</script>

<style scoped>
.table-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}
</style>
