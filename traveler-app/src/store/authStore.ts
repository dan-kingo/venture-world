// stores/authStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  language: string;
  firebaseUid?: string;
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
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  setLanguage: async (language: string) => {
    await SecureStore.setItemAsync('language', language);
    set({ language });
    
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, language };
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
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
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  },
}));