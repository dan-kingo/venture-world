import { useEffect, useState } from 'react'
import { Check, X, Eye, Mail, MapPin, Calendar, Search } from 'lucide-react'
import { useAdminStore } from '../stores/adminStore'

export default function Providers() {
  const { providers, fetchProviders, approveProvider, rejectProvider, isLoading } = useAdminStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  const filteredProviders = providers.filter(provider => {
    const matchesFilter = filter === 'all' || provider.status === filter
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApprove = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this provider?')) {
      await approveProvider(id)
    }
  }

  const handleReject = async (id: string) => {
    if (window.confirm('Are you sure you want to reject this provider?')) {
      await rejectProvider(id)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Management</h1>
          <p className="text-gray-600">Review and manage experience providers</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                    {providers.filter(p => p.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="card">
            <div className="flex items-start space-x-6">
              {provider.photos && provider.photos.length > 0 ? (
                <img
                  src={provider.photos[0]}
                  alt={provider.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {provider.name}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {provider.email}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {provider.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(provider.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {provider.bio}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>

                    {provider.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(provider.id)}
                          className="btn-success flex items-center space-x-1 text-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(provider.id)}
                          className="btn-danger flex items-center space-x-1 text-sm"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {provider.photos && provider.photos.length > 1 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Additional Photos:</p>
                    <div className="flex space-x-2">
                      {provider.photos.slice(1).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${provider.name} photo ${index + 2}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProviders.length === 0 && (
          <div className="card text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search criteria.' : 'No providers match the selected filter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}