'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Eye, 
  RefreshCw, 
  Search,
  Clock,
  Tag,
  User,
  Settings
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Event {
  event: string
  params: Record<string, unknown>
  ts: string
}

export function EventInspector() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/analytics/events?limit=100')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = useCallback(() => {
    if (!searchTerm) {
      setFilteredEvents(events)
      return
    }

    const filtered = events.filter(event => 
      event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(event.params).toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEvents(filtered)
  }, [events, searchTerm])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, filterEvents])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(loadEvents, 5000) // Refresh every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('nb-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getEventBadgeVariant = (eventName: string) => {
    if (eventName.includes('error') || eventName.includes('blocked')) {
      return 'destructive'
    }
    if (eventName.includes('admin') || eventName.includes('test')) {
      return 'secondary'
    }
    return 'default'
  }

  const getParamIcon = (key: string) => {
    if (key.includes('user') || key.includes('role')) {
      return <User className="h-3 w-3" />
    }
    if (key.includes('time') || key.includes('duration')) {
      return <Clock className="h-3 w-3" />
    }
    if (key.includes('type') || key.includes('category')) {
      return <Tag className="h-3 w-3" />
    }
    return <Settings className="h-3 w-3" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Event Inspector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Søk events</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Søk etter event navn eller parametre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={loadEvents}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Oppdater
              </Button>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                onClick={() => setAutoRefresh(!autoRefresh)}
                size="sm"
              >
                Auto-refresh
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Viser {filteredEvents.length} av {events.length} events</span>
            {autoRefresh && (
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Auto-refresh aktiv
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ingen events funnet
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Prøv å endre søketermen'
                  : 'Send en test event for å se data her'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={getEventBadgeVariant(event.event)}>
                      {event.event}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(event.ts)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Parametre:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Object.entries(event.params).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                        {getParamIcon(key)}
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-600">
                          {typeof value === 'object' 
                            ? JSON.stringify(value) 
                            : String(value)
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}














