'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Lock, Key, Smartphone, Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Users, Database, Clock, Zap } from 'lucide-react'
import { 
  Line, Area, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart,
  BarChart, Bar, ScatterChart, Scatter, PieChart, LineChart
} from 'recharts'

export default function ZeroTrustSecurityPage() {
  const [securitySettings, setSecuritySettings] = useState({
    fieldEncryption: true,
    apiKeyRotation: true,
    deviceTrust: true,
    sessionFingerprinting: true,
    realTimeMonitoring: true,
    aiSecurity: true,
    quantumEncryption: false,
    biometricAuth: false,
    zeroTrustMode: true
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Advanced Mock Data for Awesome Visualizations
  const securityMetrics = {
    totalEvents: 1247,
    criticalAlerts: 23,
    highPriority: 156,
    mediumPriority: 423,
    lowPriority: 645,
    encryptedFields: 8942,
    totalFields: 10000,
    activeSessions: 234,
    suspiciousSessions: 12,
    trustedDevices: 45,
    untrustedDevices: 3,
    threatScore: 87,
    securityRating: 94,
    complianceScore: 91,
    riskLevel: 'LOW'
  }

  const realTimeMetrics = [
    { time: '00:00', threats: 12, blocked: 11, encrypted: 45, sessions: 23 },
    { time: '04:00', threats: 8, blocked: 8, encrypted: 38, sessions: 18 },
    { time: '08:00', threats: 23, blocked: 22, encrypted: 67, sessions: 45 },
    { time: '12:00', threats: 45, blocked: 43, encrypted: 89, sessions: 78 },
    { time: '16:00', threats: 67, blocked: 65, encrypted: 95, sessions: 92 },
    { time: '20:00', threats: 34, blocked: 32, encrypted: 76, sessions: 65 },
    { time: '24:00', threats: 18, blocked: 17, encrypted: 52, sessions: 34 }
  ]

  const performanceMetrics = [
    { name: 'Jan', encryption: 85, monitoring: 92, compliance: 88, response: 90 },
    { name: 'Feb', encryption: 87, monitoring: 94, compliance: 91, response: 92 },
    { name: 'Mar', encryption: 89, monitoring: 96, compliance: 93, response: 94 },
    { name: 'Apr', encryption: 91, monitoring: 98, compliance: 95, response: 96 },
    { name: 'May', encryption: 93, monitoring: 99, compliance: 97, response: 98 },
    { name: 'Jun', encryption: 95, monitoring: 100, compliance: 99, response: 100 }
  ]

  const threatTypes = [
    { name: 'Malware', value: 35, color: '#ef4444', trend: '+12%' },
    { name: 'Phishing', value: 28, color: '#f97316', trend: '-5%' },
    { name: 'DDoS', value: 20, color: '#eab308', trend: '+8%' },
    { name: 'Data Breach', value: 12, color: '#22c55e', trend: '-15%' },
    { name: 'Insider Threat', value: 5, color: '#3b82f6', trend: '+3%' }
  ]

  const geographicThreats = [
    { country: 'USA', threats: 45, blocked: 42, color: '#0088FE' },
    { country: 'China', threats: 38, blocked: 35, color: '#00C49F' },
    { country: 'Russia', threats: 32, blocked: 28, color: '#FFBB28' },
    { country: 'Germany', threats: 25, blocked: 24, color: '#FF8042' },
    { country: 'UK', threats: 22, blocked: 21, color: '#8884d8' },
    { country: 'France', threats: 18, blocked: 17, color: '#82ca9d' }
  ]

  const complianceStatus = [
    { framework: 'GDPR', score: 95, status: 'Compliant', color: '#22c55e' },
    { framework: 'SOC 2', score: 92, status: 'Compliant', color: '#22c55e' },
    { framework: 'ISO 27001', score: 89, status: 'Compliant', color: '#22c55e' },
    { framework: 'HIPAA', score: 87, status: 'Partial', color: '#f59e0b' },
    { framework: 'PCI DSS', score: 94, status: 'Compliant', color: '#22c55e' }
  ]

  const deviceSecurity = [
    { device: 'Windows', secure: 45, vulnerable: 5, color: '#0078d4' },
    { device: 'macOS', secure: 38, vulnerable: 2, color: '#007aff' },
    { device: 'Linux', secure: 42, vulnerable: 3, color: '#fcc624' },
    { device: 'iOS', secure: 35, vulnerable: 1, color: '#000000' },
    { device: 'Android', secure: 28, vulnerable: 7, color: '#3ddc84' }
  ]

  const aiInsights = [
    { insight: 'Anomalous login pattern detected', confidence: 94, action: 'Blocked', severity: 'High' },
    { insight: 'Unusual data access frequency', confidence: 87, action: 'Monitored', severity: 'Medium' },
    { insight: 'Potential insider threat identified', confidence: 92, action: 'Alerted', severity: 'High' },
    { insight: 'New device registration pattern', confidence: 78, action: 'Verified', severity: 'Low' },
    { insight: 'API key usage spike detected', confidence: 89, action: 'Rotated', severity: 'Medium' }
  ]

  const threatTimeline = [
    { time: '00:00', threats: 12, blocked: 11 },
    { time: '04:00', threats: 8, blocked: 8 },
    { time: '08:00', threats: 23, blocked: 22 },
    { time: '12:00', threats: 45, blocked: 43 },
    { time: '16:00', threats: 67, blocked: 65 },
    { time: '20:00', threats: 34, blocked: 32 },
    { time: '24:00', threats: 18, blocked: 17 }
  ]

  const securityRadarData = [
    { name: 'Encryption', value: 89 },
    { name: 'Access Control', value: 94 },
    { name: 'Session Management', value: 87 },
    { name: 'Device Trust', value: 92 },
    { name: 'API Security', value: 85 },
    { name: 'Monitoring', value: 96 }
  ]

  const deviceTypes = [
    { name: 'Desktop', value: 35, color: '#0088FE' },
    { name: 'Mobile', value: 28, color: '#00C49F' },
    { name: 'Tablet', value: 15, color: '#FFBB28' },
    { name: 'Server', value: 22, color: '#FF8042' }
  ]

  const encryptionCoverage = [
    { name: 'Encrypted', value: 89.4, color: '#00C49F' },
    { name: 'Unencrypted', value: 10.6, color: '#FF8042' }
  ]

  const recentEvents = [
    { id: 1, type: 'encryption', message: 'Field encryption applied to user data', userId: 'user_123', ipAddress: '192.168.1.100', timestamp: '2025-01-28T16:58:16Z', severity: 'low' },
    { id: 2, type: 'api_key_rotation', message: 'API key rotated for service account', userId: 'service_456', ipAddress: '10.0.0.50', timestamp: '2025-01-28T15:30:45Z', severity: 'medium' },
    { id: 3, type: 'access_denied', message: 'Unauthorized access attempt blocked', userId: 'unknown', ipAddress: '203.0.113.42', timestamp: '2025-01-28T14:15:22Z', severity: 'high' },
    { id: 4, type: 'device_registration', message: 'New device registered and verified', userId: 'user_789', ipAddress: '192.168.1.200', timestamp: '2025-01-28T13:45:10Z', severity: 'low' },
    { id: 5, type: 'session_validation', message: 'Suspicious session pattern detected', userId: 'user_321', ipAddress: '198.51.100.15', timestamp: '2025-01-28T12:20:33Z', severity: 'critical' }
  ]

  const handleSecurityToggle = async (setting: string, value: boolean) => {
    setIsLoading(true)
    
    // Simuler API-kall
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }))
    
    setIsLoading(false)
  }

  const securityFeatures = [
    {
      id: 'fieldEncryption',
      title: 'Feltnivå-kryptering',
      description: 'Krypterer alle sensitive data på feltnivå',
      icon: Lock,
      critical: true
    },
    {
      id: 'apiKeyRotation',
      title: 'API-nøkkelrotasjon',
      description: 'Automatisk rotasjon av API-nøkler hver 24. time',
      icon: Key,
      critical: true
    },
    {
      id: 'deviceTrust',
      title: 'Enhetstilgang',
      description: 'Kontrollerer og validerer enheter som får tilgang',
      icon: Smartphone,
      critical: true
    },
    {
      id: 'sessionFingerprinting',
      title: 'Sesjonsfingeravtrykk',
      description: 'Overvåker og validerer brukersesjoner',
      icon: Activity,
      critical: true
    },
    {
      id: 'realTimeMonitoring',
      title: 'Sanntidsmonitorering',
      description: 'Overvåker sikkerhetshendelser i sanntid',
      icon: AlertTriangle,
      critical: true
    },
    {
      id: 'aiSecurity',
      title: 'AI-sikkerhet',
      description: 'Avansert AI-drevet trusseljakt og -forebygging',
      icon: Shield,
      critical: true
    },
    {
      id: 'quantumEncryption',
      title: 'Kvantekryptering',
      description: 'Kvantemotstandsdyktig kryptering (eksperimentell)',
      icon: Lock,
      critical: false
    },
    {
      id: 'biometricAuth',
      title: 'Biometrisk autentisering',
      description: 'Fingeravtrykk og ansiktsgjenkjenning',
      icon: Smartphone,
      critical: false
    },
    {
      id: 'zeroTrustMode',
      title: 'Zero Trust-modus',
      description: 'Aktiverer fullstendig Zero Trust-arkitektur',
      icon: Shield,
      critical: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Zero Trust Security
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Avansert sikkerhet med feltnivå-kryptering, API-nøkkelrotasjon og enhetstilgang
          </p>
        </div>

        {/* 🚀 AWESOME SECURITY ANALYTICS DASHBOARD 🚀 */}
        <div className="space-y-8 mt-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              🛡️ Advanced Security Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Real-time threat intelligence & comprehensive security monitoring
            </p>
        </div>

          {/* 🔥 REAL-TIME METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Threat Score</CardTitle>
                <div className="text-3xl font-bold text-red-600">{securityMetrics.threatScore}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-red-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5% from yesterday
                </div>
                </CardContent>
              </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Security Rating</CardTitle>
                <div className="text-3xl font-bold text-green-600">{securityMetrics.securityRating}%</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Excellent
                        </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Compliance Score</CardTitle>
                <div className="text-3xl font-bold text-blue-600">{securityMetrics.complianceScore}%</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-700">
                  <Shield className="h-4 w-4 mr-1" />
                  GDPR Ready
                        </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Risk Level</CardTitle>
                <div className="text-3xl font-bold text-purple-600">{securityMetrics.riskLevel}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-purple-700">
                  <Activity className="h-4 w-4 mr-1" />
                  Low Risk
                      </div>
                </CardContent>
              </Card>
            </div>

          {/* 📊 MEGA CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Real-time Threat Monitoring */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Real-time Threat Monitoring (24h)
                </CardTitle>
                <CardDescription>Live threat detection and response metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={realTimeMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Legend />
                    <Area type="monotone" dataKey="threats" fill="#ef4444" stroke="#ef4444" fillOpacity={0.3} name="Threats" />
                    <Area type="monotone" dataKey="blocked" fill="#22c55e" stroke="#22c55e" fillOpacity={0.3} name="Blocked" />
                    <Line type="monotone" dataKey="encrypted" stroke="#3b82f6" strokeWidth={3} name="Encrypted" />
                    <Line type="monotone" dataKey="sessions" stroke="#8b5cf6" strokeWidth={3} name="Sessions" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Security Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Performance Trend
                </CardTitle>
                <CardDescription>6-month security improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 100]} />
                    <Legend />
                    <Line type="monotone" dataKey="encryption" stroke="#3b82f6" strokeWidth={3} name="Encryption" />
                    <Line type="monotone" dataKey="monitoring" stroke="#22c55e" strokeWidth={3} name="Monitoring" />
                    <Line type="monotone" dataKey="compliance" stroke="#f59e0b" strokeWidth={3} name="Compliance" />
                    <Line type="monotone" dataKey="response" stroke="#ef4444" strokeWidth={3} name="Response" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Threat Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Threat Types
                </CardTitle>
                <CardDescription>Distribution of security threats</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={threatTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {threatTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Threat Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Geographic Threats
                </CardTitle>
                <CardDescription>Threats by country origin</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geographicThreats} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="country" type="category" width={80} />
                    <Legend />
                    <Bar dataKey="threats" fill="#ef4444" name="Threats" />
                    <Bar dataKey="blocked" fill="#22c55e" name="Blocked" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                  Device Security
                </CardTitle>
                <CardDescription>Security status by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deviceSecurity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Legend />
                    <Bar dataKey="secure" fill="#22c55e" name="Secure" />
                    <Bar dataKey="vulnerable" fill="#ef4444" name="Vulnerable" />
                  </BarChart>
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
                <CardDescription>Regulatory compliance scores</CardDescription>
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

          {/* 🤖 AI INSIGHTS & RECENT EVENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Security Insights */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  🤖 AI Security Insights
                </CardTitle>
                <CardDescription>Machine learning powered threat detection</CardDescription>
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

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Security Events
                </CardTitle>
                <CardDescription>Latest security activities and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          event.severity === 'critical' ? 'bg-red-100 text-red-600' :
                          event.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                          event.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <Activity className="h-4 w-4" />
                      </div>
                        <div>
                          <p className="font-medium">{event.message}</p>
                          <p className="text-sm text-gray-500">
                            {event.userId} • {event.ipAddress} • {isClient ? new Date(event.timestamp).toLocaleString('nb-NO') : event.timestamp}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        event.severity === 'critical' ? 'destructive' :
                        event.severity === 'high' ? 'destructive' :
                        event.severity === 'medium' ? 'secondary' :
                        'outline'
                      }>
                        {event.severity.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Sikkerhetsfunksjoner</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(securitySettings).filter(Boolean).length}
              </div>
              <p className="text-xs text-muted-foreground">
                av {Object.keys(securitySettings).length} funksjoner
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kritiske Funksjoner</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {securityFeatures.filter(f => f.critical && securitySettings[f.id as keyof typeof securitySettings]).length}
              </div>
              <p className="text-xs text-muted-foreground">
                av {securityFeatures.filter(f => f.critical).length} kritiske
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sikkerhetsstatus</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {securitySettings.zeroTrustMode ? 'Aktiv' : 'Inaktiv'}
              </div>
              <p className="text-xs text-muted-foreground">
                Zero Trust-modus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sikkerhetshendelser</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {securityMetrics.totalEvents}
              </div>
              <p className="text-xs text-muted-foreground">
                siste 24 timer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Sikkerhetsfunksjoner
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon
              const isEnabled = securitySettings[feature.id as keyof typeof securitySettings]
              
              return (
                <Card key={feature.id} className={`transition-all duration-200 ${
                  isEnabled ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-gray-200'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-5 w-5 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        {feature.critical && (
                          <Badge variant="destructive" className="text-xs">
                            Kritisk
                          </Badge>
                        )}
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => handleSecurityToggle(feature.id, checked)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-3 flex items-center space-x-2">
                      {isEnabled ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aktiv
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500 text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Inaktiv
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Security Warning */}
        {!securitySettings.zeroTrustMode && (
          <Alert className="mt-8 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <strong>Advarsel:</strong> Zero Trust-modus er deaktivert. Dette kan utsette systemet for sikkerhetsrisikoer. 
              Anbefaler å aktivere alle kritiske sikkerhetsfunksjoner.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button 
            onClick={() => {
              setSecuritySettings(prev => ({
                ...prev,
                fieldEncryption: true,
                apiKeyRotation: true,
                deviceTrust: true,
                sessionFingerprinting: true,
                realTimeMonitoring: true,
                aiSecurity: true,
                zeroTrustMode: true
              }))
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Shield className="h-4 w-4 mr-2" />
            Aktiver Alle Kritiske
          </Button>
          
          <Button 
            onClick={() => {
              setSecuritySettings(prev => ({
                ...prev,
                fieldEncryption: false,
                apiKeyRotation: false,
                deviceTrust: false,
                sessionFingerprinting: false,
                realTimeMonitoring: false,
                aiSecurity: false,
                zeroTrustMode: false
              }))
            }}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Deaktiver Alle
          </Button>
                    </div>
      </div>
    </div>
  )
}
