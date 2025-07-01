import { useEffect } from 'react'
import { 
  Users, 
  UserCheck, 
  MapPin, 
  Calendar,
  DollarSign,
  Star,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react'
import { useAdminStore } from '../stores/adminStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const stats = [
  {
    name: 'Total Users',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Active Providers',
    value: '89',
    change: '+8%',
    changeType: 'positive',
    icon: UserCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Total Experiences',
    value: '156',
    change: '+15%',
    changeType: 'positive',
    icon: MapPin,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Total Bookings',
    value: '2,456',
    change: '+23%',
    changeType: 'positive',
    icon: Calendar,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  
]

const chartData = [
  { name: 'Jan', users: 400, bookings: 240, revenue: 2400, experiences: 12 },
  { name: 'Feb', users: 300, bookings: 139, revenue: 2210, experiences: 15 },
  { name: 'Mar', users: 200, bookings: 980, revenue: 2290, experiences: 18 },
  { name: 'Apr', users: 278, bookings: 390, revenue: 2000, experiences: 22 },
  { name: 'May', users: 189, bookings: 480, revenue: 2181, experiences: 25 },
  { name: 'Jun', users: 239, bookings: 380, revenue: 2500, experiences: 28 },
  { name: 'Jul', users: 349, bookings: 430, revenue: 2100, experiences: 32 },
]

const categoryData = [
  { name: 'AR Sites', value: 45, color: '#3B82F6' },
  { name: 'Eco Tours', value: 35, color: '#10B981' },
  { name: 'Heritage', value: 30, color: '#8B5CF6' },
  { name: 'Cultural', value: 20, color: '#F59E0B' },
]

const recentActivity = [
  {
    id: '1',
    type: 'provider_signup',
    message: 'New provider John Doe signed up',
    time: '2 hours ago',
    status: 'pending',
    icon: UserCheck,
    color: 'text-blue-600'
  },
  {
    id: '2',
    type: 'experience_submitted',
    message: 'Experience "Lalibela AR Tour" submitted for review',
    time: '4 hours ago',
    status: 'pending',
    icon: MapPin,
    color: 'text-purple-600'
  },
  {
    id: '3',
    type: 'booking_confirmed',
    message: 'Booking confirmed for Coffee Ceremony Experience',
    time: '6 hours ago',
    status: 'confirmed',
    icon: Calendar,
    color: 'text-green-600'
  },
  {
    id: '4',
    type: 'user_registered',
    message: 'New user Alice Johnson registered',
    time: '8 hours ago',
    status: 'active',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    id: '5',
    type: 'payment_received',
    message: 'Payment of $150 received for AR Tour booking',
    time: '10 hours ago',
    status: 'completed',
    icon: DollarSign,
    color: 'text-emerald-600'
  }
]

const topExperiences = [
  {
    id: '1',
    title: 'Lalibela Rock Churches AR Tour',
    bookings: 45,
    revenue: '$6,750',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg'
  },
  {
    id: '2',
    title: 'Coffee Ceremony Cultural Experience',
    bookings: 38,
    revenue: '$1,900',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg'
  },
  {
    id: '3',
    title: 'Bale Mountains Eco Adventure',
    bookings: 32,
    revenue: '$6,400',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg'
  },
  {
    id: '4',
    title: 'Axum Obelisks Heritage Walk',
    bookings: 28,
    revenue: '$2,800',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg'
  }
]

const systemHealth = [
  { name: 'API Response Time', value: '245ms', status: 'good', color: 'text-green-600' },
  { name: 'Database Performance', value: '98.5%', status: 'good', color: 'text-green-600' },
  { name: 'Server Uptime', value: '99.9%', status: 'excellent', color: 'text-green-600' },
  { name: 'Error Rate', value: '0.02%', status: 'good', color: 'text-green-600' },
]

export default function Dashboard() {
  const { providers, experiences, fetchProviders, fetchExperiences, fetchUsers, fetchBookings } = useAdminStore()

  useEffect(() => {
    fetchProviders()
    fetchExperiences()
    fetchUsers()
    fetchBookings()
  }, [fetchProviders, fetchExperiences, fetchUsers, fetchBookings])

  const pendingProviders = providers.filter(p => p.status === 'pending').length
  const pendingExperiences = experiences.filter(e => e.status === 'pending').length
  const totalPendingActions = pendingProviders + pendingExperiences

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-primary-100">
              Monitor and manage your platform's activity
            </p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Last updated</p>
            <p className="text-white font-medium">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Alert */}
      {totalPendingActions > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {totalPendingActions} item{totalPendingActions !== 1 ? 's' : ''} require{totalPendingActions === 1 ? 's' : ''} your attention
              </h3>
              <p className="text-sm text-yellow-700">
                {pendingProviders > 0 && `${pendingProviders} provider${pendingProviders !== 1 ? 's' : ''} awaiting approval`}
                {pendingProviders > 0 && pendingExperiences > 0 && ', '}
                {pendingExperiences > 0 && `${pendingExperiences} experience${pendingExperiences !== 1 ? 's' : ''} awaiting review`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">New Users</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Revenue ($)</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bookings Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Bookings</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Experience Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Categories</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-600">{category.name}</span>
                <span className="text-sm font-medium text-gray-900 ml-auto">{category.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Experiences */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Experiences</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topExperiences.map((experience, index) => (
            <div key={experience.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{experience.rating}</span>
                </div>
              </div>
              <img 
                src={experience.image} 
                alt={experience.title}
                className="w-full h-24 object-cover rounded-lg mb-3"
              />
              <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                {experience.title}
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Bookings:</span>
                  <span className="font-medium text-gray-900">{experience.bookings}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Revenue:</span>
                  <span className="font-medium text-emerald-600">{experience.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg bg-white`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : activity.status === 'confirmed' || activity.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-4">
            {systemHealth.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{metric.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{metric.status}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${metric.color}`}>{metric.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
            <Users className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-blue-900">Manage Users</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
            <UserCheck className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-sm font-medium text-green-900">Review Providers</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
            <MapPin className="w-5 h-5 text-purple-600 mr-3" />
            <span className="text-sm font-medium text-purple-900">Approve Experiences</span>
          </button>
          
          <button className="flex items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group">
            <Calendar className="w-5 h-5 text-yellow-600 mr-3" />
            <span className="text-sm font-medium text-yellow-900">View Bookings</span>
          </button>
        </div>
      </div>
    </div>
  )
}