<template>
  <div class="admin-page">
    <header class="header">
      <h1>管理后台</h1>
      <button class="logout-btn" @click="handleLogout">退出</button>
    </header>
    
    <div class="content">
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">{{ stats.categories }}</div>
          <div class="stat-label">分类数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.albums }}</div>
          <div class="stat-label">相册数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.photos }}</div>
          <div class="stat-label">照片数</div>
        </div>
      </div>
      
      <div class="menu-list">
        <router-link to="/admin/settings" class="menu-item">
          <span>站点设置</span>
          <span class="arrow">›</span>
        </router-link>
        <router-link to="/admin/password" class="menu-item">
          <span>密码管理</span>
          <span class="arrow">›</span>
        </router-link>
        
        <!-- 分类管理（可展开） -->
        <div class="menu-section">
          <div class="menu-item section-header" @click="toggleCategories">
            <span>📁 分类管理</span>
            <span class="arrow" :class="{ expanded: categoriesExpanded }">›</span>
          </div>
          
          <div v-if="categoriesExpanded" class="sub-menu">
            <!-- 分类操作入口 -->
            <router-link to="/admin/categories" class="sub-menu-item manage-link">
              <span>⚙️ 管理分类</span>
              <span class="arrow">›</span>
            </router-link>
            
            <div v-if="categoriesLoading" class="loading-hint">加载中...</div>
            <div v-else-if="categories.length === 0" class="empty-hint">暂无分类</div>
            
            <!-- 分类列表 -->
            <div v-for="category in categories" :key="category.id" class="category-item">
              <div class="category-header" @click="toggleCategory(category.id)">
                <div class="category-info">
                  <img v-if="category.cover_image" :src="`/uploads/${category.cover_image}`" class="category-cover" />
                  <span class="category-name">{{ category.name }}</span>
                  <span class="album-count">({{ getCategoryAlbumCount(category.id) }})</span>
                </div>
                <span class="arrow" :class="{ expanded: expandedCategories.includes(category.id) }">›</span>
              </div>
              
              <!-- 该分类下的相册 -->
              <div v-if="expandedCategories.includes(category.id)" class="album-list">
                <router-link 
                  :to="`/admin/albums?category=${category.id}`" 
                  class="album-item manage-link"
                >
                  <span>➕ 添加/管理相册</span>
                </router-link>
                
                <div v-if="getCategoryAlbums(category.id).length === 0" class="empty-hint">
                  该分类下暂无相册
                </div>
                
                <router-link
                  v-for="album in getCategoryAlbums(category.id)"
                  :key="album.id"
                  :to="`/admin/photos?album=${album.id}`"
                  class="album-item"
                >
                  <img v-if="album.cover_image" :src="`/uploads/${album.cover_image}`" class="album-cover" />
                  <div class="album-info">
                    <span class="album-name">{{ album.name }}</span>
                    <span class="photo-count">{{ album.photo_count || 0 }} 张照片</span>
                  </div>
                  <span class="arrow">›</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        
        <router-link to="/admin/photos" class="menu-item">
          <span>照片管理</span>
          <span class="arrow">›</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  categories: 0,
  albums: 0,
  photos: 0
})

// 分类和相册数据
const categories = ref([])
const albums = ref([])
const categoriesLoading = ref(false)
const categoriesExpanded = ref(false)
const expandedCategories = ref([])

const loadStats = async () => {
  try {
    const res = await api.getStats()
    stats.value = res.data
  } catch (err) {
    console.error('加载统计失败:', err)
  }
}

// 加载分类和相册数据
const loadCategoriesAndAlbums = async () => {
  if (categories.value.length > 0) return // 已加载过
  
  categoriesLoading.value = true
  try {
    const [catRes, albumRes] = await Promise.all([
      api.adminGetCategories(),
      api.adminGetAlbums()
    ])
    categories.value = catRes.data
    albums.value = albumRes.data
  } catch (err) {
    console.error('加载分类和相册失败:', err)
  } finally {
    categoriesLoading.value = false
  }
}

// 切换分类管理展开状态
const toggleCategories = () => {
  categoriesExpanded.value = !categoriesExpanded.value
  if (categoriesExpanded.value) {
    loadCategoriesAndAlbums()
  }
}

// 切换单个分类的展开状态
const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

// 获取分类下的相册
const getCategoryAlbums = (categoryId) => {
  return albums.value.filter(a => a.category_id === categoryId)
}

// 获取分类下的相册数量
const getCategoryAlbumCount = (categoryId) => {
  return getCategoryAlbums(categoryId).length
}

const handleLogout = () => {
  authStore.clearToken()
  router.push('/admin/login')
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
}

.logout-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
}

.content {
  padding: 16px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.menu-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  color: #333;
  transition: background 0.2s;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f5f5f5;
}

.arrow {
  color: #999;
  font-size: 20px;
  transition: transform 0.2s;
}

.arrow.expanded {
  transform: rotate(90deg);
}

/* 分类管理展开区域 */
.menu-section {
  border-bottom: 1px solid #f0f0f0;
}

.section-header {
  background: #fafafa;
  font-weight: 500;
}

.sub-menu {
  background: #f8f8f8;
  border-top: 1px solid #eee;
}

.sub-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 12px 32px;
  text-decoration: none;
  color: #333;
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.sub-menu-item:active {
  background: #f0f0f0;
}

.manage-link {
  color: #1976d2;
  font-size: 14px;
}

.loading-hint,
.empty-hint {
  padding: 12px 32px;
  color: #999;
  font-size: 14px;
}

/* 分类项 */
.category-item {
  border-bottom: 1px solid #eee;
}

.category-item:last-child {
  border-bottom: none;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 12px 32px;
  cursor: pointer;
  transition: background 0.2s;
}

.category-header:active {
  background: #f0f0f0;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.category-cover {
  width: 40px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
}

.category-name {
  font-weight: 500;
}

.album-count {
  color: #999;
  font-size: 13px;
}

/* 相册列表 */
.album-list {
  background: #fff;
  border-top: 1px solid #eee;
}

.album-item {
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 48px;
  text-decoration: none;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
  gap: 10px;
  transition: background 0.2s;
}

.album-item:last-child {
  border-bottom: none;
}

.album-item:active {
  background: #f5f5f5;
}

.album-item.manage-link {
  color: #1976d2;
  font-size: 13px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.album-cover {
  width: 36px;
  height: 27px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
}

.album-info {
  flex: 1;
  min-width: 0;
}

.album-name {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.photo-count {
  font-size: 12px;
  color: #999;
}
</style>
