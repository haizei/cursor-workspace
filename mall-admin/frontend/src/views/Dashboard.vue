<template>
  <div class="dashboard-container">
    <h2 class="page-title">数据统计</h2>
    
    <!-- 核心指标卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #409EFF;">
              <i class="el-icon-s-order"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.overview.totalOrders || 0 }}</div>
              <div class="stat-label">订单总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #67C23A;">
              <i class="el-icon-money"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ dashboardData.overview.totalSales || 0 }}</div>
              <div class="stat-label">销售总额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #E6A23C;">
              <i class="el-icon-user"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.overview.totalUsers || 0 }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="color: #F56C6C;">
              <i class="el-icon-goods"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ dashboardData.overview.totalGoods || 0 }}</div>
              <div class="stat-label">商品总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 今日/本月数据 -->
    <el-row :gutter="20" class="time-stats">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>今日数据</span>
          </div>
          <div class="time-stat-item">
            <span>新增用户：</span>
            <strong>{{ dashboardData.today.users || 0 }}</strong>
          </div>
          <div class="time-stat-item">
            <span>订单数量：</span>
            <strong>{{ dashboardData.today.orders || 0 }}</strong>
          </div>
          <div class="time-stat-item">
            <span>销售额：</span>
            <strong class="text-success">¥{{ dashboardData.today.sales || 0 }}</strong>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>本月数据</span>
          </div>
          <div class="time-stat-item">
            <span>订单数量：</span>
            <strong>{{ dashboardData.month.orders || 0 }}</strong>
          </div>
          <div class="time-stat-item">
            <span>销售额：</span>
            <strong class="text-success">¥{{ dashboardData.month.sales || 0 }}</strong>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表 -->
    <el-row :gutter="20" class="chart-section">
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>销售趋势（最近7天）</span>
          </div>
          <div ref="salesChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>订单状态分布</span>
          </div>
          <div ref="orderStatusChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 热销商品 -->
    <el-card class="hot-goods-section">
      <div slot="header">
        <span>热销商品 Top10</span>
      </div>
      <el-table :data="dashboardData.hotGoods" stripe>
        <el-table-column type="index" label="排名" width="60" />
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.main_image" class="goods-image" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="orderCount" label="订单数" width="100" />
      </el-table>
    </el-card>
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
        overview: {},
        today: {},
        month: {},
        orderStatus: [],
        salesTrend: [],
        hotGoods: []
      },
      salesChart: null,
      orderStatusChart: null
    };
  },
  
  mounted() {
    this.loadData();
  },
  
  beforeDestroy() {
    if (this.salesChart) {
      this.salesChart.dispose();
    }
    if (this.orderStatusChart) {
      this.orderStatusChart.dispose();
    }
  },
  
  methods: {
    async loadData() {
      try {
        const res = await getDashboardData();
        this.dashboardData = res.data;
        
        this.$nextTick(() => {
          this.initSalesChart();
          this.initOrderStatusChart();
        });
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    },
    
    initSalesChart() {
      if (!this.$refs.salesChart) return;
      
      this.salesChart = echarts.init(this.$refs.salesChart);
      
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
          boundaryGap: false,
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
              color: '#409EFF'
            }
          },
          {
            name: '销售额',
            type: 'line',
            yAxisIndex: 1,
            data: sales,
            smooth: true,
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      };
      
      this.salesChart.setOption(option);
    },
    
    initOrderStatusChart() {
      if (!this.$refs.orderStatusChart) return;
      
      this.orderStatusChart = echarts.init(this.$refs.orderStatusChart);
      
      const statusMap = {
        0: '待支付',
        1: '待发货',
        2: '已发货',
        3: '已完成',
        4: '已关闭'
      };
      
      const data = this.dashboardData.orderStatus.map(item => ({
        name: statusMap[item.status],
        value: item.count
      }));
      
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      
      this.orderStatusChart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  .page-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
    color: #303133;
  }
  
  .stat-cards {
    margin-bottom: 20px;
    
    .stat-card {
      /deep/ .el-card__body {
        padding: 20px;
      }
      
      .stat-content {
        display: flex;
        align-items: center;
        
        .stat-icon {
          font-size: 48px;
          margin-right: 20px;
        }
        
        .stat-info {
          flex: 1;
          
          .stat-value {
            font-size: 28px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 8px;
          }
          
          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }
  
  .time-stats {
    margin-bottom: 20px;
    
    .time-stat-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      span {
        color: #606266;
      }
      
      strong {
        font-size: 18px;
        color: #303133;
        
        &.text-success {
          color: #67C23A;
        }
      }
    }
  }
  
  .chart-section {
    margin-bottom: 20px;
  }
  
  .hot-goods-section {
    .goods-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}
</style>
