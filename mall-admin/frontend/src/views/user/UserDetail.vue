<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户详情</h2>
    </div>
    
    <div class="page-content" v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">{{ userData.id }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="userData.status ? 'success' : 'danger'">
              {{ userData.status ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="昵称">{{ userData.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ userData.phone || '未绑定' }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ ['未知', '男', '女'][userData.gender] }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ userData.create_time | formatDate }}
          </el-descriptions-item>
          <el-descriptions-item label="订单数量">{{ userData.order_count }}</el-descriptions-item>
          <el-descriptions-item label="收货地址数">{{ userData.address_count }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      
      <div style="margin-top: 20px;">
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserDetail } from '@/api/user';

export default {
  name: 'UserDetail',
  
  data() {
    return {
      userData: {},
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
        const res = await getUserDetail(this.$route.params.id);
        this.userData = res.data;
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
