'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Users, 
  Shield, 
  Settings, 
  Brain, 
  Star, 
  Eye, 
  Edit,
  Search,
  Maximize2,
  Minimize2,
  Download,
  XCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Node {
  id: string
  type: 'user' | 'role' | 'function' | 'module'
  label: string
  x: number
  y: number
  color: string
  size: number
  connections: string[]
  metadata: {
    description?: string
    permissions?: string[]
    status?: 'active' | 'inactive' | 'pending'
    lastAccess?: string
    userCount?: number
  }
}

interface Connection {
  from: string
  to: string
  type: 'permission' | 'inheritance' | 'dependency' | 'access'
  label: string
  strength: number
  color: string
}

export default function MindmapSystem() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'connections'>('overview')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initialize mindmap data
  useEffect(() => {
    const initialNodes: Node[] = [
      // Core System Nodes
      {
        id: 'system-core',
        type: 'module',
        label: 'Pengeplan 2.0 Core',
        x: 400,
        y: 200,
        color: 'from-violet-500 to-purple-500',
        size: 80,
        connections: ['admin-role', 'user-role', 'verge-role', 'superadmin-role'],
        metadata: {
          description: 'Hovedsystemet for økonomisk planlegging',
          status: 'active'
        }
      },
      
      // User Roles
      {
        id: 'superadmin-role',
        type: 'role',
        label: 'Super Administrator',
        x: 200,
        y: 100,
        color: 'from-red-500 to-pink-500',
        size: 60,
        connections: ['system-core', 'admin-functions', 'user-management', 'system-settings'],
        metadata: {
          description: 'Full systemtilgang og administrasjon',
          userCount: 1,
          status: 'active'
        }
      },
      {
        id: 'admin-role',
        type: 'role',
        label: 'Administrator',
        x: 200,
        y: 300,
        color: 'from-orange-500 to-red-500',
        size: 55,
        connections: ['system-core', 'user-management', 'reports', 'analytics'],
        metadata: {
          description: 'Administrasjon av brukere og rapporter',
          userCount: 2,
          status: 'active'
        }
      },
      {
        id: 'verge-role',
        type: 'role',
        label: 'Verge',
        x: 200,
        y: 500,
        color: 'from-green-500 to-emerald-500',
        size: 50,
        connections: ['system-core', 'dependent-management', 'consent-management'],
        metadata: {
          description: 'Administrasjon av vergehavere',
          userCount: 5,
          status: 'active'
        }
      },
      {
        id: 'user-role',
        type: 'role',
        label: 'Bruker',
        x: 200,
        y: 700,
        color: 'from-blue-500 to-cyan-500',
        size: 45,
        connections: ['system-core', 'budget-functions', 'debt-functions', 'ai-advisor'],
        metadata: {
          description: 'Standard bruker med grunnleggende funksjoner',
          userCount: 150,
          status: 'active'
        }
      },

      // Function Modules
      {
        id: 'admin-functions',
        type: 'function',
        label: 'Admin Funksjoner',
        x: 600,
        y: 100,
        color: 'from-slate-500 to-gray-500',
        size: 50,
        connections: ['superadmin-role', 'user-management', 'system-settings'],
        metadata: {
          description: 'Administrative funksjoner og verktøy',
          permissions: ['users.manage', 'roles.manage', 'system.settings'],
          status: 'active'
        }
      },
      {
        id: 'user-management',
        type: 'function',
        label: 'Brukerstyring',
        x: 600,
        y: 200,
        color: 'from-indigo-500 to-blue-500',
        size: 45,
        connections: ['admin-role', 'superadmin-role', 'admin-functions'],
        metadata: {
          description: 'Administrasjon av brukere og roller',
          permissions: ['users.create', 'users.read', 'users.update', 'users.delete'],
          status: 'active'
        }
      },
      {
        id: 'budget-functions',
        type: 'function',
        label: 'Budsjett',
        x: 600,
        y: 400,
        color: 'from-green-500 to-emerald-500',
        size: 40,
        connections: ['user-role', 'ai-advisor', 'reports'],
        metadata: {
          description: 'Budsjettplanlegging og -sporing',
          permissions: ['budget.read', 'budget.write', 'budget.create'],
          status: 'active'
        }
      },
      {
        id: 'debt-functions',
        type: 'function',
        label: 'Gjeld',
        x: 600,
        y: 500,
        color: 'from-orange-500 to-red-500',
        size: 40,
        connections: ['user-role', 'ai-advisor', 'reports'],
        metadata: {
          description: 'Gjeldshåndtering og betalingsplaner',
          permissions: ['debt.read', 'debt.write', 'debt.plan'],
          status: 'active'
        }
      },
      {
        id: 'ai-advisor',
        type: 'function',
        label: 'AI-Rådgiver',
        x: 600,
        y: 600,
        color: 'from-purple-500 to-violet-500',
        size: 45,
        connections: ['user-role', 'budget-functions', 'debt-functions'],
        metadata: {
          description: 'AI-drevet økonomisk rådgivning',
          permissions: ['ai.chat', 'ai.advice', 'ai.analyze'],
          status: 'active'
        }
      },
      {
        id: 'reports',
        type: 'function',
        label: 'Rapporter',
        x: 600,
        y: 700,
        color: 'from-cyan-500 to-blue-500',
        size: 40,
        connections: ['admin-role', 'budget-functions', 'debt-functions'],
        metadata: {
          description: 'Rapporter og analyser',
          permissions: ['reports.read', 'reports.generate', 'reports.export'],
          status: 'active'
        }
      },
      {
        id: 'analytics',
        type: 'function',
        label: 'Analytikk',
        x: 600,
        y: 800,
        color: 'from-yellow-500 to-orange-500',
        size: 40,
        connections: ['admin-role', 'reports'],
        metadata: {
          description: 'Systemanalytikk og statistikk',
          permissions: ['analytics.read', 'analytics.admin'],
          status: 'active'
        }
      },
      {
        id: 'dependent-management',
        type: 'function',
        label: 'Vergehåndtering',
        x: 800,
        y: 500,
        color: 'from-teal-500 to-green-500',
        size: 40,
        connections: ['verge-role', 'consent-management'],
        metadata: {
          description: 'Administrasjon av vergehavere',
          permissions: ['dependents.manage', 'dependents.read'],
          status: 'active'
        }
      },
      {
        id: 'consent-management',
        type: 'function',
        label: 'Samtykke',
        x: 800,
        y: 600,
        color: 'from-pink-500 to-rose-500',
        size: 35,
        connections: ['verge-role', 'dependent-management'],
        metadata: {
          description: 'Samtykkehåndtering og GDPR',
          permissions: ['consent.manage', 'consent.read'],
          status: 'active'
        }
      },
      {
        id: 'system-settings',
        type: 'function',
        label: 'Systeminnstillinger',
        x: 800,
        y: 100,
        color: 'from-gray-500 to-slate-500',
        size: 40,
        connections: ['superadmin-role', 'admin-functions'],
        metadata: {
          description: 'Systemkonfigurasjon og innstillinger',
          permissions: ['system.settings', 'system.configure'],
          status: 'active'
        }
      }
    ]

    const initialConnections: Connection[] = [
      // Role to System connections
      { from: 'superadmin-role', to: 'system-core', type: 'access', label: 'Full tilgang', strength: 100, color: 'red' },
      { from: 'admin-role', to: 'system-core', type: 'access', label: 'Admin tilgang', strength: 80, color: 'orange' },
      { from: 'verge-role', to: 'system-core', type: 'access', label: 'Verge tilgang', strength: 60, color: 'green' },
      { from: 'user-role', to: 'system-core', type: 'access', label: 'Bruker tilgang', strength: 40, color: 'blue' },

      // Role to Function connections
      { from: 'superadmin-role', to: 'admin-functions', type: 'permission', label: 'Full kontroll', strength: 100, color: 'red' },
      { from: 'admin-role', to: 'user-management', type: 'permission', label: 'Brukerstyring', strength: 90, color: 'orange' },
      { from: 'user-role', to: 'budget-functions', type: 'permission', label: 'Budsjett', strength: 70, color: 'blue' },
      { from: 'user-role', to: 'debt-functions', type: 'permission', label: 'Gjeld', strength: 70, color: 'blue' },
      { from: 'user-role', to: 'ai-advisor', type: 'permission', label: 'AI-rådgivning', strength: 80, color: 'blue' },
      { from: 'verge-role', to: 'dependent-management', type: 'permission', label: 'Vergehåndtering', strength: 85, color: 'green' },
      { from: 'verge-role', to: 'consent-management', type: 'permission', label: 'Samtykke', strength: 90, color: 'green' },

      // Function to Function connections
      { from: 'budget-functions', to: 'ai-advisor', type: 'dependency', label: 'Data deling', strength: 60, color: 'purple' },
      { from: 'debt-functions', to: 'ai-advisor', type: 'dependency', label: 'Data deling', strength: 60, color: 'purple' },
      { from: 'budget-functions', to: 'reports', type: 'dependency', label: 'Rapportdata', strength: 70, color: 'cyan' },
      { from: 'debt-functions', to: 'reports', type: 'dependency', label: 'Rapportdata', strength: 70, color: 'cyan' },
      { from: 'reports', to: 'analytics', type: 'dependency', label: 'Analysedata', strength: 80, color: 'yellow' }
    ]

    setNodes(initialNodes)
    setConnections(initialConnections)
  }, [])

  const filteredNodes = nodes.filter(node => {
    if (filterType !== 'all' && node.type !== filterType) return false
    if (searchTerm && !node.label.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getNodeColor = (node: Node) => {
    const colorMap = {
      'from-violet-500 to-purple-500': 'bg-gradient-to-br from-violet-500 to-purple-500',
      'from-red-500 to-pink-500': 'bg-gradient-to-br from-red-500 to-pink-500',
      'from-orange-500 to-red-500': 'bg-gradient-to-br from-orange-500 to-red-500',
      'from-green-500 to-emerald-500': 'bg-gradient-to-br from-green-500 to-emerald-500',
      'from-blue-500 to-cyan-500': 'bg-gradient-to-br from-blue-500 to-cyan-500',
      'from-slate-500 to-gray-500': 'bg-gradient-to-br from-slate-500 to-gray-500',
      'from-indigo-500 to-blue-500': 'bg-gradient-to-br from-indigo-500 to-blue-500',
      'from-purple-500 to-violet-500': 'bg-gradient-to-br from-purple-500 to-violet-500',
      'from-cyan-500 to-blue-500': 'bg-gradient-to-br from-cyan-500 to-blue-500',
      'from-yellow-500 to-orange-500': 'bg-gradient-to-br from-yellow-500 to-orange-500',
      'from-teal-500 to-green-500': 'bg-gradient-to-br from-teal-500 to-green-500',
      'from-pink-500 to-rose-500': 'bg-gradient-to-br from-pink-500 to-rose-500',
      'from-gray-500 to-slate-500': 'bg-gradient-to-br from-gray-500 to-slate-500'
    }
    return colorMap[node.color as keyof typeof colorMap] || 'bg-gradient-to-br from-gray-500 to-gray-600'
  }

  const getNodeIcon = (node: Node) => {
    switch (node.type) {
      case 'user': return <Users className="h-4 w-4" />
      case 'role': return <Shield className="h-4 w-4" />
      case 'function': return <Settings className="h-4 w-4" />
      case 'module': return <Brain className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <Card className={`${isFullscreen ? 'h-full' : 'h-[800px]'} bg-white/80 backdrop-blur border-violet-200 shadow-2xl`}>
        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">System Mindmap</CardTitle>
                <p className="text-sm text-gray-600">Visuell oversikt over alle funksjoner, roller og tilganger</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Søk i systemet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-violet-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-300"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 border border-violet-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-300"
            >
              <option value="all">Alle typer</option>
              <option value="role">Roller</option>
              <option value="function">Funksjoner</option>
              <option value="module">Moduler</option>
              <option value="user">Brukere</option>
            </select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('overview')}
                className="text-xs"
              >
                Oversikt
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
                className="text-xs"
              >
                Detaljert
              </Button>
              <Button
                variant={viewMode === 'connections' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('connections')}
                className="text-xs"
              >
                Forbindelser
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 relative overflow-hidden">
          {/* Legend */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border border-violet-200">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Forklaring</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-red-500 to-pink-500"></div>
                <span>Super Administrator</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500"></div>
                <span>Administrator</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"></div>
                <span>Verge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                <span>Bruker</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-500"></div>
                <span>System Moduler</span>
              </div>
            </div>
          </div>

          {/* Mindmap Canvas */}
          <div 
            ref={canvasRef}
            className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-gray-50 to-slate-100 overflow-auto"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }}
          >
            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, index) => {
                const fromNode = nodes.find(n => n.id === conn.from)
                const toNode = nodes.find(n => n.id === conn.to)
                if (!fromNode || !toNode) return null

                const colorMap = {
                  red: '#ef4444',
                  orange: '#f97316',
                  green: '#22c55e',
                  blue: '#3b82f6',
                  purple: '#8b5cf6',
                  cyan: '#06b6d4',
                  yellow: '#eab308',
                  pink: '#ec4899'
                }

                return (
                  <g key={index}>
                    <defs>
                      <marker
                        id={`arrowhead-${index}`}
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill={colorMap[conn.color as keyof typeof colorMap] || '#6b7280'}
                        />
                      </marker>
                    </defs>
                    <line
                      x1={fromNode.x + fromNode.size/2}
                      y1={fromNode.y + fromNode.size/2}
                      x2={toNode.x + toNode.size/2}
                      y2={toNode.y + toNode.size/2}
                      stroke={colorMap[conn.color as keyof typeof colorMap] || '#6b7280'}
                      strokeWidth={Math.max(1, conn.strength / 20)}
                      opacity={0.6}
                      markerEnd={`url(#arrowhead-${index})`}
                    />
                    {viewMode === 'connections' && (
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                        fontSize="10"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Nodes */}
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${
                  selectedNode?.id === node.id ? 'ring-4 ring-violet-400 ring-opacity-50' : ''
                }`}
                style={{
                  left: node.x - node.size/2,
                  top: node.y - node.size/2,
                  width: node.size,
                  height: node.size
                }}
                onClick={() => setSelectedNode(node)}
              >
                <div className={`w-full h-full rounded-full ${getNodeColor(node)} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200`}>
                  <div className="text-white">
                    {getNodeIcon(node)}
                  </div>
                </div>
                
                {/* Node Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                  <div className="bg-white/90 backdrop-blur rounded-lg px-2 py-1 shadow-sm border border-violet-200">
                    <p className="text-xs font-medium text-gray-900 whitespace-nowrap">{node.label}</p>
                    {viewMode === 'detailed' && node.metadata.userCount && (
                      <p className="text-xs text-gray-600">{node.metadata.userCount} brukere</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Node Details Panel */}
          {selectedNode && (
            <div className="absolute bottom-4 right-4 w-80 bg-white/95 backdrop-blur rounded-lg p-4 shadow-xl border border-violet-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{selectedNode.label}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  className="h-6 w-6 p-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedNode.type}
                  </Badge>
                  <Badge 
                    variant={selectedNode.metadata.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {selectedNode.metadata.status}
                  </Badge>
                </div>
                
                {selectedNode.metadata.description && (
                  <p className="text-sm text-gray-600">{selectedNode.metadata.description}</p>
                )}
                
                {selectedNode.metadata.userCount && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{selectedNode.metadata.userCount} brukere</span>
                  </div>
                )}
                
                {selectedNode.metadata.permissions && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Tillatelser:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.metadata.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Edit className="h-3 w-3 mr-1" />
                    Rediger
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Detaljer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
