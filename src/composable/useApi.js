import { useAuthStore } from "~/stores/useAuthStore";

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`;
    }

    try {
      const response = await fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          authStore.logout();
        }
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  return {
    apiFetch,
  };
};
