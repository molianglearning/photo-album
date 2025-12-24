<template>
  <div class="admin-page">
    <header class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>{{ filterCategoryName ? `${filterCategoryName} - 相册` : '相册管理' }}</h1>
      <button class="add-btn" @click="showAddDialog">+</button>
    </header>
    
    <div class="content">
      <!-- 分类筛选提示 -->
      <div v-if="filterCategoryName" class="filter-tip">
        当前显示: {{ filterCategoryName }} 分类下的相册
        <button class="clear-filter" @click="clearFilter">显示全部</button>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="filteredAlbums.length === 0" class="empty">
        {{ filterCategoryName ? '该分类下暂无相册，点击右上角添加' : '暂无相册，点击右上角添加' }}
      </div>
      
      <div v-else>
        <div class="sort-tip">
          💡 使用 ↑↓ 按钮调整排序
        </div>
        <div class="list">
        <div
          v-for="(album, index) in filteredAlbums"
          :key="album.id"
          class="list-item"
        >
          <div class="sort-buttons">
            <button 
              class="sort-btn" 
              @click="moveUp(index)"
              :disabled="index === 0"
              title="上移"
            >
              ↑
            </button>
            <button 
              class="sort-btn" 
              @click="moveDown(index)"
              :disabled="index === filteredAlbums.length - 1"
              title="下移"
            >
              ↓
            </button>
          </div>
          <div v-if="album.cover_image" class="item-cover">
            <img :src="`/uploads/${album.cover_image}`" :alt="album.name" />
          </div>
          <div class="item-info">
            <h3>{{ album.name }}</h3>
            <p v-if="album.description">{{ album.description }}</p>
            <span class="category-tag">{{ getCategoryName(album.category_id) }}</span>
          </div>
          <div class="item-actions">
            <button @click="editAlbum(album)">编辑</button>
            <button @click="deleteAlbum(album.id)">删除</button>
          </div>
        </div>
      </div>
      </div>
    </div>
    
    <!-- 添加/编辑对话框 -->
    <div v-if="dialogVisible" class="dialog-mask" @click="closeDialog">
      <div class="dialog" @click.stop>
        <h3>{{ isEdit ? '编辑相册' : '添加相册' }}</h3>
        
        <div class="form-group">
          <label>相册名称</label>
          <input
            v-model="form.name"
            type="text"
            class="input"
            placeholder="请输入相册名称"
          />
        </div>
        
        <div class="form-group">
          <label>所属分类</label>
          <select v-model="form.category_id" class="input">
            <option value="">请选择分类</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>相册描述</label>
          <textarea
            v-model="form.description"
            class="input"
            placeholder="请输入相册描述"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>封面图片</label>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleCoverSelect"
          />
          
          <div v-if="compressing" class="compress-status">
            <span class="compress-spinner"></span>
            <span>压缩中...</span>
          </div>
          
          <div v-else-if="coverPreview" class="cover-preview">
            <img :src="coverPreview" alt="封面预览" />
            <button type="button" class="remove-cover" @click="removeCover">
              ×
            </button>
          </div>
          
          <button
            v-else
            type="button"
            class="upload-btn"
            @click="$refs.fileInput.click()"
          >
            选择封面图片
          </button>
          <p class="hint">支持JPG、PNG格式，所有图片自动压缩到2MB以内</p>
        </div>
        
        <div class="dialog-actions">
          <button class="btn-cancel" @click="closeDialog" :disabled="uploading || compressing">
            取消
          </button>
          <button class="btn" @click="handleSubmit" :disabled="uploading || compressing">
            {{ uploading ? '上传中...' : '确定' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api'
import imageCompression from 'browser-image-compression'

const router = useRouter()
const route = useRoute()

const albums = ref([])
const categories = ref([])
const loading = ref(true)
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  name: '',
  category_id: '',
  description: '',
  cover_image: ''
})
const coverFile = ref(null)
const coverPreview = ref('')
const fileInput = ref(null)
const uploading = ref(false)

// 从 URL 获取分类筛选
const filterCategoryId = computed(() => {
  return route.query.category ? parseInt(route.query.category) : null
})

