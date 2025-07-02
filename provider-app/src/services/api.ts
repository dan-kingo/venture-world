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

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token)
      }
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  register: async (userData: any) => {
    try {
      const formData = new FormData()
      
      // Add text fields
      Object.keys(userData).forEach(key => {
        if (key !== 'photos') {
          formData.append(key, userData[key])
        }
      })
      
      // Add photos if they exist
      if (userData.photos && userData.photos.length > 0) {
        userData.photos.forEach((photo: string, index: number) => {
          // Convert base64 to blob if needed
          if (photo.startsWith('data:')) {
            const blob = dataURLtoBlob(photo)
            formData.append('photos', blob, `photo-${index}.jpg`)
          }
        })
      }

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token)
      }
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed')
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
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  }
}

export const experienceAPI = {
  create: async (experienceData: any) => {
    try {
      const formData = new FormData()
      
      // Add text fields
      Object.keys(experienceData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, experienceData[key])
        }
      })
      
      // Add image if it exists
      if (experienceData.image) {
        if (experienceData.image.startsWith('data:')) {
          const blob = dataURLtoBlob(experienceData.image)
          formData.append('image', blob, 'experience-image.jpg')
        }
      }

      const response = await api.post('/experiences', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create experience')
    }
  },

  getMine: async () => {
    try {
      const response = await api.get('/experiences/mine')
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch experiences')
    }
  },

  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/experiences/${id}`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update experience')
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/experiences/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete experience')
    }
  }
}

// Helper function to convert data URL to blob
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

export default api