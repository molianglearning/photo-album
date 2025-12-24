<template>
  <div class="photo-page">
    <header class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>照片</h1>
    </header>
    
    <div v-if="albumInfo.name || albumInfo.description" class="album-intro">
      <h2 class="intro-title">{{ albumInfo.name }}</h2>
      <p v-if="albumInfo.description" class="intro-desc">{{ albumInfo.description }}</p>
    </div>
    
    <div class="content">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="photos.length === 0" class="empty">
        暂无照片
      </div>
      
      <div v-else class="photo-grid">
        <div
          v-for="(photo, index) in photos"
          :key="photo.id"
          class="photo-item"
          @click="openLightbox(index)"
        >
          <img
            :src="`/uploads/${photo.file_name}`"
            :alt="photo.original_name"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
    
    <!-- 简单的灯箱效果 -->
    <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
      <div 
        class="lightbox-content" 
        @click.stop
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <button class="close-btn" @click="closeLightbox">×</button>
        <button
          v-if="currentIndex > 0"
          class="nav-btn prev"
          @click="prevPhoto"
        >
          ‹
        </button>
        <img
          :src="`/uploads/${photos[currentIndex].file_name}`"
          :alt="photos[currentIndex].original_name"
          @load="handleImageLoad"
        />
        <button
          v-if="currentIndex < photos.length - 1"
          class="nav-btn next"
          @click="nextPhoto"
        >
          ›
        </button>
        <div class="photo-counter">
          {{ currentIndex + 1 }} / {{ photos.length }}
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
const photos = ref([])
const loading = ref(true)
const lightboxVisible = ref(false)
const currentIndex = ref(0)
const albumInfo = ref({
  name: '',
  description: ''
})

const loadAlbumInfo = async () => {
  try {
    const res = await api.getAlbumInfo(route.params.albumId)
    albumInfo.value = res.data
  } catch (err) {
    console.error('加载相册信息失败:', err)
  }
}

const loadPhotos = async () => {
  try {
    const res = await api.getPhotos(route.params.albumId)
    photos.value = res.data
  } catch (err) {
    console.error('加载照片失败:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const touchStartX = ref(0)
const touchEndX = ref(0)
const imageLoaded = ref(false)

const openLightbox = (index) => {
  currentIndex.value = index
  lightboxVisible.value = true
  imageLoaded.value = false
  document.body.style.overflow = 'hidden'
}

const handleImageLoad = () => {
  imageLoaded.value = true
}

const closeLightbox = () => {
  lightboxVisible.value = false
  document.body.style.overflow = ''
}

const prevPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextPhoto = () => {
  if (currentIndex.value < photos.value.length - 1) {
    currentIndex.value++
  }
}

const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const diff = touchStartX.value - touchEndX.value
  const threshold = 50 // 滑动阈值
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // 向左滑动，显示下一张
      nextPhoto()
    } else {
      // 向右滑动，显示上一张
      prevPhoto()
    }
  }
  
  touchStartX.value = 0
  touchEndX.value = 0
}

onMounted(() => {
  loadAlbumInfo()
  loadPhotos()
})
</script>

<style scoped>
.photo-page {
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

.album-intro {
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

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

/* 手机端响应式 */
@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }
}

/* 平板端 */
@media (min-width: 481px) and (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
}

/* 桌面端 */
@media (min-width: 769px) {
  .photo-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
}

.photo-item {
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: #f0f0f0;
  position: relative;
}

.photo-item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-top-color: #999;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 1;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 灯箱样式 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 0;
}

.lightbox-content img {
  width: 100%;
  max-height: 100vh;
  object-fit: contain;
  display: block;
  margin: auto;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 40px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  line-height: 1;
  z-index: 1001;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  font-size: 48px;
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.nav-btn.prev {
  left: 20px;
}

.nav-btn.next {
  right: 20px;
}

.nav-btn:active {
  background: rgba(255, 255, 255, 0.3);
}

.photo-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1001;
}

/* 手机端隐藏导航按钮，使用滑动 */
@media (max-width: 768px) {
  .nav-btn {
    display: none;
  }
}
</style>
