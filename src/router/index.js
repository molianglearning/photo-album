import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/frontend/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/frontend/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/albums/:categoryId',
    name: 'AlbumList',
    component: () => import('@/views/frontend/AlbumList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/photos/:albumId',
    name: 'PhotoGallery',
    component: () => import('@/views/frontend/PhotoGallery.vue'),
    meta: { requiresAuth: true }
  },
  // 后台路由
  {
    path: '/admin',
    redirect: '/admin/login'
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/AdminLogin.vue')
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'SiteSettings',
    component: () => import('@/views/admin/SiteSettings.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/password',
    name: 'PasswordManage',
    component: () => import('@/views/admin/PasswordManage.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/categories',
    name: 'CategoryManage',
    component: () => import('@/views/admin/CategoryManage.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/albums',
    name: 'AlbumManage',
    component: () => import('@/views/admin/AlbumManage.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/photos',
    name: 'PhotoManage',
    component: () => import('@/views/admin/PhotoManage.vue'),
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 需要普通用户认证的页面
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('需要认证，跳转到登录页')
    return next('/login')
  }
  
  // 需要管理员认证的页面
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      console.log('需要管理员认证，但未登录，跳转到管理员登录页')
      return next('/admin/login')
    }
    if (!authStore.isAdmin) {
      console.log('需要管理员权限，但当前不是管理员')
      return next('/admin/login')
    }
  }
  
  // 已登录的普通用户访问登录页，跳转到首页
  if (to.path === '/login' && authStore.isAuthenticated && !authStore.isAdmin) {
    return next('/home')
  }
  
  // 已登录的管理员访问管理员登录页，跳转到仪表板
  if (to.path === '/admin/login' && authStore.isAuthenticated && authStore.isAdmin) {
    return next('/admin/dashboard')
  }
  
  next()
})

export default router
