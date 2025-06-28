import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, initializeAuth, getReactNativePersistence, onAuthStateChanged } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbQ5l0PueNEGeWKn9jvf6DrYlX60atoJk",
  authDomain: "venture-world-1123.firebaseapp.com",
  projectId: "venture-world-1123",
  storageBucket: "venture-world-1123.firebasestorage.app",
  messagingSenderId: "483733490793",
  appId: "1:483733490793:web:67a111b328a44f7650e6f8",
  measurementId: "G-L256W2HEEC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Backend URL - update this to match your backend server
const API_BASE_URL = __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-api.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear secure storage
      try {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('user');
      } catch (storageError) {
        console.error('Error clearing secure storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      // Save token to SecureStore
      await SecureStore.setItemAsync('authToken', token);
      
      // Get user data from your backend
      try {
        const response = await api.get('/me');
        const userData = response.data;
        
        if (userData) {
          await SecureStore.setItemAsync('user', JSON.stringify(userData));
        }
        
        return userData;
      } catch (backendError) {
        // If backend is not available, create user data from Firebase
        const userData = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || 'User',
          email: userCredential.user.email,
          role: 'traveler',
          interests: [],
          firebaseUid: userCredential.user.uid,
        };
        
        await SecureStore.setItemAsync('user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const { email, password, ...rest } = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      // Save token to SecureStore
      await SecureStore.setItemAsync('authToken', token);
      
      // Try to create user profile in your backend
      try {
        const response = await api.post('/auth/setup', {
          firebaseUid: userCredential.user.uid,
          email,
          ...rest
        });
        
        if (response.data) {
          await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
        }
        
        return response.data.user;
      } catch (backendError) {
        // If backend is not available, create user data locally
        const newUserData = {
          id: userCredential.user.uid,
          email,
          firebaseUid: userCredential.user.uid,
          ...rest
        };
        
        await SecureStore.setItemAsync('user', JSON.stringify(newUserData));
        return newUserData;
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await auth.signOut();
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  setupProfile: async (profileData: any) => {
    try {
      const response = await api.post('/auth/setup', profileData);
      return response.data;
    } catch (error) {
      console.error('Setup profile error:', error);
      // Return mock success if backend is not available
      return { success: true, user: profileData };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/me');
      if (response.data) {
        await SecureStore.setItemAsync('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      // Return stored user data if backend is not available
      const storedUser = await SecureStore.getItemAsync('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
  },

  getCurrentUser: () => auth.currentUser,
  
  onAuthStateChanged: (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

// Experiences API
export const experiencesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/experiences');
      return response.data;
    } catch (error) {
      console.error('Get experiences error:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/experiences/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get experience by ID error:', error);
      throw error;
    }
  },

  getMine: async () => {
    try {
      const response = await api.get('/experiences/mine');
      return response.data;
    } catch (error) {
      console.error('Get my experiences error:', error);
      throw error;
    }
  },

  create: async (experienceData: any) => {
    try {
      const response = await api.post('/experiences', experienceData);
      return response.data;
    } catch (error) {
      console.error('Create experience error:', error);
      throw error;
    }
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (experienceId: string) => {
    try {
      const response = await api.post('/bookings', { experienceId });
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  getMine: async () => {
    try {
      const response = await api.get('/bookings/mine');
      return response.data;
    } catch (error) {
      console.error('Get my bookings error:', error);
      throw error;
    }
  },
};

// Itineraries API
export const itinerariesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/itineraries');
      return response.data;
    } catch (error) {
      console.error('Get itineraries error:', error);
      throw error;
    }
  },
};

export { auth };
export default api;