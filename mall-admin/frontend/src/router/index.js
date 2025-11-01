import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { getToken } from '@/utils/auth';

Vue.use(VueRouter);

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '数据统计', icon: 'el-icon-s-data' }
      },
      // 商品管理
      {
        path: 'goods',
        name: 'Goods',
        redirect: '/goods/list',
        meta: { title: '商品管理', icon: 'el-icon-goods' },
        children: [
          {
            path: 'list',
            name: 'GoodsList',
            component: () => import('@/views/goods/GoodsList.vue'),
            meta: { title: '商品列表' }
          },
          {
            path: 'edit/:id?',
            name: 'GoodsEdit',
            component: () => import('@/views/goods/GoodsEdit.vue'),
            meta: { title: '商品编辑', hidden: true }
          }
        ]
      },
      // 分类管理
      {
        path: 'category',
        name: 'Category',
        redirect: '/category/list',
        meta: { title: '分类管理', icon: 'el-icon-menu' },
        children: [
          {
            path: 'list',
            name: 'CategoryList',
            component: () => import('@/views/category/CategoryList.vue'),
            meta: { title: '分类列表' }
          }
        ]
      },
      // 轮播图管理
      {
        path: 'banner',
        name: 'Banner',
        redirect: '/banner/list',
        meta: { title: '轮播图管理', icon: 'el-icon-picture' },
        children: [
          {
            path: 'list',
            name: 'BannerList',
            component: () => import('@/views/banner/BannerList.vue'),
            meta: { title: '轮播图列表' }
          }
        ]
      },
      // 订单管理
      {
        path: 'order',
        name: 'Order',
        redirect: '/order/list',
        meta: { title: '订单管理', icon: 'el-icon-s-order' },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/order/OrderList.vue'),
            meta: { title: '订单列表' }
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('@/views/order/OrderDetail.vue'),
            meta: { title: '订单详情', hidden: true }
          }
        ]
      },
      // 用户管理
      {
        path: 'user',
        name: 'User',
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'el-icon-user' },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/views/user/UserList.vue'),
            meta: { title: '用户列表' }
          },
          {
            path: 'detail/:id',
            name: 'UserDetail',
            component: () => import('@/views/user/UserDetail.vue'),
            meta: { title: '用户详情', hidden: true }
          }
        ]
      },
      // 设置
      {
        path: 'settings',
        name: 'Settings',
        redirect: '/settings/password',
        meta: { title: '系统设置', icon: 'el-icon-setting' },
        children: [
          {
            path: 'password',
            name: 'ChangePassword',
            component: () => import('@/views/settings/ChangePassword.vue'),
            meta: { title: '修改密码' }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/dashboard'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 商城管理后台` : '商城管理后台';
  
  const hasToken = getToken();
  
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      // 判断是否已获取用户信息
      const hasUserInfo = store.getters.userInfo;
      if (hasUserInfo) {
        next();
      } else {
        try {
          await store.dispatch('user/getInfo');
          next();
        } catch (error) {
          await store.dispatch('user/resetToken');
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

export default router;
