import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Backend URL - update this to match your backend server
const API_BASE_URL =  'http://192.168.0.118:3000/api';

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

export interface Experience {
  _id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
  category: 'AR site' | 'eco-tour' | 'heritage';
  provider: {
    _id: string;
    name: string;
  };
  rating: number;
  duration: string;
  location: string;
}



// Mock users for testing
const mockUsers = [
  {
    id: '1',
    name: 'John Traveler',
    email: 'john@example.com',
    password: 'password123',
    role: 'traveler',
    interests: ['Culture', 'History', 'Adventure'],
    _id: 'mock-uid-1',
  },
  {
    id: '2',
    name: 'Sarah Provider',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'provider',
    interests: ['Tourism', 'Culture'],
    _id: 'mock-uid-2',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    interests: [],
    _id: 'mock-uid-3',
  },
];

export const mockExperiences: Experience[] = [
  {
    _id: '1',
    title: 'Lalibela Rock Churches AR Tour',
    description: 'Experience the ancient rock-hewn churches through augmented reality with historical insights.',
    image: 'https://images.unsplash.com/flagged/photo-1572644973628-e9be84915d59?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 150,
    category: 'AR site',
    provider: { _id: '1', name: 'Ethiopian Heritage Tours' },
    rating: 4.8,
    duration: '3 hours',
    location: 'Lalibela',
  },
  {
    _id: '2',
    title: 'Bale Mountains Eco Adventure',
    description: 'Explore the stunning Bale Mountains with expert guides and spot rare wildlife.',
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npUivll5ZGs3cjeGa5WEmKYr-xE1BiwaG8sfp8s0NTb7DgZc5iiPrim1dsy-VpFds5p5z1VMu4NwKgDz0DBrsFnW0TYtIo154l-p5vfbFxV9CdPv-teIUETdISbiNK1Nso3Um-z=s680-w680-h510-rw',
    price: 200,
    category: 'eco-tour',
    provider: { _id: '2', name: 'Mountain Adventures Ethiopia' },
    rating: 4.9,
    duration: 'Full day',
    location: 'Bale Mountains',
  },
  {
    _id: '3',
    title: 'Axum Obelisks Heritage Walk',
    description: 'Discover the ancient kingdom of Axum and its mysterious obelisks.',
    image: 'https://cdn.britannica.com/23/93423-050-107B2836/obelisk-kingdom-Aksum-Ethiopian-name-city.jpg',
    price: 100,
    category: 'heritage',
    provider: { _id: '3', name: 'Ancient Ethiopia Tours' },
    rating: 4.7,
    duration: '2 hours',
    location: 'Axum',
  },
  {
    _id: '4',
    title: 'Coffee Ceremony Cultural Experience',
    description: 'Learn about Ethiopian coffee culture in an authentic ceremony.',
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    price: 50,
    category: 'heritage',
    provider: { _id: '4', name: 'Cultural Connections' },
    rating: 4.6,
    duration: '1.5 hours',
    location: 'Addis Ababa',
  },
  {
    _id: '5',
    title: 'Simien Mountains VR Experience',
    description: 'Virtual reality tour of the breathtaking Simien Mountains landscape.',
    image: 'https://plus.unsplash.com/premium_photo-1661963813165-de22e1c7d406?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 75,
    category: 'eco-tour',
    provider: { _id: '5', name: 'VR Ethiopia Adventures' },
    rating: 4.5,
    duration: '45 minutes',
    location: 'Simien Mountains',
  },
  {
    _id: '6',
    title: 'Harar Old City Heritage Tour',
    description: 'Explore the ancient walled city of Harar with its unique architecture.',
    image: 'https://www.shutterstock.com/image-photo/harar-ethiopia-july-262014-gate-260nw-208874200.jpg',
    price: 120,
    category: 'heritage',
    provider: { _id: '6', name: 'Harar Cultural Tours' },
    rating: 4.4,
    duration: '4 hours',
    location: 'Harar',
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
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('user', JSON.stringify(user));

        return user;
      } catch (backendError) {
        console.log('Backend login failed, falling back to mock login');
      }
    }

    // Mock Login Fallback
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials (mock)");
    }

    const token = `mock-token-${user.id}-${Date.now()}`;

    await SecureStore.setItemAsync('authToken', token);
    const { password: _, ...userWithoutPassword } = user;
    await SecureStore.setItemAsync('user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
},
register: async (userData: any) => {
    try {
      const isBackendAvailable = await checkBackendAvailability();

      if (!isBackendAvailable) {
        throw new Error("Backend not available. Please try again later.");
      }

      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

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
      // console.error('Get experiences error:', error);
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
      
      // Fallback to mock data lookup
      const mockExperience = mockExperiences.find(exp => exp._id === id);
      if (!mockExperience) {
        throw new Error('Experience not found in mock data');
      }
      return mockExperience;
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
      // console.error('Get my experiences error:', error);
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
      // console.error('Create experience error:', error);
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
      // console.error('Create booking error:', error);
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
      // console.error('Get my bookings error:', error);
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
      // console.error('Get itineraries error:', error);
      throw error;
    }
  },
};

export default api;