// 筛选后的相册列表
const filteredAlbums = computed(() => {
  if (!filterCategoryId.value) return albums.value
  return albums.value.filter(a => a.category_id === filterCategoryId.value)
})

// 当前筛选的分类名称
const filterCategoryName = computed(() => {
  if (!filterCategoryId.value) return null
  const cat = categories.value.find(c => c.id === filterCategoryId.value)
  return cat ? cat.name : null
})

const loadData = async () => {
  try {
    const [albumsRes, categoriesRes] = await Promise.all([
      api.adminGetAlbums(),
      api.adminGetCategories()
    ])
    albums.value = albumsRes.data
    categories.value = categoriesRes.data
  } catch (err) {
    console.error('加载数据失败:', err)
  } finally {
    loading.value = false
  }
}

const moveUp = async (index) => {
  if (index === 0) return
  
  // 交换位置
  const temp = filteredAlbums.value[index]
  const prevItem = filteredAlbums.value[index - 1]
  
  // 在原数组中找到对应位置并交换
  const origIndex = albums.value.findIndex(a => a.id === temp.id)
  const origPrevIndex = albums.value.findIndex(a => a.id === prevItem.id)
  
  const tempAlbum = albums.value[origIndex]
  albums.value[origIndex] = albums.value[origPrevIndex]
  albums.value[origPrevIndex] = tempAlbum
  
  // 保存排序
  await saveSortOrder()
}

const moveDown = async (index) => {
  if (index === filteredAlbums.value.length - 1) return
  
  // 交换位置
  const temp = filteredAlbums.value[index]
  const nextItem = filteredAlbums.value[index + 1]
  
  // 在原数组中找到对应位置并交换
  const origIndex = albums.value.findIndex(a => a.id === temp.id)
  const origNextIndex = albums.value.findIndex(a => a.id === nextItem.id)
  
  const tempAlbum = albums.value[origIndex]
  albums.value[origIndex] = albums.value[origNextIndex]
  albums.value[origNextIndex] = tempAlbum
  
  // 保存排序
  await saveSortOrder()
}

