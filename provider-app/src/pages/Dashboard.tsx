import { useEffect } from 'react'
import { 
  DollarSign, 
  Eye, 
  Calendar, 
  Star,
  TrendingUp,
  MapPin,
  Users,
  Clock
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useExperienceStore } from '../stores/experienceStore'

const stats = [
  {
    name: 'Total Earnings',
    value: '$2,450',
    change: '+12%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Total Views',
    value: '57',
    change: '+8%',
    changeType: 'positive',
    icon: Eye,
  },
  {
    name: 'Total Bookings',
    value: '10',
    change: '+3%',
    changeType: 'positive',
    icon: Calendar,
  },
  {
    name: 'Average Rating',
    value: '4.8',
    change: '+0.2',
    changeType: 'positive',
    icon: Star,
  },
]

const recentBookings = [
  {
    id: '1',
    experience: 'Lalibela Rock Churches AR Tour',
    customer: 'Sarah Johnson',
    date: '2024-01-25',
    amount: '$150',
    status: 'confirmed'
  },
  {
    id: '2',
    experience: 'Coffee Ceremony Experience',
    customer: 'Michael Chen',
    date: '2024-01-24',
    amount: '$50',
    status: 'pending'
  },
  {
    id: '3',
    experience: 'Lalibela Rock Churches AR Tour',
    customer: 'Emma Wilson',
    date: '2024-01-23',
    amount: '$150',
    status: 'confirmed'
  }
]

const reviews = [
  {
    id: '1',
    customer: 'Sarah Johnson',
    experience: 'Lalibela Rock Churches AR Tour',
    rating: 5,
    comment: 'Amazing experience! The AR features were incredible and the guide was very knowledgeable.',
    date: '2024-01-20'
  },
  {
    id: '2',
    customer: 'Michael Chen',
    experience: 'Coffee Ceremony Experience',
    rating: 4,
    comment: 'Great cultural experience. Learned so much about Ethiopian coffee traditions.',
    date: '2024-01-18'
  }
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const { experiences, fetchExperiences } = useExperienceStore()

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  if (user?.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Account Pending Approval
          </h3>
          <p className="text-yellow-800">
            Your provider account is currently under review. You'll receive an email notification 
            once your account is approved and you can start adding experiences.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your experiences today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{booking.experience}</p>
                  <p className="text-sm text-gray-500">{booking.customer}</p>
                  <p className="text-xs text-gray-400">{booking.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{booking.amount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
            <Star className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{review.customer}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{review.experience}</p>
                <p className="text-sm text-gray-500">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Performance */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Performance</h3>
        <div className="space-y-4">
          {experiences.map((experience) => (
            <div key={experience.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{experience.title}</h4>
                  <p className="text-sm text-gray-500">{experience.category}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    experience.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : experience.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {experience.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {experience.views || 0} views
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {experience.bookings || 0} bookings
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  ${experience.price || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}