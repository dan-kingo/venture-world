import { create } from 'zustand'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

interface Provider {
  _id: string
  name: string
  email: string
  bio: string
  location: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  images?: string[]
}

interface Experience {
  _id: string
  title: string
  description: string
  image: string
  price: number
  category: 'AR site' | 'eco-tour' | 'heritage'
  status: 'pending' | 'approved' | 'rejected'
  provider: {
    _id: string
    name: string
  }
  location: string
  createdAt: string
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface Booking {
  _id: string
  experience: {
    _id: string
    title: string
  }
  traveler: {
    _id: string
    name: string
    email: string
  }
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

interface AdminState {
  providers: Provider[]
  experiences: Experience[]
  users: User[]
  bookings: Booking[]
  isLoading: boolean
  
  // Provider actions
  fetchProviders: () => Promise<void>
  approveProvider: (id: string) => Promise<void>
  rejectProvider: (id: string) => Promise<void>
  
  // Experience actions
  fetchExperiences: () => Promise<void>
  approveExperience: (id: string) => Promise<void>
  rejectExperience: (id: string) => Promise<void>
  
  // User actions
  fetchUsers: () => Promise<void>
  
  // Booking actions
  fetchBookings: () => Promise<void>
  confirmBooking: (id: string) => Promise<void>
  
  // Notification actions
  sendNotification: (data: { title: string; message: string; type: string; target: string }) => Promise<void>
}

export const useAdminStore = create<AdminState>((set, get) => ({
  providers: [],
  experiences: [],
  users: [],
  bookings: [],
  isLoading: false,

  fetchProviders: async () => {
    set({ isLoading: true })
    try {
      const response = await adminAPI.getProviders()
      set({ providers: response.providers || [], isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      toast.error(error.message || 'Failed to fetch providers')
    }
  },

  approveProvider: async (id: string) => {
    try {
      await adminAPI.approveProvider(id)
      set(state => ({
        providers: state.providers.map(provider =>
          provider._id === id ? { ...provider, status: 'approved' as const } : provider
        )
      }))
      toast.success('Provider approved successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve provider')
    }
  },

  rejectProvider: async (id: string) => {
    try {
      await adminAPI.rejectProvider(id)
      set(state => ({
        providers: state.providers.map(provider =>
          provider._id === id ? { ...provider, status: 'rejected' as const } : provider
        )
      }))
      toast.success('Provider rejected')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject provider')
    }
  },

  fetchExperiences: async () => {
    set({ isLoading: true })
    try {
      const response = await adminAPI.getExperiences()
      set({ experiences: response.experiences || [], isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      toast.error(error.message || 'Failed to fetch experiences')
    }
  },

  approveExperience: async (id: string) => {
    try {
      await adminAPI.approveExperience(id)
      set(state => ({
        experiences: state.experiences.map(experience =>
          experience._id === id ? { ...experience, status: 'approved' as const } : experience
        )
      }))
      toast.success('Experience approved successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve experience')
    }
  },

  rejectExperience: async (id: string) => {
    try {
      await adminAPI.rejectExperience(id)
      set(state => ({
        experiences: state.experiences.map(experience =>
          experience._id === id ? { ...experience, status: 'rejected' as const } : experience
        )
      }))
      toast.success('Experience rejected')
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject experience')
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true })
    try {
      const response = await adminAPI.getUsers()
      set({ users: response.users || [], isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      toast.error(error.message || 'Failed to fetch users')
    }
  },

  fetchBookings: async () => {
    set({ isLoading: true })
    try {
      const response = await adminAPI.getBookings()
      set({ bookings: response.bookings || [], isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      toast.error(error.message || 'Failed to fetch bookings')
    }
  },

  confirmBooking: async (id: string) => {
    try {
      await adminAPI.confirmBooking(id)
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking._id === id ? { ...booking, status: 'confirmed' as const } : booking
        )
      }))
      toast.success('Booking confirmed successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm booking')
    }
  },

  sendNotification: async (data) => {
    try {
      await adminAPI.sendNotification(data)
      toast.success('Notification sent successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send notification')
    }
  },
}))