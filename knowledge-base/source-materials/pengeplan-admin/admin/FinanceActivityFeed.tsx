'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  DollarSign, 
  Eye, 
  FileText, 
  RefreshCw, 
  Shield, 
  TrendingUp, 
  Users,
  Zap,
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  Info,
  XCircle,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'

interface FinanceEvent {
  type: string
  id: string
  userId: string
  source?: string
  action?: string
  amount?: number
  category?: string
  title?: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
  details: string
  confidence?: number
  severity?: string
}

interface FinanceActivityFeedProps {
  className?: string
  maxEvents?: number
  autoScroll?: boolean
  showFilters?: boolean
}

export function FinanceActivityFeed({ 
  className = '',
  maxEvents = 50,
  autoScroll = true,
  showFilters = true
}: FinanceActivityFeedProps) {
  const [events, setEvents] = useState<FinanceEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    warning: 0,
    error: 0
  })
  
  const eventSourceRef = useRef<EventSource | null>(null)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    connectToStream()
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (autoScroll && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [events, autoScroll])

  const connectToStream = () => {
    try {
      const eventSource = new EventSource('/api/live/finance/stream')
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setConnected(true)
        setLoading(false)
        console.log('Connected to Finance Observer stream')
      }

      eventSource.onmessage = (event) => {
        if (paused) return

        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'connection') {
            console.log('Finance Observer connected:', data.message)
            return
          }

          if (data.type === 'error') {
            console.error('Stream error:', data.message)
            return
          }

          // Add new event to the list
          setEvents(prev => {
            const newEvents = [data, ...prev].slice(0, maxEvents)
            return newEvents
          })

          // Update stats
          setStats(prev => ({
            total: prev.total + 1,
            success: prev.success + (data.status === 'success' ? 1 : 0),
            warning: prev.warning + (data.status === 'warning' ? 1 : 0),
            error: prev.error + (data.status === 'error' ? 1 : 0)
          }))

          // Play sound for important events (if not muted)
          if (!muted && (data.status === 'error' || data.severity === 'critical')) {
            playNotificationSound()
          }

        } catch (error) {
          console.error('Error parsing event data:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error)
        setConnected(false)
        
        // Retry connection after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connectToStream()
          }
        }, 5000)
      }

    } catch (error) {
      console.error('Failed to connect to Finance Observer stream:', error)
      setLoading(false)
    }
  }

  const playNotificationSound = () => {
    // Simple notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      console.log('Could not play notification sound')
    }
  }

  const getEventIcon = (type: string, status: string) => {
    switch (type) {
      case 'calculation':
        return <Brain className="h-4 w-4" />
      case 'transaction':
        return <DollarSign className="h-4 w-4" />
      case 'bill':
        return <FileText className="h-4 w-4" />
      case 'ai_question':
        return <Zap className="h-4 w-4" />
      case 'mock_data_detected':
        return <AlertTriangle className="h-4 w-4" />
      case 'calculation_error':
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true
    return event.status === filter
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Nå'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m siden`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}t siden`
    return date.toLocaleTimeString('nb-NO')
  }

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Live Finance Feed
            </CardTitle>
            <CardDescription>
              Sanntids hendelser fra alle økonomiske prosesser
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {connected ? 'Koblet' : 'Frakoblet'}
              </span>
            </div>
            
            {/* Controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <div className="text-sm text-gray-600">Suksess</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
            <div className="text-sm text-gray-600">Advarsel</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <div className="text-sm text-gray-600">Feil</div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Alle
            </Button>
            <Button
              variant={filter === 'success' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('success')}
            >
              Suksess
            </Button>
            <Button
              variant={filter === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('warning')}
            >
              Advarsel
            </Button>
            <Button
              variant={filter === 'error' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('error')}
            >
              Feil
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Kobler til live feed...</span>
          </div>
        ) : (
          <div 
            ref={feedRef}
            className="max-h-96 overflow-y-auto space-y-2"
          >
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.type, event.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {event.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusIcon(event.status)}
                          <span className="ml-1">{event.status.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mt-1">
                      {event.details}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Bruker: {event.userId}</span>
                      {event.source && <span>Kilde: {event.source}</span>}
                      {event.amount && (
                        <span>Beløp: {event.amount.toLocaleString('nb-NO')} kr</span>
                      )}
                      {event.confidence && (
                        <span>Konfidens: {(event.confidence * 100).toFixed(0)}%</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Ingen hendelser å vise</p>
                <p className="text-sm">Vent på nye økonomiske aktiviteter...</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
