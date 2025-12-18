<template>
  <div class="album-page">
    <header class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>相册列表</h1>
    </header>
    
    <div v-if="categoryInfo.name || categoryInfo.description" class="category-intro">
      <h2 class="intro-title">{{ categoryInfo.name }}</h2>
      <p v-if="categoryInfo.description" class="intro-desc">{{ categoryInfo.description }}</p>
    </div>
    
    <div class="content">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="albums.length === 0" class="empty">
        暂无相册
      </div>
      
      <div v-else class="album-list">
        <div
          v-for="album in albums"
          :key="album.id"
          class="card album-item"
          @click="goToPhotos(album.id)"
        >
          <div class="img-wrapper" style="padding-top: 60%;">
            <img
              v-if="album.cover_image"
              :src="`/uploads/${album.cover_image}`"
              :alt="album.name"
            />
          </div>
          <div class="card-body">
            <h3>{{ album.name }}</h3>
            <p v-if="album.description">{{ album.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'

const router = useRouter()
const route = useRoute()
const albums = ref([])
const loading = ref(true)
const categoryInfo = ref({
  name: '',
  description: ''
})

const loadCategoryInfo = async () => {
  try {
    const res = await api.getCategoryInfo(route.params.categoryId)
    categoryInfo.value = res.data
  } catch (err) {
    console.error('加载分类信息失败:', err)
  }
}

const loadAlbums = async () => {
  try {
    const res = await api.getAlbums(route.params.categoryId)
    albums.value = res.data
  } catch (err) {
    console.error('加载相册失败:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goToPhotos = (albumId) => {
  router.push(`/photos/${albumId}`)
}

onMounted(() => {
  loadCategoryInfo()
  loadAlbums()
})
</script>

<style scoped>
.album-page {
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  color: #333;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
}

.category-intro {
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

.album-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

/* 手机端响应式 */
@media (max-width: 480px) {
  .album-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

/* 平板端 */
@media (min-width: 481px) and (max-width: 768px) {
  .album-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

/* 桌面端 */
@media (min-width: 769px) {
  .album-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

.album-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.album-item:active {
  transform: scale(0.98);
}

.img-wrapper {
  position: relative;
  background: #f0f0f0;
}

.img-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 12px;
}

.card-body h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body p {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 桌面端文字大小 */
@media (min-width: 769px) {
  .card-body {
    padding: 16px;
  }
  
  .card-body h3 {
    font-size: 16px;
  }
  
  .card-body p {
    font-size: 14px;
  }
}
</style>
