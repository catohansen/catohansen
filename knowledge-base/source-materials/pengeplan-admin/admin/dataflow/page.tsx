/**
 * Admin Data Flow Visualizer - Interaktive diagrammer for debugging og oversikt
 * 
 * Dette er en komplett data flow visualizer som viser hvordan data flyter
 * gjennom hele Pengeplan 2.0 systemet med sanntids-status og interaktivitet.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  Database, 
  Users, 
  Shield, 
  Bot, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Eye,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Download,
  Filter,
  Search
} from 'lucide-react'
// Import ReactFlow CSS
import 'reactflow/dist/style.css'
import SimpleFinanceFlowVisualizer from '@/components/admin/SimpleFinanceFlowVisualizer'

interface DataFlowMetrics {
  totalNodes: number
  activeNodes: number
  dataPoints: number
  averageLatency: number
  errorRate: number
  throughput: number
  lastUpdate: string
}

interface NodeStatus {
  id: string
  name: string
  type: 'source' | 'processor' | 'ai' | 'output'
  status: 'healthy' | 'degraded' | 'error' | 'offline'
  latency: number
  throughput: number
  lastActivity: string
  connections: string[]
}

export default function AdminDataFlowPage() {
  const [metrics, setMetrics] = useState<DataFlowMetrics | null>(null)
  const [nodeStatuses, setNodeStatuses] = useState<NodeStatus[]>([])
  const [isLive, setIsLive] = useState(true)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'healthy' | 'degraded' | 'error'>('all')

  // Mock data for demonstration
  useEffect(() => {
    const mockMetrics: DataFlowMetrics = {
      totalNodes: 9,
      activeNodes: 8,
      dataPoints: 1247,
      averageLatency: 45,
      errorRate: 0.2,
      throughput: 156,
      lastUpdate: new Date().toISOString()
    }

    const mockNodes: NodeStatus[] = [
      {
        id: 'user-input',
        name: 'User Input',
        type: 'source',
        status: 'healthy',
        latency: 12,
        throughput: 45,
        lastActivity: new Date(Date.now() - 2000).toISOString(),
        connections: ['data-validation']
      },
      {
        id: 'data-validation',
        name: 'Data Validation',
        type: 'processor',
        status: 'healthy',
        latency: 8,
        throughput: 42,
        lastActivity: new Date(Date.now() - 1500).toISOString(),
        connections: ['calculations', 'ai-analysis']
      },
      {
        id: 'calculations',
        name: 'Financial Calculations',
        type: 'processor',
        status: 'healthy',
        latency: 15,
        throughput: 38,
        lastActivity: new Date(Date.now() - 1000).toISOString(),
        connections: ['reconciliation']
      },
      {
        id: 'ai-analysis',
        name: 'AI Analysis',
        type: 'ai',
        status: 'healthy',
        latency: 25,
        throughput: 12,
        lastActivity: new Date(Date.now() - 800).toISOString(),
        connections: ['reconciliation']
      },
      {
        id: 'reconciliation',
        name: 'Reconciliation Engine',
        type: 'processor',
        status: 'degraded',
        latency: 35,
        throughput: 28,
        lastActivity: new Date(Date.now() - 500).toISOString(),
        connections: ['audit-logging']
      },
      {
        id: 'audit-logging',
        name: 'Audit Logging',
        type: 'processor',
        status: 'healthy',
        latency: 5,
        throughput: 35,
        lastActivity: new Date(Date.now() - 300).toISOString(),
        connections: ['user-dashboard', 'guardian-dashboard', 'admin-dashboard']
      },
      {
        id: 'user-dashboard',
        name: 'User Dashboard',
        type: 'output',
        status: 'healthy',
        latency: 8,
        throughput: 25,
        lastActivity: new Date(Date.now() - 200).toISOString(),
        connections: []
      },
      {
        id: 'guardian-dashboard',
        name: 'Guardian Dashboard',
        type: 'output',
        status: 'healthy',
        latency: 10,
        throughput: 15,
        lastActivity: new Date(Date.now() - 150).toISOString(),
        connections: []
      },
      {
        id: 'admin-dashboard',
        name: 'Admin Dashboard',
        type: 'output',
        status: 'error',
        latency: 0,
        throughput: 0,
        lastActivity: new Date(Date.now() - 5000).toISOString(),
        connections: []
      }
    ]

    setMetrics(mockMetrics)
    setNodeStatuses(mockNodes)

    // Simulate live updates
    if (isLive) {
      const interval = setInterval(() => {
        setMetrics(prev => prev ? {
          ...prev,
          dataPoints: prev.dataPoints + Math.floor(Math.random() * 10),
          averageLatency: Math.max(10, prev.averageLatency + (Math.random() - 0.5) * 10),
          lastUpdate: new Date().toISOString()
        } : null)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isLive])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200'
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'offline': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />
      case 'degraded': return <AlertTriangle className="h-4 w-4" />
      case 'error': return <AlertTriangle className="h-4 w-4" />
      case 'offline': return <Clock className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'source': return <Users className="h-4 w-4" />
      case 'processor': return <Database className="h-4 w-4" />
      case 'ai': return <Bot className="h-4 w-4" />
      case 'output': return <Eye className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const filteredNodes = nodeStatuses.filter(node => 
    filter === 'all' || node.status === filter
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Flow Visualizer
          </h1>
          <p className="text-gray-600">
            Interaktive diagrammer for debugging og oversikt av dataflyt
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Live Data
          </Badge>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalNodes}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeNodes} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.dataPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Processed today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageLatency}ms</div>
              <p className="text-xs text-muted-foreground">
                System average
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.throughput}/min</div>
              <p className="text-xs text-muted-foreground">
                {metrics.errorRate}% error rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="visualizer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visualizer">Flow Visualizer</TabsTrigger>
          <TabsTrigger value="nodes">Node Status</TabsTrigger>
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="visualizer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Finance Data Flow</span>
              </CardTitle>
              <CardDescription>
                Interaktiv visualisering av hvordan finansielle data flyter gjennom systemet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleFinanceFlowVisualizer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>Node Status</span>
                  </CardTitle>
                  <CardDescription>
                    Sanntids status for alle systemnoder
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="all">All Status</option>
                    <option value="healthy">Healthy</option>
                    <option value="degraded">Degraded</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNodes.map((node) => (
                  <Card 
                    key={node.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(node.type)}
                          <span className="font-medium">{node.name}</span>
                        </div>
                        <Badge className={getStatusColor(node.status)}>
                          {getStatusIcon(node.status)}
                          <span className="ml-1 capitalize">{node.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Latency:</span>
                          <span className="font-medium">{node.latency}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Throughput:</span>
                          <span className="font-medium">{node.throughput}/min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Connections:</span>
                          <span className="font-medium">{node.connections.length}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Last activity: {new Date(node.lastActivity).toLocaleTimeString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Live Metrics</span>
              </CardTitle>
              <CardDescription>
                Sanntids metrics og ytelsesdata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Live Metrics Dashboard
                </h3>
                <p className="text-gray-500 mb-4">
                  Sanntids metrics og ytelsesdata kommer snart
                </p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Metrics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
