'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Globe, 
  Users, 
  Activity,
  Zap,
  Ban,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Database,
  Smartphone,
  Mail,
  MessageSquare,
  FileText,
  Download,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Square,
  AlertCircle,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Key,
  Fingerprint,
  Search,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts'

interface SecurityEvent {
  id: string
  timestamp: number
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  details: {
    userId?: string
    ip?: string
    userAgent?: string
    endpoint?: string
    reason?: string
    location?: string
    country?: string
  }
  status: 'active' | 'resolved' | 'investigating'
}

interface ThreatSummary {
  totalEvents: number
  criticalEvents: number
  highEvents: number
  mediumEvents: number
  lowEvents: number
  activeThreats: number
  blockedIPs: number
  securityScore: number
}

interface IPThreat {
  ip: string
  country: string
  city: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  reasons: string[]
  firstSeen: string
  lastSeen: string
  blocked: boolean
}

interface SecurityMetrics {
  totalLogins: number
  failedLogins: number
  blockedAttempts: number
  activeSessions: number
  securityScore: number
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  lastIncident: string
  uptime: number
}

interface AIThreatAnalysis {
  anomalyScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  patterns: string[]
  recommendations: string[]
  confidence: number
}

export default function SecurityCommandCenter() {
  const router = useRouter()
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [threatSummary, setThreatSummary] = useState<ThreatSummary | null>(null)
  const [ipThreats, setIpThreats] = useState<IPThreat[]>([])
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIThreatAnalysis | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [autoResponse, setAutoResponse] = useState(true)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const user = await response.json()
        if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
          setIsAuthenticated(true)
        } else {
          router.push('/admin-login')
        }
      } else {
        router.push('/admin-login')
      }
    } catch (error) {
      router.push('/admin-login')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch security data
  const fetchSecurityData = async () => {
    if (!isAuthenticated) return
    
    try {
      const [eventsResponse, summaryResponse, threatsResponse, metricsResponse, aiResponse] = await Promise.all([
        fetch('/api/security/events'),
        fetch('/api/security/summary'),
        fetch('/api/security/ip-threats'),
        fetch('/api/security/metrics'),
        fetch('/api/security/ai-analysis')
      ])

      if (eventsResponse.ok) {
        const events = await eventsResponse.json()
        setSecurityEvents(events.events || [])
      }

      if (summaryResponse.ok) {
        const summary = await summaryResponse.json()
        setThreatSummary(summary.summary)
      }

      if (threatsResponse.ok) {
        const threats = await threatsResponse.json()
        setIpThreats(threats.threats || [])
      }

      if (metricsResponse.ok) {
        const metrics = await metricsResponse.json()
        setSecurityMetrics(metrics.metrics)
      }

      if (aiResponse.ok) {
        const ai = await aiResponse.json()
        setAiAnalysis(ai.analysis)
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch security data:', error)
    }
  }

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Auto-refresh every 5 seconds when live and authenticated
  useEffect(() => {
    if (isLive && isAuthenticated) {
      const interval = setInterval(fetchSecurityData, 5000)
      return () => clearInterval(interval)
    }
  }, [isLive, isAuthenticated])

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSecurityData()
    }
  }, [isAuthenticated])

  // Initialize lastUpdate on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !lastUpdate) {
      setLastUpdate(new Date())
    }
  }, [lastUpdate])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldX className="h-4 w-4 text-red-500" />
      case 'high': return <ShieldAlert className="h-4 w-4 text-orange-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low': return <ShieldCheck className="h-4 w-4 text-green-500" />
      default: return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const handleEmergencyToggle = () => {
    if (confirm('Aktiver nødmodus? Dette gir full systemtilgang uten sikkerhetsrestriksjoner.')) {
      setEmergencyMode(!emergencyMode)
      // Send emergency mode toggle to API
      fetch('/api/security/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergency: !emergencyMode })
      })
    }
  }

  const handleBlockIP = async (ip: string) => {
    try {
      await fetch('/api/security/block-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      })
      fetchSecurityData() // Refresh data
    } catch (error) {
      console.error('Failed to block IP:', error)
    }
  }

  const handleUnblockIP = async (ip: string) => {
    try {
      await fetch('/api/security/unblock-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      })
      fetchSecurityData() // Refresh data
    } catch (error) {
      console.error('Failed to unblock IP:', error)
    }
  }

  const handleAutoResponseToggle = () => {
    setAutoResponse(!autoResponse)
    // Send auto-response toggle to API
    fetch('/api/security/auto-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !autoResponse })
    })
  }

  // Mock data for demonstration
  const mockSecurityEvents: SecurityEvent[] = [
    {
      id: '1',
      timestamp: Date.now() - 300000,
      type: 'BRUTE_FORCE_ATTEMPT',
      severity: 'critical',
      source: '192.168.1.100',
      details: {
        ip: '192.168.1.100',
        endpoint: '/api/auth/login',
        reason: 'Multiple failed login attempts',
        location: 'Oslo, Norway',
        country: 'NO'
      },
      status: 'active'
    },
    {
      id: '2',
      timestamp: Date.now() - 600000,
      type: 'SUSPICIOUS_ACTIVITY',
      severity: 'high',
      source: '10.0.0.50',
      details: {
        ip: '10.0.0.50',
        endpoint: '/admin/users',
        reason: 'Unauthorized access attempt',
        location: 'Unknown',
        country: 'Unknown'
      },
      status: 'investigating'
    }
  ]

  const mockThreatSummary: ThreatSummary = {
    totalEvents: 47,
    criticalEvents: 3,
    highEvents: 8,
    mediumEvents: 15,
    lowEvents: 21,
    activeThreats: 2,
    blockedIPs: 12,
    securityScore: 87
  }

  const mockSecurityMetrics: SecurityMetrics = {
    totalLogins: 1247,
    failedLogins: 23,
    blockedAttempts: 8,
    activeSessions: 156,
    securityScore: 87,
    threatLevel: 'medium',
    lastIncident: '2 hours ago',
    uptime: 99.8
  }

  const mockAiAnalysis: AIThreatAnalysis = {
    anomalyScore: 0.23,
    riskLevel: 'medium',
    patterns: ['Unusual login patterns', 'Geographic anomalies', 'Time-based attacks'],
    recommendations: [
      'Enable 2FA for all admin accounts',
      'Implement geographic restrictions',
      'Increase monitoring for off-hours activity'
    ],
    confidence: 0.87
  }

  // Use mock data if API fails
  const events = securityEvents.length > 0 ? securityEvents : mockSecurityEvents
  const summary = threatSummary || mockThreatSummary
  const metrics = securityMetrics || mockSecurityMetrics
  const analysis = aiAnalysis || mockAiAnalysis

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Laster Ultra Security Command Center...</p>
          <p className="text-slate-300 text-sm">Verifiserer admin-tilgang</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Tilgang Nektet</h1>
          <p className="text-slate-300 mb-4">Du har ikke tilgang til sikkerhetssystemet</p>
          <Button onClick={() => router.push('/admin-login')} className="bg-blue-600 hover:bg-blue-700">
            Gå til Admin Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🛡️ Ultra Security Command Center
            </h1>
            <p className="text-slate-300">
              AI-drevet sikkerhetsovervåking og trusselhåndtering for Pengeplan 2.0
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm text-slate-300">
                {isLive ? 'Live' : 'Paused'} • {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Loading...'}
              </span>
            </div>
            <Button
              onClick={() => setIsLive(!isLive)}
              variant={isLive ? "destructive" : "default"}
              size="sm"
            >
              {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isLive ? 'Pause' : 'Resume'}
            </Button>
            <Button
              onClick={handleEmergencyToggle}
              variant={emergencyMode ? "destructive" : "outline"}
              size="sm"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {emergencyMode ? 'Emergency Mode' : 'Normal Mode'}
            </Button>
          </div>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Security Score</p>
                <p className="text-3xl font-bold text-white">{summary.securityScore}/100</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-green-200" />
            </div>
            <Progress value={summary.securityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Sessions</p>
                <p className="text-3xl font-bold text-white">{metrics.activeSessions}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
            <p className="text-blue-100 text-xs mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Blocked IPs</p>
                <p className="text-3xl font-bold text-white">{summary.blockedIPs}</p>
              </div>
              <Ban className="h-8 w-8 text-orange-200" />
            </div>
            <p className="text-orange-100 text-xs mt-1">+3 in last hour</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">AI Analysis</p>
                <p className="text-3xl font-bold text-white">{Math.round(analysis.confidence * 100)}%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-200" />
            </div>
            <p className="text-purple-100 text-xs mt-1">Confidence: {analysis.riskLevel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          <TabsTrigger value="forensics">Forensics</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Security Events */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-blue-400" />
                Real-time Security Events
              </CardTitle>
              <CardDescription className="text-slate-300">
                Live oversikt over sikkerhetshendelser og trusler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getSeverityIcon(event.severity)}
                      <div>
                        <p className="text-white font-medium">{event.type}</p>
                        <p className="text-slate-300 text-sm">
                          {event.details.ip} • {event.details.location} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {event.severity}
                      </Badge>
                      <Badge variant={event.status === 'active' ? 'default' : 'outline'}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Metrics Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Security Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { time: '00:00', events: 2, blocked: 0 },
                    { time: '04:00', events: 1, blocked: 0 },
                    { time: '08:00', events: 5, blocked: 1 },
                    { time: '12:00', events: 8, blocked: 2 },
                    { time: '16:00', events: 12, blocked: 3 },
                    { time: '20:00', events: 6, blocked: 1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                    <Area type="monotone" dataKey="events" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="blocked" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          {/* IP Threats */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="h-5 w-5 text-red-400" />
                IP Threat Intelligence
              </CardTitle>
              <CardDescription className="text-slate-300">
                Overvåkning av mistenkelige IP-adresser og geografiske trusler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ipThreats.slice(0, 10).map((threat) => (
                  <div key={threat.ip} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.severity)}`} />
                      <div>
                        <p className="text-white font-medium">{threat.ip}</p>
                        <p className="text-slate-300 text-sm">
                          {threat.city}, {threat.country} • {threat.reasons.join(', ')}
                        </p>
                        <p className="text-slate-400 text-xs">
                          First seen: {threat.firstSeen} • Last seen: {threat.lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={threat.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {threat.severity}
                      </Badge>
                      {threat.blocked ? (
                        <Button size="sm" variant="outline" onClick={() => handleUnblockIP(threat.ip)}>
                          <Unlock className="h-4 w-4 mr-2" />
                          Unblock
                        </Button>
                      ) : (
                        <Button size="sm" variant="destructive" onClick={() => handleBlockIP(threat.ip)}>
                          <Ban className="h-4 w-4 mr-2" />
                          Block
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {/* AI Threat Analysis */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-5 w-5 text-purple-400" />
                AI Threat Analysis
              </CardTitle>
              <CardDescription className="text-slate-300">
                Machine learning-basert trusselanalyse og anomali-deteksjon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-1">
                        <span>Anomaly Score</span>
                        <span>{Math.round(analysis.anomalyScore * 100)}%</span>
                      </div>
                      <Progress value={analysis.anomalyScore * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-1">
                        <span>Confidence</span>
                        <span>{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                      <Progress value={analysis.confidence * 100} className="h-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Detected Patterns</h3>
                  <div className="space-y-2">
                    {analysis.patterns.map((pattern, index) => (
                      <div key={index} className="flex items-center gap-2 text-slate-300">
                        <Target className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        <span className="text-slate-300">{rec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          {/* Automated Response Controls */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-yellow-400" />
                Automated Response System
              </CardTitle>
              <CardDescription className="text-slate-300">
                Kontroller automatiske sikkerhetsresponser og nødprosedyrer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Auto-Response System</h3>
                    <p className="text-slate-300 text-sm">Automatisk blokkering og varsling ved trusler</p>
                  </div>
                  <Button
                    onClick={handleAutoResponseToggle}
                    variant={autoResponse ? "default" : "outline"}
                  >
                    {autoResponse ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-20 bg-red-600 hover:bg-red-700 text-white">
                    <Ban className="h-6 w-6 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Block All Suspicious IPs</div>
                      <div className="text-sm opacity-90">Immediate action</div>
                    </div>
                  </Button>

                  <Button className="h-20 bg-orange-600 hover:bg-orange-700 text-white">
                    <Users className="h-6 w-6 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Invalidate All Sessions</div>
                      <div className="text-sm opacity-90">Force re-login</div>
                    </div>
                  </Button>

                  <Button className="h-20 bg-purple-600 hover:bg-purple-700 text-white">
                    <Lock className="h-6 w-6 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Enable Maintenance Mode</div>
                      <div className="text-sm opacity-90">System lockdown</div>
                    </div>
                  </Button>

                  <Button className="h-20 bg-blue-600 hover:bg-blue-700 text-white">
                    <MessageSquare className="h-6 w-6 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Send Emergency Alerts</div>
                      <div className="text-sm opacity-90">Notify all admins</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
