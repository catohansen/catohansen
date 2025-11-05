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
  XCircle, FileText, User, Database, Lock, Clock, Activity, Plus, Edit, Save, 
  Send, TrendingUp, TrendingDown, Users, Globe, Zap, Brain, Target, BarChart3,
  PieChart, LineChart, BarChart, ScatterChart, AreaChart
} from 'lucide-react'
import { 
  Line, Area, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart,
  BarChart as RechartsBarChart, Bar, ScatterChart as RechartsScatterChart, Scatter, PieChart as RechartsPieChart
} from 'recharts'

export default function GDPRDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Advanced GDPR Metrics
  const gdprMetrics = {
    totalRequests: 1247,
    pendingRequests: 23,
    completedRequests: 1156,
    dataBreaches: 2,
    consentRate: 94.2,
    complianceScore: 91.5,
    dpiasCompleted: 15,
    dataSubjects: 8942,
    dataCategories: 12,
    retentionPeriods: 8
  }

  // Real-time GDPR Analytics
  const requestTrends = [
    { month: 'Jan', requests: 45, completed: 42, breaches: 0 },
    { month: 'Feb', requests: 67, completed: 63, breaches: 1 },
    { month: 'Mar', requests: 89, completed: 85, breaches: 0 },
    { month: 'Apr', requests: 123, completed: 118, breaches: 1 },
    { month: 'May', requests: 156, completed: 149, breaches: 0 },
    { month: 'Jun', requests: 189, completed: 182, breaches: 0 }
  ]

  const dataCategories = [
    { name: 'Personal Data', value: 35, color: '#3b82f6', trend: '+12%' },
    { name: 'Sensitive Data', value: 28, color: '#ef4444', trend: '-5%' },
    { name: 'Biometric Data', value: 20, color: '#f59e0b', trend: '+8%' },
    { name: 'Financial Data', value: 12, color: '#22c55e', trend: '-15%' },
    { name: 'Health Data', value: 5, color: '#8b5cf6', trend: '+3%' }
  ]

  const complianceStatus = [
    { framework: 'GDPR Art. 5', score: 95, status: 'Compliant', color: '#22c55e' },
    { framework: 'GDPR Art. 6', score: 92, status: 'Compliant', color: '#22c55e' },
    { framework: 'GDPR Art. 7', score: 89, status: 'Compliant', color: '#22c55e' },
    { framework: 'GDPR Art. 17', score: 87, status: 'Partial', color: '#f59e0b' },
    { framework: 'GDPR Art. 25', score: 94, status: 'Compliant', color: '#22c55e' }
  ]

  const requestTypes = [
    { type: 'Access Request', count: 456, percentage: 36.6, color: '#3b82f6' },
    { type: 'Rectification', count: 234, percentage: 18.8, color: '#22c55e' },
    { type: 'Erasure', count: 189, percentage: 15.2, color: '#ef4444' },
    { type: 'Portability', count: 156, percentage: 12.5, color: '#f59e0b' },
    { type: 'Objection', count: 123, percentage: 9.9, color: '#8b5cf6' },
    { type: 'Restriction', count: 89, percentage: 7.1, color: '#06b6d4' }
  ]

  const geographicRequests = [
    { country: 'Norway', requests: 45, completed: 42, color: '#0088FE' },
    { country: 'Germany', requests: 38, completed: 35, color: '#00C49F' },
    { country: 'France', requests: 32, completed: 28, color: '#FFBB28' },
    { country: 'UK', requests: 25, completed: 24, color: '#FF8042' },
    { country: 'Spain', requests: 22, completed: 21, color: '#8884d8' },
    { country: 'Italy', requests: 18, completed: 17, color: '#82ca9d' }
  ]

  const recentRequests = [
    { id: 1, type: 'Access Request', subject: 'John Doe', status: 'Completed', date: '2025-01-28T16:58:16Z', priority: 'High' },
    { id: 2, type: 'Data Rectification', subject: 'Jane Smith', status: 'Pending', date: '2025-01-28T15:30:45Z', priority: 'Medium' },
    { id: 3, type: 'Right to Erasure', subject: 'Bob Johnson', status: 'In Progress', date: '2025-01-28T14:15:22Z', priority: 'High' },
    { id: 4, type: 'Data Portability', subject: 'Alice Brown', status: 'Completed', date: '2025-01-28T13:45:10Z', priority: 'Low' },
    { id: 5, type: 'Objection', subject: 'Charlie Wilson', status: 'Pending', date: '2025-01-28T12:20:33Z', priority: 'Medium' }
  ]

  const aiInsights = [
    { insight: 'Unusual data access pattern detected', confidence: 94, action: 'Flagged for review', severity: 'High' },
    { insight: 'Potential consent withdrawal spike', confidence: 87, action: 'Monitored', severity: 'Medium' },
    { insight: 'Cross-border data transfer anomaly', confidence: 92, action: 'Alerted', severity: 'High' },
    { insight: 'Retention period compliance risk', confidence: 78, action: 'Scheduled review', severity: 'Low' },
    { insight: 'Data subject request complexity increase', confidence: 89, action: 'Resource allocation', severity: 'Medium' }
  ]

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: BarChart3 },
    { id: 'requests', label: 'Forespørsler', icon: FileText },
    { id: 'data-categories', label: 'Datakategorier', icon: Database },
    { id: 'consent', label: 'Samtykke', icon: Shield },
    { id: 'breaches', label: 'Datainnbrudd', icon: AlertTriangle },
    { id: 'dpias', label: 'DPIA', icon: Target }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
      <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🛡️ GDPR Compliance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Avansert GDPR-overvåking, databeskyttelse og compliance management
          </p>
        </div>

        {/* 🚀 AWESOME GDPR ANALYTICS DASHBOARD 🚀 */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              📊 GDPR Analytics & Insights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Real-time compliance monitoring & data protection intelligence
            </p>
      </div>

          {/* 🔥 REAL-TIME GDPR METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Forespørsler</CardTitle>
                <div className="text-3xl font-bold text-blue-600">{gdprMetrics.totalRequests}</div>
          </CardHeader>
          <CardContent>
                <div className="flex items-center text-sm text-blue-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12% denne måneden
            </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Compliance Score</CardTitle>
                <div className="text-3xl font-bold text-green-600">{gdprMetrics.complianceScore}%</div>
          </CardHeader>
          <CardContent>
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Excellent
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Samtykke Rate</CardTitle>
                <div className="text-3xl font-bold text-purple-600">{gdprMetrics.consentRate}%</div>
          </CardHeader>
          <CardContent>
                <div className="flex items-center text-sm text-purple-700">
                  <Shield className="h-4 w-4 mr-1" />
                  GDPR Ready
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Datainnbrudd</CardTitle>
                <div className="text-3xl font-bold text-orange-600">{gdprMetrics.dataBreaches}</div>
          </CardHeader>
          <CardContent>
                <div className="flex items-center text-sm text-orange-700">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Siste 12 måneder
            </div>
          </CardContent>
        </Card>
      </div>

          {/* 📊 MEGA GDPR CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Request Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  GDPR Forespørsler Trend (6 måneder)
                </CardTitle>
                <CardDescription>Utvikling av forespørsler og compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={requestTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Legend />
                    <Area type="monotone" dataKey="requests" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.3} name="Forespørsler" />
                    <Area type="monotone" dataKey="completed" fill="#22c55e" stroke="#22c55e" fillOpacity={0.3} name="Fullført" />
                    <Line type="monotone" dataKey="breaches" stroke="#ef4444" strokeWidth={3} name="Datainnbrudd" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Data Categories Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Datakategorier
                </CardTitle>
                <CardDescription>Fordeling av behandlede datatyper</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={dataCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Request Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Forespørselstyper
                </CardTitle>
                <CardDescription>Fordeling av GDPR-forespørsler</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={requestTypes} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={100} />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Antall" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-500" />
                  Geografisk Fordeling
                </CardTitle>
                <CardDescription>Forespørsler per land</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={geographicRequests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Legend />
                    <Bar dataKey="requests" fill="#3b82f6" name="Forespørsler" />
                    <Bar dataKey="completed" fill="#22c55e" name="Fullført" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Compliance Status
                </CardTitle>
                <CardDescription>GDPR-artikler compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceStatus.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                        <span className="font-medium">{item.framework}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{item.score}%</span>
                        <Badge variant={item.status === 'Compliant' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
          </div>
        </div>
                  ))}
              </div>
              </CardContent>
            </Card>
          </div>

          {/* 🤖 AI INSIGHTS & RECENT REQUESTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI GDPR Insights */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  🤖 AI GDPR Insights
                </CardTitle>
                <CardDescription>Machine learning powered compliance monitoring</CardDescription>
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

            {/* Recent GDPR Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Nylige GDPR Forespørsler
                </CardTitle>
                <CardDescription>Siste data subject forespørsler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          request.status === 'Completed' ? 'bg-green-100 text-green-600' :
                          request.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{request.type}</p>
                          <p className="text-sm text-gray-500">
                            {request.subject} • {isClient ? new Date(request.date).toLocaleString('nb-NO') : request.date}
                          </p>
                        </div>
          </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          request.priority === 'High' ? 'destructive' :
                          request.priority === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {request.priority}
                        </Badge>
                        <Badge variant={
                          request.status === 'Completed' ? 'default' :
                          request.status === 'Pending' ? 'secondary' : 'outline'
                        }>
                          {request.status}
                        </Badge>
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
            GDPR Management
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
                      <Users className="h-5 w-5 text-blue-500" />
                      Data Subjects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{gdprMetrics.dataSubjects}</div>
                    <p className="text-sm text-gray-500">Registrerte personer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-500" />
                      Datakategorier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{gdprMetrics.dataCategories}</div>
                    <p className="text-sm text-gray-500">Aktive kategorier</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      DPIA Fullført
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{gdprMetrics.dpiasCompleted}</div>
                    <p className="text-sm text-gray-500">Data Protection Impact Assessments</p>
                  </CardContent>
                </Card>
                  </div>
            )}

            {activeTab === 'requests' && (
              <Card>
                <CardHeader>
                  <CardTitle>GDPR Forespørsler</CardTitle>
                  <CardDescription>Administrer data subject forespørsler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input placeholder="Søk i forespørsler..." className="flex-1" />
                      <Button><Search className="h-4 w-4 mr-2" />Søk</Button>
                      <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Oppdater</Button>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Ingen aktive forespørsler for øyeblikket</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'data-categories' && (
              <Card>
                <CardHeader>
                  <CardTitle>Datakategorier</CardTitle>
                  <CardDescription>Administrer personopplysningskategorier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
          <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Aktive Kategorier</h3>
                      <Button><Plus className="h-4 w-4 mr-2" />Legg til</Button>
          </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dataCategories.map((category, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category.name}</span>
                            <Badge variant="outline">{category.trend}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {category.value}% av total data
                          </div>
                          </div>
                    ))}
                    </div>
              </div>
            </CardContent>
          </Card>
            )}

            {activeTab === 'consent' && (
              <Card>
                <CardHeader>
                  <CardTitle>Samtykke Management</CardTitle>
                  <CardDescription>Administrer brukersamtykke og preferanser</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                        <h3 className="font-semibold text-green-800">Samtykke Rate</h3>
                        <p className="text-2xl font-bold text-green-600">{gdprMetrics.consentRate}%</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Samtykke management verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'breaches' && (
              <Card>
                <CardHeader>
                  <CardTitle>Datainnbrudd</CardTitle>
                  <CardDescription>Overvåk og rapporter datainnbrudd</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Status:</strong> {gdprMetrics.dataBreaches} datainnbrudd registrert siste 12 måneder
                      </AlertDescription>
                    </Alert>
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Datainnbrudd monitoring verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'dpias' && (
              <Card>
                <CardHeader>
                  <CardTitle>Data Protection Impact Assessments</CardTitle>
                  <CardDescription>Administrer DPIA-prosesser</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                        <h3 className="font-semibold text-purple-800">DPIA Fullført</h3>
                        <p className="text-2xl font-bold text-purple-600">{gdprMetrics.dpiasCompleted}</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>DPIA management verktøy kommer snart</p>
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