import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const token = await AsyncStorage.getItem('authToken');
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
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // You might want to trigger a logout action here
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  setupProfile: async (profileData: any) => {
    const response = await api.post('/auth/setup', profileData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  savePushToken: async (expoPushToken: string) => {
    const response = await api.post('/auth/push-token', { expoPushToken });
    return response.data;
  },
};

// Experiences API
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