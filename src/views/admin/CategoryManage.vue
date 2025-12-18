<template>
  <div class="admin-page">
    <header class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>分类管理</h1>
      <button class="add-btn" @click="showAddDialog">+</button>
    </header>
    
    <div class="content">
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="categories.length === 0" class="empty">
        暂无分类，点击右上角添加
      </div>
      
      <div v-else class="list">
        <div
          v-for="category in categories"
          :key="category.id"
          class="list-item"
        >
          <div v-if="category.cover_image" class="item-cover">
            <img :src="`/uploads/${category.cover_image}`" :alt="category.name" />
          </div>
          <div class="item-info">
            <h3>{{ category.name }}</h3>
            <p v-if="category.description">{{ category.description }}</p>
          </div>
          <div class="item-actions">
            <button @click="editCategory(category)">编辑</button>
            <button @click="deleteCategory(category.id)">删除</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑对话框 -->
    <div v-if="dialogVisible" class="dialog-mask" @click="closeDialog">
      <div class="dialog" @click.stop>
        <h3>{{ isEdit ? '编辑分类' : '添加分类' }}</h3>
        
        <div class="form-group">
          <label>分类名称</label>
          <input
            v-model="form.name"
            type="text"
            class="input"
            placeholder="请输入分类名称"
          />
        </div>
        
        <div class="form-group">
          <label>分类描述</label>
          <textarea
            v-model="form.description"
            class="input"
            placeholder="请输入分类描述"
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
          
          <div v-if="coverPreview" class="cover-preview">
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
          <p class="hint">建议尺寸：800x480，支持JPG、PNG格式，最大10MB</p>
        </div>
        
        <div class="dialog-actions">
          <button class="btn-cancel" @click="closeDialog" :disabled="uploading">
            取消
          </button>
          <button class="btn" @click="handleSubmit" :disabled="uploading">
            {{ uploading ? '上传中...' : '确定' }}
          </button>
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
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  name: '',
  description: '',
  cover_image: ''
})
const coverFile = ref(null)
const coverPreview = ref('')
const fileInput = ref(null)
const uploading = ref(false)

const loadCategories = async () => {
  try {
    const res = await api.adminGetCategories()
    categories.value = res.data
  } catch (err) {
    console.error('加载分类失败:', err)
  } finally {
    loading.value = false
  }
}

const showAddDialog = () => {
  isEdit.value = false
  form.value = { id: null, name: '', description: '', cover_image: '' }
  coverFile.value = null
  coverPreview.value = ''
  dialogVisible.value = true
}

const editCategory = (category) => {
  isEdit.value = true
  form.value = { ...category }
  coverFile.value = null
  // 如果有封面图片，显示预览（确保路径正确）
  if (category.cover_image) {
    // 如果已经包含 /uploads/，直接使用；否则添加前缀
    coverPreview.value = category.cover_image.startsWith('/uploads/') 
      ? category.cover_image 
      : `/uploads/${category.cover_image}`
  } else {
    coverPreview.value = ''
  }
  dialogVisible.value = true
}

const handleCoverSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  
  if (file.size > 10 * 1024 * 1024) {
    alert('图片大小不能超过10MB')
    return
  }
  
  coverFile.value = file
  
  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
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
    alert('请输入分类名称')
    return
  }
  
  uploading.value = true
  
  try {
    let coverImageName = form.value.cover_image
    
    // 如果有新上传的封面图片，先上传
    if (coverFile.value) {
      console.log('开始上传封面图片...')
      const formData = new FormData()
      formData.append('cover', coverFile.value)
      
      const uploadRes = await api.uploadCover(formData)
      console.log('封面上传成功:', uploadRes)
      coverImageName = uploadRes.data.filename
      console.log('封面文件名:', coverImageName)
    } else if (coverImageName) {
      // 如果没有新上传，但有旧的封面图片，确保只保存文件名（去掉 /uploads/ 前缀）
      coverImageName = coverImageName.replace(/^\/uploads\//, '')
    }
    
    const data = {
      name: form.value.name,
      description: form.value.description,
      cover_image: coverImageName || ''
    }
    
    console.log('提交的数据:', data)
    
    if (isEdit.value) {
      const result = await api.updateCategory(form.value.id, data)
      console.log('更新结果:', result)
    } else {
      const result = await api.createCategory(data)
      console.log('创建结果:', result)
    }
    closeDialog()
    await loadCategories()
  } catch (err) {
    console.error('提交失败:', err)
    alert(err.response?.data?.message || '操作失败')
  } finally {
    uploading.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm('确定要删除这个分类吗？')) return
  
  try {
    await api.deleteCategory(id)
    loadCategories()
  } catch (err) {
    alert(err.response?.data?.message || '删除失败')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadCategories()
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
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 对话框样式 */
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

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  margin-bottom: 0;
}
</style>
