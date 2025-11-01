<template>
  <div class="page-container">
    <div class="page-card" v-loading="loading">
      <h3 style="margin-bottom: 20px;">用户详情</h3>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>基本信息</span>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
              <el-avatar 
                v-if="userData.avatar" 
                :src="userData.avatar"
                :size="100"
              ></el-avatar>
              <el-avatar v-else :size="100" icon="el-icon-user-solid"></el-avatar>
            </div>
            
            <el-descriptions :column="1" border>
              <el-descriptions-item label="用户ID">{{ userData.id }}</el-descriptions-item>
              <el-descriptions-item label="昵称">{{ userData.nickname || '-' }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ userData.phone || '-' }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ getGenderText(userData.gender) }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="userData.status ? 'success' : 'danger'" size="small">
                  {{ userData.status ? '启用' : '禁用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="注册时间">{{ userData.create_time }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>统计信息</span>
            </div>
            
            <div style="padding: 20px;">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="stat-item">
                    <div class="stat-label">订单数量</div>
                    <div class="stat-value">{{ userData.orderCount }}</div>
                  </div>
                </el-col>
                
                <el-col :span="12">
                  <div class="stat-item">
                    <div class="stat-label">收货地址</div>
                    <div class="stat-value">{{ userData.addressCount }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <div style="margin-top: 20px; text-align: right;">
        <el-button @click="$router.back()">返回</el-button>
        <el-button 
          :type="userData.status ? 'danger' : 'success'" 
          @click="handleToggleStatus"
        >
          {{ userData.status ? '禁用' : '启用' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserDetail, setUserStatus } from '@/api/user';

export default {
  name: 'UserDetail',
  data() {
    return {
      userData: {
        orderCount: 0,
        addressCount: 0
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
        const res = await getUserDetail(this.$route.params.id);
        if (res.success) {
          this.userData = res.data;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    getGenderText(gender) {
      const genderMap = {
        0: '未知',
        1: '男',
        2: '女'
      };
      return genderMap[gender] || '未知';
    },
    handleToggleStatus() {
      const newStatus = this.userData.status ? 0 : 1;
      const text = newStatus ? '启用' : '禁用';
      
      this.$confirm(`确定要${text}该用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await setUserStatus({ id: this.userData.id, status: newStatus });
          this.$message.success(`${text}成功`);
          this.loadData();
        } catch (error) {
          console.error('设置状态失败:', error);
        }
      });
    }
  }
};
</script>

<style scoped>
.stat-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
}
</style>
