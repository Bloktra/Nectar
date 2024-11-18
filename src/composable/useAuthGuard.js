export function useAuthGuard() {
    const authStore = useAuthStore()
    const router = useRouter()
  
    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }
  
      // Verify the token is still valid by fetching user
      if (!await authStore.fetchUser()) {
        router.push('/login')
      }
    })
  }