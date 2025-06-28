import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      // For now, use mock data since backend auth might not be fully implemented
      // Replace this with actual API call when backend is ready
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'traveler',
        interests: ['culture', 'history'],
        language: get().language,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('authToken', 'mock-token');
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true });
    try {
      // For now, use mock data since backend auth might not be fully implemented
      // Replace this with actual API call when backend is ready
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        language: get().language,
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('authToken', 'mock-token');
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  setLanguage: async (language: string) => {
    await AsyncStorage.setItem('language', language);
    set({ language });
    
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, language };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  initializeAuth: async () => {
    try {
      const [storedUser, storedLanguage] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('language'),
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