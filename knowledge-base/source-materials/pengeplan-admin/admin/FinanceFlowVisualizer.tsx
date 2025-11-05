/**
 * Finance DataFlow Visualizer - Interaktive diagrammer for dataflyt og debugging
 * 
 * Dette systemet viser hvordan økonomiske data flyter gjennom Pengeplan 2.0
 * med interaktive noder, sanntids-status og debugging-informasjon.
 * Perfekt for admin-oversikt og feilsøking.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  Handle,
  Position,
  NodeProps,
  EdgeProps
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Database, 
  Cpu, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react'

export interface DataFlowNode {
  id: string
  type: 'source' | 'processor' | 'storage' | 'output' | 'ai'
  name: string
  description: string
  status: 'healthy' | 'warning' | 'error' | 'processing'
  lastUpdate: Date
  metrics: {
    throughput: number
    latency: number
    errorRate: number
    confidence: number
  }
  connections: string[]
}

export interface DataFlowEdge {
  id: string
  source: string
  target: string
  dataFlow: number
  status: 'active' | 'slow' | 'error'
  lastDataTransfer: Date
}

export interface DataFlowMetrics {
  totalNodes: number
  activeNodes: number
  errorNodes: number
  totalDataFlow: number
  averageLatency: number
  systemHealth: 'healthy' | 'degraded' | 'critical'
}

// Custom Node Components
const SourceNode: React.FC<NodeProps> = ({ data }) => (
  <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
    data.status === 'healthy' ? 'border-green-500 bg-green-50' :
    data.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
    data.status === 'error' ? 'border-red-500 bg-red-50' :
    'border-blue-500 bg-blue-50'
  }`}>
    <Handle type="source" position={Position.Right} />
    <div className="flex items-center space-x-2">
      <Database className="h-4 w-4" />
      <div>
        <div className="font-semibold text-sm">{data.name}</div>
        <div className="text-xs text-gray-600">{data.description}</div>
      </div>
    </div>
    <div className="mt-2 flex justify-between text-xs">
      <span>Throughput: {data.metrics.throughput}/min</span>
      <span className={data.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
        {data.status === 'healthy' ? '✓' : '⚠'}
      </span>
    </div>
  </div>
)

const ProcessorNode: React.FC<NodeProps> = ({ data }) => (
  <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
    data.status === 'healthy' ? 'border-green-500 bg-green-50' :
    data.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
    data.status === 'error' ? 'border-red-500 bg-red-50' :
    'border-purple-500 bg-purple-50'
  }`}>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <div className="flex items-center space-x-2">
      <Cpu className="h-4 w-4" />
      <div>
        <div className="font-semibold text-sm">{data.name}</div>
        <div className="text-xs text-gray-600">{data.description}</div>
      </div>
    </div>
    <div className="mt-2 flex justify-between text-xs">
      <span>Latency: {data.metrics.latency}ms</span>
      <span className={data.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
        {data.status === 'healthy' ? '✓' : '⚠'}
      </span>
    </div>
  </div>
)

const AINode: React.FC<NodeProps> = ({ data }) => (
  <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
    data.status === 'healthy' ? 'border-green-500 bg-green-50' :
    data.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
    data.status === 'error' ? 'border-red-500 bg-red-50' :
    'border-indigo-500 bg-indigo-50'
  }`}>
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <div className="flex items-center space-x-2">
      <Zap className="h-4 w-4" />
      <div>
        <div className="font-semibold text-sm">{data.name}</div>
        <div className="text-xs text-gray-600">{data.description}</div>
      </div>
    </div>
    <div className="mt-2 flex justify-between text-xs">
      <span>Confidence: {(data.metrics.confidence * 100).toFixed(1)}%</span>
      <span className={data.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
        {data.status === 'healthy' ? '✓' : '⚠'}
      </span>
    </div>
  </div>
)

const OutputNode: React.FC<NodeProps> = ({ data }) => (
  <div className={`px-4 py-2 rounded-lg border-2 min-w-[200px] ${
    data.status === 'healthy' ? 'border-green-500 bg-green-50' :
    data.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
    data.status === 'error' ? 'border-red-500 bg-red-50' :
    'border-orange-500 bg-orange-50'
  }`}>
    <Handle type="target" position={Position.Left} />
    <div className="flex items-center space-x-2">
      <TrendingUp className="h-4 w-4" />
      <div>
        <div className="font-semibold text-sm">{data.name}</div>
        <div className="text-xs text-gray-600">{data.description}</div>
      </div>
    </div>
    <div className="mt-2 flex justify-between text-xs">
      <span>Last update: {data.lastUpdate.toLocaleTimeString()}</span>
      <span className={data.status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
        {data.status === 'healthy' ? '✓' : '⚠'}
      </span>
    </div>
  </div>
)

const nodeTypes: NodeTypes = {
  source: SourceNode,
  processor: ProcessorNode,
  ai: AINode,
  output: OutputNode,
}

// Custom Edge Component
const CustomEdge: React.FC<EdgeProps> = ({ data }) => (
  <div className="relative">
    <div className={`px-2 py-1 rounded text-xs ${
      data?.status === 'active' ? 'bg-green-100 text-green-800' :
      data?.status === 'slow' ? 'bg-yellow-100 text-yellow-800' :
      'bg-red-100 text-red-800'
    }`}>
      {data?.dataFlow || 0} data/min
    </div>
  </div>
)

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

export default function FinanceFlowVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [metrics, setMetrics] = useState<DataFlowMetrics | null>(null)
  const [selectedNode, setSelectedNode] = useState<DataFlowNode | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Initial data flow setup
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: 'user-input',
        type: 'source',
        position: { x: 100, y: 100 },
        data: {
          name: 'Brukerinput',
          description: 'Transaksjoner, regninger, budsjetter',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 45, latency: 0, errorRate: 0, confidence: 1.0 }
        }
      },
      {
        id: 'data-validation',
        type: 'processor',
        position: { x: 400, y: 100 },
        data: {
          name: 'Datavalidering',
          description: 'Validerer og renser input-data',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 42, latency: 15, errorRate: 0.02, confidence: 0.98 }
        }
      },
      {
        id: 'finance-calculations',
        type: 'processor',
        position: { x: 700, y: 100 },
        data: {
          name: 'Finansielle beregninger',
          description: 'Beregner saldoer, nettoresultat, gjeld',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 40, latency: 25, errorRate: 0.01, confidence: 0.99 }
        }
      },
      {
        id: 'ai-analysis',
        type: 'ai',
        position: { x: 1000, y: 100 },
        data: {
          name: 'AI-analyse',
          description: 'Genererer innsikter og anbefalinger',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 35, latency: 1200, errorRate: 0.05, confidence: 0.92 }
        }
      },
      {
        id: 'reconciliation',
        type: 'processor',
        position: { x: 400, y: 300 },
        data: {
          name: 'Reconciliation Engine',
          description: 'Validerer dataintegritet og oppdager avvik',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 38, latency: 50, errorRate: 0.01, confidence: 0.97 }
        }
      },
      {
        id: 'audit-logging',
        type: 'processor',
        position: { x: 700, y: 300 },
        data: {
          name: 'Audit Logging',
          description: 'Logger alle beregninger for sporbarhet',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 40, latency: 10, errorRate: 0, confidence: 1.0 }
        }
      },
      {
        id: 'user-dashboard',
        type: 'output',
        position: { x: 1300, y: 100 },
        data: {
          name: 'Bruker Dashboard',
          description: 'Visuell oversikt for brukere',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 30, latency: 200, errorRate: 0.01, confidence: 0.95 }
        }
      },
      {
        id: 'verge-dashboard',
        type: 'output',
        position: { x: 1300, y: 200 },
        data: {
          name: 'Verge Dashboard',
          description: 'Kontrollpanel for verger',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 15, latency: 150, errorRate: 0.01, confidence: 0.96 }
        }
      },
      {
        id: 'admin-monitor',
        type: 'output',
        position: { x: 1000, y: 300 },
        data: {
          name: 'Admin Monitor',
          description: 'Sanntids overvåking og kontroll',
          status: 'healthy',
          lastUpdate: new Date(),
          metrics: { throughput: 25, latency: 100, errorRate: 0, confidence: 0.98 }
        }
      }
    ]

    const initialEdges: Edge[] = [
      {
        id: 'e1-2',
        source: 'user-input',
        target: 'data-validation',
        type: 'custom',
        data: { dataFlow: 45, status: 'active', lastDataTransfer: new Date() }
      },
      {
        id: 'e2-3',
        source: 'data-validation',
        target: 'finance-calculations',
        type: 'custom',
        data: { dataFlow: 42, status: 'active', lastDataTransfer: new Date() }
      },
      {
        id: 'e3-4',
        source: 'finance-calculations',
        target: 'ai-analysis',
        type: 'custom',
        data: { dataFlow: 40, status: 'active', lastDataTransfer: new Date() }
      },
      {
        id: 'e3-5',
        source: 'finance-calculations',
        target: 'reconciliation',
        type: 'custom',
        data: { dataFlow: 40, status: 'active', lastDataTransfer: new Date() }
      },
      {
        id: 'e5-6',
        source: 'reconciliation',
        target: 'audit-logging',
        type: 'custom',
        data: { dataFlow: 38, status: 'active', lastDataTransfer: new Date() }
      },
      {
        id: 'e4-7',
        source: 'ai-analysis',
        target: 'user-dashboard',
        type: 'custom',
        data: { dataFlow: 30, status: 'active', lastDataTransfer: new Date() }
      },
      {
        id: 'e4-8',
        source: 'ai-analysis',
        target: 'verge-dashboard',
        type: 'custom',
        data: { dataFlow: 15, status: 'active', lastDataTransfer: new Date() }
      },
      {
        id: 'e6-9',
        source: 'audit-logging',
        target: 'admin-monitor',
        type: 'custom',
        data: { dataFlow: 25, status: 'active', lastDataTransfer: new Date() }
      }
    ]

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [])

  // Live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      updateDataFlow()
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const updateDataFlow = useCallback(async () => {
    try {
      // Fetch live metrics from API
      const response = await fetch('/api/admin/dataflow/metrics')
      const liveMetrics = await response.json()

      // Update nodes with live data
      setNodes(currentNodes => 
        currentNodes.map(node => {
          const liveData = liveMetrics.nodes.find((n: any) => n.id === node.id)
          if (liveData) {
            return {
              ...node,
              data: {
                ...node.data,
                status: liveData.status,
                lastUpdate: new Date(liveData.lastUpdate),
                metrics: liveData.metrics
              }
            }
          }
          return node
        })
      )

      // Update edges with live data
      setEdges(currentEdges =>
        currentEdges.map(edge => {
          const liveData = liveMetrics.edges.find((e: any) => e.id === edge.id)
          if (liveData) {
            return {
              ...edge,
              data: {
                ...edge.data,
                dataFlow: liveData.dataFlow,
                status: liveData.status,
                lastDataTransfer: new Date(liveData.lastDataTransfer)
              }
            }
          }
          return edge
        })
      )

      // Update overall metrics
      setMetrics(liveMetrics.summary)
    } catch (error) {
      console.error('Failed to update data flow:', error)
    }
  }, [])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as DataFlowNode)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      case 'processing': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'processing': return <Activity className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="h-screen flex">
      {/* Main Flow Diagram */}
      <div className="flex-1">
        <div className="h-full border rounded-lg">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 border-l bg-gray-50 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Data Flow Monitor</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              <Activity className="h-4 w-4 mr-1" />
              {isLive ? 'Live' : 'Paused'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={updateDataFlow}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* System Metrics */}
        {metrics && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Nodes:</span>
                <Badge variant="outline">{metrics.totalNodes}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active:</span>
                <Badge variant="outline" className="text-green-600">
                  {metrics.activeNodes}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Errors:</span>
                <Badge variant="outline" className="text-red-600">
                  {metrics.errorNodes}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Data Flow:</span>
                <Badge variant="outline">
                  {metrics.totalDataFlow}/min
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Latency:</span>
                <Badge variant="outline">
                  {metrics.averageLatency}ms
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Health:</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(metrics.systemHealth)}
                  <span className={`text-sm font-medium ${getStatusColor(metrics.systemHealth)}`}>
                    {metrics.systemHealth}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Node Details */}
        {selectedNode && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Node Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-semibold text-sm">{selectedNode.name}</div>
                <div className="text-xs text-gray-600">{selectedNode.description}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedNode.status)}
                <span className={`text-sm font-medium ${getStatusColor(selectedNode.status)}`}>
                  {selectedNode.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Throughput:</span>
                  <span>{selectedNode.metrics.throughput}/min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Latency:</span>
                  <span>{selectedNode.metrics.latency}ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Error Rate:</span>
                  <span>{(selectedNode.metrics.errorRate * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Confidence:</span>
                  <span>{(selectedNode.metrics.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Last Update:</span>
                  <span>{selectedNode.lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last Update */}
        <div className="text-xs text-gray-500 text-center">
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}









