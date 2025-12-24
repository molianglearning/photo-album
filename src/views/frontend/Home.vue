<template>
  <div class="home-page">
    <header class="header">
      <h1>相册分类</h1>
    </header>
    
    <div v-if="siteConfig.site_title || siteConfig.site_description" class="site-intro">
      <h2 class="intro-title">{{ siteConfig.site_title }}</h2>
      <p class="intro-desc">{{ siteConfig.site_description }}</p>
    </div>
    
    <div class="content">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="categories.length === 0" class="empty">
        暂无分类
      </div>
      
      <div v-else class="category-list">
        <div
          v-for="category in categories"
          :key="category.id"
          class="card category-item"
          @click="goToAlbums(category.id)"
        >
          <div class="img-wrapper">
            <img
              v-if="category.cover_image"
              :src="`/uploads/${category.cover_image}`"
              :alt="category.name"
              loading="lazy"
            />
          </div>
          <div class="card-body">
            <h3>{{ category.name }}</h3>
            <p v-if="category.description">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const categories = ref([])
const loading = ref(true)
const siteConfig = ref({
  site_title: '',
  site_description: ''
})

const loadSiteConfig = async () => {
  try {
    const res = await api.getSiteConfig()
    siteConfig.value = res.data
  } catch (err) {
    console.error('加载站点配置失败:', err)
  }
}

const loadCategories = async () => {
  try {
    const res = await api.getCategories()
    categories.value = res.data
  } catch (err) {
    console.error('加载分类失败:', err)
  } finally {
    loading.value = false
  }
}

const goToAlbums = (categoryId) => {
  router.push(`/albums/${categoryId}`)
}

onMounted(() => {
  loadSiteConfig()
  loadCategories()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #fff;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
}

.site-intro {
  background: #fff;
  padding: 24px 20px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.intro-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.intro-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.content {
  padding: 16px;
}

.loading,
.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 手机端响应式 */
@media (max-width: 480px) {
  .category-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

/* 平板端 */
@media (min-width: 481px) and (max-width: 768px) {
  .category-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

/* 桌面端 */
@media (min-width: 769px) {
  .category-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

.category-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.category-item:active {
  transform: scale(0.98);
}

.img-wrapper {
  height: 144px;
  background: #f0f0f0;
  overflow: hidden;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-body {
  height: 48px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-body h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.card-body p {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
  margin: 2px 0 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 桌面端文字大小 */
@media (min-width: 769px) {
  .card-body {
    padding: 10px 16px;
  }
  
  .card-body h3 {
    font-size: 16px;
  }
  
  .card-body p {
    font-size: 13px;
  }
}
</style>
