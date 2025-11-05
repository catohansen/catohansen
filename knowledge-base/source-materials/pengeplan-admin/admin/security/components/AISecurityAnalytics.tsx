'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  BarChart3,
  Shield,
  Eye,
  Zap,
  Cpu,
  Database,
  Network,
  Lock,
  Key,
  Fingerprint,
  Search,
  Filter,
  Settings,
  RefreshCw,
  Download,
  Play,
  Pause,
  Square
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
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
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

interface AIThreatAnalysis {
  anomalyScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  patterns: string[]
  recommendations: string[]
  confidence: number
  lastAnalysis: string
}

interface BehavioralAnalysis {
  userBehavior: {
    normal: number
    suspicious: number
    malicious: number
  }
  patterns: {
    loginPatterns: number
    accessPatterns: number
    dataPatterns: number
  }
  anomalies: {
    geographic: number
    temporal: number
    device: number
  }
}

interface ThreatIntelligence {
  knownThreats: number
  newThreats: number
  blockedThreats: number
  threatSources: {
    ip: string
    country: string
    severity: string
    count: number
  }[]
}

interface SecurityMetrics {
  totalEvents: number
  criticalEvents: number
  highEvents: number
  mediumEvents: number
  lowEvents: number
  aiDetected: number
  humanDetected: number
  falsePositives: number
  accuracy: number
}

