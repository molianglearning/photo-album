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
        <router-link to="/admin/categories" class="menu-item">
          <span>分类管理</span>
          <span class="arrow">›</span>
        </router-link>
        <router-link to="/admin/albums" class="menu-item">
          <span>相册管理</span>
          <span class="arrow">›</span>
        </router-link>
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

const loadStats = async () => {
  try {
    const res = await api.getStats()
    stats.value = res.data
  } catch (err) {
    console.error('加载统计失败:', err)
  }
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
}
</style>
