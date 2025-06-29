import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send, Bell, Users, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useAdminStore } from '../stores/adminStore'

interface NotificationForm {
  title: string
  message: string
  type: 'welcome' | 'booking_confirmed' | 'new_experience' | 'cultural_tip' | 'general'
  target: 'all' | 'travelers' | 'providers'
}

const notificationTypes = [
  { value: 'welcome', label: 'Welcome Message', icon: '👋' },
  { value: 'booking_confirmed', label: 'Booking Confirmed', icon: '✅' },
  { value: 'new_experience', label: 'New Experience Added', icon: '🆕' },
  { value: 'cultural_tip', label: 'Cultural Tip of the Day', icon: '💡' },
  { value: 'general', label: 'General Announcement', icon: '📢' },
]

const targetAudiences = [
  { value: 'all', label: 'All Users', description: 'Send to all registered users' },
  { value: 'travelers', label: 'Travelers Only', description: 'Send to travelers only' },
  { value: 'providers', label: 'Providers Only', description: 'Send to experience providers only' },
]

const recentNotifications = [
  {
    id: '1',
    title: 'Welcome to Venture World!',
    message: 'Thank you for joining our community of travelers and explorers.',
    type: 'welcome',
    target: 'all',
    sentAt: '2024-01-25 10:30 AM',
    recipients: 1234,
    status: 'sent'
  },
  {
    id: '2',
    title: 'New VR Experience Available',
    message: 'Explore the Simien Mountains in stunning virtual reality.',
    type: 'new_experience',
    target: 'travelers',
    sentAt: '2024-01-24 2:15 PM',
    recipients: 856,
    status: 'sent'
  },
  {
    id: '3',
    title: 'Cultural Tip: Ethiopian Coffee Ceremony',
    message: 'Did you know that Ethiopia is the birthplace of coffee? Learn about the traditional coffee ceremony.',
    type: 'cultural_tip',
    target: 'all',
    sentAt: '2024-01-23 9:00 AM',
    recipients: 1234,
    status: 'sent'
  }
]

export default function Notifications() {
  const { sendNotification, isLoading } = useAdminStore()
  const [selectedType, setSelectedType] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<NotificationForm>()

  const watchedType = watch('type')

  const onSubmit = async (data: NotificationForm) => {
    try {
      await sendNotification(data)
      reset()
      setSelectedType('')
    } catch (error) {
      // Error is handled by the store
    }
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    return typeConfig?.icon || '📢'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-600">Send notifications to users via Expo push notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Send New Notification</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Notification Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {notificationTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex cursor-pointer rounded-lg border p-3 focus:outline-none ${
                      watchedType === type.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      {...register('type', { required: 'Notification type is required' })}
                      type="radio"
                      value={type.value}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="space-y-3">
                {targetAudiences.map((target) => (
                  <label
                    key={target.value}
                    className={`relative flex cursor-pointer rounded-lg border p-3 focus:outline-none ${
                      watch('target') === target.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      {...register('target', { required: 'Target audience is required' })}
                      type="radio"
                      value={target.value}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{target.label}</p>
                        <p className="text-xs text-gray-500">{target.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.target && (
                <p className="mt-1 text-sm text-red-600">{errors.target.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Notification Title
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="input-field"
                placeholder="Enter notification title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                rows={4}
                className="input-field"
                placeholder="Enter your notification message..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {/* Preview */}
            {watch('title') && watch('message') && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{watch('title')}</p>
                      <p className="text-sm text-gray-600 mt-1">{watch('message')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Sending...' : 'Send Notification'}</span>
            </button>
          </form>
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Notifications</h2>
          
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Target: {notification.target}</span>
                        <span>Recipients: {notification.recipients}</span>
                        <span>{notification.sentAt}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Templates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-medium text-gray-900">Booking Confirmed</h4>
            </div>
            <p className="text-xs text-gray-600">
              Your booking for [Experience Name] has been confirmed! Get ready for an amazing adventure.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-medium text-gray-900">New Experience</h4>
            </div>
            <p className="text-xs text-gray-600">
              A new VR experience has been added to our platform. Check it out now!
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-medium text-gray-900">Cultural Tip</h4>
            </div>
            <p className="text-xs text-gray-600">
              Did you know? [Cultural fact about Ethiopia]. Learn more about Ethiopian culture.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}