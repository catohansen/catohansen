'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Building2, 
  Users, 
  Activity, 
  Database, 
  Brain, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Eye,
  Lock,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  BarChart3,
  FileText,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Network,
  Smartphone,
  Monitor,
  Bot,
  Sparkles,
  Target,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Search,
  Filter,
  Download,
  ExternalLink,
  Info,
  CreditCard,
  Settings,
  AlertCircle,
  X,
  Loader2,
  Play,
  Pause
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from 'recharts'
// Removed non-existent imports - using Card components instead

interface Tenant {
  id: string
  name: string
  slug: string
  logoUrl?: string
  primaryColor?: string
  dataRegion: string
  plan: string
  status: string
  createdAt: string
  updatedAt: string
  metrics: {
    totalUsers: number
    activeUsers: number
    totalTransactions: number
    totalBudgets: number
    totalDebts: number
    storageUsed: number
    lastActivity: string
  }
}

interface EnterpriseMetrics {
  totalTenants: number
  activeTenants: number
  totalUsers: number
  activeUsers: number
  totalTransactions: number
  totalRevenue: number
  systemHealth: number
  aiAccuracy: number
  complianceScore: number
  lastUpdated: string
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple'
  loading?: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200'
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'orange': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'red': return 'text-red-600 bg-red-50 border-red-200'
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className={`${getColorClasses(color)} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-lg font-semibold">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {trend && trendValue && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(trend)}
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const EnterpriseMonitorDashboard: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [metrics, setMetrics] = useState<EnterpriseMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchTenants = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/tenants')
      if (response.ok) {
        const result = await response.json()
        setTenants(result.data || [])
      } else {
        console.error('Failed to fetch tenants')
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
    }
  }, [])

  const fetchMetrics = useCallback(async () => {
    try {
      // Mock enterprise metrics - in real implementation, this would come from a dedicated API
      const mockMetrics: EnterpriseMetrics = {
        totalTenants: tenants.length,
        activeTenants: tenants.filter(t => t.status === 'active').length,
        totalUsers: tenants.reduce((sum, t) => sum + t.metrics.totalUsers, 0),
        activeUsers: tenants.reduce((sum, t) => sum + t.metrics.activeUsers, 0),
        totalTransactions: tenants.reduce((sum, t) => sum + t.metrics.totalTransactions, 0),
        totalRevenue: tenants.length * 2500, // Mock revenue calculation
        systemHealth: 98.5,
        aiAccuracy: 94.2,
        complianceScore: 96.8,
        lastUpdated: new Date().toISOString()
      }
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  }, [tenants])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchTenants()
      setLoading(false)
    }
    fetchData()
  }, [fetchTenants])

  useEffect(() => {
    if (tenants.length > 0) {
      fetchMetrics()
    }
  }, [tenants, fetchMetrics])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        setRefreshing(true)
        fetchTenants().then(() => {
          setRefreshing(false)
          setLastUpdate(new Date())
        })
      }, 30000) // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, fetchTenants])

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>
      case 'suspended':
        return <Badge variant="destructive" className="bg-red-500 text-white">Suspended</Badge>
      case 'trial':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Trial</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'enterprise':
        return <Badge variant="default" className="bg-purple-500 text-white">Enterprise</Badge>
      case 'premium':
        return <Badge variant="default" className="bg-blue-500 text-white">Premium</Badge>
      case 'free':
        return <Badge variant="outline">Free</Badge>
      default:
        return <Badge variant="secondary">{plan}</Badge>
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Enterprise Monitor</h1>
        <p>Overvåker alle tenants, brukere og systemytelse på enterprise-nivå.</p>
        <div className="text-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Laster enterprise data...</p>
        </div>
      </div>
    )
  }

  // Mock data for charts
  const tenantGrowthData = [
    { month: 'Jan', tenants: 5, users: 120 },
    { month: 'Feb', tenants: 8, users: 180 },
    { month: 'Mar', tenants: 12, users: 250 },
    { month: 'Apr', tenants: 15, users: 320 },
    { month: 'May', tenants: 18, users: 400 },
    { month: 'Jun', tenants: tenants.length, users: metrics?.totalUsers || 0 }
  ]

  const planDistributionData = [
    { name: 'Enterprise', value: tenants.filter(t => t.plan === 'ENTERPRISE').length, color: '#8b5cf6' },
    { name: 'Premium', value: tenants.filter(t => t.plan === 'PREMIUM').length, color: '#3b82f6' },
    { name: 'Free', value: tenants.filter(t => t.plan === 'FREE').length, color: '#6b7280' }
  ]

  const regionDistributionData = [
    { name: 'Norway', value: tenants.filter(t => t.dataRegion === 'NO').length, color: '#10b981' },
    { name: 'EU', value: tenants.filter(t => t.dataRegion === 'EU').length, color: '#f59e0b' },
    { name: 'US', value: tenants.filter(t => t.dataRegion === 'US').length, color: '#ef4444' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        
          
            <Building2 className="h-8 w-8 text-purple-600" /> Enterprise Monitor
          
          
            Overvåker alle tenants, brukere og systemytelse på enterprise-nivå med avanserte analytics.
          
        

        <div className="flex justify-end mb-4 space-x-2">
          <Button 
            onClick={() => { setLoading(true); fetchTenants() }} 
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {refreshing ? 'Oppdaterer...' : 'Manuell Oppdatering'}
          </Button>
          <Button 
            onClick={() => setAutoRefresh(!autoRefresh)} 
            variant={autoRefresh ? "default" : "outline"}
          >
            {autoRefresh ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            Auto-oppdatering {autoRefresh ? 'På' : 'Av'}
          </Button>
        </div>

        {/* Enterprise Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Tenants"
              value={metrics.totalTenants}
              subtitle={`${metrics.activeTenants} active`}
              icon={<Building2 className="h-5 w-5" />}
              color="purple"
              trend="up"
              trendValue="+12%"
            />
            <MetricCard
              title="Total Users"
              value={metrics.totalUsers}
              subtitle={`${metrics.activeUsers} active`}
              icon={<Users className="h-5 w-5" />}
              color="blue"
              trend="up"
              trendValue="+8%"
            />
            <MetricCard
              title="System Health"
              value={`${metrics.systemHealth}%`}
              subtitle="Overall uptime"
              icon={<Activity className="h-5 w-5" />}
              color="green"
              trend="up"
              trendValue="+0.2%"
            />
            <MetricCard
              title="AI Accuracy"
              value={`${metrics.aiAccuracy}%`}
              subtitle="Model performance"
              icon={<Brain className="h-5 w-5" />}
              color="orange"
              trend="up"
              trendValue="+1.5%"
            />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Ytelse</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Growth</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={tenantGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="tenants" fill="#8b5cf6" name="Tenants" />
                      <Line yAxisId="right" type="monotone" dataKey="users" stroke="#3b82f6" name="Users" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={planDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {planDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tenants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{tenant.name}</h3>
                          <p className="text-sm text-gray-500">@{tenant.slug}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(tenant.status)}
                            {getPlanBadge(tenant.plan)}
                            <Badge variant="outline">{tenant.dataRegion}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {tenant.metrics.totalUsers} users
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.metrics.totalTransactions} transactions
                        </div>
                        <div className="text-xs text-gray-400">
                          Last activity: {new Date(tenant.metrics.lastActivity).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {regionDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity Heatmap</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Heatmap visualization coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="API Response Time"
                value="145ms"
                subtitle="Average p95"
                icon={<Zap className="h-5 w-5" />}
                color="green"
                trend="down"
                trendValue="-5ms"
              />
              <MetricCard
                title="Database Latency"
                value="23ms"
                subtitle="Average query time"
                icon={<Database className="h-5 w-5" />}
                color="blue"
                trend="down"
                trendValue="-2ms"
              />
              <MetricCard
                title="Cache Hit Rate"
                value="94.2%"
                subtitle="Redis performance"
                icon={<HardDrive className="h-5 w-5" />}
                color="purple"
                trend="up"
                trendValue="+1.2%"
              />
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="GDPR Compliance"
                value="100%"
                subtitle="All tenants compliant"
                icon={<Shield className="h-5 w-5" />}
                color="green"
                trend="neutral"
                trendValue="Stable"
              />
              <MetricCard
                title="AI Act Compliance"
                value="98.5%"
                subtitle="Model documentation"
                icon={<Brain className="h-5 w-5" />}
                color="blue"
                trend="up"
                trendValue="+0.5%"
              />
              <MetricCard
                title="Audit Readiness"
                value="100%"
                subtitle="All data traceable"
                icon={<FileText className="h-5 w-5" />}
                color="green"
                trend="neutral"
                trendValue="Complete"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Last Update */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Sist oppdatert: {lastUpdate.toLocaleString('nb-NO')}
        </div>
      </div>
    </div>
  )
}

export default EnterpriseMonitorDashboard
