/**
 * Admin MindMap - Ultra-Advanced Interactive System Overview
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Network, 
  Users, 
  Database, 
  Shield, 
  Zap,
  Search,
  Activity,
  Server,
  Globe,
  Cloud,
  BarChart3,
  RefreshCw,
  Bell,
  Clock,
  CheckCircle,
  Trophy,
  Cpu,
  HardDrive,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Minimize2
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancedTabs, TabsContent } from '@/components/ui/EnhancedTabs'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface MindMapNode {
  id: string
  label: string
  type: 'user' | 'system' | 'api' | 'database' | 'feature' | 'service' | 'analytics'
  status: 'active' | 'inactive' | 'development' | 'warning' | 'error'
  connections: string[]
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  metrics?: {
    users?: number
    requests?: number
    uptime?: number
    responseTime?: number
    performanceScore?: number
    memoryUsage?: number
    cpuUsage?: number
  }
  alerts?: {
    type: 'info' | 'warning' | 'error' | 'success'
    message: string
    timestamp: string
  }[]
}

interface MindMapView {
  id: string
  name: string
  description: string
  color: string
  nodes: MindMapNode[]
}

export default function AdminMindMapPage() {
  const [selectedView, setSelectedView] = useState('system')
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showMetrics, setShowMetrics] = useState(true)
  const [showConnections, setShowConnections] = useState(true)
  const [showAlerts, setShowAlerts] = useState(true)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'degraded' | 'unhealthy'>('healthy')
  const [totalUsers, setTotalUsers] = useState(1247)
  const [totalRequests, setTotalRequests] = useState(89432)
  const [averageResponseTime, setAverageResponseTime] = useState(145)
  
  // Mindmap visualization state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState<'grid' | 'mindmap'>('grid')
  const svgRef = useRef<SVGSVGElement>(null)

  // Enhanced mindmap data
  const mindMapViews: MindMapView[] = [
    {
      id: 'system',
      name: 'System Arkitektur',
      description: 'Komplett oversikt over systemkomponenter med live metrics',
      color: 'from-blue-500 to-cyan-500',
      nodes: [
        {
          id: 'frontend',
          label: 'Frontend (Next.js)',
          type: 'system',
          status: 'active',
          connections: ['api', 'auth', 'database'],
          description: 'Next.js 14 applikasjon med App Router og Server Components',
          priority: 'critical',
          metrics: { 
            users: 1247, 
            requests: 45230, 
            uptime: 99.8, 
            responseTime: 120,
            performanceScore: 94,
            memoryUsage: 65,
            cpuUsage: 23
          },
          alerts: [
            {
              type: 'warning',
              message: 'Memory usage approaching 70%',
              timestamp: '2024-09-20T10:25:00Z'
            }
          ]
        },
        {
          id: 'api',
          label: 'API Gateway',
          type: 'api',
          status: 'active',
          connections: ['database', 'auth', 'ai'],
          description: 'REST API med rate limiting, caching og monitoring',
          priority: 'critical',
          metrics: { 
            requests: 125430, 
            uptime: 99.95, 
            responseTime: 85,
            performanceScore: 96
          },
          alerts: []
        },
        {
          id: 'database',
          label: 'Database Cluster',
          type: 'database',
          status: 'active',
          connections: ['api'],
          description: 'PostgreSQL cluster med read replicas og automated backups',
          priority: 'critical',
          metrics: { 
            requests: 89234, 
            uptime: 99.99, 
            responseTime: 15,
            performanceScore: 91
          },
          alerts: [
            {
              type: 'info',
              message: 'Scheduled maintenance in 2 hours',
              timestamp: '2024-09-20T08:00:00Z'
            }
          ]
        },
        {
          id: 'auth',
          label: 'Authentication Service',
          type: 'system',
          status: 'active',
          connections: ['frontend', 'api'],
          description: 'JWT-basert autentisering med multi-factor authentication',
          priority: 'critical',
          metrics: { 
            users: 1247, 
            uptime: 99.7, 
            responseTime: 95,
            performanceScore: 89
          },
          alerts: []
        },
        {
          id: 'ai',
          label: 'AI/ML Pipeline',
          type: 'service',
          status: 'warning',
          connections: ['api'],
          description: 'Machine learning pipeline for finansiell analyse',
          priority: 'high',
          metrics: { 
            requests: 8543, 
            uptime: 98.5, 
            responseTime: 2340,
            performanceScore: 78
          },
          alerts: [
            {
              type: 'warning',
              message: 'Model accuracy below threshold (85%)',
              timestamp: '2024-09-20T10:15:00Z'
            }
          ]
        },
        {
          id: 'monitoring',
          label: 'Monitoring & Observability',
          type: 'analytics',
          status: 'active',
          connections: ['frontend', 'api', 'database'],
          description: 'Komplett monitoring med metrics, logs og alerts',
          priority: 'high',
          metrics: { 
            requests: 1234567, 
            uptime: 99.95, 
            responseTime: 25,
            performanceScore: 95
          },
          alerts: []
        }
      ]
    },
    {
      id: 'performance',
      name: 'Ytelse & Monitoring',
      description: 'Real-time ytelsesovervåking og systemhelse',
      color: 'from-green-500 to-emerald-500',
      nodes: [
        {
          id: 'response-times',
          label: 'Response Times',
          type: 'analytics',
          status: 'active',
          connections: ['api', 'database', 'frontend'],
          description: 'Real-time responstidsovervåking',
          metrics: { 
            responseTime: 145,
            performanceScore: 92
          },
          alerts: []
        },
        {
          id: 'error-tracking',
          label: 'Error Tracking',
          type: 'analytics',
          status: 'active',
          connections: ['monitoring'],
          description: 'Automatisk feilsporing og -rapportering',
          metrics: { 
            performanceScore: 98
          },
          alerts: []
        }
      ]
    },
    {
      id: 'security',
      name: 'Sikkerhet & Compliance',
      description: 'Sikkerhetsovervåking og compliance-rapportering',
      color: 'from-red-500 to-pink-500',
      nodes: [
        {
          id: 'security-monitoring',
          label: 'Security Monitoring',
          type: 'system',
          status: 'active',
          connections: ['auth'],
          description: 'Kontinuerlig sikkerhetsovervåking',
          metrics: { 
            performanceScore: 96
          },
          alerts: []
        }
      ]
    }
  ]

  // Real-time data simulation
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      setLastUpdated(new Date())
      setTotalUsers(prev => prev + Math.floor(Math.random() * 5) - 2)
      setTotalRequests(prev => prev + Math.floor(Math.random() * 100) + 50)
      setAverageResponseTime(prev => Math.max(50, prev + Math.floor(Math.random() * 20) - 10))
    }, 30000)

    return () => clearInterval(interval)
  }, [isRealTimeEnabled])

  const currentView = mindMapViews.find(v => v.id === selectedView) || mindMapViews[0]
  const filteredNodes = currentView.nodes.filter(node =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />
      case 'system': return <Server className="h-4 w-4" />
      case 'api': return <Globe className="h-4 w-4" />
      case 'database': return <Database className="h-4 w-4" />
      case 'feature': return <Zap className="h-4 w-4" />
      case 'service': return <Cloud className="h-4 w-4" />
      case 'analytics': return <BarChart3 className="h-4 w-4" />
      default: return <Network className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'development': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'error': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'unhealthy': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Mindmap interaction handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1))
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)))
  }

  // Calculate node positions for mindmap layout
  const calculateNodePositions = (nodes: MindMapNode[]) => {
    const positions: { [key: string]: { x: number; y: number } } = {}
    const centerX = 400
    const centerY = 300
    const radius = 200

    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })

    return positions
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header with Real-time Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Network className="h-6 w-6 text-white" />
              </div>
              {isRealTimeEnabled && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                System MindMap Pro
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                Ultra-avansert systemovervåking og visualisering
                <Badge variant="outline" className="ml-2">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </p>
            </div>
          </div>
          
          {/* Real-time System Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">System Health</p>
                  <p className={`text-lg font-bold ${getHealthColor(systemHealth)}`}>
                    {systemHealth === 'healthy' ? '🟢' : systemHealth === 'degraded' ? '🟡' : '🔴'}
                    {systemHealth.charAt(0).toUpperCase() + systemHealth.slice(1)}
                  </p>
                </div>
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">Active Users</p>
                  <p className="text-lg font-bold text-blue-600">{totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium">Requests/min</p>
                  <p className="text-lg font-bold text-purple-600">{Math.floor(totalRequests/60).toLocaleString()}</p>
                </div>
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium">Avg Response</p>
                  <p className="text-lg font-bold text-orange-600">{averageResponseTime}ms</p>
                </div>
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </Card>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Søk komponenter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Display Options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={showMetrics} onCheckedChange={setShowMetrics} />
                <label className="text-sm text-gray-600">Metrics</label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={showConnections} onCheckedChange={setShowConnections} />
                <label className="text-sm text-gray-600">Koblinger</label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={showAlerts} onCheckedChange={setShowAlerts} />
                <label className="text-sm text-gray-600">Alerts</label>
              </div>
          </div>
          
            {/* Real-time Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={isRealTimeEnabled} onCheckedChange={setIsRealTimeEnabled} />
                <label className="text-sm text-gray-600">Live Data</label>
              </div>
              <Button onClick={() => setLastUpdated(new Date())} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Oppdater
              </Button>
            </div>
          </div>
          
          {/* View Mode Controls */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Grid View
              </Button>
              <Button
                variant={viewMode === 'mindmap' ? 'default' : 'outline'}
                onClick={() => setViewMode('mindmap')}
                size="sm"
              >
                <Network className="h-4 w-4 mr-2" />
                MindMap View
              </Button>
            </div>
            
            {viewMode === 'mindmap' && (
              <div className="flex items-center gap-2">
                <Button onClick={handleZoomOut} size="sm" variant="outline">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button onClick={handleZoomIn} size="sm" variant="outline">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button onClick={handleResetView} size="sm" variant="outline">
                  <Move className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </Card>
        </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Views and Nodes */}
        <div className="xl:col-span-3">
          <EnhancedTabs 
            value={selectedView} 
            onValueChange={setSelectedView}
            tabs={mindMapViews.map(view => ({
              value: view.id,
              label: view.name,
              icon: view.id === 'system' ? <Server className="h-4 w-4" /> :
                    view.id === 'performance' ? <Activity className="h-4 w-4" /> :
                    view.id === 'security' ? <Shield className="h-4 w-4" /> : null,
              color: view.id === 'system' ? 'blue' :
                     view.id === 'performance' ? 'green' :
                     view.id === 'security' ? 'red' : 'purple'
            }))}
          >

            {mindMapViews.map((view) => (
              <TabsContent key={view.id} value={view.id} className="mt-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className={`bg-gradient-to-r ${view.color} text-white rounded-t-lg`}>
                    <CardTitle className="flex items-center gap-3">
                      {view.id === 'system' && <Server className="h-5 w-5" />}
                      {view.id === 'performance' && <Activity className="h-5 w-5" />}
                      {view.id === 'security' && <Shield className="h-5 w-5" />}
                      {view.name}
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {filteredNodes.length} komponenter
                      </Badge>
                    </CardTitle>
                    <p className="text-white/90">{view.description}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredNodes.map((node) => (
                          <Card
                            key={node.id}
                            className={`cursor-pointer transition-shadow duration-150 hover:shadow-lg ${
                              selectedNode?.id === node.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                            }`}
                            onClick={() => setSelectedNode(node)}
                          >
                            <CardContent className="p-5">
                              {/* Node Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg bg-gradient-to-br ${view.color} text-white shadow-lg`}>
                                    {getNodeIcon(node.type)}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{node.label}</h3>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(node.status)} variant="outline">
                                  {node.status === 'active' ? '🟢 Aktiv' :
                                   node.status === 'inactive' ? '⚫ Inaktiv' :
                                   node.status === 'development' ? '🟡 Utvikling' :
                                   node.status === 'warning' ? '🟠 Warning' : '🔴 Error'}
                                </Badge>
                              </div>
                              
                              {/* Description */}
                              {node.description && (
                                <p className="text-sm text-gray-600 mb-4">{node.description}</p>
                              )}

                              {/* Connections */}
                              {showConnections && node.connections.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-medium text-gray-500 mb-2">
                                    🔗 Koblet til ({node.connections.length}):
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {node.connections.slice(0, 3).map((connectionId) => {
                                      const connectedNode = view.nodes.find(n => n.id === connectionId)
                                      return connectedNode ? (
                                        <Badge key={connectionId} variant="outline" className="text-xs">
                                          {connectedNode.label}
                                        </Badge>
                                      ) : null
                                    })}
                                    {node.connections.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{node.connections.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Metrics */}
                              {showMetrics && node.metrics && (
                                <div className="grid grid-cols-2 gap-2">
                                  {node.metrics.users && (
                                    <div className="bg-blue-50 p-2 rounded-lg text-center">
                                      <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                                      <p className="text-sm font-bold text-blue-600">
                                        {node.metrics.users.toLocaleString()}
                                      </p>
                                      <p className="text-xs text-blue-500">Users</p>
                                    </div>
                                  )}
                                  {node.metrics.uptime && (
                                    <div className="bg-green-50 p-2 rounded-lg text-center">
                                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                                      <p className="text-sm font-bold text-green-600">
                                        {node.metrics.uptime}%
                                      </p>
                                      <p className="text-xs text-green-500">Uptime</p>
                                    </div>
                                  )}
                                  {node.metrics.responseTime && (
                                    <div className="bg-orange-50 p-2 rounded-lg text-center">
                                      <Clock className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                                      <p className="text-sm font-bold text-orange-600">
                                        {node.metrics.responseTime}ms
                                      </p>
                                      <p className="text-xs text-orange-500">Response</p>
                                    </div>
                                  )}
                                  {node.metrics.performanceScore && (
                                    <div className="bg-purple-50 p-2 rounded-lg text-center">
                                      <Trophy className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                                      <p className="text-sm font-bold text-purple-600">
                                        {node.metrics.performanceScore}
                                      </p>
                                      <p className="text-xs text-purple-500">Score</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Alerts */}
                              {showAlerts && node.alerts && node.alerts.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Bell className="h-3 w-3 text-orange-500" />
                                    <span className="text-xs font-medium text-orange-600">
                                      {node.alerts.length} alert{node.alerts.length !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  {node.alerts.slice(0, 1).map((alert, index) => (
                                    <div key={index} className="text-xs text-gray-600 bg-orange-50 p-2 rounded border-l-2 border-orange-300">
                                      {alert.message}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      // Interactive SVG MindMap View
                      <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg overflow-hidden border-2 border-gray-200">
                        <svg
                          ref={svgRef}
                          className="w-full h-full cursor-grab active:cursor-grabbing"
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onWheel={handleWheel}
                          style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transformOrigin: '0 0'
                          }}
                        >
                          <defs>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                            <marker
                              id="arrowhead"
                              markerWidth="10"
                              markerHeight="7"
                              refX="9"
                              refY="3.5"
                              orient="auto"
                            >
                              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                            </marker>
                          </defs>
                          
                          {/* Connection Lines */}
                          {showConnections && filteredNodes.map((node) => {
                            const nodePos = calculateNodePositions(filteredNodes)[node.id]
                            return node.connections.map((connectionId) => {
                              const connectedNode = view.nodes.find(n => n.id === connectionId)
                              if (!connectedNode) return null
                              const connectedPos = calculateNodePositions(filteredNodes)[connectionId]
                              if (!nodePos || !connectedPos) return null
                              
                              return (
                                <line
                                  key={`${node.id}-${connectionId}`}
                                  x1={nodePos.x}
                                  y1={nodePos.y}
                                  x2={connectedPos.x}
                                  y2={connectedPos.y}
                                  stroke="#3B82F6"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  markerEnd="url(#arrowhead)"
                                  className="opacity-60"
                                />
                              )
                            })
                          })}
                          
                          {/* Nodes */}
                          {filteredNodes.map((node) => {
                            const position = calculateNodePositions(filteredNodes)[node.id]
                            if (!position) return null
                            
                            return (
                              <g key={node.id}>
                                {/* Node Circle */}
                                <circle
                                  cx={position.x}
                                  cy={position.y}
                                  r="40"
                                  fill={node.status === 'active' ? '#10B981' : 
                                        node.status === 'warning' ? '#F59E0B' : 
                                        node.status === 'error' ? '#EF4444' : '#6B7280'}
                                  stroke="white"
                                  strokeWidth="3"
                                  className="cursor-pointer hover:r-50 transition-all duration-300"
                                  filter="url(#glow)"
                                  onClick={() => setSelectedNode(node)}
                                />
                                
                                {/* Node Icon */}
                                <foreignObject
                                  x={position.x - 15}
                                  y={position.y - 15}
                                  width="30"
                                  height="30"
                                  className="pointer-events-none"
                                >
                                  <div className="flex items-center justify-center w-full h-full text-white">
                                    {getNodeIcon(node.type)}
                                  </div>
                                </foreignObject>
                                
                                {/* Node Label */}
                                <text
                                  x={position.x}
                                  y={position.y + 60}
                                  textAnchor="middle"
                                  className="text-sm font-semibold fill-gray-700 pointer-events-none"
                                >
                                  {node.label}
                                </text>
                                
                                {/* Status Indicator */}
                                <circle
                                  cx={position.x + 25}
                                  cy={position.y - 25}
                                  r="8"
                                  fill={node.status === 'active' ? '#10B981' : 
                                        node.status === 'warning' ? '#F59E0B' : 
                                        node.status === 'error' ? '#EF4444' : '#6B7280'}
                                  stroke="white"
                                  strokeWidth="2"
                                />
                              </g>
                            )
                          })}
                        </svg>
                        
                        {/* MindMap Controls Overlay */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <Button onClick={handleZoomIn} size="sm" variant="outline" className="bg-white/90">
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button onClick={handleZoomOut} size="sm" variant="outline" className="bg-white/90">
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button onClick={handleResetView} size="sm" variant="outline" className="bg-white/90">
                            <Move className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Zoom Level Display */}
                        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg text-sm font-medium">
                          {Math.round(zoom * 100)}%
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </EnhancedTabs>
        </div>

        {/* Node Details Sidebar */}
        <div className="xl:col-span-1">
          {selectedNode ? (
            <Card className="sticky top-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className={`bg-gradient-to-r ${currentView.color} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center gap-3">
                  {getNodeIcon(selectedNode.type)}
                  {selectedNode.label}
                </CardTitle>
                <Badge className={getStatusColor(selectedNode.status)} variant="outline">
                  {selectedNode.status}
                </Badge>
                  </CardHeader>
              <CardContent className="p-6 space-y-6">
                    {selectedNode.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Beskrivelse</h4>
                    <p className="text-sm text-gray-600">{selectedNode.description}</p>
                  </div>
                    )}
                    
                {showConnections && selectedNode.connections.length > 0 && (
                      <div>
                    <h4 className="font-semibold mb-3">Koblinger ({selectedNode.connections.length})</h4>
                    <div className="space-y-2">
                          {selectedNode.connections.map((connectionId) => {
                        const connectedNode = currentView.nodes.find(n => n.id === connectionId)
                            if (!connectedNode) return null
                            
                            return (
                          <div
                                key={connectionId}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedNode(connectedNode)}
                              >
                            {getNodeIcon(connectedNode.type)}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{connectedNode.label}</div>
                              <div className="text-xs text-gray-500">{connectedNode.type}</div>
                            </div>
                            <Badge className={getStatusColor(connectedNode.status)} variant="outline">
                              {connectedNode.status}
                              </Badge>
                          </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    
                    {showMetrics && selectedNode.metrics && (
                      <div>
                    <h4 className="font-semibold mb-3">Detaljerte Metrics</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedNode.metrics).map(([key, value]) => {
                        if (typeof value !== 'number') return null
                        
                        const getMetricIcon = (metricKey: string) => {
                          switch (metricKey) {
                            case 'users': return <Users className="h-4 w-4 text-blue-600" />
                            case 'requests': return <Activity className="h-4 w-4 text-green-600" />
                            case 'uptime': return <CheckCircle className="h-4 w-4 text-emerald-600" />
                            case 'responseTime': return <Clock className="h-4 w-4 text-orange-600" />
                            case 'performanceScore': return <Trophy className="h-4 w-4 text-purple-600" />
                            case 'memoryUsage': return <HardDrive className="h-4 w-4 text-yellow-600" />
                            case 'cpuUsage': return <Cpu className="h-4 w-4 text-pink-600" />
                            default: return <BarChart3 className="h-4 w-4 text-gray-600" />
                          }
                        }
                        
                        const formatValue = (metricKey: string, val: number) => {
                          switch (metricKey) {
                            case 'uptime': return `${val}%`
                            case 'responseTime': return `${val}ms`
                            case 'memoryUsage': return `${val}%`
                            case 'cpuUsage': return `${val}%`
                            default: return val.toLocaleString()
                          }
                        }
                        
                        return (
                          <div key={key} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {getMetricIcon(key)}
                              <span className="text-sm font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                              {formatValue(key, value)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                            </div>
                          )}

                {showAlerts && selectedNode.alerts && selectedNode.alerts.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Alerts ({selectedNode.alerts.length})</h4>
                    <div className="space-y-2">
                      {selectedNode.alerts.map((alert, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          alert.type === 'error' ? 'bg-red-50 border-red-500' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                          alert.type === 'success' ? 'bg-green-50 border-green-500' :
                          'bg-blue-50 border-blue-500'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className={
                              alert.type === 'error' ? 'text-red-600 border-red-300' :
                              alert.type === 'warning' ? 'text-yellow-600 border-yellow-300' :
                              alert.type === 'success' ? 'text-green-600 border-green-300' :
                              'text-blue-600 border-blue-300'
                            }>
                              {alert.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(alert.timestamp).toLocaleString('no-NO')}
                            </span>
                            </div>
                          <p className="text-sm text-gray-700">{alert.message}</p>
                        </div>
                      ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
          ) : (
            <Card className="sticky top-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <Network className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Velg en komponent</h3>
                <p className="text-gray-600 mb-6">
                  Klikk på en komponent til venstre for å se detaljerte metrics og informasjon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}