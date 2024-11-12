<script setup>
import {
  HomeIcon,
  CogIcon,
  PaperAirplaneIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
} from "@heroicons/vue/24/outline";

const categories = [
  { icon: HomeIcon, name: "Medieval", count: "2.4k builds" },
  { icon: RocketLaunchIcon, name: "Futuristic", count: "1.8k builds" },
  { icon: PaperAirplaneIcon, name: "Nature", count: "3.2k builds" },
  { icon: CogIcon, name: "Redstone", count: "1.5k builds" },
  { icon: AcademicCapIcon, name: "Survival", count: "2.1k builds" },
  { icon: AcademicCapIcon, name: "Modern", count: "2.7k builds" },
  { icon: AcademicCapIcon, name: "Farms", count: "1.9k builds" },
  { icon: AcademicCapIcon, name: "Fantasy", count: "2.3k builds" },
];
</script>

<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-zinc-800/50">
    <h2 class="text-3xl font-bold mb-12 text-center">Explore Categories</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="category in categories"
        :key="category.name"
        class="bg-zinc-800 p-6 rounded-xl hover:bg-zinc-700 transition-colors cursor-pointer group"
      >
        <component
          :is="category.icon"
          class="h-8 w-8 mb-4 text-rose-500 group-hover:text-rose-400"
        />
        <h3 class="text-lg font-semibold mb-2">{{ category.name }}</h3>
        <p class="text-zinc-400 text-sm">{{ category.count }}</p>
      </div>
    </div>
  </section>
</template>
