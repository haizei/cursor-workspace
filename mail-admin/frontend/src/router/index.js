import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../components/Layout/Index.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '数据统计', icon: 'DataAnalysis' }
      },
      {
        path: 'goods',
        name: 'Goods',
        redirect: '/goods/list',
        meta: { title: '商品管理', icon: 'Goods' },
        children: [
          {
            path: 'list',
            name: 'GoodsList',
            component: () => import('../views/goods/GoodsList.vue'),
            meta: { title: '商品列表', icon: 'List' }
          },
          {
            path: 'edit/:id?',
            name: 'GoodsEdit',
            component: () => import('../views/goods/GoodsEdit.vue'),
            meta: { title: '商品编辑', hidden: true }
          }
        ]
      },
      {
        path: 'category',
        name: 'Category',
        redirect: '/category/list',
        meta: { title: '分类管理', icon: 'Menu' },
        children: [
          {
            path: 'list',
            name: 'CategoryList',
            component: () => import('../views/category/CategoryList.vue'),
            meta: { title: '分类列表', icon: 'List' }
          },
          {
            path: 'edit/:id?',
            name: 'CategoryEdit',
            component: () => import('../views/category/CategoryEdit.vue'),
            meta: { title: '分类编辑', hidden: true }
          }
        ]
      },
      {
        path: 'banner',
        name: 'Banner',
        redirect: '/banner/list',
        meta: { title: '轮播图管理', icon: 'Picture' },
        children: [
          {
            path: 'list',
            name: 'BannerList',
            component: () => import('../views/banner/BannerList.vue'),
            meta: { title: '轮播图列表', icon: 'List' }
          },
          {
            path: 'edit/:id?',
            name: 'BannerEdit',
            component: () => import('../views/banner/BannerEdit.vue'),
            meta: { title: '轮播图编辑', hidden: true }
          }
        ]
      },
      {
        path: 'order',
        name: 'Order',
        redirect: '/order/list',
        meta: { title: '订单管理', icon: 'Tickets' },
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('../views/order/OrderList.vue'),
            meta: { title: '订单列表', icon: 'List' }
          },
          {
            path: 'detail/:id',
            name: 'OrderDetail',
            component: () => import('../views/order/OrderDetail.vue'),
            meta: { title: '订单详情', hidden: true }
          }
        ]
      },
      {
        path: 'user',
        name: 'User',
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'User' },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('../views/user/UserList.vue'),
            meta: { title: '用户列表', icon: 'List' }
          },
          {
            path: 'detail/:id',
            name: 'UserDetail',
            component: () => import('../views/user/UserDetail.vue'),
            meta: { title: '用户详情', hidden: true }
          }
        ]
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/settings/Index.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
