import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  language?: string;
  phone?: string;
  status?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: string;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  language: 'en',

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const userData = await authAPI.login(email, password);
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true });
    try {
      const newUser = await authAPI.register(userData);
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(userData);
      if (response.user) {
        set({ user: response.user });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      await authAPI.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      await authAPI.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      await authAPI.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  setLanguage: async (language: string) => {
    try {
      await SecureStore.setItemAsync('language', language);
      set({ language });
      
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, language };
        await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error('Set language error:', error);
    }
  },

  initializeAuth: async () => {
    try {
      const [storedUser, storedLanguage] = await Promise.all([
        SecureStore.getItemAsync('user'),
        SecureStore.getItemAsync('language'),
      ]);
      
      if (storedLanguage) {
        set({ language: storedLanguage });
      }
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true });
        
        // Try to refresh user data from server
        try {
          const refreshedUser = await authAPI.getProfile();
          if (refreshedUser) {
            set({ user: refreshedUser });
          }
        } catch (error) {
          console.log('Could not refresh user data, using stored data');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  },
}));