export default function AISecurityAnalytics() {
  const [aiAnalysis, setAiAnalysis] = useState<AIThreatAnalysis | null>(null)
  const [behavioralAnalysis, setBehavioralAnalysis] = useState<BehavioralAnalysis | null>(null)
  const [threatIntelligence, setThreatIntelligence] = useState<ThreatIntelligence | null>(null)
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    fetchAIAnalytics()
    const interval = setInterval(fetchAIAnalytics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Initialize lastUpdate on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !lastUpdate) {
      setLastUpdate(new Date())
    }
  }, [lastUpdate])

  const fetchAIAnalytics = async () => {
    try {
      setIsAnalyzing(true)
      
      const [analysisResponse, behavioralResponse, threatsResponse, metricsResponse] = await Promise.all([
        fetch('/api/security/ai-analysis'),
        fetch('/api/security/behavioral-analysis'),
        fetch('/api/security/threat-intelligence'),
        fetch('/api/security/ai-metrics')
      ])

      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json()
        setAiAnalysis(analysis.analysis)
      }

      if (behavioralResponse.ok) {
        const behavioral = await behavioralResponse.json()
        setBehavioralAnalysis(behavioral.analysis)
      }

      if (threatsResponse.ok) {
        const threats = await threatsResponse.json()
        setThreatIntelligence(threats.intelligence)
      }

      if (metricsResponse.ok) {
        const metrics = await metricsResponse.json()
        setSecurityMetrics(metrics.metrics)
      }

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching AI analytics:', error)
      // Use mock data if API fails
      setAiAnalysis(getMockAIAnalysis())
      setBehavioralAnalysis(getMockBehavioralAnalysis())
      setThreatIntelligence(getMockThreatIntelligence())
      setSecurityMetrics(getMockSecurityMetrics())
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-400" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-400" />
      case 'medium': return <Target className="h-5 w-5 text-yellow-400" />
      case 'low': return <CheckCircle className="h-5 w-5 text-green-400" />
      default: return <Shield className="h-5 w-5 text-gray-400" />
    }
  }

  // Mock data functions
  function getMockAIAnalysis(): AIThreatAnalysis {
    return {
      anomalyScore: 0.23,
      riskLevel: 'medium',
      patterns: [
        'Unusual login patterns detected',
        'Geographic anomalies identified',
        'Time-based attack patterns',
        'Device fingerprint anomalies'
      ],
      recommendations: [
        'Enable 2FA for all admin accounts',
        'Implement geographic restrictions',
        'Increase monitoring for off-hours activity',
        'Review and update password policies'
      ],
      confidence: 0.87,
      lastAnalysis: new Date().toISOString()
    }
  }

  function getMockBehavioralAnalysis(): BehavioralAnalysis {
    return {
      userBehavior: {
        normal: 85,
        suspicious: 12,
        malicious: 3
      },
      patterns: {
        loginPatterns: 92,
        accessPatterns: 88,
        dataPatterns: 95
      },
      anomalies: {
        geographic: 15,
        temporal: 8,
        device: 12
      }
    }
  }

  function getMockThreatIntelligence(): ThreatIntelligence {
    return {
      knownThreats: 45,
      newThreats: 8,
      blockedThreats: 12,
      threatSources: [
        { ip: '192.168.1.100', country: 'NO', severity: 'high', count: 15 },
        { ip: '10.0.0.50', country: 'Unknown', severity: 'medium', count: 8 },
        { ip: '172.16.0.25', country: 'US', severity: 'low', count: 3 }
      ]
    }
  }

  function getMockSecurityMetrics(): SecurityMetrics {
    return {
      totalEvents: 1247,
      criticalEvents: 3,
      highEvents: 8,
      mediumEvents: 15,
      lowEvents: 21,
      aiDetected: 23,
      humanDetected: 5,
      falsePositives: 2,
      accuracy: 96.5
    }
  }

  const analysis = aiAnalysis || getMockAIAnalysis()
  const behavioral = behavioralAnalysis || getMockBehavioralAnalysis()
  const threats = threatIntelligence || getMockThreatIntelligence()
  const metrics = securityMetrics || getMockSecurityMetrics()

  return (
    <div className="space-y-6">
      {/* AI Analysis Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-6 w-6 text-purple-400" />
                AI Threat Analysis
              </CardTitle>
              <CardDescription className="text-slate-300">
                Machine learning-powered threat detection and analysis
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Loading...'}
              </span>
              <Button
                onClick={fetchAIAnalytics}
                size="sm"
                variant="outline"
                disabled={isAnalyzing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(analysis.riskLevel)}`}>
                {Math.round(analysis.anomalyScore * 100)}%
              </div>
              <p className="text-slate-300 text-sm">Anomaly Score</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {getRiskIcon(analysis.riskLevel)}
                <span className="text-sm text-slate-400">{analysis.riskLevel.toUpperCase()}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {Math.round(analysis.confidence * 100)}%
              </div>
              <p className="text-slate-300 text-sm">AI Confidence</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-400">High Accuracy</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {analysis.patterns.length}
              </div>
              <p className="text-slate-300 text-sm">Detected Patterns</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-400">Active Monitoring</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analytics Tabs */}
      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="threats">Threat Intel</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          {/* Detected Patterns */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-blue-400" />
                Detected Security Patterns
              </CardTitle>
              <CardDescription className="text-slate-300">
                AI-identified patterns and anomalies in system behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.patterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">{pattern}</p>
                        <p className="text-slate-300 text-sm">
                          Detected by AI behavioral analysis
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      Pattern {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-green-400" />
                AI Security Recommendations
              </CardTitle>
              <CardDescription className="text-slate-300">
                Actionable recommendations based on AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-slate-300">{recommendation}</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Priority: {index < 2 ? 'High' : 'Medium'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavioral" className="space-y-6">
          {/* Behavioral Analysis Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-blue-400" />
                User Behavior Analysis
              </CardTitle>
              <CardDescription className="text-slate-300">
                AI-powered analysis of user behavior patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Normal', value: behavioral.userBehavior.normal, color: '#10B981' },
                        { name: 'Suspicious', value: behavioral.userBehavior.suspicious, color: '#F59E0B' },
                        { name: 'Malicious', value: behavioral.userBehavior.malicious, color: '#EF4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {[
                        { name: 'Normal', value: behavioral.userBehavior.normal, color: '#10B981' },
                        { name: 'Suspicious', value: behavioral.userBehavior.suspicious, color: '#F59E0B' },
                        { name: 'Malicious', value: behavioral.userBehavior.malicious, color: '#EF4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Login Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  {behavioral.patterns.loginPatterns}%
                </div>
                <p className="text-slate-300 text-sm">Accuracy</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Access Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">
                  {behavioral.patterns.accessPatterns}%
                </div>
                <p className="text-slate-300 text-sm">Accuracy</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Data Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">
                  {behavioral.patterns.dataPatterns}%
                </div>
                <p className="text-slate-300 text-sm">Accuracy</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          {/* Threat Intelligence */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-red-400" />
                Threat Intelligence
              </CardTitle>
              <CardDescription className="text-slate-300">
                Real-time threat intelligence and source analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {threats.knownThreats}
                  </div>
                  <p className="text-slate-300 text-sm">Known Threats</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    {threats.newThreats}
                  </div>
                  <p className="text-slate-300 text-sm">New Threats</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {threats.blockedThreats}
                  </div>
                  <p className="text-slate-300 text-sm">Blocked Threats</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Threat Sources</h3>
                {threats.threatSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        source.severity === 'high' ? 'bg-red-500' :
                        source.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <p className="text-white font-medium">{source.ip}</p>
                        <p className="text-slate-300 text-sm">
                          {source.country} • {source.count} attempts
                        </p>
                      </div>
                    </div>
                    <Badge variant={source.severity === 'high' ? 'destructive' : 'secondary'}>
                      {source.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {/* Security Metrics */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                AI Security Metrics
              </CardTitle>
              <CardDescription className="text-slate-300">
                Performance metrics for AI security systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {metrics.totalEvents}
                  </div>
                  <p className="text-slate-300 text-sm">Total Events</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {metrics.aiDetected}
                  </div>
                  <p className="text-slate-300 text-sm">AI Detected</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {metrics.humanDetected}
                  </div>
                  <p className="text-slate-300 text-sm">Human Detected</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {metrics.accuracy}%
                  </div>
                  <p className="text-slate-300 text-sm">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Distribution */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                  <RechartsLineChart className="h-5 w-5 text-green-400" />
                Event Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { level: 'Critical', events: metrics.criticalEvents, color: '#EF4444' },
                    { level: 'High', events: metrics.highEvents, color: '#F59E0B' },
                    { level: 'Medium', events: metrics.mediumEvents, color: '#3B82F6' },
                    { level: 'Low', events: metrics.lowEvents, color: '#10B981' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="level" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                    <Bar dataKey="events" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
