<script setup>
import {
  ArrowUpCircleIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="relative overflow-hidden z-10 pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center">
      <div class="flex justify-center mb-8">
        <img src="/img/Logo.svg" class="h-44" />
      </div>
      <h1 class="font-bold mb-8 flex flex-col">
        <span class="text-4xl md:text-6xl -mb-3">Share your Minecraft</span>
        <span
          class="text-7xl md:text-9xl tracking-wide bg-gradient-to-t from-rose-600 to-rose-400 text-transparent bg-clip-text"
        >
          creations
        </span>
      </h1>
      <p class="text-xl text-zinc-300 mb-12 max-w-3xl mx-auto">
        Join the world's largest community of Minecraft builders. Share your
        creations, discover amazing builds, and connect with fellow creators.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <button
          class="bg-rose-600 hover:bg-rose-700 px-4 py-3 rounded-lg text-md font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowUpCircleIcon class="h-5 w-5" />
          <span>Share Your Build</span>
        </button>
        <button
          class="bg-zinc-700 hover:bg-zinc-600 px-4 py-3 rounded-lg text-md font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <MagnifyingGlassCircleIcon class="h-5 w-5" />
          <span>Explore Builds</span>
        </button>
      </div>
      <div class="flex justify-center space-x-8 text-zinc-400">
        <div class="text-center">
          <div class="text-3xl font-bold text-white">10K+</div>
          <div>Active Builders</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-white">50K+</div>
          <div>Creations Shared</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-white">100K+</div>
          <div>Monthly Views</div>
        </div>
      </div>
    </div>
    <div class="absolute inset-0 -z-10">
      <div
        class="absolute inset-0 bg-[radial-gradient(72.55%_72.55%_at_50%_97.31%,rgba(247,79,79,0.23)_0%,#121B22_100%)]"
      ></div>
    </div>
    <div class="absolute inset-0 -z-10 opacity-[1.5%]">
      <div
        class="absolute inset-0 bg-[url(/img/bg.jpeg)] bg-contain"
      ></div>
    </div>
  </div>
</template>
