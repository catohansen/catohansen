'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Volume2,
  Loader2
} from 'lucide-react'

interface HealthItem {
  name: string
  status: 'healthy' | 'degraded' | 'error' | 'unknown'
  detail?: string
}

interface SystemHealth {
  overall: {
    status: 'healthy' | 'degraded' | 'error'
    score: number
    uptime: number
  }
  database: {
    status: 'healthy' | 'degraded' | 'error'
    latency: number
  }
  ai: {
    status: 'healthy' | 'degraded' | 'error'
    latency: number
  }
  backup: {
    status: 'healthy' | 'degraded' | 'error'
    health: number
  }
  security: {
    status: 'healthy' | 'degraded' | 'error'
    score: number
  }
  performance: {
    status: 'healthy' | 'degraded' | 'error'
    cpu: number
    memory: number
  }
}

const icons = {
  healthy: <CheckCircle2 className="text-green-500 w-5 h-5" />,
  degraded: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
  error: <XCircle className="text-red-500 w-5 h-5" />,
  unknown: <AlertTriangle className="text-gray-400 w-5 h-5" />
}

export function SystemHealthCard() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [prevHealth, setPrevHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(false)
  const [timestamp, setTimestamp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio for alerts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/alert.mp3')
      audioRef.current.volume = 0.3
    }
  }, [])

  const checkHealth = async (manual = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/system/health')
      const data = await res.json()
      
      if (data.success && data.data) {
        const newHealth = data.data as SystemHealth
        
        // Check for status degradation
        if (prevHealth && !manual) {
          const components = [
            { name: 'Database', old: prevHealth.database?.status, new: newHealth.database?.status },
            { name: 'AI Service', old: prevHealth.ai?.status, new: newHealth.ai?.status },
            { name: 'Backups', old: prevHealth.backup?.status, new: newHealth.backup?.status },
            { name: 'Security', old: prevHealth.security?.status, new: newHealth.security?.status }
          ]
          
          components.forEach((comp) => {
            if (comp.old === 'healthy' && comp.new !== 'healthy') {
              // Status degraded - show notification
              if (typeof window !== 'undefined' && 'Notification' in window) {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    new Notification(`⚠️ ${comp.name} Status: ${comp.new?.toUpperCase()}`, {
                      body: `${comp.name} status changed from healthy to ${comp.new}`,
                      icon: '/favicon.ico'
                    })
                  }
                })
              }
              
              // Play sound if available
              audioRef.current?.play().catch(() => {
                // Ignore audio errors
              })
            }
          })
        }
        
        setPrevHealth(health)
        setHealth(newHealth)
        setTimestamp(new Date().toLocaleTimeString('nb-NO'))
      } else {
        setError('Invalid response from health API')
      }
    } catch (err: any) {
      console.error('Health check failed:', err)
      setError(err.message || 'Failed to fetch system health')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load
    checkHealth()
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => checkHealth(), 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission()
    }
  }, [])

  if (error && !health) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧠 System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-600">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Failed to load system health</p>
            <p className="text-sm text-gray-500">{error}</p>
            <Button onClick={() => checkHealth(true)} className="mt-4" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!health) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧠 System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const components: HealthItem[] = [
    {
      name: 'Database',
      status: health.database?.status || 'unknown',
      detail: health.database?.latency ? `${health.database.latency}ms` : undefined
    },
    {
      name: 'AI Service',
      status: health.ai?.status || 'unknown',
      detail: health.ai?.latency ? `${health.ai.latency}ms` : undefined
    },
    {
      name: 'Backups',
      status: health.backup?.status || 'unknown',
      detail: health.backup?.health ? `${health.backup.health}%` : undefined
    },
    {
      name: 'Security',
      status: health.security?.status || 'unknown',
      detail: health.security?.score ? `${health.security.score}/100` : undefined
    },
    {
      name: 'Performance',
      status: health.performance?.status || 'unknown',
      detail: health.performance?.cpu ? `CPU: ${health.performance.cpu}%, RAM: ${health.performance.memory}%` : undefined
    },
    {
      name: 'Overall System',
      status: health.overall?.status || 'unknown',
      detail: health.overall?.score ? `Score: ${health.overall.score}/100` : undefined
    }
  ]

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          🧠 System Health Overview
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => checkHealth(true)}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => audioRef.current?.play()}
            title="Test alert sound"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {components.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between bg-muted rounded-lg p-3 text-sm border"
            >
              <div className="flex items-center gap-2">
                {icons[c.status]}
                <div>
                  <span className="font-medium">{c.name}</span>
                  {c.detail && (
                    <p className="text-xs text-gray-500 mt-0.5">{c.detail}</p>
                  )}
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  c.status === 'healthy'
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : c.status === 'degraded'
                    ? 'border-yellow-500 text-yellow-600 bg-yellow-50'
                    : 'border-red-500 text-red-600 bg-red-50'
                }
              >
                {c.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ {error}
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Last checked: {timestamp || 'Never'} • Auto-refresh every 60 seconds
        </div>
      </CardContent>
      
      {/* Hidden audio element */}
      <audio src="/sounds/alert.mp3" ref={audioRef} preload="auto" />
    </Card>
  )
}

