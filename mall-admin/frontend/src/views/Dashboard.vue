<template>
  <div class="page-container">
    <h2 style="margin-bottom: 20px;">数据概览</h2>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6">
        <div class="stat-card" style="border-left: 3px solid #409EFF;">
          <div class="stat-icon" style="color: #409EFF;">
            <i class="el-icon-s-order"></i>
          </div>
          <div class="stat-value">{{ stats.total.orders || 0 }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="stat-card" style="border-left: 3px solid #67C23A;">
          <div class="stat-icon" style="color: #67C23A;">
            <i class="el-icon-sold-out"></i>
          </div>
          <div class="stat-value">¥{{ (stats.total.sales || 0).toFixed(2) }}</div>
          <div class="stat-label">销售总额</div>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="stat-card" style="border-left: 3px solid #E6A23C;">
          <div class="stat-icon" style="color: #E6A23C;">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-value">{{ stats.total.users || 0 }}</div>
          <div class="stat-label">用户总数</div>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="stat-card" style="border-left: 3px solid #F56C6C;">
          <div class="stat-icon" style="color: #F56C6C;">
            <i class="el-icon-goods"></i>
          </div>
          <div class="stat-value">{{ stats.total.goods || 0 }}</div>
          <div class="stat-label">商品总数</div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 今日数据 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="12">
        <div class="card">
          <div class="card-title">今日数据</div>
          <el-row :gutter="20">
            <el-col :span="8">
              <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 28px; font-weight: bold; color: #409EFF;">
                  {{ stats.today.orders || 0 }}
                </div>
                <div style="color: #999; margin-top: 10px;">今日订单</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 28px; font-weight: bold; color: #67C23A;">
                  ¥{{ (stats.today.sales || 0).toFixed(2) }}
                </div>
                <div style="color: #999; margin-top: 10px;">今日销售额</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 28px; font-weight: bold; color: #E6A23C;">
                  {{ stats.today.users || 0 }}
                </div>
                <div style="color: #999; margin-top: 10px;">今日新增用户</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      
      <el-col :span="12">
        <div class="card">
          <div class="card-title">订单状态统计</div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 24px; font-weight: bold;">
                  {{ stats.orderStatus.pendingPayment || 0 }}
                </div>
                <div style="color: #999; margin-top: 10px;">待支付</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 24px; font-weight: bold;">
                  {{ stats.orderStatus.pendingDelivery || 0 }}
                </div>
                <div style="color: #999; margin-top: 10px;">待发货</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 24px; font-weight: bold;">
                  {{ stats.orderStatus.delivered || 0 }}
                </div>
                <div style="color: #999; margin-top: 10px;">已发货</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div style="text-align: center; padding: 20px 0;">
                <div style="font-size: 24px; font-weight: bold;">
                  {{ stats.orderStatus.completed || 0 }}
                </div>
                <div style="color: #999; margin-top: 10px;">已完成</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDashboard } from '../api/stat';

export default {
  name: 'Dashboard',
  data() {
    return {
      stats: {
        total: {},
        today: {},
        month: {},
        orderStatus: {}
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const res = await getDashboard();
        this.stats = res.data;
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    }
  }
};
</script>
