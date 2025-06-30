// itineraryStore.ts
import { create } from 'zustand';

interface Place {
  name: string;
  description: string;
  image: string;
  duration: string;
}

interface Itinerary {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  difficulty: string;
  places: Place[];
  tags: string[];
}

interface ItineraryBooking {
  itineraryId: string;
  date: string;
  numberOfPeople: number;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  totalPrice: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

interface ItineraryStore {
  itineraries: Itinerary[];
  bookings: ItineraryBooking[];
  bookItinerary: (itineraryId: string, bookingData: Omit<ItineraryBooking, 'itineraryId'>) => Promise<void>;
  getItineraryById: (id: string) => Itinerary | undefined;
}

// Fallback itineraries data
export const itineraries = [
  {
    id: '1',
    title: '3-Day Cultural Trip',
    description: 'Experience Ethiopia\'s rich culture with this 3-day itinerary.',
    duration: '3 days',
    difficulty: 'Easy',
    price: 450,
    image: 'https://www.musicinafrica.net/sites/default/files/images/article/201601/ethiopian-culture.jpg',
    places: [
      {
        name: 'Hamar People Culture',
        description: 'Home of Lucy fossil.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Dmitri-Markine-Hamer.jpg',
        duration: '2 hours',
      },
      {
        name: 'Cultural Coffee Ceremony',
        description: 'Learn about Ethiopia\'s coffee tradition.',
        image: 'https://www.shutterstock.com/image-photo/harar-ethiopia-september-2018-legendary-260nw-2184167041.jpg',
        duration: '1.5 hours',
      },
      {
        name: 'Merkato Market',
        description: 'Africa\'s largest open-air market.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfuCUsiesB4UfZWm4F2ZYuXUqKv8mfwajZCA&s',
        duration: '3 hours',
      },
    ],
    tags: ['Culture', 'History', 'Food'],
  },
  {
    id: '2',
    title: 'Historical Landmarks Tour',
    description: 'Explore Ethiopia\'s famous historical landmarks.',
    duration: '5 days',
    difficulty: 'Moderate',
    price: 850,
    image: 'https://cdn.britannica.com/23/93423-050-107B2836/obelisk-kingdom-Aksum-Ethiopian-name-city.jpg',
    places: [
      {
        name: 'Lalibela Rock-Hewn Churches',
        description: 'UNESCO World Heritage site.',
        image: 'https://images.unsplash.com/flagged/photo-1572644973628-e9be84915d59?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        duration: 'Full day',
      },
      {
        name: 'Axum Obelisks',
        description: 'Ancient archaeological site.',
        image: 'https://cdn.britannica.com/23/93423-050-107B2836/obelisk-kingdom-Aksum-Ethiopian-name-city.jpg',
        duration: 'Half day',
      },
    ],
    tags: ['History', 'UNESCO', 'Architecture'],
  },
  {
    id: '3',
    title: 'Nature & Eco-Tour',
    description: 'Discover Ethiopia\'s stunning landscapes and eco-tourism sites.',
    duration: '7 days',
    difficulty: 'Challenging',
    price: 1200,
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    places: [
      {
        name: 'Bale Mountains National Park',
        description: 'Spot rare wildlife and scenic views.',
        image: 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npUivll5ZGs3cjeGa5WEmKYr-xE1BiwaG8sfp8s0NTb7DgZc5iiPrim1dsy-VpFds5p5z1VMu4NwKgDz0DBrsFnW0TYtIo154l-p5vfbFxV9CdPv-teIUETdISbiNK1Nso3Um-z=s680-w680-h510-rw',
        duration: '2 days',
      },
      {
        name: 'Lake Tana',
        description: 'Source of the Blue Nile, rich biodiversity.',
        image: 'https://i.ytimg.com/vi/un1uA6eFTaE/maxresdefault.jpg',
        duration: '1 day',
      },
    ],
    tags: ['Nature', 'Wildlife', 'Adventure'],
  },
];

export const useItineraryStore = create<ItineraryStore>((set, get) => ({
  itineraries: itineraries,
  bookings: [],
  
  bookItinerary: async (itineraryId, bookingData) => {
    // Add to bookings with default status
    set((state) => ({
      bookings: [...state.bookings, { 
        itineraryId, 
        ...bookingData,
        status: 'confirmed' // or 'pending' depending on your flow
      }]
    }));
  },
  
  getItineraryById: (id) => {
    return get().itineraries.find(itinerary => itinerary.id === id);
  }
}));