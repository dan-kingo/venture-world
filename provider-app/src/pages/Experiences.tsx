import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Users, Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useExperienceStore } from '../stores/experienceStore'

export default function Experiences() {
  const { experiences, fetchExperiences, isLoading, deleteExperience } = useExperienceStore()

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id)
      } catch (error) {
        // Error is handled by the store
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Experiences</h1>
          <p className="text-gray-600">Manage your travel experiences</p>
        </div>
        <Link
          to="/add-experience"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No experiences yet</h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first experience to share with travelers.
          </p>
          <Link to="/add-experience" className="btn-primary">
            Add Your First Experience
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="card">
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
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {experience.category}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${experience.price}
                        </span>
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
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(experience.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(experience.status)}`}>
                          {experience.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit experience"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(experience.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {experience.status === 'pending' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your experience is under review. You'll be notified once it's approved.
                  </p>
                </div>
              )}

              {experience.status === 'rejected' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Your experience was not approved. Please contact support for more information.
                  </p>
                </div>
              )}

              {experience.status === 'approved' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Availability:</strong> Available Soon - Calendar feature coming soon!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}