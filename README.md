# Venture World - Ethiopian Tourism Platform

A comprehensive tourism platform for Ethiopia featuring AR/VR experiences, smart itineraries, and multi-platform applications.

## 🏗️ Project Structure

```
venture-world/
├── backend/                    # Node.js/Express API server
├── traveler-app/              # React Native mobile app for travelers
├── provider-app/              # React web app for experience providers
├── admin-app/                 # React web app for administrators
└── README.md                  # This file
```

## 📱 Applications Overview

### 1. **Traveler App** (React Native/Expo)
Mobile application for travelers to discover and book experiences in Ethiopia.

**Features:**
- AR/VR experiences with WebAR.js integration
- Smart AI-powered itineraries
- Experience browsing and booking
- User profile management
- Multi-language support (English, Amharic, Oromo)

### 2. **Provider App** (React Web)
Web application for experience providers to manage their offerings.

**Features:**
- Experience creation and management
- Provider profile setup
- Booking management
- Analytics dashboard
- Account approval workflow

### 3. **Admin App** (React Web)
Administrative dashboard for platform management.

**Features:**
- User management (travelers, providers, admins)
- Experience approval workflow
- Booking oversight and confirmation
- Notification system
- Analytics and reporting

### 4. **Backend API** (Node.js/Express)
RESTful API server with MongoDB database.

**Features:**
- Authentication and authorization
- User, experience, and booking management
- File upload with Cloudinary
- Push notifications with Expo
- Admin controls and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Expo CLI (for mobile app)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd venture-world
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - MongoDB connection string
# - Cloudinary credentials (optional)
# - JWT secret

# Seed admin user (optional)
npm run seed:admin

# Start development server
npm run dev
```

**Backend Environment Variables (.env):**
```env
# MongoDB
MONGO_URI_LOCAL=mongodb://localhost:27017/venture-world
MONGO_URI=your_mongodb_atlas_connection_string

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Admin App Setup
```bash
cd admin-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env:
VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

**Access:** http://localhost:3002
**Default Admin Login:**
- Email: admin@example.com
- Password: admin123

### 4. Provider App Setup
```bash
cd provider-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env:
VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

**Access:** http://localhost:3001

### 5. Traveler App Setup (Mobile)
```bash
cd traveler-app

# Install dependencies
npm install

# Update API URL in src/services/api.ts
# Change API_BASE_URL to your local IP:
# const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000/api'

# Start Expo development server
npm start

# Scan QR code with Expo Go app or run on simulator
```

## 📁 Detailed Folder Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── experience.controller.ts
│   │   └── itinerary.controller.ts
│   ├── middlewares/          # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── upload.middleware.ts
│   ├── models/               # MongoDB schemas
│   │   ├── user.model.ts
│   │   ├── experience.model.ts
│   │   └── booking.model.ts
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── experience.routes.ts
│   │   ├── health.routes.ts
│   │   └── itinerary.routes.ts
│   ├── utils/                # Utility functions
│   │   ├── jwt.ts
│   │   ├── upload.ts
│   │   ├── cloudinary.ts
│   │   └── expoNotification.ts
│   ├── config/               # Configuration
│   │   └── db.ts
│   ├── types/                # TypeScript types
│   ├── data/                 # Static data
│   ├── seed/                 # Database seeders
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── uploads/                  # Local file uploads
├── package.json
├── tsconfig.json
└── .env.example
```

### Traveler App (`/traveler-app`)
```
traveler-app/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   │   ├── welcome.tsx
│   │   ├── language.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── index.tsx        # Home
│   │   ├── explore.tsx      # Explore experiences
│   │   ├── bookings.tsx     # User bookings
│   │   └── profile.tsx      # User profile
│   ├── profile/             # Profile sub-pages
│   ├── ar.tsx               # AR experience
│   ├── vr.tsx               # VR experience
│   ├── booking.tsx          # Booking flow
│   ├── itinerary.tsx        # Smart itineraries
│   └── experience/[id].tsx  # Experience details
├── src/
│   ├── services/            # API services
│   │   └── api.ts
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── experienceStore.ts
│   │   └── itineraryStore.ts
│   └── theme/               # Theme configuration
│       └── theme.ts
├── assets/                  # Images, fonts, etc.
├── package.json
├── app.json                 # Expo configuration
└── tsconfig.json
```

### Provider App (`/provider-app`)
```
provider-app/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── AddExperience.tsx
│   │   ├── Experiences.tsx
│   │   └── Profile.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   ├── stores/              # Zustand stores
│   │   ├── authStore.ts
│   │   └── experienceStore.ts
│   └── theme/               # Theme configuration
├── public/                  # Static assets
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

