import axios from 'axios'

export function useAxios() {
  const authStore = useAuthStore()
  const baseURL = '/api'

  const axiosInstance = axios.create({ baseURL })

  // Request interceptor
  axiosInstance.interceptors.request.use(config => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })

  // Response interceptor
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config

      // If error is 401 and we haven't tried to refresh token yet
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Try to refresh the token
          const newToken = await authStore.refreshToken()
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return axiosInstance(originalRequest)
          }
        } catch (refreshError) {
          authStore.logout()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  return {
    axios: axiosInstance
  }
}