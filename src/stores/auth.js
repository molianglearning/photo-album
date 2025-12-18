import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const role = ref(localStorage.getItem('role') || '')
  
  const isAuthenticated = computed(() => {
    return !!token.value && token.value !== 'null' && token.value !== 'undefined'
  })
  
  const isAdmin = computed(() => role.value === 'admin')
  
  function setToken(newToken, userRole = 'user') {
    if (!newToken || newToken === 'null' || newToken === 'undefined') {
      console.error('尝试设置无效的token')
      clearToken()
      return
    }
    
    token.value = newToken
    role.value = userRole
    
    try {
      localStorage.setItem('token', newToken)
      localStorage.setItem('role', userRole)
      console.log('Token设置成功:', userRole)
    } catch (error) {
      console.error('保存token到localStorage失败:', error)
    }
  }
  
  function clearToken() {
    token.value = ''
    role.value = ''
    
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      console.log('Token已清除')
    } catch (error) {
      console.error('清除localStorage失败:', error)
    }
  }
  
  return {
    token,
    role,
    isAuthenticated,
    isAdmin,
    setToken,
    clearToken
  }
})
