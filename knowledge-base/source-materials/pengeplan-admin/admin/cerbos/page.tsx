'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, Download, Trash2, Eye, Search, RefreshCw, AlertTriangle, CheckCircle, 
  XCircle, FileText, User, Database, Lock, Clock, Plus, Edit, Save, Send, 
  TrendingUp, TrendingDown, Users, Globe, Zap, Brain, Target, BarChart3,
  PieChart, LineChart, BarChart, ScatterChart, AreaChart, Filter, Calendar,
  Bell, Settings, Key, Activity, Server, Network, Cpu, HardDrive, Wifi
} from 'lucide-react'
import { 
  Line, Area, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart,
  BarChart as RechartsBarChart, Bar, ScatterChart as RechartsScatterChart, Scatter, PieChart as RechartsPieChart
} from 'recharts'

export default function CerbosDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Advanced Cerbos Metrics
  const cerbosMetrics = {
    totalPolicies: 47,
    activePolicies: 42,
    inactivePolicies: 5,
    totalResources: 23,
    totalActions: 156,
    totalRoles: 12,
    totalUsers: 8942,
    policyEvaluations: 1247,
    cacheHitRate: 94.2,
    avgResponseTime: 12,
    errorRate: 0.1,
    uptime: 99.9
  }

  // Real-time Cerbos Analytics
  const policyTrends = [
    { hour: '00:00', evaluations: 12, cacheHits: 11, errors: 0 },
    { hour: '04:00', evaluations: 8, cacheHits: 8, errors: 0 },
    { hour: '08:00', evaluations: 23, cacheHits: 22, errors: 1 },
    { hour: '12:00', evaluations: 45, cacheHits: 42, errors: 2 },
    { hour: '16:00', evaluations: 67, cacheHits: 63, errors: 3 },
    { hour: '20:00', evaluations: 34, cacheHits: 32, errors: 1 },
    { hour: '24:00', evaluations: 18, cacheHits: 17, errors: 0 }
  ]

  const resourceTypes = [
    { name: 'User', value: 35, color: '#3b82f6', policies: 12, actions: 8 },
    { name: 'Document', value: 28, color: '#22c55e', policies: 10, actions: 6 },
    { name: 'Project', value: 20, color: '#ef4444', policies: 8, actions: 5 },
    { name: 'Organization', value: 12, color: '#f59e0b', policies: 6, actions: 4 },
    { name: 'Report', value: 5, color: '#8b5cf6', policies: 3, actions: 2 }
  ]

  const actionTypes = [
    { action: 'read', count: 456, percentage: 36.6, color: '#3b82f6' },
    { action: 'write', count: 234, percentage: 18.8, color: '#22c55e' },
    { action: 'delete', count: 189, percentage: 15.2, color: '#ef4444' },
    { action: 'update', count: 156, percentage: 12.5, color: '#f59e0b' },
    { action: 'create', count: 123, percentage: 9.9, color: '#8b5cf6' },
    { action: 'admin', count: 89, percentage: 7.1, color: '#06b6d4' }
  ]

  const roleDistribution = [
    { role: 'admin', users: 45, permissions: 156, color: '#0088FE' },
    { role: 'manager', users: 38, permissions: 89, color: '#00C49F' },
    { role: 'user', users: 32, permissions: 45, color: '#FFBB28' },
    { role: 'viewer', users: 25, permissions: 23, color: '#FF8042' },
    { role: 'guest', users: 22, permissions: 12, color: '#8884d8' },
    { role: 'moderator', users: 18, permissions: 67, color: '#82ca9d' }
  ]

  const policyPerformance = [
    { policy: 'user:read', evaluations: 95, avgTime: 2.3, success: 98.5, color: '#22c55e' },
    { policy: 'document:write', evaluations: 87, avgTime: 3.1, success: 96.2, color: '#3b82f6' },
    { policy: 'project:admin', evaluations: 76, avgTime: 4.2, success: 94.8, color: '#f59e0b' },
    { policy: 'organization:read', evaluations: 65, avgTime: 2.8, success: 97.1, color: '#8b5cf6' },
    { policy: 'report:create', evaluations: 54, avgTime: 3.5, success: 95.3, color: '#ef4444' }
  ]

  const recentEvaluations = [
    { id: 1, user: 'john.doe', resource: 'document:123', action: 'read', result: 'ALLOW', timestamp: '2025-01-28T16:58:16Z', responseTime: 2.3 },
    { id: 2, user: 'jane.smith', resource: 'project:456', action: 'write', result: 'DENY', timestamp: '2025-01-28T15:30:45Z', responseTime: 1.8 },
    { id: 3, user: 'bob.johnson', resource: 'user:789', action: 'update', result: 'ALLOW', timestamp: '2025-01-28T14:15:22Z', responseTime: 3.1 },
    { id: 4, user: 'alice.brown', resource: 'organization:321', action: 'read', result: 'ALLOW', timestamp: '2025-01-28T13:45:10Z', responseTime: 2.7 },
    { id: 5, user: 'charlie.wilson', resource: 'report:654', action: 'delete', result: 'DENY', timestamp: '2025-01-28T12:20:33Z', responseTime: 2.1 }
  ]

  const aiInsights = [
    { insight: 'Unusual permission pattern detected for user:admin', confidence: 94, action: 'Review admin policies', severity: 'High' },
    { insight: 'High denial rate for document:write actions', confidence: 87, action: 'Check document policies', severity: 'Medium' },
    { insight: 'Cache hit rate below optimal threshold', confidence: 92, action: 'Optimize cache configuration', severity: 'High' },
    { insight: 'Policy evaluation time increasing', confidence: 78, action: 'Review complex policies', severity: 'Low' },
    { insight: 'New role pattern detected in evaluations', confidence: 89, action: 'Create role-specific policies', severity: 'Medium' }
  ]

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: BarChart3 },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'resources', label: 'Resources', icon: Database },
    { id: 'roles', label: 'Roles', icon: Users },
    { id: 'evaluations', label: 'Evaluations', icon: Activity },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'ALLOW': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'DENY': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'ALLOW': return 'bg-green-100 text-green-600 border-green-200'
      case 'DENY': return 'bg-red-100 text-red-600 border-red-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            🛡️ Cerbos Authorization Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Avansert policy management, authorization analytics og security monitoring
          </p>
        </div>

        {/* 🚀 AWESOME CERBOS ANALYTICS DASHBOARD 🚀 */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              📊 Authorization Analytics
            </h2>
          </div>
          
          {/* 🔥 REAL-TIME CERBOS METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Policies</CardTitle>
                <div className="text-3xl font-bold text-blue-600">{cerbosMetrics.totalPolicies}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {cerbosMetrics.activePolicies} aktive
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Cache Hit Rate</CardTitle>
                <div className="text-3xl font-bold text-green-600">{cerbosMetrics.cacheHitRate}%</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-700">
                  <Zap className="h-4 w-4 mr-1" />
                  Excellent
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Evaluations</CardTitle>
                <div className="text-3xl font-bold text-purple-600">{cerbosMetrics.policyEvaluations}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-purple-700">
                  <Activity className="h-4 w-4 mr-1" />
                  Siste 24 timer
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Response Time</CardTitle>
                <div className="text-3xl font-bold text-orange-600">{cerbosMetrics.avgResponseTime}ms</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-700">
                  <Clock className="h-4 w-4 mr-1" />
                  Ultra Fast
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 📊 MEGA CERBOS CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Policy Evaluation Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Policy Evaluation Trends (24 timer)
                </CardTitle>
                <CardDescription>Real-time authorization requests og performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={policyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Legend />
                    <Area type="monotone" dataKey="evaluations" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.3} name="Evaluations" />
                    <Area type="monotone" dataKey="cacheHits" fill="#22c55e" stroke="#22c55e" fillOpacity={0.3} name="Cache Hits" />
                    <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} name="Errors" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resource Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Resource Types
                </CardTitle>
                <CardDescription>Fordeling av policy-ressurser</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={resourceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resourceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Action Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-purple-500" />
                  Action Types
                </CardTitle>
                <CardDescription>Fordeling av autoriserte handlinger</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={actionTypes} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="action" type="category" width={80} />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Antall" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Role Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Role Distribution
                </CardTitle>
                <CardDescription>Brukerroller og tillatelser</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={roleDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Legend />
                    <Bar dataKey="users" fill="#3b82f6" name="Users" />
                    <Bar dataKey="permissions" fill="#22c55e" name="Permissions" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Policy Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Policy Performance
                </CardTitle>
                <CardDescription>Top policies etter ytelse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policyPerformance.map((policy, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: policy.color }}></div>
                        <span className="font-medium text-sm">{policy.policy}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-500">{policy.evaluations} evals</span>
                        <span className="text-gray-500">{policy.avgTime}ms</span>
                        <Badge variant="outline" className="text-xs">
                          {policy.success}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 🤖 AI INSIGHTS & RECENT EVALUATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Authorization Insights */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  🤖 AI Authorization Insights
                </CardTitle>
                <CardDescription>Machine learning powered policy analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg border shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{insight.insight}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">Confidence: {insight.confidence}%</span>
                            <Badge variant="outline" className="text-xs">
                              {insight.action}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant={
                          insight.severity === 'High' ? 'destructive' :
                          insight.severity === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {insight.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Policy Evaluations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Nylige Policy Evaluations
                </CardTitle>
                <CardDescription>Siste autorisasjonsforespørsler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getResultColor(evaluation.result)}`}>
                          {getResultIcon(evaluation.result)}
                        </div>
                        <div>
                          <p className="font-medium">{evaluation.user} → {evaluation.resource}</p>
                          <p className="text-sm text-gray-500">
                            {evaluation.action} • {isClient ? new Date(evaluation.timestamp).toLocaleString('nb-NO') : evaluation.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          evaluation.result === 'ALLOW' ? 'default' : 'destructive'
                        }>
                          {evaluation.result}
                        </Badge>
                        <span className="text-xs text-gray-500">{evaluation.responseTime}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Custom Toggle Menu */}
        <div className="space-y-6 mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Cerbos Management
          </h2>
          
          <div className="flex w-full space-x-1 bg-muted p-1 rounded-md">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-sm transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Active Policies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{cerbosMetrics.activePolicies}</div>
                    <p className="text-sm text-gray-500">av {cerbosMetrics.totalPolicies} total</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-500" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{cerbosMetrics.totalResources}</div>
                    <p className="text-sm text-gray-500">Resource types</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{cerbosMetrics.totalUsers}</div>
                    <p className="text-sm text-gray-500">Total users</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'policies' && (
              <Card>
                <CardHeader>
                  <CardTitle>Policy Management</CardTitle>
                  <CardDescription>Administrer Cerbos policies og regler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input placeholder="Søk i policies..." className="flex-1" />
                      <Button><Search className="h-4 w-4 mr-2" />Søk</Button>
                      <Button><Plus className="h-4 w-4 mr-2" />Ny Policy</Button>
                      <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Oppdater</Button>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Policy management verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'resources' && (
              <Card>
                <CardHeader>
                  <CardTitle>Resource Management</CardTitle>
                  <CardDescription>Administrer policy-ressurser og typer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Resource Types</h3>
                      <Button><Plus className="h-4 w-4 mr-2" />Legg til</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resourceTypes.map((resource, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{resource.name}</span>
                            <Badge variant="outline">{resource.policies} policies</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {resource.actions} actions • {resource.value}% av total
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'roles' && (
              <Card>
                <CardHeader>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>Administrer brukerroller og tillatelser</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">User Roles</h3>
                      <Button><Plus className="h-4 w-4 mr-2" />Ny Rolle</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roleDistribution.map((role, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{role.role}</span>
                            <Badge variant="outline">{role.users} users</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {role.permissions} permissions
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'evaluations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Log</CardTitle>
                  <CardDescription>Overvåk policy evaluations og resultater</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input placeholder="Søk i evaluations..." className="flex-1" />
                      <Button><Search className="h-4 w-4 mr-2" />Søk</Button>
                      <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button>
                      <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Oppdater</Button>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Evaluation log verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'performance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Monitoring</CardTitle>
                  <CardDescription>Overvåk Cerbos ytelse og metrikker</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-800">Cache Hit Rate</h3>
                        <p className="text-2xl font-bold text-green-600">{cerbosMetrics.cacheHitRate}%</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800">Response Time</h3>
                        <p className="text-2xl font-bold text-blue-600">{cerbosMetrics.avgResponseTime}ms</p>
                      </div>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Performance monitoring verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Monitoring</CardTitle>
                  <CardDescription>Overvåk sikkerhet og policy violations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Status:</strong> {cerbosMetrics.errorRate}% error rate • {cerbosMetrics.uptime}% uptime
                      </AlertDescription>
                    </Alert>
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Security monitoring verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}