const saveSortOrder = async () => {
  try {
    const sortData = albums.value.map((album, index) => ({
      id: album.id,
      sort_order: index
    }))
    await api.sortAlbums(sortData)
  } catch (err) {
    console.error('更新排序失败:', err)
    alert('更新排序失败')
    loadData()
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未知分类'
}

const showAddDialog = () => {
  isEdit.value = false
  form.value = { 
    id: null, 
    name: '', 
    category_id: filterCategoryId.value || '', 
    description: '', 
    cover_image: '' 
  }
  coverFile.value = null
  coverPreview.value = ''
  dialogVisible.value = true
}

const editAlbum = (album) => {
  isEdit.value = true
  form.value = { ...album }
  coverFile.value = null
  // 如果有封面图片，显示预览（确保路径正确）
  if (album.cover_image) {
    // 如果已经包含 /uploads/，直接使用；否则添加前缀
    coverPreview.value = album.cover_image.startsWith('/uploads/') 
      ? album.cover_image 
      : `/uploads/${album.cover_image}`
  } else {
    coverPreview.value = ''
  }
  dialogVisible.value = true
}

const compressing = ref(false)

const handleCoverSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  
  if (file.size > 50 * 1024 * 1024) {
    alert('图片大小不能超过50MB')
    return
  }
  
  // 统一压缩到 2MB 以内，与照片上传保持一致
  compressing.value = true
  let processedFile = file
  
  try {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8
    }
    console.log(`开始压缩封面: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    const compressedBlob = await imageCompression(file, options)
    // 将 Blob 转换为 File 对象，确保有正确的文件名和类型
    processedFile = new File([compressedBlob], `cover_${Date.now()}.jpg`, {
      type: 'image/jpeg'
    })
    console.log(`压缩完成: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`)
  } catch (err) {
    console.error('压缩失败:', err)
    // 压缩失败，如果原文件小于 5MB 则使用原文件
    if (file.size > 5 * 1024 * 1024) {
      alert('图片压缩失败且文件过大，请选择较小的图片')
      compressing.value = false
      return
    }
  }
  
  compressing.value = false
  coverFile.value = processedFile
  
  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target.result
  }
  reader.readAsDataURL(processedFile)
}

const removeCover = () => {
  coverFile.value = null
  coverPreview.value = ''
  form.value.cover_image = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeDialog = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!form.value.name) {
    alert('请输入相册名称')
    return
  }
  if (!form.value.category_id) {
    alert('请选择所属分类')
    return
  }
  
  uploading.value = true
  
  try {
    let coverImageName = form.value.cover_image
    console.log('=== 开始提交 ===')
    console.log('原始 cover_image:', coverImageName)
    console.log('是否有新文件:', !!coverFile.value)
    
    // 如果有新上传的封面图片，先上传
    if (coverFile.value) {
      console.log('开始上传封面图片...')
      const formData = new FormData()
      formData.append('cover', coverFile.value)
      
      const uploadRes = await api.uploadCover(formData)
      console.log('封面上传响应:', uploadRes)
      coverImageName = uploadRes.data.filename
      console.log('新封面文件名:', coverImageName)
    } else if (coverImageName) {
      // 如果没有新上传，但有旧的封面图片，确保只保存文件名（去掉 /uploads/ 前缀）
      const oldName = coverImageName
      coverImageName = coverImageName.replace(/^\/uploads\//, '')
      console.log('清理旧封面路径:', oldName, '->', coverImageName)
    }
    
    const data = {
      name: form.value.name,
      category_id: form.value.category_id,
      description: form.value.description,
      cover_image: coverImageName || ''
    }
    
    console.log('最终提交的数据:', JSON.stringify(data, null, 2))
    
    if (isEdit.value) {
      const result = await api.updateAlbum(form.value.id, data)
      console.log('更新结果:', result)
    } else {
      const result = await api.createAlbum(data)
      console.log('创建结果:', result)
    }
    closeDialog()
    await loadData()
    console.log('=== 提交完成，数据已重新加载 ===')
  } catch (err) {
    console.error('提交失败:', err)
    alert(err.response?.data?.message || '操作失败')
  } finally {
    uploading.value = false
  }
}

const deleteAlbum = async (id) => {
  if (!confirm('确定要删除这个相册吗？相册内的照片也会被删除。')) return
  
  try {
    await api.deleteAlbum(id)
    loadData()
  } catch (err) {
    alert(err.response?.data?.message || '删除失败')
  }
}

const goBack = () => {
  router.back()
}

const clearFilter = () => {
  router.push('/admin/albums')
}

onMounted(() => {
  loadData()
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
  flex: 1;
}

.add-btn {
  background: #333;
  color: #fff;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.content {
  padding: 16px;
}

.filter-tip {
  background: #e3f2fd;
  color: #1976d2;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-filter {
  background: none;
  border: 1px solid #1976d2;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.sort-tip {
  background: #e3f2fd;
  color: #1976d2;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #bbdefb;
  user-select: none;
}

.loading,
.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: move;
  transition: background 0.2s;
}

.list-item:hover {
  background: #fafafa;
}

.sort-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-right: 8px;
}

.sort-btn {
  width: 32px;
  height: 32px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.sort-btn:hover:not(:disabled) {
  background: #e0e0e0;
  border-color: #999;
}

.sort-btn:active:not(:disabled) {
  background: #d0d0d0;
  transform: scale(0.95);
}

.sort-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-cover {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
  flex-shrink: 0;
}

.item-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.item-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.category-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.item-actions button {
  background: none;
  border: 1px solid #ddd;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.item-actions button:active {
  background: #f5f5f5;
}

.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.dialog {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
}

.dialog h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.dialog-actions .btn {
  flex: 1;
  margin: 0;
}

.cover-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-cover {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.upload-btn {
  width: 100%;
  padding: 12px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.upload-btn:hover {
  border-color: #999;
  background: #fafafa;
}

.compress-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 8px;
  color: #666;
}

.compress-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}
</style>
