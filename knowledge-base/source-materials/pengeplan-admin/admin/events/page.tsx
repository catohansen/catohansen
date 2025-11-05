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
  Activity, Download, Trash2, Eye, Search, RefreshCw, AlertTriangle, CheckCircle, 
  XCircle, FileText, User, Database, Lock, Clock, Plus, Edit, Save, Send, 
  TrendingUp, TrendingDown, Users, Globe, Zap, Brain, Target, BarChart3,
  PieChart, LineChart, BarChart, ScatterChart, AreaChart, Filter, Calendar,
  Bell, Shield, Bug, Info, AlertCircle
} from 'lucide-react'
import { 
  Line, Area, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart,
  BarChart as RechartsBarChart, Bar, ScatterChart as RechartsScatterChart, Scatter, PieChart as RechartsPieChart
} from 'recharts'

export default function EventsDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Advanced Events Metrics
  const eventsMetrics = {
    totalEvents: 1247,
    criticalEvents: 23,
    warningEvents: 156,
    infoEvents: 423,
    errorEvents: 645,
    systemEvents: 894,
    userEvents: 234,
    securityEvents: 119,
    performanceEvents: 45,
    uptime: 99.9,
    avgResponseTime: 145,
    errorRate: 0.1
  }

  // Real-time Events Analytics
  const eventTrends = [
    { hour: '00:00', events: 12, errors: 1, warnings: 2 },
    { hour: '04:00', events: 8, errors: 0, warnings: 1 },
    { hour: '08:00', events: 23, errors: 2, warnings: 3 },
    { hour: '12:00', events: 45, errors: 4, warnings: 5 },
    { hour: '16:00', events: 67, errors: 6, warnings: 8 },
    { hour: '20:00', events: 34, errors: 3, warnings: 4 },
    { hour: '24:00', events: 18, errors: 1, warnings: 2 }
  ]

  const eventTypes = [
    { name: 'System Events', value: 35, color: '#3b82f6', trend: '+12%' },
    { name: 'User Events', value: 28, color: '#22c55e', trend: '-5%' },
    { name: 'Security Events', value: 20, color: '#ef4444', trend: '+8%' },
    { name: 'Performance Events', value: 12, color: '#f59e0b', trend: '-15%' },
    { name: 'Error Events', value: 5, color: '#8b5cf6', trend: '+3%' }
  ]

  const eventSeverity = [
    { level: 'Critical', count: 23, color: '#ef4444', percentage: 1.8 },
    { level: 'Error', count: 645, color: '#f97316', percentage: 51.7 },
    { level: 'Warning', count: 156, color: '#eab308', percentage: 12.5 },
    { level: 'Info', count: 423, color: '#3b82f6', percentage: 33.9 }
  ]

  const geographicEvents = [
    { country: 'Norway', events: 45, errors: 2, color: '#0088FE' },
    { country: 'Germany', events: 38, errors: 3, color: '#00C49F' },
    { country: 'France', events: 32, errors: 1, color: '#FFBB28' },
    { country: 'UK', events: 25, errors: 2, color: '#FF8042' },
    { country: 'Spain', events: 22, errors: 1, color: '#8884d8' },
    { country: 'Italy', events: 18, errors: 0, color: '#82ca9d' }
  ]

  const recentEvents = [
    { id: 1, type: 'System', message: 'Database connection restored', severity: 'Info', timestamp: '2025-01-28T16:58:16Z', source: 'Database Server' },
    { id: 2, type: 'Security', message: 'Failed login attempt detected', severity: 'Warning', timestamp: '2025-01-28T15:30:45Z', source: 'Auth Service' },
    { id: 3, type: 'Error', message: 'API timeout occurred', severity: 'Error', timestamp: '2025-01-28T14:15:22Z', source: 'API Gateway' },
    { id: 4, type: 'Performance', message: 'High memory usage detected', severity: 'Warning', timestamp: '2025-01-28T13:45:10Z', source: 'Monitoring' },
    { id: 5, type: 'System', message: 'Backup completed successfully', severity: 'Info', timestamp: '2025-01-28T12:20:33Z', source: 'Backup Service' }
  ]

  const aiInsights = [
    { insight: 'Unusual error pattern detected in API calls', confidence: 94, action: 'Investigate API service', severity: 'High' },
    { insight: 'Memory usage spike predicted in 2 hours', confidence: 87, action: 'Scale resources', severity: 'Medium' },
    { insight: 'Potential security breach in user authentication', confidence: 92, action: 'Review auth logs', severity: 'High' },
    { insight: 'Database performance degradation trend', confidence: 78, action: 'Optimize queries', severity: 'Low' },
    { insight: 'Network latency increase across regions', confidence: 89, action: 'Check CDN status', severity: 'Medium' }
  ]

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'Error': return <XCircle className="h-4 w-4 text-orange-600" />
      case 'Warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'Info': return <Info className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-600 border-red-200'
      case 'Error': return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'Warning': return 'bg-yellow-100 text-yellow-600 border-yellow-200'
      case 'Info': return 'bg-blue-100 text-blue-600 border-blue-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            📊 Events & Monitoring Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Avansert event monitoring, real-time analytics og system observability
          </p>
        </div>

        {/* 🚀 AWESOME EVENTS ANALYTICS DASHBOARD 🚀 */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              📈 Real-time Events Analytics
            </h2>
          </div>
          
          {/* 🔥 REAL-TIME EVENTS METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Total Events</CardTitle>
                <div className="text-3xl font-bold text-red-600">{eventsMetrics.totalEvents}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-red-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15% siste 24 timer
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Error Rate</CardTitle>
                <div className="text-3xl font-bold text-orange-600">{eventsMetrics.errorRate}%</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Excellent
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Uptime</CardTitle>
                <div className="text-3xl font-bold text-green-600">{eventsMetrics.uptime}%</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-700">
                  <Shield className="h-4 w-4 mr-1" />
                  High Availability
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Response Time</CardTitle>
                <div className="text-3xl font-bold text-blue-600">{eventsMetrics.avgResponseTime}ms</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-700">
                  <Zap className="h-4 w-4 mr-1" />
                  Fast Response
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 📊 MEGA EVENTS CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Event Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Event Trends (24 timer)
                </CardTitle>
                <CardDescription>Real-time event monitoring og trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={eventTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Legend />
                    <Area type="monotone" dataKey="events" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.3} name="Total Events" />
                    <Area type="monotone" dataKey="errors" fill="#ef4444" stroke="#ef4444" fillOpacity={0.3} name="Errors" />
                    <Line type="monotone" dataKey="warnings" stroke="#f59e0b" strokeWidth={3} name="Warnings" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Event Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-500" />
                  Event Types
                </CardTitle>
                <CardDescription>Fordeling av event-typer</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={eventTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Event Severity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Event Severity
                </CardTitle>
                <CardDescription>Fordeling etter alvorlighetsgrad</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={eventSeverity} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="level" type="category" width={80} />
                    <Legend />
                    <Bar dataKey="count" fill="#ef4444" name="Antall" />
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
                <CardDescription>Events per land/region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={geographicEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Legend />
                    <Bar dataKey="events" fill="#3b82f6" name="Events" />
                    <Bar dataKey="errors" fill="#ef4444" name="Errors" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  System Health
                </CardTitle>
                <CardDescription>Overordnet system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Database</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">API Gateway</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Cache Layer</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-600">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Message Queue</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 🤖 AI INSIGHTS & RECENT EVENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Event Insights */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  🤖 AI Event Insights
                </CardTitle>
                <CardDescription>Machine learning powered event analysis</CardDescription>
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

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Nylige Events
                </CardTitle>
                <CardDescription>Siste system events og hendelser</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                          {getSeverityIcon(event.severity)}
                        </div>
                        <div>
                          <p className="font-medium">{event.message}</p>
                          <p className="text-sm text-gray-500">
                            {event.source} • {isClient ? new Date(event.timestamp).toLocaleString('nb-NO') : event.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        <Badge variant={
                          event.severity === 'Critical' ? 'destructive' :
                          event.severity === 'Error' ? 'destructive' :
                          event.severity === 'Warning' ? 'secondary' : 'outline'
                        }>
                          {event.severity}
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
            Event Management
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
                      <Activity className="h-5 w-5 text-blue-500" />
                      System Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{eventsMetrics.systemEvents}</div>
                    <p className="text-sm text-gray-500">Siste 24 timer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      User Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{eventsMetrics.userEvents}</div>
                    <p className="text-sm text-gray-500">Brukeraktiviteter</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      Security Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{eventsMetrics.securityEvents}</div>
                    <p className="text-sm text-gray-500">Sikkerhetshendelser</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'events' && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Log</CardTitle>
                  <CardDescription>Administrer og overvåk system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input placeholder="Søk i events..." className="flex-1" />
                      <Button><Search className="h-4 w-4 mr-2" />Søk</Button>
                      <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button>
                      <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Oppdater</Button>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Event log verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'analytics' && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Analytics</CardTitle>
                  <CardDescription>Avansert event analyse og rapportering</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Analytics verktøy kommer snart</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'alerts' && (
              <Card>
                <CardHeader>
                  <CardTitle>Alert Management</CardTitle>
                  <CardDescription>Konfigurer og administrer system alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <Bell className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Status:</strong> {eventsMetrics.criticalEvents} kritiske alerts aktive
                      </AlertDescription>
                    </Alert>
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Alert management verktøy kommer snart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'performance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Monitoring</CardTitle>
                  <CardDescription>Overvåk system ytelse og metrikker</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-800">Uptime</h3>
                        <p className="text-2xl font-bold text-green-600">{eventsMetrics.uptime}%</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-800">Response Time</h3>
                        <p className="text-2xl font-bold text-blue-600">{eventsMetrics.avgResponseTime}ms</p>
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
                  <CardTitle>Security Events</CardTitle>
                  <CardDescription>Overvåk sikkerhetshendelser og trusler</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-red-800">Security Events</h3>
                        <p className="text-2xl font-bold text-red-600">{eventsMetrics.securityEvents}</p>
                      </div>
                      <Shield className="h-8 w-8 text-red-600" />
                    </div>
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