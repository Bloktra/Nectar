export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  const publicRoutes = ["/login", "/register", "/browse", "/"];

  const authRoutes = ["/upload", "/profile", "/dashboard"];

  const adminRoutes = ["/admin", "/manage-builds"];

  if (publicRoutes.includes(to.path)) {
    if (
      authStore.isAuthenticated &&
      ["/login", "/register"].includes(to.path)
    ) {
      return navigateTo("/dashboard");
    }
    return;
  }

  if (authRoutes.includes(to.path)) {
    if (!authStore.isAuthenticated) {
      return navigateTo("/login");
    }
  }

  if (adminRoutes.includes(to.path)) {
    if (!authStore.user?.roles.includes("ROLE_ADMIN")) {
      return navigateTo("/");
    }
  }
});
