<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-zinc-800 rounded-lg overflow-hidden">
      <div class="p-8">
        <h1 class="text-2xl font-bold text-white mb-6 text-center">Register</h1>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-4">
            <div class="relative">
              <Mail
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              />
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                class="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div class="relative">
              <User
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              />
              <input
                v-model="username"
                type="text"
                placeholder="Username"
                class="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div class="relative">
              <Lock
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              />
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                class="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div class="relative">
              <Lock
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              />
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                class="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            class="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Register with Email
          </button>
        </form>
        <div
          v-if="error"
          class="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
        >
          <p class="font-bold">Error</p>
          <p>{{ error }}</p>
        </div>
      </div>
      <div class="px-8 pb-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-zinc-800 text-gray-500">Or continue with</span>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            v-for="provider in oauthProviders"
            :key="provider.name"
            @click="handleOAuthLogin(provider.name)"
            class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <component :is="provider.icon" class="h-5 w-5 mr-2" />
            {{ provider.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  UserIcon as User,
  LockClosedIcon as Lock,
  EnvelopeIcon as Mail,
} from "@heroicons/vue/24/outline";

const email = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const handleSubmit = () => {
  error.value = "";

  if (
    !email.value ||
    !username.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value = "All fields are required";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  // Here you would typically send a request to your backend to register the user
  console.log("Registering with:", {
    email: email.value,
    username: username.value,
    password: password.value,
  });
  // Redirect to dashboard after successful registration
  // In a real app, you'd use Vue Router: router.push('/dashboard')
};

const handleOAuthLogin = (provider) => {
  // Here you would typically redirect to your backend OAuth route
  console.log(`Logging in with ${provider}`);
};

// Custom icon components for OAuth providers
const DiscordIcon = {
  template: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
    `,
};

const GoogleIcon = {
  template: `
      <svg viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
        <path d="M1 1h22v22H1z" fill="none" />
      </svg>
    `,
};

const MicrosoftIcon = {
  template: `
      <svg viewBox="0 0 23 23">
        <path fill="#f3f3f3" d="M0 0h23v23H0z" />
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
      </svg>
    `,
};

const SteamIcon = {
  template: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
      </svg>
    `,
};

const GitlabIcon = {
  template: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 00-.867 0L16.418 9.45H7.582L4.919 1.263a.455.455 0 00-.867 0L1.386 9.45.044 13.587a.924.924 0 00.331 1.023L12 23.054l11.625-8.443a.92.92 0 00.33-1.024" />
      </svg>
    `,
};

const oauthProviders = [
  { name: "Discord", icon: DiscordIcon },
  { name: "Github", icon: DiscordIcon },
  { name: "Google", icon: GoogleIcon },
  { name: "Microsoft", icon: MicrosoftIcon },
  { name: "Steam", icon: SteamIcon },
  { name: "Gitlab", icon: GitlabIcon },
];
</script>
