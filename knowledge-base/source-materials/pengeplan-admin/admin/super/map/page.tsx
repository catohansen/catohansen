'use client'

import { useState, useEffect } from 'react'
import { 
  TreePine, 
  Table, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  Users,
  Settings
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AppShell from '@/components/layout/AppShell'

interface DriftCheckResult {
  missing_pages: string[]
  missing_guards: string[]
  extra_nav: string[]
  unguarded_routes: string[]
  total_drift: number
}

interface RoleMapData {
  meta: {
    system: string
    version: string
    updated: string
    description: string
  }
  roles: string[]
  areas: Array<{
    key: string
    label: string
    minRole: string
    description: string
    pages: Array<{
      path: string
      label: string
      description: string
      actions: string[]
      data_scope: string
      audit: string[]
    }>
  }>
  permissions: Record<string, string>
  api_endpoints: Array<{
    path: string
    method: string
    minRole: string
    description: string
  }>
  feature_flags: Array<{
    name: string
    description: string
    default: boolean
  }>
}

export default function MapViewer() {
  const [mapData, setMapData] = useState<RoleMapData | null>(null)
  const [driftResult, setDriftResult] = useState<DriftCheckResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'tree' | 'matrix' | 'drift'>('tree')

  useEffect(() => {
    loadMapData()
  }, [])

  const loadMapData = async () => {
    try {
      const response = await fetch('/api/superadmin/map')
      if (response.ok) {
        const data = await response.json()
        setMapData(data)
        // Expand all areas by default
        setExpandedAreas(new Set(data.areas.map((area: any) => area.key)))
      }
    } catch (error) {
      console.error('Error loading map data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runDriftCheck = async () => {
    try {
      const response = await fetch('/api/superadmin/map/check', {
        method: 'POST'
      })
      if (response.ok) {
        const result = await response.json()
        setDriftResult(result)
        setActiveTab('drift')
      }
    } catch (error) {
      console.error('Error running drift check:', error)
    }
  }

  const toggleArea = (areaKey: string) => {
    const newExpanded = new Set(expandedAreas)
    if (newExpanded.has(areaKey)) {
      newExpanded.delete(areaKey)
    } else {
      newExpanded.add(areaKey)
    }
    setExpandedAreas(newExpanded)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'USER': return 'bg-blue-100 text-blue-800'
      case 'ADMIN': return 'bg-green-100 text-green-800'
      case 'SUPERADMIN': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'USER': return <Users className="w-4 h-4" />
      case 'ADMIN': return <Shield className="w-4 h-4" />
      case 'SUPERADMIN': return <Settings className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <AppShell role="admin" user={{ name: 'Admin', email: 'admin@pengeplan.no', role: 'ADMIN' }}>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (!mapData) {
    return (
      <AppShell role="admin" user={{ name: 'Admin', email: 'admin@pengeplan.no', role: 'ADMIN' }}>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Map</h3>
                <p className="text-gray-600">Failed to load role map data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="admin" user={{ name: 'Admin', email: 'admin@pengeplan.no', role: 'ADMIN' }}>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pp-text mb-2">Role Map Viewer</h1>
          <p className="text-pp-text-secondary">{mapData.meta.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>Version: {mapData.meta.version}</span>
            <span>Updated: {new Date(mapData.meta.updated).toLocaleDateString('nb-NO')}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === 'tree' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tree')}
            className="flex items-center"
          >
            <TreePine className="w-4 h-4 mr-2" />
            Tree View
          </Button>
          <Button
            variant={activeTab === 'matrix' ? 'default' : 'outline'}
            onClick={() => setActiveTab('matrix')}
            className="flex items-center"
          >
            <Table className="w-4 h-4 mr-2" />
            Permission Matrix
          </Button>
          <Button
            variant={activeTab === 'drift' ? 'default' : 'outline'}
            onClick={() => setActiveTab('drift')}
            className="flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Drift Check
          </Button>
          <Button
            onClick={runDriftCheck}
            variant="outline"
            className="flex items-center ml-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Drift Check
          </Button>
        </div>

        {/* Tree View */}
        {activeTab === 'tree' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TreePine className="w-5 h-5 mr-2" />
                System Architecture Tree
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mapData.areas.map((area) => (
                  <div key={area.key} className="border rounded-lg">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleArea(area.key)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedAreas.has(area.key) ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                        {getRoleIcon(area.minRole)}
                        <div>
                          <h3 className="font-semibold">{area.label}</h3>
                          <p className="text-sm text-gray-600">{area.description}</p>
                        </div>
                      </div>
                      <Badge className={getRoleColor(area.minRole)}>
                        {area.minRole}
                      </Badge>
                    </div>
                    
                    {expandedAreas.has(area.key) && (
                      <div className="border-t bg-gray-50">
                        {area.pages.map((page, index) => (
                          <div key={index} className="p-4 border-b last:border-b-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{page.label}</h4>
                                <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {page.actions.map((action, actionIndex) => (
                                    <Badge key={actionIndex} variant="outline" className="text-xs">
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Scope: {page.data_scope}</span>
                                  <span>Audit: {page.audit.length} events</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="ml-4">
                                {page.path}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permission Matrix */}
        {activeTab === 'matrix' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="w-5 h-5 mr-2" />
                Permission Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Action</th>
                      <th className="text-center p-3 font-semibold">USER</th>
                      <th className="text-center p-3 font-semibold">ADMIN</th>
                      <th className="text-center p-3 font-semibold">SUPERADMIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(mapData.permissions).map(([action, minRole]) => (
                      <tr key={action} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{action}</td>
                        <td className="text-center p-3">
                          {minRole === 'USER' ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          {['USER', 'ADMIN'].includes(minRole) ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Drift Check Results */}
        {activeTab === 'drift' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Drift Check Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {driftResult ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      driftResult.total_drift === 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {driftResult.total_drift === 0 ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-semibold">
                          Total Drift: {driftResult.total_drift}
                        </span>
                      </div>
                    </div>
                  </div>

                  {driftResult.missing_pages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">Missing Pages ({driftResult.missing_pages.length})</h4>
                      <div className="bg-red-50 p-3 rounded">
                        {driftResult.missing_pages.map((page, index) => (
                          <div key={index} className="text-sm">{page}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {driftResult.missing_guards.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">Missing Guards ({driftResult.missing_guards.length})</h4>
                      <div className="bg-red-50 p-3 rounded">
                        {driftResult.missing_guards.map((guard, index) => (
                          <div key={index} className="text-sm">{guard}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {driftResult.extra_nav.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-yellow-600 mb-2">Extra Navigation ({driftResult.extra_nav.length})</h4>
                      <div className="bg-yellow-50 p-3 rounded">
                        {driftResult.extra_nav.map((nav, index) => (
                          <div key={index} className="text-sm">{nav}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {driftResult.unguarded_routes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2">Unguarded Routes ({driftResult.unguarded_routes.length})</h4>
                      <div className="bg-orange-50 p-3 rounded">
                        {driftResult.unguarded_routes.map((route, index) => (
                          <div key={index} className="text-sm">{route}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {driftResult.total_drift === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-600">No Drift Detected</h3>
                      <p className="text-gray-600">All routes and guards are properly configured</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Drift Check Results</h3>
                  <p className="text-gray-600">Click &quot;Run Drift Check&quot; to analyze the system</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
