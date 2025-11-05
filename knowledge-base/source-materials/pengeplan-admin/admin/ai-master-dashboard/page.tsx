'use client'

import '../../globals.css'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Removed StatusToggle - using custom button toggle instead
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Brain,
  Bot,
  Zap,
  Shield,
  Activity,
  TrendingUp,
  DollarSign,
  Settings,
  Power,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Play,
  Pause,
  StopCircle,
  Database,
  Cloud,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Key,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  X,
  Info
} from 'lucide-react'

// Types
interface AISystem {
  id: string
  name: string
  type: 'chat' | 'image' | 'voice' | 'automation' | 'agent' | 'provider'
  status: 'active' | 'inactive' | 'error' | 'maintenance'
  health: number
  lastActivity: string
  requestsToday: number
  avgLatency: number
  successRate: number
  cost: number
  description: string
  features: string[]
  dependencies: string[]
  canToggle: boolean
}

interface AIAgent {
  id: string
  name: string
  type: 'financial' | 'security' | 'analytics' | 'automation' | 'compliance'
  status: 'running' | 'stopped' | 'error' | 'paused'
  tasks: number
  completed: number
  failed: number
  lastRun: string
  nextRun: string
  health: number
  description: string
  canControl: boolean
}

interface AIProvider {
  id: string
  name: string
  type: 'hosted' | 'local' | 'open-source'
  status: 'active' | 'inactive' | 'error'
  apiKey: string
  baseUrl: string
  model: string
  cost: number
  latency: number
  successRate: number
  lastUsed: string
  features: string[]
  canConfigure: boolean
}

interface AutomationJob {
  id: string
  name: string
  type: 'cron' | 'event' | 'manual'
  status: 'running' | 'stopped' | 'error' | 'paused'
  schedule: string
  lastRun: string
  nextRun: string
  successRate: number
  description: string
  canControl: boolean
}

interface SystemMetrics {
  totalSystems: number
  activeSystems: number
  totalAgents: number
  runningAgents: number
  totalProviders: number
  activeProviders: number
  totalJobs: number
  runningJobs: number
  totalCost: number
  avgHealth: number
  avgLatency: number
  avgSuccessRate: number
}

