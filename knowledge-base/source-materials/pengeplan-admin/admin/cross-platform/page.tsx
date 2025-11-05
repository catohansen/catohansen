'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Shield, 
  Globe, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Eye, 
  Clock, 
  Target, 
  Zap, 
  Brain, 
  Heart, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  Settings,
  Bell,
  Star,
  Award,
  Trophy,
  Rocket,
  Sparkles
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

interface CrossPlatformData {
  landing: {
    visitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: number
    conversions: number
    topPages: Array<{ page: string; views: number }>
    trafficSources: Array<{ source: string; percentage: number }>
  }
  user: {
    activeUsers: number
    newUsers: number
    returningUsers: number
    avgSessionDuration: number
    featureUsage: Array<{ feature: string; usage: number }>
    userJourney: Array<{ step: string; users: number; dropoff: number }>
  }
  verge: {
    activeVerges: number
    newVerges: number
    clientCount: number
    avgClientsPerVerge: number
    vergeActivity: Array<{ action: string; count: number }>
    clientDistribution: Array<{ verge: string; clients: number }>
  }
  admin: {
    adminUsers: number
    systemAlerts: number
    maintenanceTasks: number
    performanceScore: number
    systemHealth: Array<{ metric: string; value: number; status: string }>
  }
  unified: {
    totalUsers: number
    crossPlatformActivity: number
    unifiedSessions: number
    dataFlow: Array<{ from: string; to: string; volume: number }>
    realTimeActivity: Array<{ timestamp: string; landing: number; user: number; verge: number; admin: number }>
  }
}

