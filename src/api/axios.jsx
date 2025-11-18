import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // allow cookies for refresh
});

// attach access token (if we have one)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};

    if (error.response?.status === 401 && !original._retry) {
      if (refreshing) {
        await new Promise((resolve) => queue.push(resolve));
        original._retry = true;
        return api(original);
      }

      refreshing = true;
      try {
        const { data } = await api.post("/api/auth/refresh");
        const token =
          data?.accessToken || data?.token || data?.access_token || null;
        if (token) useAuthStore.getState().setAuth(token, data?.user ?? null);
        queue.forEach((fn) => fn());
        queue = [];
        original._retry = true;
        return api(original);
      } catch (e) {
        useAuthStore.getState().logout();
        throw e;
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
