export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles?.includes('ROLE_ADMIN') ?? false)

  const authCookie = useCookie('auth-token', {
    maxAge: 60 * 60 * 24 * 365 * 10,
    sameSite: "lax",
    secure: true,
    httpOnly: false,
    path: "/",
  })

  if (authCookie.value) {
    console.log('Auth cookie found:', authCookie.value)
    token.value = authCookie.value
    console.log('Token set:', token.value)
    console.log('Is Authenticated:', isAuthenticated.value)
  } else {
    console.log('No auth cookie found')
  }

  const apiClient = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers
    }

    const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
      ...options,
      headers
    })

    if (response.status === 401 && token.value) {
      const refreshed = await refreshToken()
      if (refreshed) {
        return apiClient(endpoint, options)
      }
    }

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
    if (newToken) {
      authCookie.value = newToken
    } else {
      authCookie.value = null
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
    authCookie.value = null
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

  if (token.value) {
    fetchUser()
  }

  return {
    // State
    token,
    user,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    
    // Actions
    register,
    login,
    handleOAuthCallback,
    logout,
    fetchUser,
    refreshToken,
  }
})