### Admin App (`/admin-app`)
```
admin-app/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Providers.tsx
│   │   ├── Experiences.tsx
│   │   ├── Bookings.tsx
│   │   ├── Notifications.tsx
│   │   └── Support.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   └── stores/              # Zustand stores
│       ├── authStore.ts
│       └── adminStore.ts
├── public/                  # Static assets
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed:admin   # Create admin user
```

### Web Apps (Admin & Provider)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Mobile App (Traveler)
```bash
npm start            # Start Expo development server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run on web
npm run lint         # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/me` - Get current user

### Experiences
- `GET /api/experiences` - Get all approved experiences
- `POST /api/experiences` - Create experience (provider)
- `GET /api/experiences/mine` - Get provider's experiences
- `GET /api/experiences/:id` - Get experience by ID

### Bookings
- `POST /api/bookings` - Create booking (traveler)
- `GET /api/bookings/mine` - Get user's bookings

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/providers` - Get all providers
- `PATCH /api/admin/providers/:id/approve` - Approve provider
- `GET /api/admin/experiences` - Get all experiences
- `PATCH /api/admin/experiences/:id/approve` - Approve experience
- `GET /api/admin/bookings` - Get all bookings
- `PATCH /api/admin/bookings/:id/confirm` - Confirm booking

## 🎨 Features Showcase

### AR/VR Integration
- **WebAR.js**: Browser-based AR experiences
- **360° YouTube Videos**: Immersive VR tours
- **Surface Tracking**: AR content placement
- **Interactive Elements**: Clickable AR objects

### Smart Itineraries
- **AI-Powered**: Curated travel plans
- **Multi-Day Tours**: 3-7 day itineraries
- **Difficulty Levels**: Easy to challenging
- **Cultural Focus**: Heritage and eco-tourism

### Multi-Platform Design
- **Responsive Web**: Desktop and mobile optimized
- **Native Mobile**: React Native with Expo
- **Consistent UI**: Shared design system
- **Dark Theme**: Modern aesthetic

### Real-Time Features
- **Push Notifications**: Expo notifications
- **Live Updates**: Real-time booking status
- **Instant Messaging**: Provider-traveler communication
- **Live Chat**: Customer support

## 🔐 Authentication & Authorization

### User Roles
1. **Traveler**: Browse and book experiences
2. **Provider**: Create and manage experiences
3. **Admin**: Platform administration

### Security Features
- JWT token authentication
- Role-based access control
- Secure password hashing (bcrypt)
- Input validation and sanitization
- File upload restrictions

## 📱 Mobile App Features

### Core Functionality
- **Onboarding**: Welcome flow with language selection
- **Authentication**: Login/register with validation
- **Experience Discovery**: Browse with filters and search
- **AR/VR Experiences**: Immersive content viewing
- **Booking System**: Complete booking flow
- **Profile Management**: User preferences and settings

### Technical Features
- **Offline Support**: Cached data for offline viewing
- **Push Notifications**: Booking updates and promotions
- **Camera Integration**: AR experience activation
- **Location Services**: Location-based recommendations
- **Multi-language**: English, Amharic, Oromo support

## 🌍 Deployment

### Backend Deployment
```bash
# Build the application
npm run build

# Set environment variables
export NODE_ENV=production
export MONGO_URI=your_production_mongodb_uri
export JWT_SECRET=your_production_jwt_secret

# Start the server
npm start
```

### Web Apps Deployment
```bash
# Build for production
npm run build

# Deploy to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Mobile App Deployment
```bash
# Build for production
expo build:android
expo build:ios

# Or use EAS Build
eas build --platform all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@ventureworld.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

## 🙏 Acknowledgments

- Ethiopian Tourism Organization
- WebAR.js community
- React Native community
- All contributors and testers

---

**Built with ❤️ for Ethiopian tourism**