export default function AIMasterDashboard() {
  const [systems, setSystems] = useState<AISystem[]>([])
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [jobs, setJobs] = useState<AutomationJob[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [updating, setUpdating] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Fetch all AI data in parallel
      const [systemsRes, agentsRes, providersRes, jobsRes, metricsRes] = await Promise.allSettled([
        fetch('/api/admin/ai/systems').then(r => r.json()),
        fetch('/api/admin/ai/agents').then(r => r.json()),
        fetch('/api/admin/ai/providers').then(r => r.json()),
        fetch('/api/admin/ai/automation').then(r => r.json()),
        fetch('/api/admin/ai/metrics').then(r => r.json())
      ])

      // Process results
      if (systemsRes.status === 'fulfilled') {
        setSystems(systemsRes.value.systems || [])
      }
      if (agentsRes.status === 'fulfilled') {
        setAgents(agentsRes.value.agents || [])
      }
      if (providersRes.status === 'fulfilled') {
        setProviders(providersRes.value.providers || [])
      }
      if (jobsRes.status === 'fulfilled') {
        setJobs(jobsRes.value.jobs || [])
      }
      if (metricsRes.status === 'fulfilled') {
        setMetrics(metricsRes.value.metrics || null)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching AI data:', error)
      // Use mock data on error
      setSystems(getMockSystems())
      setAgents(getMockAgents())
      setProviders(getMockProviders())
      setJobs(getMockJobs())
      setMetrics(getMockMetrics())
    } finally {
      setLoading(false)
    }
  }

  const toggleSystem = async (systemId: string, newStatus: string) => {
    console.log(`🔄 Toggling system ${systemId} to ${newStatus}`)
    
    try {
      setUpdating(systemId)
      
      // Store original status for potential revert
      const originalStatus = systems.find(s => s.id === systemId)?.status
      
      // Update UI immediately (optimistic update)
      setSystems(prev => {
        const updated = prev.map(s => 
          s.id === systemId ? { ...s, status: newStatus as any } : s
        )
        console.log('📝 Updated systems state:', updated.find(s => s.id === systemId))
        return updated
      })
      
      const response = await fetch(`/api/admin/ai/systems/${systemId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      console.log('🌐 Toggle response:', response.status, response.ok)
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Toggle result:', result)
        // Success - UI is already updated
      } else {
        const error = await response.json()
        console.warn('⚠️ Toggle API failed:', error)
        
        // Revert the toggle if update failed
        setSystems(prev => prev.map(s => 
          s.id === systemId ? { ...s, status: originalStatus as any } : s
        ))
        console.log('🔄 Reverted to original status:', originalStatus)
      }
    } catch (error) {
      console.warn('⚠️ Toggle network error:', error)
      
      // Revert the toggle if update failed
      const originalStatus = systems.find(s => s.id === systemId)?.status
      setSystems(prev => prev.map(s => 
        s.id === systemId ? { ...s, status: originalStatus as any } : s
      ))
      console.log('🔄 Reverted to original status:', originalStatus)
    } finally {
      setUpdating(null)
    }
  }

  const controlAgent = async (agentId: string, action: 'start' | 'stop' | 'pause' | 'resume') => {
    try {
      const response = await fetch(`/api/admin/ai/agents/${agentId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (response.ok) {
        setAgents(prev => prev.map(a => {
          let newStatus = a.status
          if (action === 'start') newStatus = 'running'
          else if (action === 'stop') newStatus = 'stopped'
          else if (action === 'pause') newStatus = 'paused'
          else if (action === 'resume') newStatus = 'running'
          
          return a.id === agentId ? { ...a, status: newStatus } : a
        }))
      }
    } catch (error) {
      console.error('Error controlling agent:', error)
    }
  }

  const controlJob = async (jobId: string, action: 'start' | 'stop' | 'pause' | 'resume') => {
    try {
      const response = await fetch(`/api/admin/ai/automation/${jobId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (response.ok) {
        setJobs(prev => prev.map(j => {
          let newStatus = j.status
          if (action === 'start') newStatus = 'running'
          else if (action === 'stop') newStatus = 'stopped'
          else if (action === 'pause') newStatus = 'paused'
          else if (action === 'resume') newStatus = 'running'
          
          return j.id === jobId ? { ...j, status: newStatus } : j
        }))
      }
    } catch (error) {
      console.error('Error controlling job:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'text-green-600 bg-green-100'
      case 'inactive':
      case 'stopped':
        return 'text-gray-600 bg-gray-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'maintenance':
      case 'paused':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return <CheckCircle className="h-4 w-4" />
      case 'inactive':
      case 'stopped':
        return <X className="h-4 w-4" />
      case 'error':
        return <AlertTriangle className="h-4 w-4" />
      case 'maintenance':
      case 'paused':
        return <Pause className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <Brain className="h-5 w-5" />
      case 'image':
        return <Eye className="h-5 w-5" />
      case 'voice':
        return <Zap className="h-5 w-5" />
      case 'automation':
        return <Settings className="h-5 w-5" />
      case 'agent':
        return <Bot className="h-5 w-5" />
      case 'provider':
        return <Cloud className="h-5 w-5" />
      default:
        return <Cpu className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Laster AI Master Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Master Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Komplett oversikt og kontroll over alle AI-systemer, agenter og automatisering
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchAllData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Oppdater
          </Button>
          <Badge variant="outline" className="text-xs">
            Sist oppdatert: {lastUpdated.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* System Overview Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI-systemer</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.activeSystems}/{metrics.totalSystems}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={(metrics.activeSystems / metrics.totalSystems) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI-agenter</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.runningAgents}/{metrics.totalAgents}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={(metrics.runningAgents / metrics.totalAgents) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leverandører</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.activeProviders}/{metrics.totalProviders}
                  </p>
                </div>
                <Cloud className="h-8 w-8 text-purple-600" />
              </div>
              <Progress value={(metrics.activeProviders / metrics.totalProviders) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daglig kostnad</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.totalCost.toFixed(2)} NOK
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Gjennomsnittlig helse: {metrics.avgHealth.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="systems">AI-systemer</TabsTrigger>
          <TabsTrigger value="agents">Agenter</TabsTrigger>
          <TabsTrigger value="providers">Leverandører</TabsTrigger>
          <TabsTrigger value="automation">Automatisering</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Systemhelse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systems.slice(0, 5).map((system) => (
                    <div key={system.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(system.type)}
                        <div>
                          <p className="font-medium">{system.name}</p>
                          <p className="text-sm text-gray-500">{system.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={system.health} className="w-20" />
                        <span className="text-sm font-medium">{system.health}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Nylig aktivitet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents.slice(0, 5).map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bot className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-gray-500">
                            {agent.completed} oppgaver fullført
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Systems Tab */}
        <TabsContent value="systems" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {systems.map((system) => (
              <Card key={system.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        {getTypeIcon(system.type)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{system.name}</CardTitle>
                        <p className="text-gray-600 mt-1">{system.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(system.status)}>
                        {getStatusIcon(system.status)}
                        <span className="ml-1">{system.status}</span>
                      </Badge>
                      {system.canToggle && (
                        <div className="flex items-center gap-2">
                          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-1">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => {
                                  console.log(`🎛️ Toggle clicked for ${system.id}: active`)
                                  toggleSystem(system.id, 'active')
                                }}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                                  system.status === 'active'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                                disabled={updating === system.id}
                              >
                                Aktiv
                              </button>
                              <button
                                onClick={() => {
                                  console.log(`🎛️ Toggle clicked for ${system.id}: inactive`)
                                  toggleSystem(system.id, 'inactive')
                                }}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                                  system.status === 'inactive'
                                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                                disabled={updating === system.id}
                              >
                                Inaktiv
                              </button>
                            </div>
                          </div>
                          {updating === system.id && (
                            <span className="text-xs text-gray-500 animate-pulse">
                              Oppdaterer...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Helse</span>
                        <span className="text-sm font-bold text-gray-900">{system.health}%</span>
                      </div>
                      <Progress value={system.health} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Forespørsler i dag</span>
                      <p className="text-2xl font-bold text-blue-600">{system.requestsToday.toLocaleString()}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Latency</span>
                      <p className="text-2xl font-bold text-green-600">{system.avgLatency}ms</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Kostnad</span>
                      <p className="text-2xl font-bold text-orange-600">{system.cost.toFixed(2)} NOK</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {system.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg text-green-600">
                        <Bot className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{agent.name}</CardTitle>
                        <p className="text-gray-600 mt-1">{agent.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(agent.status)}>
                        {getStatusIcon(agent.status)}
                        <span className="ml-1">{agent.status}</span>
                      </Badge>
                      {agent.canControl && (
                        <div className="flex gap-2">
                          {agent.status === 'running' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => controlAgent(agent.id, 'pause')}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => controlAgent(agent.id, 'start')}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => controlAgent(agent.id, 'stop')}
                          >
                            <StopCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Oppgaver</span>
                      <p className="text-2xl font-bold text-blue-600">{agent.tasks}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Fullført</span>
                      <p className="text-2xl font-bold text-green-600">{agent.completed}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Feilet</span>
                      <p className="text-2xl font-bold text-red-600">{agent.failed}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Helse</span>
                      <p className="text-2xl font-bold text-purple-600">{agent.health}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Sist kjørt</span>
                        <p className="text-sm text-gray-900">
                          {new Date(agent.lastRun).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Neste kjøring</span>
                        <p className="text-sm text-gray-900">
                          {new Date(agent.nextRun).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                        <Cloud className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{provider.name}</CardTitle>
                        <p className="text-gray-600 mt-1">{provider.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(provider.status)}>
                        {getStatusIcon(provider.status)}
                        <span className="ml-1">{provider.status}</span>
                      </Badge>
                      <Badge variant="outline">{provider.type}</Badge>
                      {provider.canConfigure && (
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Kostnad</span>
                      <p className="text-2xl font-bold text-orange-600">{provider.cost} NOK/token</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Latency</span>
                      <p className="text-2xl font-bold text-blue-600">{provider.latency}ms</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Suksessrate</span>
                      <p className="text-2xl font-bold text-green-600">{provider.successRate}%</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Sist brukt</span>
                      <p className="text-sm text-gray-900">
                        {provider.lastUsed ? new Date(provider.lastUsed).toLocaleString() : 'Aldri'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {provider.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                        <Settings className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{job.name}</CardTitle>
                        <p className="text-gray-600 mt-1">{job.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(job.status)}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1">{job.status}</span>
                      </Badge>
                      <Badge variant="outline">{job.type}</Badge>
                      {job.canControl && (
                        <div className="flex gap-2">
                          {job.status === 'running' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => controlJob(job.id, 'pause')}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => controlJob(job.id, 'start')}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => controlJob(job.id, 'stop')}
                          >
                            <StopCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Suksessrate</span>
                      <p className="text-2xl font-bold text-green-600">{job.successRate}%</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Plan</span>
                      <p className="text-sm font-mono text-gray-900">{job.schedule}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Sist kjørt</span>
                      <p className="text-sm text-gray-900">
                        {new Date(job.lastRun).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-600">Neste kjøring</span>
                      <p className="text-sm text-gray-900">
                        {job.nextRun === 'N/A' ? 'Event-driven' : new Date(job.nextRun).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data functions
function getMockSystems(): AISystem[] {
  return [
    {
      id: 'revolutionary-ai',
      name: 'Revolutionary AI',
      type: 'chat',
      status: 'active',
      health: 98,
      lastActivity: new Date().toISOString(),
      requestsToday: 1247,
      avgLatency: 850,
      successRate: 98.5,
      cost: 0.0,
      description: 'Hoved-AI med 20x tenking og kontekstbevissthet',
      features: ['Chat', 'Analysis', 'Prediction', 'Personalization'],
      dependencies: ['deepseek', 'openai'],
      canToggle: true
    },
    {
      id: 'image-analysis-ai',
      name: 'Image Analysis AI',
      type: 'image',
      status: 'active',
      health: 95,
      lastActivity: new Date().toISOString(),
      requestsToday: 456,
      avgLatency: 1200,
      successRate: 96.3,
      cost: 0.02,
      description: 'OCR og bildeanalyse for dokumenter og regninger',
      features: ['OCR', 'Classification', 'Data Extraction'],
      dependencies: ['deepseek'],
      canToggle: true
    },
    {
      id: 'voice-ai',
      name: 'Voice AI Assistant',
      type: 'voice',
      status: 'active',
      health: 92,
      lastActivity: new Date().toISOString(),
      requestsToday: 234,
      avgLatency: 1500,
      successRate: 94.2,
      cost: 0.01,
      description: 'Stemmekontroll og tale-til-tekst',
      features: ['ASR', 'TTS', 'Voice Commands'],
      dependencies: ['openai'],
      canToggle: true
    },
    {
      id: 'self-improving-ai',
      name: 'Self-Improving AI',
      type: 'automation',
      status: 'active',
      health: 89,
      lastActivity: new Date().toISOString(),
      requestsToday: 12,
      avgLatency: 5000,
      successRate: 97.8,
      cost: 0.0,
      description: 'AI som sjekker seg selv og foreslår forbedringer',
      features: ['Self-Monitoring', 'Auto-Fix', 'Learning'],
      dependencies: ['revolutionary-ai'],
      canToggle: true
    }
  ]
}

function getMockAgents(): AIAgent[] {
  return [
    {
      id: 'budget-agent',
      name: 'Budget Agent',
      type: 'financial',
      status: 'running',
      tasks: 45,
      completed: 42,
      failed: 3,
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      health: 96,
      description: 'Budsjettanalyse og anbefalinger',
      canControl: true
    },
    {
      id: 'debt-agent',
      name: 'Debt Agent',
      type: 'financial',
      status: 'running',
      tasks: 23,
      completed: 21,
      failed: 2,
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 7200000).toISOString(),
      health: 94,
      description: 'Gjeldsanalyse og nedbetalingsplaner',
      canControl: true
    },
    {
      id: 'security-agent',
      name: 'Security Agent',
      type: 'security',
      status: 'running',
      tasks: 156,
      completed: 154,
      failed: 2,
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 1800000).toISOString(),
      health: 98,
      description: 'Sikkerhetsovervåking og trussel-deteksjon',
      canControl: true
    },
    {
      id: 'compliance-agent',
      name: 'Compliance Agent',
      type: 'compliance',
      status: 'running',
      tasks: 78,
      completed: 76,
      failed: 2,
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 14400000).toISOString(),
      health: 97,
      description: 'AI Act og GDPR compliance overvåking',
      canControl: true
    }
  ]
}

function getMockProviders(): AIProvider[] {
  return [
    {
      id: 'deepseek',
      name: 'DeepSeek-V3',
      type: 'hosted',
      status: 'active',
      apiKey: 'sk-***',
      baseUrl: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat',
      cost: 0.0,
      latency: 850,
      successRate: 98.5,
      lastUsed: new Date().toISOString(),
      features: ['Chat', 'Code', 'Math', 'Reasoning'],
      canConfigure: true
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4',
      type: 'hosted',
      status: 'active',
      apiKey: 'sk-***',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      cost: 0.0015,
      latency: 1200,
      successRate: 99.2,
      lastUsed: new Date().toISOString(),
      features: ['Chat', 'Code', 'Analysis', 'Creative'],
      canConfigure: true
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      type: 'open-source',
      status: 'active',
      apiKey: 'hf_***',
      baseUrl: 'https://api-inference.huggingface.co',
      model: 'microsoft/DialoGPT-medium',
      cost: 0,
      latency: 2000,
      successRate: 85,
      lastUsed: new Date().toISOString(),
      features: ['Chat', 'Free', 'Open Source'],
      canConfigure: true
    }
  ]
}

function getMockJobs(): AutomationJob[] {
  return [
    {
      id: 'backup-job',
      name: 'Automated Backup',
      type: 'cron',
      status: 'running',
      schedule: '0 2 * * *',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      successRate: 99.5,
      description: 'Daglig backup av database og filer',
      canControl: true
    },
    {
      id: 'ai-health-check',
      name: 'AI Health Check',
      type: 'cron',
      status: 'running',
      schedule: '*/30 * * * *',
      lastRun: new Date().toISOString(),
      nextRun: new Date(Date.now() + 1800000).toISOString(),
      successRate: 97.8,
      description: 'Kontinuerlig overvåking av AI-systemer',
      canControl: true
    },
    {
      id: 'data-sync',
      name: 'Data Synchronization',
      type: 'event',
      status: 'running',
      schedule: 'Event-driven',
      lastRun: new Date().toISOString(),
      nextRun: 'N/A',
      successRate: 98.2,
      description: 'Synkronisering av data mellom systemer',
      canControl: true
    }
  ]
}

function getMockMetrics(): SystemMetrics {
  return {
    totalSystems: 4,
    activeSystems: 4,
    totalAgents: 4,
    runningAgents: 4,
    totalProviders: 3,
    activeProviders: 3,
    totalJobs: 3,
    runningJobs: 3,
    totalCost: 12.45,
    avgHealth: 95.5,
    avgLatency: 1150,
    avgSuccessRate: 97.2
  }
}
