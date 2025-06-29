import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: string
  bio?: string
  location?: string
  status: 'pending' | 'approved' | 'rejected'
  photos?: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
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
          if (response.user.role !== 'provider') {
            throw new Error('Access denied. Provider account required.')
          }
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          toast.success('Welcome back!')
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.message || 'Login failed')
          throw error
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.register({
            ...userData,
            role: 'provider'
          })
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          toast.success('Registration successful! Your account is pending approval.')
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.message || 'Registration failed')
          throw error
        }
      },

      logout: () => {
        authAPI.logout()
        set({ user: null, isAuthenticated: false })
        toast.success('Logged out successfully')
      },

      updateProfile: async (userData: Partial<User>) => {
        try {
          const response = await authAPI.updateProfile(userData)
          set(state => ({
            user: state.user ? { ...state.user, ...response.user } : null
          }))
          toast.success('Profile updated successfully')
        } catch (error: any) {
          toast.error(error.message || 'Failed to update profile')
          throw error
        }
      },

      initializeAuth: () => {
        const storedState = localStorage.getItem('auth-storage')
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
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)