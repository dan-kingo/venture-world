import { create } from 'zustand';
import { experiencesAPI, bookingsAPI, Experience, mockExperiences } from '../services/api';

interface ExperienceState {
  experiences: Experience[];
  featuredExperiences: Experience[];
  isLoading: boolean;
  error: string | null;
  fetchExperiences: () => Promise<void>;
  fetchExperienceById: (id: string) => Promise<Experience | null>;
  fetchFeaturedExperiences: () => Promise<void>;
  bookExperience: (experienceId: string) => Promise<void>;
}



export const useExperienceStore = create<ExperienceState>((set, get) => ({
  experiences: [],
  featuredExperiences: [],
  isLoading: false,
  error: null,

  fetchExperiences: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch from API first
      try {
        const experiences = await experiencesAPI.getAll();
        set({ experiences, isLoading: false });
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ experiences: mockExperiences, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      set({ 
        error: 'Failed to load experiences', 
        isLoading: false,
        experiences: mockExperiences // Fallback to mock data
      });
    }
  },

  fetchFeaturedExperiences: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch from API first
      try {
        const experiences = await experiencesAPI.getAll();
        const featured = experiences.slice(0, 3);
        set({ featuredExperiences: featured, isLoading: false });
      } catch (apiError) {
        console.log('API not available, using mock data for featured');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const featured = mockExperiences.slice(0, 3);
        set({ featuredExperiences: featured, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching featured experiences:', error);
      set({ 
        error: 'Failed to load featured experiences', 
        isLoading: false,
        featuredExperiences: mockExperiences.slice(0, 3) // Fallback to mock data
      });
    }
  },

  fetchExperienceById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // First check if we have it in local state
      const existing = get().experiences.find(exp => exp._id === id);
      if (existing) {
        set({ isLoading: false });
        return existing;
      }
      
      // Try to fetch from API
      try {
        const experience = await experiencesAPI.getById(id);
        set(state => ({
          experiences: [...state.experiences, experience], // Add to cache
          isLoading: false
        }));
        return experience;
      } catch (apiError) {
        console.log('API not available, checking mock data');
        // Check mock data
        const mockExp = mockExperiences.find(exp => exp._id === id);
        if (mockExp) {
          set(state => ({
            experiences: [...state.experiences, mockExp], // Add to cache
            isLoading: false
          }));
          return mockExp;
        }
        throw new Error('Experience not found');
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load experience',
        isLoading: false
      });
      throw error;
    }
  },

  bookExperience: async (experienceId: string) => {
    try {
      // Try to book via API first
      try {
        await bookingsAPI.create(experienceId);
        console.log('Experience booked via API:', experienceId);
      } catch (apiError) {
        console.log('API not available, simulating booking');
        // Simulate booking delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Experience booked (simulated):', experienceId);
      }
    } catch (error) {
      console.error('Error booking experience:', error);
      throw new Error('Failed to book experience. Please try again.');
    }
  },
}));