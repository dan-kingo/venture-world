import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock data for development
const mockExperiences = [
  {
    id: '1',
    title: 'Lalibela Rock Churches AR Tour',
    description: 'Experience the ancient rock-hewn churches through augmented reality',
    image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
    price: 150,
    category: 'AR site' as const,
    status: 'approved' as const,
    provider: 'provider-1',
    createdAt: '2024-01-15',
    views: 45,
    bookings: 8
  },
  {
    id: '2',
    title: 'Coffee Ceremony Experience',
    description: 'Learn about Ethiopian coffee culture in an authentic ceremony',
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    price: 50,
    category: 'heritage' as const,
    status: 'pending' as const,
    provider: 'provider-1',
    createdAt: '2024-01-20',
    views: 12,
    bookings: 2
  }
]

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token)
      }
      return response.data
    } catch (error: any) {
      // Fallback to mock for development
      if (email === 'provider@example.com' && password === 'password123') {
        const mockUser = {
          id: 'provider-1',
          name: 'John Provider',
          email: 'provider@example.com',
          role: 'provider',
          bio: 'Experienced tour guide specializing in Ethiopian heritage sites',
          location: 'Addis Ababa, Ethiopia',
          status: 'approved' as const,
          photos: ['https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg']
        }
        localStorage.setItem('auth-token', 'mock-token-provider')
        return { user: mockUser, token: 'mock-token-provider' }
      }
      throw new Error('Invalid credentials')
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData)
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token)
      }
      return response.data
    } catch (error: any) {
      // Mock registration for development
      const mockUser = {
        id: `provider-${Date.now()}`,
        ...userData,
        status: 'pending' as const
      }
      localStorage.setItem('auth-token', `mock-token-${mockUser.id}`)
      return { user: mockUser, token: `mock-token-${mockUser.id}` }
    }
  },

  logout: () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-storage')
  },

  updateProfile: async (userData: any) => {
    try {
      const response = await api.put('/auth/profile', userData)
      return response.data
    } catch (error: any) {
      // Mock update for development
      return { user: userData }
    }
  }
}

export const experienceAPI = {
  create: async (experienceData: any) => {
    try {
      const response = await api.post('/experiences', experienceData)
      return response.data
    } catch (error: any) {
      // Mock creation for development
      const mockExperience = {
        id: `exp-${Date.now()}`,
        ...experienceData,
        status: 'pending' as const,
        provider: 'provider-1',
        createdAt: new Date().toISOString(),
        views: 0,
        bookings: 0
      }
      return { experience: mockExperience }
    }
  },

  getMine: async () => {
    try {
      const response = await api.get('/experiences/mine')
      return response.data
    } catch (error: any) {
      // Mock data for development
      return { experiences: mockExperiences }
    }
  },

  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/experiences/${id}`, data)
      return response.data
    } catch (error: any) {
      // Mock update for development
      return { experience: { id, ...data } }
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/experiences/${id}`)
      return response.data
    } catch (error: any) {
      // Mock delete for development
      return { success: true }
    }
  }
}

export default api