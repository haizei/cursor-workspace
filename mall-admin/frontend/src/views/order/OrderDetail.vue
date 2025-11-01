<template>
  <div class="page-container">
    <div class="card" v-loading="loading">
      <h3>订单详情</h3>
      
      <el-descriptions :column="2" border style="margin-top: 20px;">
        <el-descriptions-item label="订单号">{{ order.order_no }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(order.status)">
            {{ getStatusText(order.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ order.user_nickname }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">
          ¥{{ (order.total_amount || 0) | formatPrice }}
        </el-descriptions-item>
        <el-descriptions-item label="收货人">{{ order.receiver_name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ order.receiver_phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">
          {{ order.receiver_address }}
        </el-descriptions-item>
        <el-descriptions-item label="订单备注" :span="2">
          {{ order.remark || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">
          {{ order.create_time | formatDate }}
        </el-descriptions-item>
        <el-descriptions-item label="支付时间">
          {{ order.pay_time ? (order.pay_time | formatDate) : '未支付' }}
        </el-descriptions-item>
        <el-descriptions-item label="发货时间">
          {{ order.deliver_time ? (order.deliver_time | formatDate) : '未发货' }}
        </el-descriptions-item>
        <el-descriptions-item label="完成时间">
          {{ order.finish_time ? (order.finish_time | formatDate) : '未完成' }}
        </el-descriptions-item>
      </el-descriptions>
      
      <h4 style="margin-top: 30px; margin-bottom: 15px;">订单商品</h4>
      <el-table :data="order.items" border>
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.goods_image" class="table-image" v-if="scope.row.goods_image" />
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" />
        <el-table-column label="单价" width="120">
          <template slot-scope="scope">
            ¥{{ scope.row.goods_price | formatPrice }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="100" />
        <el-table-column label="小计" width="120">
          <template slot-scope="scope">
            ¥{{ scope.row.total_price | formatPrice }}
          </template>
        </el-table-column>
      </el-table>
      
      <div style="margin-top: 20px;">
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetail } from '../../api/order';

export default {
  name: 'OrderDetail',
  data() {
    return {
      order: {
        items: []
      },
      loading: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const id = this.$route.params.id;
        const res = await getOrderDetail(id);
        this.order = res.data;
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
    }
  }
};
</script>
