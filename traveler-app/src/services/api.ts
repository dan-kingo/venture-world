import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Backend URL - update this to match your backend server
const API_BASE_URL = __DEV__ ? 'http://192.168.0.118:3000/api' : 'https://your-production-api.com/api';

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

// Mock users for testing
const mockUsers = [
  {
    id: '1',
    name: 'John Traveler',
    email: 'john@example.com',
    password: 'password123',
    role: 'traveler',
    interests: ['Culture', 'History', 'Adventure'],
    firebaseUid: 'mock-uid-1',
  },
  {
    id: '2',
    name: 'Sarah Provider',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'provider',
    interests: ['Tourism', 'Culture'],
    firebaseUid: 'mock-uid-2',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    interests: [],
    firebaseUid: 'mock-uid-3',
  },
];

// Auth API with mock implementation
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Generate mock token
      const token = `mock-token-${user.id}-${Date.now()}`;
      
      // Save token to SecureStore
      await SecureStore.setItemAsync('authToken', token);
      
      // Remove password from user data
      const { password: _, ...userData } = user;
      
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      // Create new user
      const newUser = {
        id: `mock-${Date.now()}`,
        firebaseUid: `mock-uid-${Date.now()}`,
        ...userData,
      };
      
      // Add to mock users (in real app, this would be saved to backend)
      mockUsers.push({ ...newUser, password: userData.password });
      
      // Generate mock token
      const token = `mock-token-${newUser.id}-${Date.now()}`;
      
      // Save token to SecureStore
      await SecureStore.setItemAsync('authToken', token);
      
      // Remove password from user data
      const { password: _, ...userDataWithoutPassword } = newUser;
      
      await SecureStore.setItemAsync('user', JSON.stringify(userDataWithoutPassword));
      return userDataWithoutPassword;
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

  setupProfile: async (profileData: any) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, user: profileData };
    } catch (error) {
      console.error('Setup profile error:', error);
      return { success: true, user: profileData };
    }
  },

  getProfile: async () => {
    try {
      // Return stored user data
      const storedUser = await SecureStore.getItemAsync('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },

  getCurrentUser: () => null, // Mock implementation
  
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock implementation - return unsubscribe function
    return () => {};
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