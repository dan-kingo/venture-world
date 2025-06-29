import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(email, password)
          if (response.user.role !== 'admin') {
            throw new Error('Access denied. Admin account required.')
          }
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          toast.success('Welcome to Admin Portal!')
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.message || 'Login failed')
          throw error
        }
      },

      logout: () => {
        authAPI.logout()
        set({ user: null, isAuthenticated: false })
        toast.success('Logged out successfully')
      },

      initializeAuth: () => {
        const storedState = localStorage.getItem('admin-auth-storage')
        if (storedState) {
          const { state } = JSON.parse(storedState)
          if (state.user && state.isAuthenticated) {
            set({ 
              user: state.user, 
              isAuthenticated: true,
              isLoading: false 
            })
          }
        }
        set({ isLoading: false })
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)