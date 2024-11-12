<script setup>
import {
  ArrowTrendingUpIcon,
  HandThumbUpIcon,
  EyeIcon,
} from "@heroicons/vue/24/solid";

const trendingBuilds = [
  {
    id: 1,
    title: "Steampunk Airship Fleet",
    author: "SteamCrafter",
    image:
      "https://images.unsplash.com/photo-1563806767736-4ad9ff7c738e?q=80&w=2069",
    likes: 856,
    views: 4300,
  },
  {
    id: 2,
    title: "Underground Dwarven City",
    author: "MineDigger",
    image:
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=2187",
    likes: 743,
    views: 3800,
  },
  {
    id: 3,
    title: "Floating Sky Islands",
    author: "CloudBuilder",
    image:
      "https://images.unsplash.com/photo-1623282033815-40b05d96c903?q=80&w=2070",
    likes: 912,
    views: 5100,
  },
  {
    id: 4,
    title: "Nether Portal Hub",
    author: "NetherKnight",
    image:
      "https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=2070",
    likes: 678,
    views: 3200,
  },
];
</script>

<template>
  <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-12">
      <h2 class="text-3xl font-bold flex items-center">
        <ArrowTrendingUpIcon class="h-8 w-8 mr-3 text-rose-500" />
        Trending Now
      </h2>
      <a href="#" class="text-rose-500 hover:text-rose-400">View all</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="build in trendingBuilds"
        :key="build.id"
        class="bg-zinc-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
      >
        <div class="relative aspect-square">
          <img
            :src="build.image"
            :alt="build.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"
          ></div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold mb-1">{{ build.title }}</h3>
          <p class="text-sm text-zinc-400 mb-3">by {{ build.author }}</p>
          <div class="flex justify-between text-sm text-zinc-400">
            <div class="flex items-center">
              <HandThumbUpIcon class="h-4 w-4 mr-1" />
              {{ build.likes }}
            </div>
            <div class="flex items-center">
              <EyeIcon class="h-4 w-4 mr-1" />
              {{ build.views }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
