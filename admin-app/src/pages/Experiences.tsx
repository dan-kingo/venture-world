import { useEffect, useState } from 'react'
import { Check, X, Eye, DollarSign, Tag, Calendar, Search } from 'lucide-react'
import { useAdminStore } from '../stores/adminStore'

export default function Experiences() {
  const { experiences, fetchExperiences, approveExperience, rejectExperience, isLoading } = useAdminStore()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'AR site' | 'eco-tour' | 'heritage'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  const filteredExperiences = experiences.filter(experience => {
    const matchesFilter = filter === 'all' || experience.status === filter
    const matchesCategory = categoryFilter === 'all' || experience.category === categoryFilter
    const matchesSearch = experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experience.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experience.provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesCategory && matchesSearch
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AR site':
        return 'bg-blue-100 text-blue-800'
      case 'eco-tour':
        return 'bg-green-100 text-green-800'
      case 'heritage':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApprove = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this experience?')) {
      await approveExperience(id)
    }
  }

  const handleReject = async (id: string) => {
    if (window.confirm('Are you sure you want to reject this experience?')) {
      await rejectExperience(id)
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
          <h1 className="text-2xl font-bold text-gray-900">Experience Management</h1>
          <p className="text-gray-600">Review and manage travel experiences</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card space-y-4">
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
                    {experiences.filter(e => e.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          {['all', 'AR site', 'eco-tour', 'heritage'].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === category
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        {filteredExperiences.map((experience) => (
          <div key={experience._id} className="card">
            <div className="flex items-start space-x-6">
              <img
                src={experience.image}
                alt={experience.title}
                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {experience.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {experience.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${experience.price}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(experience.createdAt).toLocaleDateString()}
                      </div>
                      <span>by {experience.provider.name}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(experience.category)}`}>
                        {experience.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(experience.status)}`}>
                      {experience.status}
                    </span>

                    {experience.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(experience._id)}
                          className="btn-success flex items-center space-x-1 text-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(experience._id)}
                          className="btn-danger flex items-center space-x-1 text-sm"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredExperiences.length === 0 && (
          <div className="card text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No experiences found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search criteria.' : 'No experiences match the selected filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}