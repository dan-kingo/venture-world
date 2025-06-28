// services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(firebaseApp);

// Backend URL - update this to match your backend server
const API_BASE_URL = 'http://localhost:3000/api';

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
      
      // Get user data from your backend (optional)
      const response = await api.get('/me');
      const userData = response.data;
      
      if (userData) {
        await SecureStore.setItemAsync('user', JSON.stringify(userData));
      }
      
      return userData;
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
      
      // Create user profile in your backend (optional)
      const response = await api.post('/auth/register', {
        firebaseUid: userCredential.user.uid,
        email,
        ...rest
      });
      
      if (response.data) {
        await SecureStore.setItemAsync('user', JSON.stringify(response.data));
      }
      
      return response.data;
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
    const response = await api.post('/auth/setup', profileData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/me');
    if (response.data) {
      await SecureStore.setItemAsync('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  savePushToken: async (expoPushToken: string) => {
    const response = await api.post('/auth/push-token', { expoPushToken });
    return response.data;
  },
};

export const experiencesAPI = {
  getAll: async () => {
    const response = await api.get('/experiences');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },

  getMine: async () => {
    const response = await api.get('/experiences/mine');
    return response.data;
  },

  create: async (experienceData: any) => {
    const response = await api.post('/experiences', experienceData);
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (experienceId: string) => {
    const response = await api.post('/bookings', { experienceId });
    return response.data;
  },

  getMine: async () => {
    const response = await api.get('/bookings/mine');
    return response.data;
  },
};

// Itineraries API
export const itinerariesAPI = {
  getAll: async () => {
    const response = await api.get('/itineraries');
    return response.data;
  },
};

export default api;