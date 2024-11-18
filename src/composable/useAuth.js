export function useAuth() {
    const authStore = useAuthStore()
    const router = useRouter()
  
    const loginWithCredentials = async (email, password) => {
      const success = await authStore.login({ email, password })
      if (success) {
        router.push('/')
      }
      return success
    }
  
    const registerUser = async (email, password) => {
      const success = await authStore.register({ email, password })
      if (success) {
        router.push('/')
      }
      return success
    }
  
    const handleOAuthLogin = async (provider, code) => {
      const success = await authStore.handleOAuthCallback(provider, code)
      if (success) {
        router.push('/')
      }
      return success
    }
  
    const logoutUser = () => {
      authStore.logout()
      router.push('/login')
    }
  
    return {
      loginWithCredentials,
      registerUser,
      handleOAuthLogin,
      logoutUser,
      isAuthenticated: computed(() => authStore.isAuthenticated),
      isAdmin: computed(() => authStore.isAdmin),
      user: computed(() => authStore.user),
      loading: computed(() => authStore.loading),
      error: computed(() => authStore.error)
    }
  }