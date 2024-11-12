<script setup>
import {
  StarIcon,
  EyeIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/vue/24/solid";

const builds = [
  {
    id: 1,
    title: "Medieval Castle Kingdom",
    author: "BlockMaster",
    image:
      "https://preview.redd.it/zc5u0opw4nq61.jpg?width=640&crop=smart&auto=webp&s=bfd69dd5666673bd4ab1b931e5f767fc1cde79e7",
    likes: 2453,
    views: 12000,
    comments: 184,
  },
  {
    id: 2,
    title: "Futuristic City Complex",
    author: "PixelArchitect",
    image:
      "https://i.pinimg.com/originals/0c/2a/b8/0c2ab87bf37a314082b54d1462bf566d.jpg",
    likes: 1897,
    views: 9500,
    comments: 142,
  },
  {
    id: 3,
    title: "Ancient Temple Ruins",
    author: "CraftLegend",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL5T_pIxa5VL4sN9qTARvgeackBhC3448RiA&s",
    likes: 3210,
    views: 15000,
    comments: 256,
  },
];
</script>

<template>
  <section class="relative">
    <svg
      width="100%"
      class="absolute -top-4 md:-top-5 xl:-top-12 2xl:-top-14 bg-transparent z-20"
      viewBox="0 0 1440 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-100 -3.8147e-06C-100 -3.8147e-06 218.416 21.6703 693.5 21.6703C1168.58 21.6703 1487 -3.8147e-06 1487 -3.8147e-06V58H-100V-3.8147e-06Z"
        fill="#131313"
      ></path>
    </svg>
    <div class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold mb-12 text-center">Featured Creations</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="build in builds"
          :key="build.id"
          class="bg-zinc-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
        >
          <div class="relative aspect-video">
            <img
              :src="build.image"
              :alt="build.title"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"
            ></div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">{{ build.title }}</h3>
            <p class="text-zinc-400 mb-4">by {{ build.author }}</p>
            <div class="flex justify-between text-sm text-zinc-400">
              <div class="flex items-center space-x-2">
                <StarIcon class="h-4 w-4 text-yellow-500" />
                <span>{{ build.likes }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <EyeIcon class="h-4 w-4" />
                <span>{{ build.views }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <ChatBubbleOvalLeftIcon class="h-4 w-4" />
                <span>{{ build.comments }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
