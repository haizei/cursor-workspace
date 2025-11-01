import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/main.css';

Vue.config.productionTip = false;

// 使用Element UI
Vue.use(ElementUI);

// 全局过滤器
Vue.filter('formatDate', function(value) {
  if (!value) return '';
  const date = new Date(value);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
});

Vue.filter('formatPrice', function(value) {
  if (!value && value !== 0) return '0.00';
  return parseFloat(value).toFixed(2);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
