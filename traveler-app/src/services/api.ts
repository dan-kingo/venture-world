import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Save token and user data to SecureStore
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Save token and user data to SecureStore
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
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

  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.user) {
        await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  savePushToken: async (expoPushToken: string) => {
    try {
      const response = await api.post('/auth/push-token', { expoPushToken });
      return response.data;
    } catch (error) {
      console.error('Save push token error:', error);
      throw error;
    }
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

export default api;