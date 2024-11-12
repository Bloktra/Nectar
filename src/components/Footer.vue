<script setup>
import {
  ArrowPathRoundedSquareIcon,
  EnvelopeIcon,
} from "@heroicons/vue/24/outline";
</script>

<template>
  <footer class="bg-zinc-900 border-t border-zinc-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="col-span-1 md:col-span-2">
          <h3
            class="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-400 text-transparent bg-clip-text mb-4"
          >
            Bloktra
          </h3>
          <p class="text-zinc-400 mb-4">
            The ultimate platform for Minecraft creators to share, discover, and
            showcase their incredible builds with the world.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-zinc-400 hover:text-white">
              <ArrowPathRoundedSquareIcon class="h-6 w-6" />
            </a>
            <a href="#" class="text-zinc-400 hover:text-white">
              <ArrowPathRoundedSquareIcon class="h-6 w-6" />
            </a>
            <a href="#" class="text-zinc-400 hover:text-white">
              <ArrowPathRoundedSquareIcon class="h-6 w-6" />
            </a>
            <a href="#" class="text-zinc-400 hover:text-white">
              <EnvelopeIcon class="h-6 w-6" />
            </a>
          </div>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-zinc-400">
            <li><a href="#" class="hover:text-white">Home</a></li>
            <li><a href="#" class="hover:text-white">Explore</a></li>
            <li><a href="#" class="hover:text-white">Categories</a></li>
            <li><a href="#" class="hover:text-white">Submit Build</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Resources</h4>
          <ul class="space-y-2 text-zinc-400">
            <li><a href="#" class="hover:text-white">Help Center</a></li>
            <li>
              <a href="#" class="hover:text-white">Community Guidelines</a>
            </li>
            <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-400">
        <p>
          &copy; {{ new Date().getFullYear() }} Bloktra. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