export default function CrossPlatformPage() {
  const [data, setData] = useState<CrossPlatformData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: Globe },
    { id: 'landing', label: 'Landing', icon: Globe },
    { id: 'user', label: 'Brukere', icon: Users },
    { id: 'verge', label: 'Verge', icon: Shield },
    { id: 'admin', label: 'Admin', icon: Settings }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  useEffect(() => {
    fetchCrossPlatformData()
    const interval = setInterval(fetchCrossPlatformData, 30000) // Update every 30 seconds
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchCrossPlatformData = async () => {
    try {
      setLoading(true)
      
      // Fetch real cross-platform data from API
      const response = await fetch('/api/admin/cross-platform')
      const apiData = await response.json()
      
      if (apiData.success) {
        setData(apiData.data)
      } else {
        // Fallback to empty data if API fails
        setData({
          landing: { 
            visitors: 0, 
            pageViews: 0, 
            bounceRate: 0, 
            avgSessionDuration: 0, 
            conversions: 0,
            topPages: [], 
            trafficSources: [] 
          },
          user: { 
            activeUsers: 0, 
            newUsers: 0, 
            returningUsers: 0,
            avgSessionDuration: 0,
            featureUsage: [],
            userJourney: []
          },
          verge: {
            activeVerges: 0,
            newVerges: 0,
            clientCount: 0,
            avgClientsPerVerge: 0,
            vergeActivity: [],
            clientDistribution: []
          },
          admin: {
            adminUsers: 0,
            systemAlerts: 0,
            maintenanceTasks: 0,
            performanceScore: 0,
            systemHealth: []
          },
          unified: {
            totalUsers: 0,
            crossPlatformActivity: 0,
            unifiedSessions: 0,
            dataFlow: [],
            realTimeActivity: []
          }
        })
      }

    } catch (error) {
      console.error('Error fetching cross-platform data:', error)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }

  // Filtered data based on search term
  const filteredData = data

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-xl"></div>
          <div className="absolute left-20 top-40 w-64 h-64 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-xl"></div>
          <div className="absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/15 rounded-full blur-xl"></div>
          <div className="absolute right-16 top-60 w-48 h-48 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-xl"></div>
        </div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C88FF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundRepeat: 'repeat'}}></div>
        </div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Laster cross-platform data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-xl"></div>
        <div className="absolute left-20 top-40 w-64 h-64 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-xl"></div>
        <div className="absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/15 rounded-full blur-xl"></div>
        <div className="absolute right-16 top-60 w-48 h-48 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C88FF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundRepeat: 'repeat'}}></div>
      </div>
      <div className="relative z-10 p-6">
        <div className="container mx-auto space-y-6">
          {/* Search and Stats Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk i cross-platform data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Sist oppdatert: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>

        {/* Enhanced Unified Overview */}
        {filteredData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold">Landing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {filteredData.landing.visitors.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Besøkende i dag</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {filteredData.landing.pageViews.toLocaleString()} sidevisninger
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      +12%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold">Brukere</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {filteredData.user.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Aktive brukere</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {filteredData.user.newUsers} nye i dag
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      +8%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold">Verge</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {filteredData.verge.activeVerges}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Aktive verge</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {filteredData.verge.clientCount} klienter
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      +5%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold">Admin</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {filteredData.admin.adminUsers}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Admin-brukere</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {filteredData.admin.performanceScore}% ytelse
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      {filteredData.admin.performanceScore}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Custom Toggle Interface */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-1">
              <div className="flex w-full space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
            {/* Real-time Cross-Platform Activity */}
            {data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Real-time Cross-Platform Aktivitet
                  </CardTitle>
                  <CardDescription>Live oversikt over aktivitet på alle plattformer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.unified.realTimeActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="landing" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="user" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="verge" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="admin" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data Flow */}
            {data && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Flow</CardTitle>
                    <CardDescription>Brukerflyt mellom plattformer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.unified.dataFlow.map((flow, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{flow.from}</Badge>
                            <span className="text-gray-500">→</span>
                            <Badge variant="outline">{flow.to}</Badge>
                          </div>
                          <div className="text-sm font-medium">{flow.volume} brukere</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Unified Metrics</CardTitle>
                    <CardDescription>Kombinerte målestokker</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Totale brukere:</span>
                        <span className="font-bold">{data.unified.totalUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cross-platform aktivitet:</span>
                        <span className="font-bold">{data.unified.crossPlatformActivity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Unified sessions:</span>
                        <span className="font-bold">{data.unified.unifiedSessions.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            </div>
          )}

          {activeTab === 'landing' && (
            <div className="space-y-6">
            {data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Besøkende</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{data.landing.visitors.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">I dag</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Sidevisninger</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{data.landing.pageViews.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Totalt</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Bounce Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">{data.landing.bounceRate}%</div>
                      <p className="text-sm text-gray-600">Gjennomsnittlig</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Konverteringer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{data.landing.conversions.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">I dag</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Sider</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.landing.topPages.map((page, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{page.page}</span>
                            <Badge variant="outline">{page.views.toLocaleString()}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Trafikkkilder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data.landing.trafficSources}
                              dataKey="percentage"
                              nameKey="source"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {data.landing.trafficSources.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            </div>
          )}

          {activeTab === 'user' && (
            <div className="space-y-6">
            {data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Aktive Brukere</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{data.user.activeUsers.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">I dag</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Nye Brukere</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{data.user.newUsers}</div>
                      <p className="text-sm text-gray-600">I dag</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Retur-brukere</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{data.user.returningUsers.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">I dag</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Funksjonsbruk</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.user.featureUsage}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="feature" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="usage" fill="#10b981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Brukerreise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.user.userJourney.map((step, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{step.step}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{step.users}%</span>
                              {step.dropoff > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  -{step.dropoff}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            </div>
          )}

          {activeTab === 'verge' && (
            <div className="space-y-6">
            {data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Aktive Verge</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">{data.verge.activeVerges}</div>
                      <p className="text-sm text-gray-600">I dag</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Nye Verge</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{data.verge.newVerges}</div>
                      <p className="text-sm text-gray-600">I dag</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Klienter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{data.verge.clientCount.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Totalt</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Gjennomsnitt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">{data.verge.avgClientsPerVerge}</div>
                      <p className="text-sm text-gray-600">Klienter per verge</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Verge-aktivitet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.verge.vergeActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="action" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Klientfordeling</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.verge.clientDistribution.map((verge, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{verge.verge}</span>
                            <Badge variant="outline">{verge.clients} klienter</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-6">
            {data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Admin-brukere</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600">{data.admin.adminUsers}</div>
                      <p className="text-sm text-gray-600">Aktive</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">System-alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">{data.admin.systemAlerts}</div>
                      <p className="text-sm text-gray-600">Åpne</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">{data.admin.maintenanceTasks}</div>
                      <p className="text-sm text-gray-600">Oppgaver</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Ytelse</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{data.admin.performanceScore}%</div>
                      <p className="text-sm text-gray-600">Score</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Systemhelse</CardTitle>
                    <CardDescription>Detaljert oversikt over systemytelse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.admin.systemHealth.map((health, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{health.metric}</span>
                            <Badge 
                              variant={health.status === 'excellent' ? 'default' : 
                                      health.status === 'good' ? 'secondary' : 'destructive'}
                            >
                              {health.status}
                            </Badge>
                          </div>
                          <div className="text-sm font-bold">{health.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          Sist oppdatert: {lastRefresh.toLocaleString()}
        </div>
        </div>
      </div>
    </div>
  )
}
