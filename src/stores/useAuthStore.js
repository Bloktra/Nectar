import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  if (import.meta.client) {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      token.value = savedToken
    }
  }

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles?.includes('ROLE_ADMIN') ?? false)

  const apiClient = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async function register(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      setToken(response.token)
      await fetchUser()
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      
      setToken(response.token)
      await fetchUser()
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginWithGithub() {
    window.location.href = '/api/connect/github'
  }

  async function loginWithDiscord() {
    window.location.href = '/api/connect/discord'
  }

  async function handleOAuthCallback(provider, code) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient(`/connect/${provider}/check`, {
        method: 'GET',
        params: { code }
      })
      
      setToken(response.token)
      await fetchUser()
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  function setToken(newToken) {
    token.value = newToken
    if (import.meta.client) {
      localStorage.setItem('auth_token', newToken)
    }
  }

  async function fetchUser() {
    if (!token.value) return null
    
    try {
      const userData = await apiClient('/me')
      user.value = userData
      return userData
    } catch (e) {
      error.value = e.message
      logout()
      return null
    }
  }

  function logout() {
    token.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
    }
  }

  let refreshPromise = null
  async function refreshToken() {
    if (!token.value) return null
    
    if (refreshPromise) return refreshPromise
    
    refreshPromise = apiClient('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: token.value })
    })
      .then(response => {
        setToken(response.token)
        return response.token
      })
      .catch(() => {
        logout()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
    
    return refreshPromise
  }

  return {
    token,
    user,
    loading,
    error,
    
    isAuthenticated,
    isAdmin,
    
    register,
    login,
    loginWithGithub,
    loginWithDiscord,
    handleOAuthCallback,
    logout,
    fetchUser,
    refreshToken
  }
})