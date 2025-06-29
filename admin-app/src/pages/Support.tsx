import { useState } from 'react'
import { MessageSquare, User, Calendar, Search, Filter, Reply } from 'lucide-react'

const supportTickets = [
  {
    id: '1',
    user: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'traveler'
    },
    subject: 'Unable to book AR experience',
    message: 'I\'m having trouble booking the Lalibela AR tour. The payment keeps failing.',
    category: 'booking',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-25 10:30 AM',
    lastReply: '2024-01-25 11:15 AM'
  },
  {
    id: '2',
    user: {
      name: 'John Provider',
      email: 'john@provider.com',
      role: 'provider'
    },
    subject: 'Experience approval status',
    message: 'My experience has been pending approval for 3 days. When will it be reviewed?',
    category: 'account',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-01-24 2:15 PM',
    lastReply: '2024-01-24 3:30 PM'
  },
  {
    id: '3',
    user: {
      name: 'Sarah Explorer',
      email: 'sarah@explorer.com',
      role: 'traveler'
    },
    subject: 'VR experience not loading',
    message: 'The VR experience for Simien Mountains is not loading properly on my device.',
    category: 'technical',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2024-01-23 9:00 AM',
    lastReply: '2024-01-23 4:45 PM'
  }
]

const categories = ['all', 'booking', 'account', 'technical', 'general']
const priorities = ['all', 'low', 'medium', 'high', 'urgent']
const statuses = ['all', 'open', 'in_progress', 'resolved', 'closed']

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'booking':
        return 'bg-blue-100 text-blue-800'
      case 'account':
        return 'bg-purple-100 text-purple-800'
      case 'technical':
        return 'bg-red-100 text-red-800'
      case 'general':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Console</h1>
          <p className="text-gray-600">Manage user feedback and support requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{supportTickets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open</p>
              <p className="text-2xl font-semibold text-gray-900">
                {supportTickets.filter(t => t.status === 'open').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {supportTickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {supportTickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="card">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="input-field"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="input-field"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`card cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedTicket?.id === ticket.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{ticket.subject}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.message}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {ticket.user.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {ticket.createdAt}
                      </div>
                      <span className={`px-2 py-1 rounded-full ${getCategoryColor(ticket.category)}`}>
                        {ticket.category}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="card text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search criteria.' : 'No support tickets match the selected filters.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="card">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTicket.subject}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedTicket.category)}`}>
                    {selectedTicket.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {selectedTicket.user.name} ({selectedTicket.user.role})
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {selectedTicket.createdAt}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedTicket.message}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">User Information</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <p className="text-sm"><strong>Name:</strong> {selectedTicket.user.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedTicket.user.email}</p>
                  <p className="text-sm"><strong>Role:</strong> {selectedTicket.user.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Actions</h4>
                
                <div className="space-y-2">
                  <button className="w-full btn-primary flex items-center justify-center space-x-2">
                    <Reply className="w-4 h-4" />
                    <span>Reply to Ticket</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn-success text-sm">Mark Resolved</button>
                    <button className="btn-secondary text-sm">Assign to Me</button>
                  </div>
                  
                  <select className="input-field text-sm">
                    <option>Change Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Ticket</h3>
              <p className="text-gray-600">Choose a support ticket from the list to view details and take action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}