'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle, 
  Shield, 
  Lock, 
  Users, 
  Database, 
  Network, 
  Zap, 
  Ban, 
  Key, 
  Eye, 
  Settings, 
  Play, 
  Pause, 
  Square,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Target,
  ShieldCheck,
  ShieldX,
  AlertCircle
} from 'lucide-react'

interface EmergencyAction {
  id: string
  name: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'ready' | 'executing' | 'completed' | 'failed'
  icon: any
  color: string
  requiresConfirmation: boolean
  estimatedTime: string
}

interface EmergencyStatus {
  isActive: boolean
  lastActivated: string
  actionsExecuted: number
  systemStatus: 'normal' | 'warning' | 'critical' | 'emergency'
  activeThreats: number
  blockedIPs: number
  invalidatedSessions: number
}

export default function EmergencyResponsePanel() {
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const emergencyActions: EmergencyAction[] = [
    {
      id: 'block_all_suspicious',
      name: 'Block All Suspicious IPs',
      description: 'Immediately block all IPs flagged as suspicious or malicious',
      severity: 'critical',
      status: 'ready',
      icon: Ban,
      color: 'bg-red-600',
      requiresConfirmation: true,
      estimatedTime: '30 seconds'
    },
    {
      id: 'invalidate_all_sessions',
      name: 'Invalidate All Sessions',
      description: 'Force all users to re-authenticate by invalidating all active sessions',
      severity: 'high',
      status: 'ready',
      icon: Users,
      color: 'bg-orange-600',
      requiresConfirmation: true,
      estimatedTime: '1 minute'
    },
    {
      id: 'enable_maintenance_mode',
      name: 'Enable Maintenance Mode',
      description: 'Put system in maintenance mode to prevent further access',
      severity: 'critical',
      status: 'ready',
      icon: Lock,
      color: 'bg-purple-600',
      requiresConfirmation: true,
      estimatedTime: '15 seconds'
    },
    {
      id: 'send_emergency_alerts',
      name: 'Send Emergency Alerts',
      description: 'Send immediate alerts to all administrators via all channels',
      severity: 'high',
      status: 'ready',
      icon: AlertTriangle,
      color: 'bg-yellow-600',
      requiresConfirmation: false,
      estimatedTime: '10 seconds'
    },
    {
      id: 'rotate_security_keys',
      name: 'Rotate Security Keys',
      description: 'Immediately rotate all security keys and tokens',
      severity: 'critical',
      status: 'ready',
      icon: Key,
      color: 'bg-blue-600',
      requiresConfirmation: true,
      estimatedTime: '2 minutes'
    },
    {
      id: 'enable_enhanced_monitoring',
      name: 'Enable Enhanced Monitoring',
      description: 'Activate maximum security monitoring and logging',
      severity: 'medium',
      status: 'ready',
      icon: Eye,
      color: 'bg-green-600',
      requiresConfirmation: false,
      estimatedTime: '5 seconds'
    }
  ]

  useEffect(() => {
    fetchEmergencyStatus()
    const interval = setInterval(fetchEmergencyStatus, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Initialize lastUpdate on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !lastUpdate) {
      setLastUpdate(new Date())
    }
  }, [lastUpdate])

  const fetchEmergencyStatus = async () => {
    try {
      const response = await fetch('/api/security/emergency-status')
      const data = await response.json()
      
      if (data.success) {
        setEmergencyStatus(data.status)
      } else {
        // Use mock data if API fails
        setEmergencyStatus({
          isActive: false,
          lastActivated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          actionsExecuted: 0,
          systemStatus: 'normal',
          activeThreats: 0,
          blockedIPs: 0,
          invalidatedSessions: 0
        })
      }
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching emergency status:', error)
    }
  }

  const executeEmergencyAction = async (actionId: string) => {
    const action = emergencyActions.find(a => a.id === actionId)
    if (!action) return

    if (action.requiresConfirmation) {
      const confirmed = confirm(`Are you sure you want to execute: ${action.name}?\n\nThis action cannot be undone.`)
      if (!confirmed) return
    }

    try {
      setIsExecuting(true)
      
      const response = await fetch('/api/security/emergency-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionId })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local status
        setEmergencyStatus(prev => prev ? {
          ...prev,
          actionsExecuted: prev.actionsExecuted + 1,
          systemStatus: action.severity === 'critical' ? 'emergency' : 'warning'
        } : null)
      } else {
        alert(`Failed to execute ${action.name}: ${data.error}`)
      }
    } catch (error) {
      console.error('Error executing emergency action:', error)
      alert(`Error executing ${action.name}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-orange-400'
      case 'emergency': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <ShieldCheck className="h-5 w-5 text-green-400" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case 'critical': return <AlertTriangle className="h-5 w-5 text-orange-400" />
      case 'emergency': return <ShieldX className="h-5 w-5 text-red-400" />
      default: return <Shield className="h-5 w-5 text-gray-400" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const status = emergencyStatus || {
    isActive: false,
    lastActivated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actionsExecuted: 0,
    systemStatus: 'normal',
    activeThreats: 0,
    blockedIPs: 0,
    invalidatedSessions: 0
  }

  return (
    <div className="space-y-6">
      {/* Emergency Status Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                Emergency Response System
              </CardTitle>
              <CardDescription className="text-slate-300">
                Critical security response and containment actions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Loading...'}
              </span>
              <Button
                onClick={fetchEmergencyStatus}
                size="sm"
                variant="outline"
                disabled={isExecuting}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isExecuting ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getStatusColor(status.systemStatus)}`}>
                {status.systemStatus.toUpperCase()}
              </div>
              <p className="text-slate-300 text-sm">System Status</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {getStatusIcon(status.systemStatus)}
                <span className="text-sm text-slate-400">Active</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {status.actionsExecuted}
              </div>
              <p className="text-slate-300 text-sm">Actions Executed</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-400">Today</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">
                {status.activeThreats}
              </div>
              <p className="text-slate-300 text-sm">Active Threats</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Target className="h-4 w-4 text-red-400" />
                <span className="text-sm text-slate-400">Detected</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {status.blockedIPs}
              </div>
              <p className="text-slate-300 text-sm">Blocked IPs</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Ban className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-slate-400">Currently</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyActions.map((action) => {
          const IconComponent = action.icon
          return (
            <Card key={action.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <IconComponent className="h-5 w-5" />
                  {action.name}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={action.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {action.severity}
                    </Badge>
                    <span className="text-sm text-slate-400">
                      {action.estimatedTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(action.severity)}`} />
                    <span className="text-sm text-slate-300">
                      Status: {action.status}
                    </span>
                  </div>

                  <Button
                    onClick={() => executeEmergencyAction(action.id)}
                    className={`w-full ${action.color} hover:opacity-90`}
                    disabled={isExecuting || action.status === 'executing'}
                  >
                    {isExecuting && action.status === 'executing' ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Execute
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Emergency Status Alert */}
      {status.systemStatus === 'emergency' && (
        <Alert className="border-red-500 bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            <strong>EMERGENCY MODE ACTIVE</strong> - System is in emergency response mode. 
            All security measures have been activated. Monitor the situation closely.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Emergency Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-blue-400" />
            Recent Emergency Actions
          </CardTitle>
          <CardDescription className="text-slate-300">
            History of emergency response actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {status.actionsExecuted > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Emergency Response Activated</p>
                      <p className="text-slate-300 text-sm">
                        {status.actionsExecuted} actions executed
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">
                    {new Date(status.lastActivated).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">No emergency actions executed recently</p>
                <p className="text-slate-400 text-sm">System is operating normally</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
