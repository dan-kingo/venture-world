import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, MapPin, Mail, Phone, User, Upload, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

interface ProfileForm {
  name: string
  email: string
  bio: string
  location: string
}

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuthStore()
  const [photos, setPhotos] = useState<string[]>(user?.photos || [])
  const [isEditing, setIsEditing] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
    }
  })

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && photos.length < 2) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotos(prev => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile({ ...data, photos })
      setIsEditing(false)
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleCancel = () => {
    reset()
    setPhotos(user?.photos || [])
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            {photos.length > 0 ? (
              <img
                src={photos[0]}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  user?.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : user?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.status}
                </span>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {user?.location || 'Location not specified'}
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {user?.email}
              </div>
            </div>
          </div>
        </div>

        {user?.bio && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Bio</h3>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="input-field"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input-field"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="input-field"
                placeholder="e.g., Addis Ababa, Ethiopia"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                {...register('bio', { required: 'Bio is required' })}
                rows={4}
                className="input-field"
                placeholder="Tell us about yourself and your expertise..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Up to 2 photos)
              </label>
              <div className="space-y-4">
                {photos.length < 2 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload a photo
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </div>
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        
        {user?.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">Pending Approval</h4>
            <p className="text-sm text-yellow-800">
              Your account is currently under review. You'll receive an email notification 
              once your account is approved and you can start adding experiences.
            </p>
          </div>
        )}

        {user?.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">Account Approved</h4>
            <p className="text-sm text-green-800">
              Your account has been approved! You can now add experiences and start 
              receiving bookings from travelers.
            </p>
          </div>
        )}

        {user?.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-900 mb-2">Account Rejected</h4>
            <p className="text-sm text-red-800">
              Your account application was not approved. Please contact support for more information.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}