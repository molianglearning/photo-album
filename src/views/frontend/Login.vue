<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="title">私密相册</h1>
      <p class="subtitle">请输入访问密码</p>
      
      <form @submit.prevent="handleLogin">
        <input
          v-model="password"
          type="password"
          class="input"
          placeholder="请输入密码"
          autocomplete="off"
        />
        
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? '验证中...' : '进入' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
      </form>
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
    const res = await api.login(password.value)
    authStore.setToken(res.token, 'user')
    router.push('/home')
  } catch (err) {
    error.value = err.response?.data?.message || '密码错误'
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
</style>
