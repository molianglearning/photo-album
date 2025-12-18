<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="title">后台管理</h1>
      <p class="subtitle">请输入管理员密码</p>
      
      <form @submit.prevent="handleLogin">
        <input
          v-model="password"
          type="password"
          class="input"
          placeholder="请输入管理员密码"
          autocomplete="off"
        />
        
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? '验证中...' : '登录' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      
      <a href="/" class="back-link">返回前台</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 清除旧的token，确保重新登录
    authStore.clearToken()
    
    const res = await api.adminLogin(password.value)
    
    // 确保token存在
    if (!res.token) {
      throw new Error('登录失败，未获取到token')
    }
    
    authStore.setToken(res.token, 'admin')
    
    // 使用replace避免返回到登录页
    router.replace('/admin/dashboard')
  } catch (err) {
    console.error('登录失败:', err)
    error.value = err.response?.data?.message || err.message || '密码错误'
    // 确保清除任何残留的token
    authStore.clearToken()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #fff;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error {
  color: #ff4444;
  font-size: 14px;
  text-align: center;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
}
</style>
