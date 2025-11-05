/**
 * Simple Finance Flow Visualizer - Enkel versjon uten ReactFlow
 * 
 * Dette er en forenklet versjon av data flow visualizer som fungerer
 * uten ReactFlow avhengighet.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useEffect } from 'react'
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
  Zap,
  ArrowRight,
  ArrowDown
} from 'lucide-react'

interface FlowNode {
  id: string
  name: string
  type: 'source' | 'processor' | 'ai' | 'output'
  status: 'healthy' | 'degraded' | 'error' | 'offline'
  latency: number
  throughput: number
  description: string
  connections: string[]
}

const flowNodes: FlowNode[] = [
  {
    id: 'user-input',
    name: 'User Input',
    type: 'source',
    status: 'healthy',
    latency: 12,
    throughput: 45,
    description: 'Brukerdata og transaksjoner',
    connections: ['data-validation']
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    type: 'processor',
    status: 'healthy',
    latency: 8,
    throughput: 42,
    description: 'Validering og sanitering av data',
    connections: ['calculations', 'ai-analysis']
  },
  {
    id: 'calculations',
    name: 'Financial Calculations',
    type: 'processor',
    status: 'healthy',
    latency: 15,
    throughput: 38,
    description: 'Økonomiske beregninger og analyser',
    connections: ['reconciliation']
  },
  {
    id: 'ai-analysis',
    name: 'AI Analysis',
    type: 'ai',
    status: 'healthy',
    latency: 25,
    throughput: 12,
    description: 'AI-drevet analyse og anbefalinger',
    connections: ['reconciliation']
  },
  {
    id: 'reconciliation',
    name: 'Reconciliation Engine',
    type: 'processor',
    status: 'degraded',
    latency: 35,
    throughput: 28,
    description: 'Automatisk avstemming og validering',
    connections: ['audit-logging']
  },
  {
    id: 'audit-logging',
    name: 'Audit Logging',
    type: 'processor',
    status: 'healthy',
    latency: 5,
    throughput: 35,
    description: 'Komplett audit trail og logging',
    connections: ['user-dashboard', 'guardian-dashboard', 'admin-dashboard']
  },
  {
    id: 'user-dashboard',
    name: 'User Dashboard',
    type: 'output',
    status: 'healthy',
    latency: 8,
    throughput: 25,
    description: 'Brukerdashboard med økonomisk oversikt',
    connections: []
  },
  {
    id: 'guardian-dashboard',
    name: 'Guardian Dashboard',
    type: 'output',
    status: 'healthy',
    latency: 10,
    throughput: 15,
    description: 'Verge-dashboard med brukeroversikt',
    connections: []
  },
  {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    type: 'output',
    status: 'error',
    latency: 0,
    throughput: 0,
    description: 'Admin-dashboard med systemoversikt',
    connections: []
  }
]

export default function SimpleFinanceFlowVisualizer() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200'
      case 'degraded': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
      case 'source': return <Users className="h-5 w-5" />
      case 'processor': return <Database className="h-5 w-5" />
      case 'ai': return <Cpu className="h-5 w-5" />
      case 'output': return <Eye className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'source': return 'bg-blue-100 text-blue-800'
      case 'processor': return 'bg-purple-100 text-purple-800'
      case 'ai': return 'bg-orange-100 text-orange-800'
      case 'output': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span>Finance Data Flow</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Live
              </Badge>
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? 'Live' : 'Paused'}
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">9</div>
              <div className="text-sm text-gray-600">Total Nodes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-gray-600">Active Nodes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">45ms</div>
              <div className="text-sm text-gray-600">Avg Latency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Data Flow Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Row 1: User Input */}
            <div className="flex justify-center">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'user-input' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'user-input' ? null : 'user-input')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('source')}
                    <div>
                      <div className="font-medium">User Input</div>
                      <div className="text-sm text-gray-600">Brukerdata og transaksjoner</div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>
                      {getStatusIcon('healthy')}
                      <span className="ml-1">Healthy</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </div>

            {/* Row 2: Data Validation */}
            <div className="flex justify-center">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'data-validation' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'data-validation' ? null : 'data-validation')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('processor')}
                    <div>
                      <div className="font-medium">Data Validation</div>
                      <div className="text-sm text-gray-600">Validering og sanitering</div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>
                      {getStatusIcon('healthy')}
                      <span className="ml-1">Healthy</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </div>

            {/* Row 3: Calculations and AI Analysis */}
            <div className="flex justify-center space-x-8">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'calculations' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'calculations' ? null : 'calculations')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('processor')}
                    <div>
                      <div className="font-medium">Financial Calculations</div>
                      <div className="text-sm text-gray-600">Økonomiske beregninger</div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>
                      {getStatusIcon('healthy')}
                      <span className="ml-1">Healthy</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'ai-analysis' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'ai-analysis' ? null : 'ai-analysis')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('ai')}
                    <div>
                      <div className="font-medium">AI Analysis</div>
                      <div className="text-sm text-gray-600">AI-drevet analyse</div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>
                      {getStatusIcon('healthy')}
                      <span className="ml-1">Healthy</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </div>

            {/* Row 4: Reconciliation */}
            <div className="flex justify-center">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'reconciliation' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'reconciliation' ? null : 'reconciliation')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('processor')}
                    <div>
                      <div className="font-medium">Reconciliation Engine</div>
                      <div className="text-sm text-gray-600">Automatisk avstemming</div>
                    </div>
                    <Badge className={getStatusColor('degraded')}>
                      {getStatusIcon('degraded')}
                      <span className="ml-1">Degraded</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </div>

            {/* Row 5: Audit Logging */}
            <div className="flex justify-center">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'audit-logging' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'audit-logging' ? null : 'audit-logging')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('processor')}
                    <div>
                      <div className="font-medium">Audit Logging</div>
                      <div className="text-sm text-gray-600">Komplett audit trail</div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>
                      {getStatusIcon('healthy')}
                      <span className="ml-1">Healthy</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </div>

            {/* Row 6: Dashboards */}
            <div className="flex justify-center space-x-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'user-dashboard' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'user-dashboard' ? null : 'user-dashboard')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('output')}
                    <div>
                      <div className="font-medium">User Dashboard</div>
                      <div className="text-sm text-gray-600">Brukeroversikt</div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>
                      {getStatusIcon('healthy')}
                      <span className="ml-1">Healthy</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'guardian-dashboard' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'guardian-dashboard' ? null : 'guardian-dashboard')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('output')}
                    <div>
                      <div className="font-medium">Guardian Dashboard</div>
                      <div className="text-sm text-gray-600">Verge-oversikt</div>
                    </div>
                    <Badge className={getStatusColor('healthy')}>
                      {getStatusIcon('healthy')}
                      <span className="ml-1">Healthy</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedNode === 'admin-dashboard' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedNode(selectedNode === 'admin-dashboard' ? null : 'admin-dashboard')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon('output')}
                    <div>
                      <div className="font-medium">Admin Dashboard</div>
                      <div className="text-sm text-gray-600">Systemoversikt</div>
                    </div>
                    <Badge className={getStatusColor('error')}>
                      {getStatusIcon('error')}
                      <span className="ml-1">Error</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle>Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const node = flowNodes.find(n => n.id === selectedNode)
              if (!node) return null
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(node.type)}
                    <div>
                      <h3 className="text-lg font-medium">{node.name}</h3>
                      <p className="text-gray-600">{node.description}</p>
                    </div>
                    <Badge className={getStatusColor(node.status)}>
                      {getStatusIcon(node.status)}
                      <span className="ml-1 capitalize">{node.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Latency</div>
                      <div className="text-lg font-medium">{node.latency}ms</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Throughput</div>
                      <div className="text-lg font-medium">{node.throughput}/min</div>
                    </div>
                  </div>
                  
                  {node.connections.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Connections</div>
                      <div className="flex flex-wrap gap-2">
                        {node.connections.map(connId => {
                          const connNode = flowNodes.find(n => n.id === connId)
                          return (
                            <Badge key={connId} variant="outline">
                              {connNode?.name || connId}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}









