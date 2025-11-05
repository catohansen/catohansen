'use client'

import { useState, useEffect } from 'react'
import { Bell, X, AlertTriangle, CheckCircle, Info, Clock, Shield, Bot, Users } from 'lucide-react'
// Utility function for class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  read: boolean
  category: 'security' | 'system' | 'user' | 'ai'
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Sikkerhetsadvarsel',
    message: 'Uvanlig innloggingsaktivitet oppdaget fra ny IP-adresse',
    type: 'warning',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    read: false,
    category: 'security',
    actionUrl: '/admin/security'
  },
  {
    id: '2',
    title: 'AI Agent Status',
    message: 'Budget Assistant har behandlet 15 forespørsler i dag',
    type: 'info',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    read: false,
    category: 'ai',
    actionUrl: '/admin/ai-pilot'
  },
  {
    id: '3',
    title: 'System Oppdatering',
    message: 'Cerbos policies er oppdatert og deployet til produksjon',
    type: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    category: 'system',
    actionUrl: '/admin/cerbos'
  },
  {
    id: '4',
    title: 'Ny Bruker Registrert',
    message: 'test@example.com har registrert seg som premium bruker',
    type: 'info',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    category: 'user',
    actionUrl: '/admin/users'
  },
  {
    id: '5',
    title: 'Backup Fullført',
    message: 'Daglig backup er fullført og lagret til sikker lagring',
    type: 'success',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    category: 'system'
  }
]

interface AdminNotificationsProps {
  className?: string
}

export function AdminNotifications({ className }: AdminNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string, category: string) => {
    if (category === 'security') return Shield
    if (category === 'ai') return Bot
    if (category === 'user') return Users
    
    switch (type) {
      case 'warning': return AlertTriangle
      case 'success': return CheckCircle
      case 'error': return AlertTriangle
      default: return Info
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'success': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m siden`
    if (hours < 24) return `${hours}t siden`
    return `${days}d siden`
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Varsler</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Marker alle som lest
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <div className="text-sm">Ingen varsler</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type, notification.category)
                  
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-gray-50 transition-colors cursor-pointer',
                        !notification.read && 'bg-blue-50'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'flex-shrink-0 p-2 rounded-full',
                          getTypeColor(notification.type)
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={cn(
                                'text-sm font-medium',
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {formatTime(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // Navigate to full notifications page
                  window.location.href = '/admin/notifications'
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                Se alle varsler
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


















