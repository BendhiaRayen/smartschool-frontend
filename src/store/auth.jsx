import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      // Used by Google login
      setTokens: ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken });
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      },

      setAuth: (token, user) => {
        set({ accessToken: token, user });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      },

      refresh: async () => {
        const { data } = await api.post("/api/auth/refresh");
        const token = data?.accessToken || data?.token || data?.access || null;
        set({ accessToken: token, user: data?.user ?? get().user });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return token;
      },

      login: async (email, password) => {
        try {
          const { data } = await api.post("/api/auth/login", {
            email,
            password,
          });

          const token =
            data?.access || data?.accessToken || data?.token || null;

          if (!token) throw new Error("Invalid login response");

          set({ accessToken: token, user: data.user ?? null });
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (err) {
          const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Invalid email or password";

          throw new Error(msg);
        }
      },

      register: async (payload) => {
        await api.post("/api/auth/register", payload);
      },

      fetchUserProfile: async () => {
        const { data } = await api.get("/api/auth/me");
        set({ user: data.user }); // FIXED: data.user
        return data.user;
      },

      logout: async () => {
        try {
          await api.post("/api/auth/logout");
        } catch {}
        set({ accessToken: null, refreshToken: null, user: null });
        delete api.defaults.headers.common["Authorization"];
      },
    }),
    {
      name: "smartschool-auth",

      // ⭐ CRITICAL FIX ⭐
      // Restore Authorization header on page reload
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${state.accessToken}`;
        }
        state?.setHydrated?.(true);
      },
    }
  )
);
