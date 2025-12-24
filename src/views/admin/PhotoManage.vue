<template>
  <div class="admin-page">
    <header class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>{{ selectedAlbumName() ? `${selectedAlbumName()} - 照片` : '照片管理' }}</h1>
    </header>
    
    <div class="content">
      <div class="album-selector">
        <select v-model="selectedAlbumId" class="input" @change="loadPhotos">
          <option value="">请选择相册</option>
          <option
            v-for="album in albums"
            :key="album.id"
            :value="album.id"
          >
            {{ album.name }}
          </option>
        </select>
      </div>
      
      <div v-if="selectedAlbumId" class="upload-section">
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          style="display: none"
          @change="handleFileSelect"
        />
        <button class="btn" @click="$refs.fileInput.click()" :disabled="uploadProgress > 0 && uploadProgress < 100">
          {{ uploadProgress > 0 && uploadProgress < 100 ? '上传中...' : '选择照片上传' }}
        </button>
        
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress">
          <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
          <span class="progress-text">
            {{ uploadProgress <= 30 ? '压缩中...' : '上传中...' }} {{ uploadProgress }}%
          </span>
        </div>
        
        <p class="hint">支持批量上传，所有图片自动压缩到 2MB 以内</p>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="!selectedAlbumId" class="empty">
        请先选择一个相册
      </div>
      
      <div v-else-if="photos.length === 0" class="empty">
        该相册暂无照片
      </div>
      
      <div v-else>
        <div class="actions-bar">
          <button
            v-if="selectedPhotos.length > 0"
            class="btn-delete"
            @click="deleteSelected"
          >
            删除选中 ({{ selectedPhotos.length }})
          </button>
        </div>
        
        <div class="photo-grid">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="photo-item"
            :class="{ selected: selectedPhotos.includes(photo.id) }"
            @click="toggleSelect(photo.id)"
          >
            <img
              :src="`/uploads/${photo.file_name}`"
              :alt="photo.original_name"
              loading="lazy"
              decoding="async"
            />
            <div v-if="selectedPhotos.includes(photo.id)" class="check-mark">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'
import imageCompression from 'browser-image-compression'

const router = useRouter()
const route = useRoute()

const albums = ref([])
const photos = ref([])
const selectedAlbumId = ref('')
const selectedPhotos = ref([])
const loading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

// 获取当前选中相册的名称
const selectedAlbumName = () => {
  if (!selectedAlbumId.value) return null
  const album = albums.value.find(a => a.id === parseInt(selectedAlbumId.value))
  return album ? album.name : null
}

const loadAlbums = async () => {
  try {
    const res = await api.adminGetAlbums()
    albums.value = res.data
    
    // 如果 URL 有 album 参数，自动选中
    if (route.query.album) {
      selectedAlbumId.value = route.query.album
      loadPhotos()
    }
  } catch (err) {
    console.error('加载相册失败:', err)
  }
}

// 监听 URL 参数变化
watch(() => route.query.album, (newAlbumId) => {
  if (newAlbumId && newAlbumId !== selectedAlbumId.value) {
    selectedAlbumId.value = newAlbumId
    loadPhotos()
  }
})

const loadPhotos = async () => {
  if (!selectedAlbumId.value) {
    photos.value = []
    return
  }
  
  loading.value = true
  selectedPhotos.value = []
  
  try {
    const res = await api.adminGetPhotos(selectedAlbumId.value)
    photos.value = res.data
  } catch (err) {
    console.error('加载照片失败:', err)
  } finally {
    loading.value = false
  }
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return
  
  uploadProgress.value = 1
  
  try {
    // 统一压缩配置：所有图片压缩到 2MB 以内
    const compressOptions = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8
    }
    
    const compressedFiles = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      uploadProgress.value = Math.round(((i + 0.5) / files.length) * 50)
      
      try {
        // 所有图片都压缩，确保上传成功
        console.log(`压缩 ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        const compressedFile = await imageCompression(file, compressOptions)
        compressedFiles.push(compressedFile)
        console.log(`完成: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
      } catch (err) {
        console.error(`压缩失败 ${file.name}:`, err)
        // 压缩失败，如果原文件小于 5MB 则使用原文件
        if (file.size < 5 * 1024 * 1024) {
          compressedFiles.push(file)
        } else {
          alert(`${file.name} 压缩失败且文件过大，已跳过`)
        }
      }
    }
    
    if (compressedFiles.length === 0) {
      alert('没有可上传的图片')
      uploadProgress.value = 0
      return
    }
    
    uploadProgress.value = 50
    
    // 创建表单数据
    const formData = new FormData()
    formData.append('album_id', selectedAlbumId.value)
    compressedFiles.forEach((file, index) => {
      // 确保文件有正确的名称和类型
      const fileName = `photo_${Date.now()}_${index}.jpg`
      const blob = new Blob([file], { type: 'image/jpeg' })
      formData.append('photos', blob, fileName)
    })
    
    console.log('准备上传', compressedFiles.length, '个文件到相册', selectedAlbumId.value)
    
    // 上传
    await api.uploadPhotos(formData, (progressEvent) => {
      const uploadPercent = Math.round((progressEvent.loaded * 50) / progressEvent.total)
      uploadProgress.value = 50 + uploadPercent
    })
    
    uploadProgress.value = 100
    setTimeout(() => {
      uploadProgress.value = 0
    }, 1000)
    
    event.target.value = ''
    loadPhotos()
  } catch (err) {
    console.error('上传失败:', err)
    alert(err.response?.data?.message || err.message || '上传失败')
    uploadProgress.value = 0
  }
}

const toggleSelect = (photoId) => {
  const index = selectedPhotos.value.indexOf(photoId)
  if (index > -1) {
    selectedPhotos.value.splice(index, 1)
  } else {
    selectedPhotos.value.push(photoId)
  }
}

const deleteSelected = async () => {
  if (!confirm(`确定要删除选中的 ${selectedPhotos.value.length} 张照片吗？`)) {
    return
  }
  
  try {
    await api.deletePhotos(selectedPhotos.value)
    loadPhotos()
  } catch (err) {
    alert(err.response?.data?.message || '删除失败')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadAlbums()
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

.content {
  padding: 16px;
}

.album-selector {
  margin-bottom: 16px;
}

select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.upload-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.upload-section .hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}

.upload-section .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress {
  margin-top: 12px;
  height: 32px;
  background: #f0f0f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #333;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  mix-blend-mode: difference;
}

.loading,
.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.actions-bar {
  margin-bottom: 12px;
}

.btn-delete {
  background: #ff4444;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
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
  z-index: 0;
}

.photo-item.selected {
  outline: 3px solid #333;
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

.check-mark {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: #333;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
