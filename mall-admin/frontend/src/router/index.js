import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { getToken } from '@/utils/auth';

Vue.use(VueRouter);

// 导入页面组件
import Layout from '@/components/Layout/Index.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';

// 商品管理
import GoodsList from '@/views/goods/GoodsList.vue';
import GoodsEdit from '@/views/goods/GoodsEdit.vue';

// 分类管理
import CategoryList from '@/views/category/CategoryList.vue';

// 轮播图管理
import BannerList from '@/views/banner/BannerList.vue';

// 订单管理
import OrderList from '@/views/order/OrderList.vue';
import OrderDetail from '@/views/order/OrderDetail.vue';

// 用户管理
import UserList from '@/views/user/UserList.vue';
import UserDetail from '@/views/user/UserDetail.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', noAuth: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '数据统计', icon: 'el-icon-s-data' }
      },
      // 商品管理
      {
        path: 'goods',
        name: 'GoodsManage',
        meta: { title: '商品管理', icon: 'el-icon-goods' },
        redirect: '/goods/list',
        children: [
          {
            path: 'list',
            name: 'GoodsList',
            component: GoodsList,
            meta: { title: '商品列表' }
          },
          {
            path: 'add',
            name: 'GoodsAdd',
            component: GoodsEdit,
            meta: { title: '新增商品' }
          },
          {
            path: 'edit/:id',
            name: 'GoodsEdit',
            component: GoodsEdit,
            meta: { title: '编辑商品' }
          }
        ]
      },
      // 分类管理
      {
        path: 'category',
        name: 'CategoryManage',
        meta: { title: '分类管理', icon: 'el-icon-menu' },
        children: [
          {
            path: 'list',
            name: 'CategoryList',
            component: CategoryList,
            meta: { title: '分类列表' }
          }
        ]
      },
      // 轮播图管理
      {
        path: 'banner',
        name: 'BannerManage',
        meta: { title: '轮播图管理', icon: 'el-icon-picture' },
        children: [
          {
            path: 'list',
            name: 'BannerList',
            component: BannerList,
            meta: { title: '轮播图列表' }
          }
        ]
      },
      // 订单管理
      {
        path: 'order',
        name: 'OrderManage',
        meta: { title: '订单管理', icon: 'el-icon-s-order' },
        redirect: '/order/list',
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: OrderList,
            meta: { title: '订单列表' }
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: OrderDetail,
            meta: { title: '订单详情' }
          }
        ]
      },
      // 用户管理
      {
        path: 'user',
        name: 'UserManage',
        meta: { title: '用户管理', icon: 'el-icon-user' },
        redirect: '/user/list',
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: UserList,
            meta: { title: '用户列表' }
          },
          {
            path: 'detail/:id',
            name: 'UserDetail',
            component: UserDetail,
            meta: { title: '用户详情' }
          }
        ]
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
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 商城管理后台` : '商城管理后台';
  
  // 检查是否需要登录
  if (!to.meta.noAuth) {
    const token = getToken();
    if (!token) {
      next('/login');
      return;
    }
  }
  
  next();
});

export default router;
