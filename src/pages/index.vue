<template>
    <Hero />
    <FeaturedBuilds />
    <Categories />
    <TrendingSection />
    <Footer />
</template>

<script setup>
import { useAuthStore } from '../stores/useAuthStore'
const authStore = useAuthStore()

onMounted(async () => {
    const user = authStore.isAuthenticated
    console.log(user);
})
</script>

<style scoped>

</style>