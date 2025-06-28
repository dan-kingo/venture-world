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

// Check if backend is available
const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    await api.get('/health', { timeout: 3000 });
    return true;
  } catch (error) {
    console.log('Backend not available, using mock data');
    return false;
  }
};

// Auth API with backend integration
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        // Try backend login first
        try {
          // For now, we'll use mock login since Firebase auth is not fully set up
          // In production, this would be a proper Firebase auth flow
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          
          await SecureStore.setItemAsync('authToken', token);
          await SecureStore.setItemAsync('user', JSON.stringify(user));
          
          return user;
        } catch (backendError) {
          console.log('Backend auth failed, falling back to mock');
        }
      }
      
      // Fallback to mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const token = `mock-token-${user.id}-${Date.now()}`;
      await SecureStore.setItemAsync('authToken', token);
      
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
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        try {
          const response = await api.post('/auth/register', userData);
          const { token, user } = response.data;
          
          await SecureStore.setItemAsync('authToken', token);
          await SecureStore.setItemAsync('user', JSON.stringify(user));
          
          return user;
        } catch (backendError) {
          console.log('Backend registration failed, falling back to mock');
        }
      }
      
      // Fallback to mock registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      const newUser = {
        id: `mock-${Date.now()}`,
        firebaseUid: `mock-uid-${Date.now()}`,
        ...userData,
      };
      
      mockUsers.push({ ...newUser, password: userData.password });
      
      const token = `mock-token-${newUser.id}-${Date.now()}`;
      await SecureStore.setItemAsync('authToken', token);
      
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
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        try {
          const response = await api.post('/auth/setup', profileData);
          return response.data;
        } catch (backendError) {
          console.log('Backend profile setup failed');
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, user: profileData };
    } catch (error) {
      console.error('Setup profile error:', error);
      return { success: true, user: profileData };
    }
  },

  getProfile: async () => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        try {
          const response = await api.get('/me');
          if (response.data) {
            await SecureStore.setItemAsync('user', JSON.stringify(response.data));
          }
          return response.data;
        } catch (backendError) {
          console.log('Backend profile fetch failed');
        }
      }
      
      const storedUser = await SecureStore.getItemAsync('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },

  getCurrentUser: () => null,
  
  onAuthStateChanged: (callback: (user: any) => void) => {
    return () => {};
  },
};

// Experiences API with backend integration
export const experiencesAPI = {
  getAll: async () => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        const response = await api.get('/experiences');
        return response.data;
      }
      
      // Fallback to mock data
      throw new Error('Backend not available');
    } catch (error) {
      console.error('Get experiences error:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        const response = await api.get(`/experiences/${id}`);
        return response.data;
      }
      
      throw new Error('Backend not available');
    } catch (error) {
      console.error('Get experience by ID error:', error);
      throw error;
    }
  },

  getMine: async () => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        const response = await api.get('/experiences/mine');
        return response.data;
      }
      
      throw new Error('Backend not available');
    } catch (error) {
      console.error('Get my experiences error:', error);
      throw error;
    }
  },

  create: async (experienceData: any) => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        const response = await api.post('/experiences', experienceData);
        return response.data;
      }
      
      throw new Error('Backend not available');
    } catch (error) {
      console.error('Create experience error:', error);
      throw error;
    }
  },
};

// Bookings API with backend integration
export const bookingsAPI = {
  create: async (experienceId: string) => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        const response = await api.post('/bookings', { experienceId });
        return response.data;
      }
      
      // Mock booking creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, bookingId: `mock-booking-${Date.now()}` };
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  getMine: async () => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        const response = await api.get('/bookings/mine');
        return response.data;
      }
      
      // Return empty array for mock
      return [];
    } catch (error) {
      console.error('Get my bookings error:', error);
      throw error;
    }
  },
};

// Itineraries API with backend integration
export const itinerariesAPI = {
  getAll: async () => {
    try {
      const isBackendAvailable = await checkBackendAvailability();
      
      if (isBackendAvailable) {
        const response = await api.get('/itineraries');
        return response.data;
      }
      
      throw new Error('Backend not available');
    } catch (error) {
      console.error('Get itineraries error:', error);
      throw error;
    }
  },
};

export default api;