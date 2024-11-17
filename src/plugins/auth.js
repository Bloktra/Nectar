export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore()
    
    // Load user data if we have a token
    if (authStore.token) {
      await authStore.fetchUser()
    }
  })