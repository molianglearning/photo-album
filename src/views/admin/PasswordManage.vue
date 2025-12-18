<template>
  <div class="admin-page">
    <header class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>密码管理</h1>
    </header>
    
    <div class="content">
      <div class="form-card">
        <h3>修改前台访问密码</h3>
        <div class="form-group">
          <label>旧密码</label>
          <input
            v-model="accessForm.old_password"
            type="password"
            class="input"
            placeholder="请输入旧密码"
          />
        </div>
        <div class="form-group">
          <label>新密码</label>
          <input
            v-model="accessForm.new_password"
            type="password"
            class="input"
            placeholder="请输入新密码"
          />
        </div>
        <button class="btn" @click="changeAccessPassword" :disabled="loading">
          修改前台密码
        </button>
      </div>
      
      <div class="form-card">
        <h3>修改后台管理密码</h3>
        <div class="form-group">
          <label>旧密码</label>
          <input
            v-model="adminForm.old_password"
            type="password"
            class="input"
            placeholder="请输入旧密码"
          />
        </div>
        <div class="form-group">
          <label>新密码</label>
          <input
            v-model="adminForm.new_password"
            type="password"
            class="input"
            placeholder="请输入新密码"
          />
        </div>
        <button class="btn" @click="changeAdminPassword" :disabled="loading">
          修改后台密码
        </button>
      </div>
      
      <p v-if="message" class="message" :class="{ error: isError }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const router = useRouter()

const accessForm = ref({
  old_password: '',
  new_password: ''
})

const adminForm = ref({
  old_password: '',
  new_password: ''
})

const loading = ref(false)
const message = ref('')
const isError = ref(false)

const changeAccessPassword = async () => {
  if (!accessForm.value.old_password || !accessForm.value.new_password) {
    message.value = '请填写完整信息'
    isError.value = true
    setTimeout(() => { message.value = '' }, 3000)
    return
  }
  
  loading.value = true
  message.value = ''
  
  try {
    await api.changePassword({
      type: 'access',
      ...accessForm.value
    })
    message.value = '前台密码修改成功'
    isError.value = false
    accessForm.value = { old_password: '', new_password: '' }
    
    // 3秒后自动清除提示
    setTimeout(() => { message.value = '' }, 3000)
  } catch (err) {
    message.value = err.response?.data?.message || '修改失败'
    isError.value = true
    setTimeout(() => { message.value = '' }, 3000)
  } finally {
    loading.value = false
  }
}

const changeAdminPassword = async () => {
  if (!adminForm.value.old_password || !adminForm.value.new_password) {
    message.value = '请填写完整信息'
    isError.value = true
    setTimeout(() => { message.value = '' }, 3000)
    return
  }
  
  loading.value = true
  message.value = ''
  
  try {
    await api.changePassword({
      type: 'admin',
      ...adminForm.value
    })
    message.value = '后台密码修改成功，请重新登录'
    isError.value = false
    adminForm.value = { old_password: '', new_password: '' }
    
    // 修改管理员密码后，清除token并跳转到登录页
    setTimeout(() => {
      const authStore = useAuthStore()
      authStore.clearToken()
      router.replace('/admin/login')
    }, 2000)
  } catch (err) {
    message.value = err.response?.data?.message || '修改失败'
    isError.value = true
    setTimeout(() => { message.value = '' }, 3000)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}
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
  margin-bottom: 16px;
}

.form-card h3 {
  font-size: 16px;
  margin-bottom: 16px;
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

.message {
  text-align: center;
  font-size: 14px;
  color: #52c41a;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
}

.message.error {
  color: #ff4444;
}
</style>
