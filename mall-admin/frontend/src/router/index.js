import Vue from 'vue';
import VueRouter from 'vue-router';
import { isLoggedIn } from '../utils/auth';

Vue.use(VueRouter);

// 解决重复点击路由报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'el-icon-s-home' }
      },
      {
        path: 'goods/list',
        name: 'GoodsList',
        component: () => import('../views/goods/GoodsList.vue'),
        meta: { title: '商品列表', icon: 'el-icon-goods' }
      },
      {
        path: 'goods/edit/:id?',
        name: 'GoodsEdit',
        component: () => import('../views/goods/GoodsEdit.vue'),
        meta: { title: '商品编辑', hidden: true }
      },
      {
        path: 'category/list',
        name: 'CategoryList',
        component: () => import('../views/category/CategoryList.vue'),
        meta: { title: '分类管理', icon: 'el-icon-menu' }
      },
      {
        path: 'banner/list',
        name: 'BannerList',
        component: () => import('../views/banner/BannerList.vue'),
        meta: { title: '轮播图管理', icon: 'el-icon-picture' }
      },
      {
        path: 'order/list',
        name: 'OrderList',
        component: () => import('../views/order/OrderList.vue'),
        meta: { title: '订单列表', icon: 'el-icon-s-order' }
      },
      {
        path: 'order/detail/:id',
        name: 'OrderDetail',
        component: () => import('../views/order/OrderDetail.vue'),
        meta: { title: '订单详情', hidden: true }
      },
      {
        path: 'user/list',
        name: 'UserList',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '用户列表', icon: 'el-icon-user' }
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 商城管理后台` : '商城管理后台';

  // 判断是否需要登录
  if (to.path !== '/login' && !isLoggedIn()) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn()) {
    next('/');
  } else {
    next();
  }
});

export default router;
