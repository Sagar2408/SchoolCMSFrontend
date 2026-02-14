// src/context/AuthContext.jsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      setAuth: (data) => set({ 
        user: data.user, 
        token: data.token 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null 
      }),
      
      isAdmin: () => get().user?.role === 'admin',
      isTeacher: () => get().user?.role === 'teacher',
    }),
    {
      name: 'auth-storage',
    }
  )
)