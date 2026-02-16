// src/context/AuthContext.jsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hasHydrated: false,

      setAuth: (data) => set({
        user: data.user,
        token: data.token
      }),

      logout: () => set({
        user: null,
        token: null
      }),

      setHasHydrated: () => set({ hasHydrated: true }),

      isAdmin: () => get().user?.role === 'admin',
      isTeacher: () => get().user?.role === 'teacher',
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated()
      },
    }
  )
)