'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Server,
  Database,
  Mail,
  Shield,
  Cpu,
  HardDrive,
  Network,
  Clock
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface ServiceHealth {
  name: string
  status: 'healthy' | 'warning' | 'error' | 'unknown'
  responseTime: number
  lastCheck: string
  details?: string
}

interface SystemEvent {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
  service: string
}

interface HealthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminHealthModal({ isOpen, onClose }: HealthModalProps) {
  const [services, setServices] = useState<ServiceHealth[]>([])
  const [events, setEvents] = useState<SystemEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    if (isOpen) {
      fetchHealthDetails()
    }
  }, [isOpen])

  const fetchHealthDetails = async () => {
    setLoading(true)
    try {
      // Fetch detailed health information
      const [healthResponse, eventsResponse] = await Promise.all([
        fetch('/api/admin/system/health/detailed'),
        fetch('/api/admin/system/events')
      ])

      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        setServices(healthData.services || [])
      }

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData.events || [])
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching health details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Server className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-300'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'error': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getEventIcon = (level: string) => {
    switch (level) {
      case 'info': return <CheckCircle className="h-3 w-3 text-blue-600" />
      case 'warning': return <AlertTriangle className="h-3 w-3 text-yellow-600" />
      case 'error': return <XCircle className="h-3 w-3 text-red-600" />
      default: return <Clock className="h-3 w-3 text-gray-600" />
    }
  }

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'database': return <Database className="h-4 w-4" />
      case 'email': return <Mail className="h-4 w-4" />
      case 'auth': return <Shield className="h-4 w-4" />
      case 'cpu': return <Cpu className="h-4 w-4" />
      case 'memory': return <HardDrive className="h-4 w-4" />
      case 'network': return <Network className="h-4 w-4" />
      default: return <Server className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-600" />
            System Health Details
            <Button
              variant="outline"
              size="sm"
              onClick={fetchHealthDetails}
              disabled={loading}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Services Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(service.name)}
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1 capitalize">{service.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">{service.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Check:</span>
                      <span className="font-medium">
                        {new Date(service.lastCheck).toLocaleTimeString()}
                      </span>
                    </div>
                    {service.details && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        {service.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No recent events
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-0.5">
                      {getEventIcon(event.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {event.service}
                        </span>
                        <Badge 
                          variant={event.level === 'error' ? 'destructive' : 
                                  event.level === 'warning' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {event.level}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{event.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">CPU Usage</span>
                </div>
                <Progress value={34} className="h-2" indicatorColor="bg-orange-500" />
                <span className="text-sm text-gray-600">34%</span>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Memory</span>
                </div>
                <Progress value={68} className="h-2" indicatorColor="bg-blue-500" />
                <span className="text-sm text-gray-600">68%</span>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Disk</span>
                </div>
                <Progress value={52} className="h-2" indicatorColor="bg-green-500" />
                <span className="text-sm text-gray-600">52%</span>
              </div>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-center text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
