import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const state = useAuthStore.getState();

    // 🚫 If no token exists → user logged out → NEVER refresh
    if (!state.accessToken) {
      return Promise.reject(error);
    }

    // 🚫 Never refresh for these protected routes
    if (
      original.url.includes("/auth/login") ||
      original.url.includes("/auth/register") ||
      original.url.includes("/auth/logout") ||
      original.url.includes("/auth/me") || // fixes profile reload
      original.url.includes("/profile/me") // fixes refresh loop
    ) {
      return Promise.reject(error);
    }

    // 🔁 Try refresh only ONCE
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newToken = await state.refresh();
        original.headers["Authorization"] = `Bearer ${newToken}`;
        return api(original);
      } catch {
        state.logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
