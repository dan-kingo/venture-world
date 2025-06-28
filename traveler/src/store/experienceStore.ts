import { create } from 'zustand';

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
  category: 'AR site' | 'eco-tour' | 'heritage';
  provider: {
    id: string;
    name: string;
  };
  rating: number;
  duration: string;
  location: string;
}

interface ExperienceState {
  experiences: Experience[];
  featuredExperiences: Experience[];
  isLoading: boolean;
  fetchExperiences: () => Promise<void>;
  fetchFeaturedExperiences: () => Promise<void>;
  bookExperience: (experienceId: string) => Promise<void>;
}

// Mock data
const mockExperiences: Experience[] = [
  {
    id: '1',
    title: 'Lalibela Rock Churches AR Tour',
    description: 'Experience the ancient rock-hewn churches through augmented reality with historical insights.',
    image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg',
    price: 150,
    category: 'AR site',
    provider: { id: '1', name: 'Ethiopian Heritage Tours' },
    rating: 4.8,
    duration: '3 hours',
    location: 'Lalibela',
  },
  {
    id: '2',
    title: 'Bale Mountains Eco Adventure',
    description: 'Explore the stunning Bale Mountains with expert guides and spot rare wildlife.',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    price: 200,
    category: 'eco-tour',
    provider: { id: '2', name: 'Mountain Adventures Ethiopia' },
    rating: 4.9,
    duration: 'Full day',
    location: 'Bale Mountains',
  },
  {
    id: '3',
    title: 'Axum Obelisks Heritage Walk',
    description: 'Discover the ancient kingdom of Axum and its mysterious obelisks.',
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    price: 100,
    category: 'heritage',
    provider: { id: '3', name: 'Ancient Ethiopia Tours' },
    rating: 4.7,
    duration: '2 hours',
    location: 'Axum',
  },
  {
    id: '4',
    title: 'Coffee Ceremony Cultural Experience',
    description: 'Learn about Ethiopian coffee culture in an authentic ceremony.',
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    price: 50,
    category: 'heritage',
    provider: { id: '4', name: 'Cultural Connections' },
    rating: 4.6,
    duration: '1.5 hours',
    location: 'Addis Ababa',
  },
  {
    id: '5',
    title: 'Simien Mountains VR Experience',
    description: 'Virtual reality tour of the breathtaking Simien Mountains landscape.',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    price: 75,
    category: 'eco-tour',
    provider: { id: '5', name: 'VR Ethiopia Adventures' },
    rating: 4.5,
    duration: '45 minutes',
    location: 'Simien Mountains',
  },
];

export const useExperienceStore = create<ExperienceState>((set) => ({
  experiences: [],
  featuredExperiences: [],
  isLoading: false,

  fetchExperiences: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ experiences: mockExperiences, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching experiences:', error);
    }
  },

  fetchFeaturedExperiences: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const featured = mockExperiences.slice(0, 3);
      set({ featuredExperiences: featured, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error fetching featured experiences:', error);
    }
  },

  bookExperience: async (experienceId: string) => {
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Experience booked:', experienceId);
    } catch (error) {
      console.error('Error booking experience:', error);
      throw error;
    }
  },
}));