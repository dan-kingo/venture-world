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
    const token = localStorage.getItem('admin-auth-token')
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
      localStorage.removeItem('admin-auth-token')
      localStorage.removeItem('admin-auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock data for development
const mockProviders = [
  {
    id: '1',
    name: 'John Provider',
    email: 'john@provider.com',
    bio: 'Experienced tour guide specializing in Ethiopian heritage sites',
    location: 'Addis Ababa, Ethiopia',
    status: 'pending' as const,
    createdAt: '2024-01-15',
    photos: ['https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg']
  },
  {
    id: '2',
    name: 'Sarah Guide',
    email: 'sarah@guide.com',
    bio: 'Cultural expert and coffee ceremony specialist',
    location: 'Lalibela, Ethiopia',
    status: 'approved' as const,
    createdAt: '2024-01-10',
    photos: ['https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg']
  }
]

const mockExperiences = [
  {
    id: '1',
    title: 'Lalibela Rock Churches AR Tour',
    description: 'Experience the ancient rock-hewn churches through augmented reality',
    image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
    price: 150,
    category: 'AR site' as const,
    status: 'pending' as const,
    provider: { id: '1', name: 'John Provider' },
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Coffee Ceremony Experience',
    description: 'Learn about Ethiopian coffee culture in an authentic ceremony',
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    price: 50,
    category: 'heritage' as const,
    status: 'approved' as const,
    provider: { id: '2', name: 'Sarah Guide' },
    createdAt: '2024-01-18'
  }
]

const mockUsers = [
  {
    id: '1',
    name: 'Alice Traveler',
    email: 'alice@traveler.com',
    role: 'traveler',
    status: 'active',
    createdAt: '2024-01-12'
  },
  {
    id: '2',
    name: 'Bob Explorer',
    email: 'bob@explorer.com',
    role: 'traveler',
    status: 'active',
    createdAt: '2024-01-14'
  }
]

const mockBookings = [
  {
    id: '1',
    experience: { id: '1', title: 'Lalibela Rock Churches AR Tour' },
    traveler: { id: '1', name: 'Alice Traveler', email: 'alice@traveler.com' },
    status: 'confirmed' as const,
    createdAt: '2024-01-22'
  },
  {
    id: '2',
    experience: { id: '2', title: 'Coffee Ceremony Experience' },
    traveler: { id: '2', name: 'Bob Explorer', email: 'bob@explorer.com' },
    status: 'pending' as const,
    createdAt: '2024-01-23'
  }
]

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('admin-auth-token', response.data.token)
      }
      return response.data
    } catch (error: any) {
      // Fallback to mock for development
      if (email === 'admin@example.com' && password === 'admin123') {
        const mockUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
        localStorage.setItem('admin-auth-token', 'mock-admin-token')
        return { user: mockUser, token: 'mock-admin-token' }
      }
      throw new Error('Invalid credentials')
    }
  },

  logout: () => {
    localStorage.removeItem('admin-auth-token')
    localStorage.removeItem('admin-auth-storage')
  }
}

export const adminAPI = {
  getProviders: async () => {
    try {
      const response = await api.get('/admin/providers')
      return response.data
    } catch (error: any) {
      // Mock data for development
      return { providers: mockProviders }
    }
  },

  approveProvider: async (id: string) => {
    try {
      const response = await api.patch(`/admin/providers/${id}/approve`)
      return response.data
    } catch (error: any) {
      // Mock approval for development
      return { success: true }
    }
  },

  rejectProvider: async (id: string) => {
    try {
      const response = await api.patch(`/admin/providers/${id}/reject`)
      return response.data
    } catch (error: any) {
      // Mock rejection for development
      return { success: true }
    }
  },

  getExperiences: async () => {
    try {
      const response = await api.get('/admin/experiences')
      return response.data
    } catch (error: any) {
      // Mock data for development
      return { experiences: mockExperiences }
    }
  },

  approveExperience: async (id: string) => {
    try {
      const response = await api.patch(`/admin/experiences/${id}/approve`)
      return response.data
    } catch (error: any) {
      // Mock approval for development
      return { success: true }
    }
  },

  rejectExperience: async (id: string) => {
    try {
      const response = await api.patch(`/admin/experiences/${id}/reject`)
      return response.data
    } catch (error: any) {
      // Mock rejection for development
      return { success: true }
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get('/admin/users')
      return response.data
    } catch (error: any) {
      // Mock data for development
      return { users: mockUsers }
    }
  },

  getBookings: async () => {
    try {
      const response = await api.get('/admin/bookings')
      return response.data
    } catch (error: any) {
      // Mock data for development
      return { bookings: mockBookings }
    }
  },

  sendNotification: async (data: any) => {
    try {
      const response = await api.post('/admin/notifications', data)
      return response.data
    } catch (error: any) {
      // Mock notification for development
      return { success: true }
    }
  }
}

export default api