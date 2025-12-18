import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.request.use(config => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      const currentPath = window.location.pathname
      
      // 清除token
      authStore.clearToken()
      
      // 根据当前路径判断跳转到哪个登录页
      if (currentPath.startsWith('/admin')) {
        // 如果已经在登录页，不要重复跳转
        if (currentPath !== '/admin/login') {
          window.location.href = '/admin/login'
        }
      } else {
        if (currentPath !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default {
  // 前台接口
  login(password) {
    return api.post('/login', { password })
  },
  
  getSiteConfig() {
    return api.get('/site-config')
  },
  
  getCategories() {
    return api.get('/categories')
  },
  
  getCategoryInfo(categoryId) {
    return api.get(`/categories/${categoryId}`)
  },
  
  getAlbums(categoryId) {
    return api.get('/albums', { params: { category_id: categoryId } })
  },
  
  getAlbumInfo(albumId) {
    return api.get(`/albums/${albumId}`)
  },
  
  getPhotos(albumId) {
    return api.get('/photos', { params: { album_id: albumId } })
  },
  
  // 后台接口
  adminLogin(password) {
    return api.post('/admin/login', { password })
  },
  
  getSettings() {
    return api.get('/admin/settings')
  },
  
  updateSettings(data) {
    return api.put('/admin/settings', data)
  },
  
  changePassword(data) {
    return api.post('/admin/change-password', data)
  },
  
  // 分类管理
  adminGetCategories() {
    return api.get('/admin/categories')
  },
  
  createCategory(data) {
    return api.post('/admin/categories', data)
  },
  
  updateCategory(id, data) {
    return api.put(`/admin/categories/${id}`, data)
  },
  
  deleteCategory(id) {
    return api.delete(`/admin/categories/${id}`)
  },
  
  sortCategories(orders) {
    return api.post('/admin/categories/sort', { orders })
  },
  
  // 相册管理
  adminGetAlbums() {
    return api.get('/admin/albums')
  },
  
  createAlbum(data) {
    return api.post('/admin/albums', data)
  },
  
  updateAlbum(id, data) {
    return api.put(`/admin/albums/${id}`, data)
  },
  
  deleteAlbum(id) {
    return api.delete(`/admin/albums/${id}`)
  },
  
  sortAlbums(orders) {
    return api.post('/admin/albums/sort', { orders })
  },
  
  // 照片管理
  adminGetPhotos(albumId) {
    return api.get('/admin/photos', { params: { album_id: albumId } })
  },
  
  uploadPhotos(formData, onProgress) {
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    })
  },
  
  deletePhotos(ids) {
    return api.delete('/admin/photos', { data: { ids } })
  },
  
  sortPhotos(orders) {
    return api.post('/admin/photos/sort', { orders })
  },
  
  getStats() {
    return api.get('/admin/stats')
  },
  
  // 上传封面图片
  uploadCover(formData) {
    return api.post('/admin/upload-cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
