/**
 * Transparency Dashboard
 * 
 * Comprehensive transparency and audit trail dashboard
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Shield, Activity, Database, Brain, CheckCircle, AlertTriangle, XCircle,
  RefreshCw, Eye, Lock, TrendingUp, TrendingDown, Clock, Users, Zap, BarChart3,
  FileText, Globe, Server, Cpu, HardDrive, Network, Smartphone, Monitor, Bot,
  Sparkles, Target, Star, ArrowUpRight, ArrowDownRight, DollarSign, Search,
  Filter, Download, ExternalLink, Info, CreditCard, Settings, AlertCircle,
  X, Loader2, Pause, Play, Layers, Scale, Gauge, PieChart, AreaChart,
  Bell, BellOff, AlertOctagon, CheckSquare, Square, UserCheck, MessageSquare,
  Calendar, MapPin, Phone, Mail, User, ChevronDown, ChevronUp, MoreHorizontal,
  Key, Fingerprint, Smartphone as DeviceIcon, Wifi, WifiOff, Check, X as XIcon,
  RotateCcw, Save, Edit, Trash2, Plus, Minus, AlertTriangle as WarningIcon,
  BookOpen, FileSearch, History, ClipboardList, ShieldCheck, EyeOff, Code
} from 'lucide-react'
import { LineChart, Tooltip, Legend } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { 
  Line, Area, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
// Removed non-existent imports - using Card components instead

// Define interfaces for data structures
interface TransparencyData {
  overallTransparencyScore: number
  auditTrail: {
    totalEvents: number
    eventsLast24h: number
    eventsLast7d: number
    eventsLast30d: number
    eventsByType: Array<{ type: string; count: number }>
    eventsByUser: Array<{ user: string; count: number }>
    recentEvents: AuditEvent[]
  }
  dataProvenance: {
    totalDataSources: number
    verifiedSources: number
    unverifiedSources: number
    dataFlowMaps: number
    lineageTraces: number
  }
  systemTransparency: {
    apiEndpoints: number
    documentedEndpoints: number
    openSourceComponents: number
    thirdPartyServices: number
    dataRetentionPolicies: number
    privacyPolicies: number
  }
  complianceStatus: {
    gdprCompliant: boolean
    aiActCompliant: boolean
    soc2Compliant: boolean
    iso27001Compliant: boolean
    lastAudit: string
    nextAudit: string
  }
  realTimeMetrics: {
    activeUsers: number
    apiCallsPerMinute: number
    dataProcessingRate: number
    errorRate: number
    systemUptime: number
  }
}

interface AuditEvent {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: string
  entity: string
  entityId: string
  ipAddress: string
  userAgent: string
  details: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: string
}

interface DataSource {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'deprecated'
  lastVerified: Date
  verificationStatus: 'verified' | 'pending' | 'failed'
  dataVolume: number
  retentionPeriod: number
  privacyLevel: 'public' | 'internal' | 'confidential' | 'restricted'
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
  onClick?: () => void
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false,
  onClick
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
    <Card 
      className={`${getColorClasses(color)} transition-all duration-200 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
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

const TransparencyDashboard: React.FC = () => {
  const [transparencyData, setTransparencyData] = useState<TransparencyData | null>(null)
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

  const fetchTransparencyData = useCallback(async () => {
    try {
      // Mock data - in production this would come from actual APIs
      const mockTransparencyData: TransparencyData = {
        overallTransparencyScore: 96.8,
        auditTrail: {
          totalEvents: 45678,
          eventsLast24h: 1234,
          eventsLast7d: 8765,
          eventsLast30d: 34567,
          eventsByType: [
            { type: 'user.login', count: 1234 },
            { type: 'data.access', count: 2345 },
            { type: 'data.modify', count: 1567 },
            { type: 'system.change', count: 890 },
            { type: 'security.event', count: 234 }
          ],
          eventsByUser: [
            { user: 'admin@pengeplan.no', count: 2345 },
            { user: 'user@example.com', count: 1234 },
            { user: 'system', count: 3456 }
          ],
          recentEvents: [
            {
              id: 'event-001',
              timestamp: new Date(Date.now() - 1000 * 60 * 5),
              userId: 'user-123',
              userName: 'admin@pengeplan.no',
              action: 'data.access',
              entity: 'User',
              entityId: 'user-456',
              ipAddress: '192.168.1.100',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              details: { resource: 'user-profile', method: 'GET' },
              severity: 'low',
              category: 'data-access'
            },
            {
              id: 'event-002',
              timestamp: new Date(Date.now() - 1000 * 60 * 15),
              userId: 'user-456',
              userName: 'user@example.com',
              action: 'data.modify',
              entity: 'Transaction',
              entityId: 'txn-789',
              ipAddress: '192.168.1.101',
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
              details: { resource: 'transaction', method: 'PUT', changes: ['amount', 'category'] },
              severity: 'medium',
              category: 'data-modification'
            },
            {
              id: 'event-003',
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              userId: 'system',
              userName: 'system',
              action: 'system.change',
              entity: 'Configuration',
              entityId: 'config-001',
              ipAddress: '127.0.0.1',
              userAgent: 'Pengeplan-System/2.0',
              details: { resource: 'system-config', method: 'POST', changes: ['api-rate-limit'] },
              severity: 'high',
              category: 'system-change'
            }
          ]
        },
        dataProvenance: {
          totalDataSources: 24,
          verifiedSources: 22,
          unverifiedSources: 2,
          dataFlowMaps: 15,
          lineageTraces: 1247
        },
        systemTransparency: {
          apiEndpoints: 156,
          documentedEndpoints: 152,
          openSourceComponents: 45,
          thirdPartyServices: 12,
          dataRetentionPolicies: 8,
          privacyPolicies: 3
        },
        complianceStatus: {
          gdprCompliant: true,
          aiActCompliant: true,
          soc2Compliant: false,
          iso27001Compliant: false,
          lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
          nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days from now
        },
        realTimeMetrics: {
          activeUsers: 234,
          apiCallsPerMinute: 1234,
          dataProcessingRate: 567,
          errorRate: 0.002,
          systemUptime: 99.9
        }
      }

      const mockDataSources: DataSource[] = [
        {
          id: 'ds-001',
          name: 'User Database',
          type: 'PostgreSQL',
          status: 'active',
          lastVerified: new Date(Date.now() - 1000 * 60 * 60 * 2),
          verificationStatus: 'verified',
          dataVolume: 2.5,
          retentionPeriod: 2555, // 7 years in days
          privacyLevel: 'confidential'
        },
        {
          id: 'ds-002',
          name: 'Transaction Logs',
          type: 'MongoDB',
          status: 'active',
          lastVerified: new Date(Date.now() - 1000 * 60 * 60 * 4),
          verificationStatus: 'verified',
          dataVolume: 15.7,
          retentionPeriod: 2555,
          privacyLevel: 'restricted'
        },
        {
          id: 'ds-003',
          name: 'Analytics Data',
          type: 'BigQuery',
          status: 'active',
          lastVerified: new Date(Date.now() - 1000 * 60 * 60 * 6),
          verificationStatus: 'verified',
          dataVolume: 45.2,
          retentionPeriod: 1095, // 3 years in days
          privacyLevel: 'internal'
        },
        {
          id: 'ds-004',
          name: 'Legacy System',
          type: 'MySQL',
          status: 'deprecated',
          lastVerified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          verificationStatus: 'pending',
          dataVolume: 8.9,
          retentionPeriod: 365,
          privacyLevel: 'confidential'
        }
      ]

      setTransparencyData(mockTransparencyData)
      setDataSources(mockDataSources)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching transparency data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTransparencyData()
  }, [fetchTransparencyData])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        setRefreshing(true)
        fetchTransparencyData()
      }, 30000) // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, fetchTransparencyData])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red'
      case 'high': return 'orange'
      case 'medium': return 'blue'
      case 'low': return 'green'
      default: return 'blue'
    }
  }

  const getSeverityBadge = (severity: string) => {
    const color = getSeverityColor(severity)
    return (
      <Badge 
        variant={color === 'red' ? 'destructive' : color === 'orange' ? 'secondary' : 'secondary'}
        className={`bg-${color}-500 text-white`}
      >
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    )
  }

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'green'
      case 'internal': return 'blue'
      case 'confidential': return 'orange'
      case 'restricted': return 'red'
      default: return 'blue'
    }
  }

  const getPrivacyLevelBadge = (level: string) => {
    const color = getPrivacyLevelColor(level)
    return (
      <Badge 
        variant={color === 'red' ? 'destructive' : color === 'orange' ? 'secondary' : 'secondary'}
        className={`bg-${color}-500 text-white`}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-500 text-white">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Inactive</Badge>
      case 'deprecated':
        return <Badge variant="destructive" className="bg-red-500 text-white">Deprecated</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Eye className="h-8 w-8 text-blue-600" /> Transparency Dashboard
            </h1>
            <p className="text-gray-600">
              Komplett oversikt over systemtransparens, audit trails og dataproveniens.
            </p>
          </div>
          <div className="text-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
            <p className="mt-4 text-lg text-gray-600">Laster transparensdata...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!transparencyData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Eye className="h-8 w-8 text-blue-600" /> Transparency Dashboard
            </h1>
            <p className="text-gray-600">
              Komplett oversikt over systemtransparens, audit trails og dataproveniens.
            </p>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Feil</AlertTitle>
            <AlertDescription>
              Kunne ikke laste transparensdata. Vennligst prøv igjen.
            </AlertDescription>
          </Alert>
          <Button onClick={() => { setLoading(true); fetchTransparencyData() }} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Prøv igjen
          </Button>
        </div>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Eye className="h-8 w-8 text-blue-600" /> Transparency Dashboard
          </h1>
          <p className="text-gray-600">
            Komplett oversikt over systemtransparens, audit trails, dataproveniens og compliance-status.
          </p>
        </div>

        <div className="flex justify-end mb-4 space-x-2">
          <Button 
            onClick={() => { setLoading(true); fetchTransparencyData() }} 
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

        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Overall Transparency Score"
            value={`${transparencyData.overallTransparencyScore}%`}
            icon={<Eye className="h-5 w-5" />}
            color={transparencyData.overallTransparencyScore < 80 ? 'red' : transparencyData.overallTransparencyScore < 90 ? 'orange' : 'green'}
            subtitle={`Last updated: ${lastUpdate.toLocaleTimeString()}`}
          />
          <MetricCard
            title="Audit Events (24h)"
            value={transparencyData.auditTrail.eventsLast24h}
            icon={<History className="h-5 w-5" />}
            color="blue"
            subtitle={`${transparencyData.auditTrail.totalEvents} total events`}
            onClick={() => setActiveTab('audit')}
          />
          <MetricCard
            title="Data Sources"
            value={`${transparencyData.dataProvenance.verifiedSources}/${transparencyData.dataProvenance.totalDataSources}`}
            icon={<Database className="h-5 w-5" />}
            color={transparencyData.dataProvenance.unverifiedSources > 0 ? 'orange' : 'green'}
            subtitle={`${transparencyData.dataProvenance.unverifiedSources} unverified`}
            onClick={() => setActiveTab('provenance')}
          />
          <MetricCard
            title="Compliance Status"
            value={transparencyData.complianceStatus.gdprCompliant && transparencyData.complianceStatus.aiActCompliant ? 'Compliant' : 'Review Needed'}
            icon={<ShieldCheck className="h-5 w-5" />}
            color={transparencyData.complianceStatus.gdprCompliant && transparencyData.complianceStatus.aiActCompliant ? 'green' : 'orange'}
            subtitle={`GDPR: ${transparencyData.complianceStatus.gdprCompliant ? '✓' : '✗'}, AI Act: ${transparencyData.complianceStatus.aiActCompliant ? '✓' : '✗'}`}
            onClick={() => setActiveTab('compliance')}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="provenance">Dataproveniens</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="system">System Info</TabsTrigger>
            <TabsTrigger value="realtime">Sanntid</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Transparency Score Breakdown</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Audit Coverage', value: 98 },
                      { name: 'Data Provenance', value: 95 },
                      { name: 'API Documentation', value: 97 },
                      { name: 'Compliance Status', value: 96 },
                      { name: 'System Transparency', value: 99 }
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Audit Events by Type</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transparencyData.auditTrail.eventsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ type, percent }) => `${type}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      >
                        {transparencyData.auditTrail.eventsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Recent Audit Events</CardTitle></CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] pr-4">
                  {transparencyData.auditTrail.recentEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 py-2 border-b last:border-b-0">
                      <div className="flex-shrink-0">
                        <History className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium">{event.action}</p>
                          {getSeverityBadge(event.severity)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {event.userName} • {event.entity} • {event.ipAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsEventDialogOpen(true)
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Total Events" value={transparencyData.auditTrail.totalEvents} icon={<History className="h-5 w-5" />} color="blue" />
              <MetricCard title="Last 24h" value={transparencyData.auditTrail.eventsLast24h} icon={<Clock className="h-5 w-5" />} color="green" />
              <MetricCard title="Last 7d" value={transparencyData.auditTrail.eventsLast7d} icon={<Calendar className="h-5 w-5" />} color="purple" />
              <MetricCard title="Last 30d" value={transparencyData.auditTrail.eventsLast30d} icon={<BarChart3 className="h-5 w-5" />} color="orange" />
            </div>
            
            <Card>
              <CardHeader><CardTitle>Audit Events by User</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transparencyData.auditTrail.eventsByUser}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="user" />
                    <YAxis label={{ value: 'Events', angle: -90, position: 'insideLeft' }} />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="provenance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Total Data Sources" value={transparencyData.dataProvenance.totalDataSources} icon={<Database className="h-5 w-5" />} color="blue" />
              <MetricCard title="Verified Sources" value={transparencyData.dataProvenance.verifiedSources} icon={<CheckCircle className="h-5 w-5" />} color="green" />
              <MetricCard title="Unverified Sources" value={transparencyData.dataProvenance.unverifiedSources} icon={<AlertTriangle className="h-5 w-5" />} color="orange" />
              <MetricCard title="Data Flow Maps" value={transparencyData.dataProvenance.dataFlowMaps} icon={<Network className="h-5 w-5" />} color="purple" />
            </div>
            
            <Card>
              <CardHeader><CardTitle>Data Sources</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {dataSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Database className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{source.name}</h4>
                          <p className="text-sm text-gray-600">{source.type} • {source.dataVolume}GB</p>
                          <p className="text-xs text-gray-500">
                            Last verified: {source.lastVerified.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(source.status)}
                        {getPrivacyLevelBadge(source.privacyLevel)}
                        <Badge variant={source.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                          {source.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard 
                title="GDPR Compliance" 
                value={transparencyData.complianceStatus.gdprCompliant ? 'Compliant' : 'Non-Compliant'} 
                icon={<ShieldCheck className="h-5 w-5" />} 
                color={transparencyData.complianceStatus.gdprCompliant ? 'green' : 'red'} 
              />
              <MetricCard 
                title="AI Act Compliance" 
                value={transparencyData.complianceStatus.aiActCompliant ? 'Compliant' : 'Non-Compliant'} 
                icon={<Brain className="h-5 w-5" />} 
                color={transparencyData.complianceStatus.aiActCompliant ? 'green' : 'red'} 
              />
              <MetricCard 
                title="SOC 2 Compliance" 
                value={transparencyData.complianceStatus.soc2Compliant ? 'Compliant' : 'Non-Compliant'} 
                icon={<Lock className="h-5 w-5" />} 
                color={transparencyData.complianceStatus.soc2Compliant ? 'green' : 'orange'} 
              />
              <MetricCard 
                title="ISO 27001" 
                value={transparencyData.complianceStatus.iso27001Compliant ? 'Compliant' : 'Non-Compliant'} 
                icon={<Scale className="h-5 w-5" />} 
                color={transparencyData.complianceStatus.iso27001Compliant ? 'green' : 'orange'} 
              />
              <MetricCard 
                title="Last Audit" 
                value={new Date(transparencyData.complianceStatus.lastAudit).toLocaleDateString()} 
                icon={<Calendar className="h-5 w-5" />} 
                color="blue" 
              />
              <MetricCard 
                title="Next Audit" 
                value={new Date(transparencyData.complianceStatus.nextAudit).toLocaleDateString()} 
                icon={<Clock className="h-5 w-5" />} 
                color="purple" 
              />
            </div>
            
            <Card>
              <CardHeader><CardTitle>Compliance Timeline</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '2024-01', gdpr: 95, aiAct: 90, soc2: 70, iso27001: 65 },
                    { date: '2024-02', gdpr: 96, aiAct: 92, soc2: 75, iso27001: 70 },
                    { date: '2024-03', gdpr: 97, aiAct: 94, soc2: 80, iso27001: 75 },
                    { date: '2024-04', gdpr: 98, aiAct: 96, soc2: 85, iso27001: 80 },
                    { date: '2024-05', gdpr: 99, aiAct: 98, soc2: 90, iso27001: 85 },
                    { date: '2024-06', gdpr: 100, aiAct: 100, soc2: 95, iso27001: 90 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Compliance Score (%)', angle: -90, position: 'insideLeft' }} />
                    <Line type="monotone" dataKey="gdpr" stroke="#00C49F" strokeWidth={2} />
                    <Line type="monotone" dataKey="aiAct" stroke="#0088FE" strokeWidth={2} />
                    <Line type="monotone" dataKey="soc2" stroke="#FFBB28" strokeWidth={2} />
                    <Line type="monotone" dataKey="iso27001" stroke="#FF8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard title="API Endpoints" value={transparencyData.systemTransparency.apiEndpoints} icon={<Globe className="h-5 w-5" />} color="blue" />
              <MetricCard title="Documented" value={transparencyData.systemTransparency.documentedEndpoints} icon={<FileText className="h-5 w-5" />} color="green" />
              <MetricCard title="Open Source Components" value={transparencyData.systemTransparency.openSourceComponents} icon={<Code className="h-5 w-5" />} color="purple" />
              <MetricCard title="Third Party Services" value={transparencyData.systemTransparency.thirdPartyServices} icon={<ExternalLink className="h-5 w-5" />} color="orange" />
              <MetricCard title="Data Retention Policies" value={transparencyData.systemTransparency.dataRetentionPolicies} icon={<Clock className="h-5 w-5" />} color="blue" />
              <MetricCard title="Privacy Policies" value={transparencyData.systemTransparency.privacyPolicies} icon={<Eye className="h-5 w-5" />} color="green" />
            </div>
            
            <Card>
              <CardHeader><CardTitle>System Transparency Score</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'API Documentation', value: (transparencyData.systemTransparency.documentedEndpoints / transparencyData.systemTransparency.apiEndpoints) * 100 },
                    { name: 'Open Source Ratio', value: (transparencyData.systemTransparency.openSourceComponents / (transparencyData.systemTransparency.openSourceComponents + transparencyData.systemTransparency.thirdPartyServices)) * 100 },
                    { name: 'Policy Coverage', value: ((transparencyData.systemTransparency.dataRetentionPolicies + transparencyData.systemTransparency.privacyPolicies) / 2) * 100 }
                  ]}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard title="Active Users" value={transparencyData.realTimeMetrics.activeUsers} icon={<Users className="h-5 w-5" />} color="blue" />
              <MetricCard title="API Calls/min" value={transparencyData.realTimeMetrics.apiCallsPerMinute} icon={<Zap className="h-5 w-5" />} color="green" />
              <MetricCard title="Data Processing Rate" value={`${transparencyData.realTimeMetrics.dataProcessingRate} ops/s`} icon={<Database className="h-5 w-5" />} color="purple" />
              <MetricCard title="Error Rate" value={`${(transparencyData.realTimeMetrics.errorRate * 100).toFixed(3)}%`} icon={<XCircle className="h-5 w-5" />} color={transparencyData.realTimeMetrics.errorRate > 0.01 ? 'red' : 'green'} />
              <MetricCard title="System Uptime" value={`${transparencyData.realTimeMetrics.systemUptime}%`} icon={<Server className="h-5 w-5" />} color="green" />
            </div>
            
            <Card>
              <CardHeader><CardTitle>Real-time Activity</CardTitle></CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { time: '00:00', users: 45, apiCalls: 234, errors: 2 },
                    { time: '04:00', users: 23, apiCalls: 123, errors: 1 },
                    { time: '08:00', users: 156, apiCalls: 567, errors: 3 },
                    { time: '12:00', users: 234, apiCalls: 1234, errors: 5 },
                    { time: '16:00', users: 198, apiCalls: 890, errors: 2 },
                    { time: '20:00', users: 87, apiCalls: 345, errors: 1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" label={{ value: 'Users', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'API Calls', angle: 90, position: 'insideRight' }} />
                    <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="apiCalls" stroke="#82ca9d" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Event Details Dialog */}
        <Dialog>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Audit Event Details</DialogTitle>
              <DialogDescription>
                {selectedEvent && `Details for event: ${selectedEvent.action}`}
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event ID</Label>
                    <Input value={selectedEvent.id} readOnly />
                  </div>
                  <div>
                    <Label>Timestamp</Label>
                    <Input value={selectedEvent.timestamp.toLocaleString()} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>User</Label>
                    <Input value={selectedEvent.userName} readOnly />
                  </div>
                  <div>
                    <Label>Action</Label>
                    <Input value={selectedEvent.action} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Entity</Label>
                    <Input value={selectedEvent.entity} readOnly />
                  </div>
                  <div>
                    <Label>Entity ID</Label>
                    <Input value={selectedEvent.entityId} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>IP Address</Label>
                    <Input value={selectedEvent.ipAddress} readOnly />
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={selectedEvent.severity} readOnly />
                      {getSeverityBadge(selectedEvent.severity)}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Details</Label>
                  <Textarea
                    value={JSON.stringify(selectedEvent.details, null, 2)}
                    readOnly
                    rows={6}
                    className="bg-gray-50"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsEventDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default TransparencyDashboard
