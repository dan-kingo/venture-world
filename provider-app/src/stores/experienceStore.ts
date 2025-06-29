import { create } from 'zustand'
import { experienceAPI } from '../services/api'
import toast from 'react-hot-toast'

interface Experience {
  id: string
  title: string
  description: string
  image: string
  price?: number
  category: 'AR site' | 'eco-tour' | 'heritage'
  status: 'pending' | 'approved' | 'rejected'
  provider: string
  createdAt: string
  views?: number
  bookings?: number
}

interface ExperienceState {
  experiences: Experience[]
  isLoading: boolean
  addExperience: (experienceData: Omit<Experience, 'id' | 'status' | 'provider' | 'createdAt'>) => Promise<void>
  fetchExperiences: () => Promise<void>
  updateExperience: (id: string, data: Partial<Experience>) => Promise<void>
  deleteExperience: (id: string) => Promise<void>
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  experiences: [],
  isLoading: false,

  addExperience: async (experienceData) => {
    set({ isLoading: true })
    try {
      const response = await experienceAPI.create(experienceData)
      set(state => ({
        experiences: [response.experience, ...state.experiences],
        isLoading: false
      }))
      toast.success('Experience submitted for review!')
    } catch (error: any) {
      set({ isLoading: false })
      toast.error(error.message || 'Failed to add experience')
      throw error
    }
  },

  fetchExperiences: async () => {
    set({ isLoading: true })
    try {
      const response = await experienceAPI.getMine()
      set({ experiences: response.experiences, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      toast.error(error.message || 'Failed to fetch experiences')
    }
  },

  updateExperience: async (id, data) => {
    try {
      const response = await experienceAPI.update(id, data)
      set(state => ({
        experiences: state.experiences.map(exp => 
          exp.id === id ? { ...exp, ...response.experience } : exp
        )
      }))
      toast.success('Experience updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update experience')
      throw error
    }
  },

  deleteExperience: async (id) => {
    try {
      await experienceAPI.delete(id)
      set(state => ({
        experiences: state.experiences.filter(exp => exp.id !== id)
      }))
      toast.success('Experience deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete experience')
      throw error
    }
  },
}))