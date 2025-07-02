import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

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

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('admin-auth-token', response.data.token)
      }
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
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
      throw new Error(error.response?.data?.message || 'Failed to fetch providers')
    }
  },

  approveProvider: async (id: string) => {
    try {
      const response = await api.patch(`/admin/providers/${id}/approve`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve provider')
    }
  },

  rejectProvider: async (id: string) => {
    try {
      const response = await api.patch(`/admin/providers/${id}/reject`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject provider')
    }
  },

  getExperiences: async () => {
    try {
      const response = await api.get('/admin/experiences')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch experiences')
    }
  },

  approveExperience: async (id: string) => {
    try {
      const response = await api.patch(`/admin/experiences/${id}/approve`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve experience')
    }
  },

  rejectExperience: async (id: string) => {
    try {
      const response = await api.patch(`/admin/experiences/${id}/reject`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject experience')
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get('/admin/users')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users')
    }
  },

  getBookings: async () => {
    try {
      const response = await api.get('/admin/bookings')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings')
    }
  },

  sendNotification: async (data: any) => {
    try {
      const response = await api.post('/admin/notifications', data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send notification')
    }
  }
}

export default api