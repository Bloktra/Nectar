import { defineStore } from "pinia";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: Cookies.get("token") || null,
    isAuthenticated: !!Cookies.get("token"),
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isUserAuthenticated: (state) => state.isAuthenticated,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await fetch("http://your-api-url/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        this.setToken(data.token);
        await this.fetchUser();

        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          error: error.message || "Login failed",
        };
      }
    },

    async register(credentials) {
      try {
        const response = await fetch("http://your-api-url/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Registration failed");
        }

        return await this.login({
          username: credentials.email,
          password: credentials.password,
        });
      } catch (error) {
        console.error("Registration error:", error);
        return {
          success: false,
          error: error.message || "Registration failed",
        };
      }
    },

    async fetchUser() {
      try {
        const response = await fetch("http://your-api-url/api/user/me", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const userData = await response.json();
        this.setUser(userData);
      } catch (error) {
        console.error("Fetch user error:", error);
        this.logout();
      }
    },

    setToken(token) {
      this.token = token;
      this.isAuthenticated = true;
      Cookies.set("token", token, { expires: 7 });
    },

    setUser(user) {
      this.user = user;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      Cookies.remove("token");
      navigateTo("/login");
    },
  },
});
