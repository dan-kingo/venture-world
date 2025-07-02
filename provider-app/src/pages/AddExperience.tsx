import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, X, MapPin, DollarSign, Tag } from 'lucide-react'
import { useExperienceStore } from '../stores/experienceStore'
import { useNavigate } from 'react-router-dom'

interface ExperienceForm {
  title: string
  description: string
  location: string
  price: number
  category: 'AR site' | 'eco-tour' | 'heritage'
}

const categories = [
  { value: 'AR site', label: 'AR Site', description: 'Augmented reality experiences' },
  { value: 'eco-tour', label: 'Eco Tour', description: 'Nature and wildlife experiences' },
  { value: 'heritage', label: 'Heritage', description: 'Cultural and historical sites' },
]

export default function AddExperience() {
  const [image, setImage] = useState<string>('')
  const { addExperience, isLoading } = useExperienceStore()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExperienceForm>()

  const selectedCategory = watch('category')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage('')
  }

  const onSubmit = async (data: ExperienceForm) => {
    try {
      if (!image) {
        throw new Error('Please upload an image for your experience')
      }

      await addExperience({
        ...data,
        image: image
      })
      navigate('/experiences')
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Experience</h1>
        <p className="text-gray-600">Create a new experience for travelers to discover</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Experience Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className="input-field"
              placeholder="e.g., Lalibela Rock Churches AR Tour"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="input-field"
              placeholder="Describe your experience in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="input-field pl-10"
                placeholder="e.g., Lalibela, Ethiopia"
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    selectedCategory === category.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    {...register('category', { required: 'Category is required' })}
                    type="radio"
                    value={category.value}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-gray-400" />
                        <p className="font-medium text-gray-900">{category.label}</p>
                      </div>
                      <p className="text-gray-500">{category.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 1, message: 'Price must be greater than 0' }
                })}
                type="number"
                className="input-field pl-10"
                placeholder="0"
                min="1"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Image *
            </label>
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload an image
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={image}
                  alt="Experience"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Availability Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Availability</h4>
                <p className="text-sm text-blue-700">
                  Availability calendar will be available soon. For now, your experience will show as "Available Soon".
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/experiences')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}