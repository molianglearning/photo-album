<template>
  <div class="admin-page">
    <header class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>站点设置</h1>
    </header>
    
    <div class="content">
      <div class="form-card">
        <div class="form-group">
          <label>站点标题</label>
          <input
            v-model="form.site_title"
            type="text"
            class="input"
            placeholder="请输入站点标题"
          />
        </div>
        
        <div class="form-group">
          <label>站点描述</label>
          <textarea
            v-model="form.site_description"
            class="input textarea"
            placeholder="请输入站点描述"
            rows="4"
          ></textarea>
        </div>
        
        <button class="btn" @click="handleSave" :disabled="saving">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
        
        <p v-if="message" class="message" :class="{ error: isError }">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()

const form = ref({
  site_title: '',
  site_description: ''
})

const saving = ref(false)
const message = ref('')
const isError = ref(false)

const loadSettings = async () => {
  try {
    const res = await api.getSettings()
    form.value = res.data
  } catch (err) {
    console.error('加载设置失败:', err)
  }
}

const handleSave = async () => {
  if (!form.value.site_title) {
    message.value = '请输入站点标题'
    isError.value = true
    return
  }
  
  saving.value = true
  message.value = ''
  
  try {
    await api.updateSettings(form.value)
    message.value = '保存成功'
    isError.value = false
  } catch (err) {
    message.value = err.response?.data?.message || '保存失败'
    isError.value = true
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadSettings()
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

.form-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.textarea {
  resize: vertical;
  font-family: inherit;
}

.message {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #52c41a;
}

.message.error {
  color: #ff4444;
}
</style>
