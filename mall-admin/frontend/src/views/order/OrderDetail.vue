<template>
  <div class="page-container">
    <div class="page-header">
      <h2>订单详情</h2>
    </div>
    
    <div class="page-content" v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <span>订单信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ orderData.order_no }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(orderData.status)">
              {{ orderData.status | orderStatus }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户昵称">{{ orderData.user_nickname }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">
            {{ orderData.total_amount | formatMoney }}
          </el-descriptions-item>
          <el-descriptions-item label="下单时间">
            {{ orderData.create_time | formatDate }}
          </el-descriptions-item>
          <el-descriptions-item label="支付时间">
            {{ orderData.pay_time | formatDate }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      
      <el-card class="box-card" style="margin-top: 20px;">
        <div slot="header">
          <span>收货信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收货人">{{ orderData.receiver_name }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ orderData.receiver_phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">
            {{ orderData.receiver_address }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ orderData.remark || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      
      <el-card class="box-card" style="margin-top: 20px;">
        <div slot="header">
          <span>商品信息</span>
        </div>
        <el-table :data="orderData.items" border>
          <el-table-column label="商品图片" width="100">
            <template slot-scope="scope">
              <el-image
                :src="scope.row.goods_image"
                class="image-preview"
              />
            </template>
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" />
          <el-table-column prop="goods_price" label="单价" width="100">
            <template slot-scope="scope">
              ¥{{ scope.row.goods_price }}
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量" width="80" />
          <el-table-column prop="total_price" label="小计" width="100">
            <template slot-scope="scope">
              ¥{{ scope.row.total_price }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <div style="margin-top: 20px;">
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderDetail } from '@/api/order';

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
      this.loading = true;
      try {
        const res = await getOrderDetail(this.$route.params.id);
        this.orderData = res.data;
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    getStatusType(status) {
      const types = ['warning', 'primary', 'info', 'success', 'danger'];
      return types[status] || 'info';
    }
  }
};
</script>
