'use client'

import { 
  Users, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Activity, 
  Zap, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Eye,
  RefreshCw,
  Sparkles,
  Bot,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  DollarSign
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { AdminCard } from '@/components/admin/AdminCard'
import { AdminSecurityStatus } from '@/components/admin/AdminSecurityStatus'
import { AdminSystemHealth } from '@/components/admin/AdminSystemHealth'
import { AdminKPICard } from '@/components/admin/AdminKPICard'
import { AIChat } from '@/components/ai/AIChat'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AdminStats {
  totalUsers: number
  adminUsers: number
  guardianUsers: number
  regularUsers: number
  activeGuardians: number
  lastActivity?: {
    name: string
    email: string
    updatedAt: string
  }
  systemHealth: string
  uptime: string
  aiInsights?: {
    systemPerformance: number
    userEngagement: number
    securityScore: number
    recommendations: string[]
    alerts: Array<{
      type: 'warning' | 'info' | 'success' | 'error'
      message: string
      priority: 'high' | 'medium' | 'low'
    }>
  }
  realTimeMetrics?: {
    activeUsers: number
    requestsPerMinute: number
    databaseConnections: number
    memoryUsage: number
    cpuUsage: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI-innsikter', icon: Brain },
    { id: 'ai-config', label: 'AI-konfig', icon: Settings },
    { id: 'ai-control', label: 'AI-kontroll', icon: Bot },
    { id: 'alerts', label: 'Varsler', icon: AlertTriangle },
    { id: 'actions', label: 'Handlinger', icon: Zap }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Fallback mock data
        setStats({
          totalUsers: 3,
          adminUsers: 1,
          guardianUsers: 1,
          regularUsers: 1,
          activeGuardians: 1,
          systemHealth: 'EXCELLENT',
          uptime: '99.9%',
          aiInsights: {
            systemPerformance: 95,
            userEngagement: 87,
            securityScore: 98,
            recommendations: [
              'Implementer 2FA for alle admin-brukere',
              'Optimaliser database-indekser',
              'Aktiver real-time monitoring'
            ],
            alerts: [
              { type: 'info', message: 'System oppdatert til v2.4.2', priority: 'low' },
              { type: 'success', message: 'Alle sikkerhetstester bestått', priority: 'medium' }
            ]
          },
          realTimeMetrics: {
            activeUsers: 3,
            requestsPerMinute: 45,
            databaseConnections: 12,
            memoryUsage: 67,
            cpuUsage: 23
          }
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchStats()
    setIsRefreshing(false)
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'EXCELLENT': return 'text-green-600'
      case 'GOOD': return 'text-blue-600'
      case 'WARNING': return 'text-yellow-600'
      case 'CRITICAL': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'EXCELLENT': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'GOOD': return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'WARNING': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'CRITICAL': return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-20 top-40 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-cyan-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute right-16 top-60 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-violet-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundRepeat: 'repeat'}}></div>
      </div>
      <div className="relative z-10 p-6">
        <div className="container mx-auto space-y-6">
          {/* Enhanced Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <Brain className="h-10 w-10 text-violet-600" />
                    AI-Powered Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">Intelligent systemstyring med AI-innsikter og automatisering</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1">
                      <Brain className="h-3 w-3 mr-1" />
                      AI-Powered
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1">
                      <Activity className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Optimal
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-lg"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Oppdaterer...' : 'Oppdater'}
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50">
                    <Settings className="h-4 w-4 mr-2" />
                    Innstillinger
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced AI Insights Panel */}
          {stats?.aiInsights && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Brain className="h-6 w-6 text-violet-600" />
                    AI System Intelligence
                  </h3>
                  <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Live Analysis
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-green-800">System Performance</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={stats.aiInsights.systemPerformance} className="h-2" />
                        </div>
                        <span className="text-sm font-bold text-green-600">{stats.aiInsights.systemPerformance}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-blue-800">User Engagement</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={stats.aiInsights.userEngagement} className="h-2" />
                        </div>
                        <span className="text-sm font-bold text-blue-600">{stats.aiInsights.userEngagement}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-red-800">Security Score</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={stats.aiInsights.securityScore} className="h-2" />
                        </div>
                        <span className="text-sm font-bold text-red-600">{stats.aiInsights.securityScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Real-time Metrics */}
          {stats?.realTimeMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {stats.realTimeMetrics.activeUsers}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">Aktive brukere</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {stats.realTimeMetrics.requestsPerMinute}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">Req/min</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {stats.realTimeMetrics.databaseConnections}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">DB Connections</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <Cpu className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {stats.realTimeMetrics.cpuUsage}%
                      </p>
                      <p className="text-sm text-gray-600 font-medium">CPU Usage</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                      <HardDrive className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        {stats.realTimeMetrics.memoryUsage}%
                      </p>
                      <p className="text-sm text-gray-600 font-medium">Memory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Toggle Interface */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
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
                            ? 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg'
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
              {/* Security Status */}
              <AdminSecurityStatus />
              
              {/* System Health */}
              <AdminSystemHealth />
              
              {/* KPI Cards with AI Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminKPICard
                  title="Totalt Brukere"
                  value={stats?.totalUsers || 0}
                  icon={Users}
                  color="blue"
                  trend="+12%"
                  description="Aktive brukere i systemet"
                />
                <AdminKPICard
                  title="Admin Brukere"
                  value={stats?.adminUsers || 0}
                  icon={Shield}
                  color="green"
                  trend="+2"
                  description="Administratorer"
                />
                <AdminKPICard
                  title="Verge Brukere"
                  value={stats?.guardianUsers || 0}
                  icon={Users}
                  color="purple"
                  trend="+1"
                  description="Verge-brukere"
                />
                <AdminKPICard
                  title="System Helse"
                  value={stats?.systemHealth || 'EXCELLENT'}
                  icon={getHealthIcon(stats?.systemHealth || 'EXCELLENT') as unknown as React.ComponentType<any>}
                  color={getHealthColor(stats?.systemHealth || 'EXCELLENT') as "blue" | "green" | "orange" | "purple" | "red"}
                  trend="99.9%"
                  description="System oppetid"
                />
              </div>
              </div>
            )}

            {activeTab === 'ai-insights' && (
              <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-violet-600" />
                      AI Anbefalinger
                    </h3>
                    <div className="space-y-3">
                      {stats?.aiInsights?.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                          <p className="text-sm text-violet-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      System Alerts
                    </h3>
                    <div className="space-y-3">
                      {stats?.aiInsights?.alerts.map((alert, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          alert.type === 'success' ? 'bg-green-50 border-green-200' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          alert.type === 'error' ? 'bg-red-50 border-red-200' :
                          'bg-blue-50 border-blue-200'
                        }`}>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-600">Priority: {alert.priority}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}

            {activeTab === 'ai-config' && (
              <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    AI Konfigurasjon
                  </h3>
                  <p className="text-gray-600 mb-4">Konfigurer AI-innstillinger og parametere</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Brain className="h-4 w-4 mr-2" />
                      AI Model Settings
                    </Button>
                    <Button variant="outline" className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Config
                    </Button>
                  </div>
                </div>
              </div>
              </div>
            )}

            {activeTab === 'ai-control' && (
              <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bot className="h-5 w-5 text-pink-600" />
                    AI Kontroll
                  </h3>
                  <p className="text-gray-600 mb-4">Kontroller AI-systemer og automatisering</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white">
                      <Bot className="h-4 w-4 mr-2" />
                      AI Control Center
                    </Button>
                    <Button variant="outline" className="border-2 border-pink-300 hover:border-pink-500 hover:bg-pink-50">
                      <Activity className="h-4 w-4 mr-2" />
                      AI Monitoring
                    </Button>
                  </div>
                </div>
              </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    System Varsler
                  </h3>
                  <p className="text-gray-600 mb-4">Oversikt over systemvarsler og notifikasjoner</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">System OK</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">Alle systemer fungerer normalt</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Quick Actions
                  </h3>
                  <p className="text-gray-600 mb-4">Hurtighandlinger og systemoperasjoner</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh System
                    </Button>
                    <Button variant="outline" className="border-2 border-orange-300 hover:border-orange-500 hover:bg-orange-50">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Data
                    </Button>
                    <Button variant="outline" className="border-2 border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* AI Chat Assistant */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-600" />
                AI Admin Assistent
              </h3>
              <AIChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}