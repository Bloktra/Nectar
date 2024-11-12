<script setup>
import { ref } from "vue";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const isOpen = ref(false);
</script>

<template>
  <nav
    class="bg-zinc-900/60 backdrop-blur-lg fixed w-full z-50 border-b border-zinc-800"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex gap-2 items-center">
            <img src="/img/Logo.svg" class="h-8" />
            <span class="text-2xl font-medium">bloktra</span>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a
                href="#"
                class="hover:bg-zinc-800 px-3 py-2 rounded-md text-sm font-medium"
                >Discover</a
              >
              <a
                href="#"
                class="hover:bg-zinc-800 px-3 py-2 rounded-md text-sm font-medium"
                >Categories</a
              >
              <a
                href="#"
                class="hover:bg-zinc-800 px-3 py-2 rounded-md text-sm font-medium"
                >Trending</a
              >
              <a
                href="#"
                class="hover:bg-zinc-800 px-3 py-2 rounded-md text-sm font-medium"
                >Submit Build</a
              >
            </div>
          </div>
        </div>
        <div class="hidden md:flex items-center space-x-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Search builds..."
              class="bg-zinc-800/50 border border-zinc-700/50 text-zinc-200 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <MagnifyingGlassIcon
              class="absolute left-3 top-2.5 h-5 w-5 text-zinc-400"
            />
          </div>
          <button
            class="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
            <span>Sign In</span>
          </button>
        </div>
        <div class="md:hidden">
          <button
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <template v-if="isOpen">
              <XMarkIcon class="h-6 w-6" />
            </template>
            <template v-else>
              <Bars3Icon class="h-6 w-6" />
            </template>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a
          href="#"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-800"
          >Discover</a
        >
        <a
          href="#"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-800"
          >Categories</a
        >
        <a
          href="#"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-800"
          >Trending</a
        >
        <a
          href="#"
          class="block px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-800"
          >Submit Build</a
        >
      </div>
    </div>
  </nav>
</template>
