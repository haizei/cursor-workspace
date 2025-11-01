import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/main.scss';

Vue.config.productionTip = false;

// 使用Element UI
Vue.use(ElementUI);

// 全局过滤器
Vue.filter('formatDate', function(value) {
  if (!value) return '';
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
});

Vue.filter('formatMoney', function(value) {
  if (value === null || value === undefined) return '¥0.00';
  return '¥' + parseFloat(value).toFixed(2);
});

Vue.filter('orderStatus', function(status) {
  const statusMap = {
    0: '待支付',
    1: '待发货',
    2: '已发货',
    3: '已完成',
    4: '已关闭'
  };
  return statusMap[status] || '未知';
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
