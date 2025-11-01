<template>
  <div class="page-container">
    <div class="page-card">
      <h2 style="margin-bottom: 20px;">数据统计</h2>
      
      <!-- 核心指标卡片 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="stat-label">订单总数</div>
            <div class="stat-value">{{ dashboardData.overview.totalOrders }}</div>
            <i class="el-icon-s-order stat-icon"></i>
          </div>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <div class="stat-label">销售总额</div>
            <div class="stat-value">¥{{ dashboardData.overview.totalSales }}</div>
            <i class="el-icon-money stat-icon"></i>
          </div>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <div class="stat-label">用户总数</div>
            <div class="stat-value">{{ dashboardData.overview.totalUsers }}</div>
            <i class="el-icon-user stat-icon"></i>
          </div>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            <div class="stat-label">商品总数</div>
            <div class="stat-value">{{ dashboardData.overview.totalGoods }}</div>
            <i class="el-icon-goods stat-icon"></i>
          </div>
        </el-col>
      </el-row>
      
      <!-- 今日数据 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header">
              <span>今日新增用户</span>
            </div>
            <div class="stat-number">{{ dashboardData.today.users }}</div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header">
              <span>今日订单数</span>
            </div>
            <div class="stat-number">{{ dashboardData.today.orders }}</div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header">
              <span>今日销售额</span>
            </div>
            <div class="stat-number">¥{{ dashboardData.today.sales }}</div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 本月数据 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header">
              <span>本月新增用户</span>
            </div>
            <div class="stat-number">{{ dashboardData.month.users }}</div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header">
              <span>本月订单数</span>
            </div>
            <div class="stat-number">{{ dashboardData.month.orders }}</div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header">
              <span>本月销售额</span>
            </div>
            <div class="stat-number">¥{{ dashboardData.month.sales }}</div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 待处理数据 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header">
              <span>待处理</span>
            </div>
            <el-alert 
              :title="`待发货订单: ${dashboardData.pending.orders} 个`" 
              type="warning" 
              :closable="false"
              show-icon
            >
            </el-alert>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 销售趋势图表 -->
      <div class="chart-container" style="margin-top: 20px;">
        <el-card shadow="hover">
          <div slot="header">
            <span>近7天销售趋势</span>
          </div>
          <div id="salesChart" style="height: 400px;"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getDashboardData } from '@/api/stat';
import * as echarts from 'echarts';

export default {
  name: 'Dashboard',
  data() {
    return {
      dashboardData: {
        overview: {
          totalOrders: 0,
          totalSales: 0,
          totalUsers: 0,
          totalGoods: 0
        },
        today: {
          users: 0,
          orders: 0,
          sales: 0
        },
        month: {
          users: 0,
          orders: 0,
          sales: 0
        },
        pending: {
          orders: 0
        },
        salesTrend: []
      },
      chart: null
    };
  },
  mounted() {
    this.loadData();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    async loadData() {
      try {
        const res = await getDashboardData();
        if (res.success) {
          this.dashboardData = res.data;
          this.$nextTick(() => {
            this.initChart();
          });
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    },
    initChart() {
      const chartDom = document.getElementById('salesChart');
      if (!chartDom) return;
      
      this.chart = echarts.init(chartDom);
      
      const dates = this.dashboardData.salesTrend.map(item => item.date);
      const orders = this.dashboardData.salesTrend.map(item => item.orders);
      const sales = this.dashboardData.salesTrend.map(item => item.sales);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['订单数', '销售额']
        },
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: [
          {
            type: 'value',
            name: '订单数',
            position: 'left'
          },
          {
            type: 'value',
            name: '销售额',
            position: 'right'
          }
        ],
        series: [
          {
            name: '订单数',
            type: 'line',
            data: orders,
            smooth: true,
            itemStyle: {
              color: '#667eea'
            }
          },
          {
            name: '销售额',
            type: 'line',
            yAxisIndex: 1,
            data: sales,
            smooth: true,
            itemStyle: {
              color: '#f5576c'
            }
          }
        ]
      };
      
      this.chart.setOption(option);
      
      // 响应式
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    }
  }
};
</script>

<style scoped>
.stat-card {
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.stat-card .stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.stat-card .stat-value {
  font-size: 32px;
  font-weight: bold;
}

.stat-card .stat-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 60px;
  opacity: 0.3;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 10px;
  }
}
</style>
