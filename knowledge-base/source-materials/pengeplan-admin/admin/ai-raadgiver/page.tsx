'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Bot, 
  Shield, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageSquare,
  Send,
  Database,
  BarChart3,
  Bell,
  BellOff,
  Lock,
  Play,
  RotateCcw,
  TestTube,
  Users,
  Download,
  Zap
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type?: 'security' | 'deployment' | 'backup' | 'performance' | 'cost'
}

interface SecurityStatus {
  overall: 'healthy' | 'warning' | 'critical'
  waf: 'active' | 'inactive'
  rateLimit: 'normal' | 'high' | 'blocked'
  ssl: 'valid' | 'expiring' | 'invalid'
  backup: 'success' | 'warning' | 'failed'
  riskScore: number
  autoHealing: boolean
}

interface SecurityEvent {
  id: string
  timestamp: Date
  type: 'waf' | 'backup' | 'ssl' | 'deploy' | 'gdpr' | 'abuse' | 'vulnerability'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  source: string
  resolved: boolean
}

interface DeployStatus {
  status: 'ready' | 'deploying' | 'failed' | 'blocked'
  errorRate: number
  testResults: 'pass' | 'fail' | 'running'
  dbLag: number
  canaryStatus: 'active' | 'inactive'
  lastDeploy: Date
}

interface BackupHealth {
  lastSnapshot: Date
  lastRestoreTest: Date
  rpo: number // minutes
  rto: number // minutes
  status: 'healthy' | 'warning' | 'critical'
  testResult: 'pass' | 'fail' | 'pending'
}

interface GDPRStatus {
  openRequests: number
  slaBreaches: number
  pendingDeletions: number
  anonymizations: number
  lastAudit: Date
}

interface AbuseDetection {
  topUsers: Array<{
    userId: string
    requests: number
    cost: number
    suspicious: boolean
  }>
  unusualPatterns: Array<{
    pattern: string
    count: number
    severity: 'low' | 'medium' | 'high'
  }>
}

interface VulnerabilityScan {
  critical: number
  high: number
  medium: number
  low: number
  lastScan: Date
  dependencies: number
  outdated: number
}

interface SyntheticTests {
  tests: Array<{
    name: string
    status: 'pass' | 'fail' | 'running'
    responseTime: number
    lastRun: Date
  }>
  overallHealth: 'healthy' | 'degraded' | 'critical'
}

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  latency: number
  uptime: string
  activeUsers: number
  errorRate: number
}

interface AICost {
  daily: number
  monthly: number
  tokens: number
  requests: number
  topEndpoint: string
}

export default function AIRaadgiverPage() {
  const [activeTab, setActiveTab] = useState('chat')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hei! Jeg er AI Sikkerhetsrådgiver for Pengeplan. Jeg overvåker systemet 24/7 og kan hjelpe deg med sikkerhet, drift og optimalisering. Hva kan jeg hjelpe deg med?',
      timestamp: new Date(),
      type: 'security'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [securityStatus] = useState<SecurityStatus>({
    overall: 'healthy',
    waf: 'active',
    rateLimit: 'normal',
    ssl: 'valid',
    backup: 'success',
    riskScore: 23,
    autoHealing: true
  })
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: 'waf',
      severity: 'medium',
      message: 'WAF blokkerte 12 mistenkelige requests fra IP 192.168.1.100',
      source: 'Cloudflare WAF',
      resolved: true
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'backup',
      severity: 'low',
      message: 'Daglig backup fullført suksessfullt',
      source: 'Backup System',
      resolved: true
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      type: 'abuse',
      severity: 'high',
      message: 'Uvanlig høy API-aktivitet fra bruker user_123',
      source: 'Abuse Detection',
      resolved: false
    }
  ])
  const [deployStatus] = useState<DeployStatus>({
    status: 'ready',
    errorRate: 0.2,
    testResults: 'pass',
    dbLag: 12,
    canaryStatus: 'inactive',
    lastDeploy: new Date(Date.now() - 1000 * 60 * 60 * 2)
  })
  const [backupHealth] = useState<BackupHealth>({
    lastSnapshot: new Date(Date.now() - 1000 * 60 * 30),
    lastRestoreTest: new Date(Date.now() - 1000 * 60 * 60 * 6),
    rpo: 5,
    rto: 15,
    status: 'healthy',
    testResult: 'pass'
  })
  const [gdprStatus] = useState<GDPRStatus>({
    openRequests: 3,
    slaBreaches: 0,
    pendingDeletions: 1,
    anonymizations: 5,
    lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24)
  })
  const [abuseDetection] = useState<AbuseDetection>({
    topUsers: [
      { userId: 'user_123', requests: 1250, cost: 45.20, suspicious: true },
      { userId: 'user_456', requests: 890, cost: 32.10, suspicious: false },
      { userId: 'user_789', requests: 650, cost: 23.50, suspicious: false }
    ],
    unusualPatterns: [
      { pattern: 'Høy frekvens API-kall', count: 12, severity: 'high' },
      { pattern: 'Uvanlig store prompts', count: 3, severity: 'medium' }
    ]
  })
  const [vulnerabilityScan] = useState<VulnerabilityScan>({
    critical: 0,
    high: 2,
    medium: 5,
    low: 12,
    lastScan: new Date(Date.now() - 1000 * 60 * 60 * 12),
    dependencies: 1247,
    outdated: 23
  })
  const [syntheticTests] = useState<SyntheticTests>({
    tests: [
      { name: 'User Login', status: 'pass', responseTime: 245, lastRun: new Date(Date.now() - 1000 * 60 * 5) },
      { name: 'Create Budget', status: 'pass', responseTime: 1200, lastRun: new Date(Date.now() - 1000 * 60 * 5) },
      { name: 'Generate Report', status: 'fail', responseTime: 5000, lastRun: new Date(Date.now() - 1000 * 60 * 5) },
      { name: 'AI Chat', status: 'pass', responseTime: 1800, lastRun: new Date(Date.now() - 1000 * 60 * 5) },
      { name: 'Payment Process', status: 'pass', responseTime: 3200, lastRun: new Date(Date.now() - 1000 * 60 * 5) }
    ],
    overallHealth: 'degraded'
  })
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    latency: 12,
    uptime: '15d 8h 32m',
    activeUsers: 1247,
    errorRate: 0.2
  })
  const [aiCost] = useState<AICost>({
    daily: 23.45,
    monthly: 704.20,
    tokens: 1250000,
    requests: 8456,
    topEndpoint: '/api/ai/chat'
  })
  const [autoMode, setAutoMode] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        latency: Math.max(5, Math.min(50, prev.latency + (Math.random() - 0.5) * 5))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        type: determineMessageType(inputMessage) || 'cost'
      }
      setChatMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('sikkerhet') || lowerInput.includes('security')) {
      return `🔒 Sikkerhetsstatus: ${securityStatus.overall === 'healthy' ? 'Grønn' : 'Gul'}

**Aktuelle sikkerhetstiltak:**
- WAF: ${securityStatus.waf === 'active' ? 'Aktiv' : 'Inaktiv'}
- Rate limiting: ${securityStatus.rateLimit}
- SSL-sertifikat: ${securityStatus.ssl === 'valid' ? 'Gyldig' : 'Utløper snart'}
- Backup: ${securityStatus.backup === 'success' ? 'Suksess' : 'Feil'}

**Anbefalinger:**
${securityStatus.overall === 'healthy' ? 'Systemet er sikkert. Fortsett med daglige sikkerhetssjekker.' : 'Økt overvåking anbefalt. Sjekk WAF-logger for mistenkelig aktivitet.'}`
    }
    
    if (lowerInput.includes('deploy') || lowerInput.includes('release')) {
      return `🚀 Deploy-status: Klar for deploy

**Go/No-Go sjekk:**
✅ Alle tester bestått
✅ Database migrasjoner klar
✅ Feature flags konfigurert
✅ Backup verifisert

**Anbefaling:** Sikker å deploye. Start med 1% canary.`
    }
    
    if (lowerInput.includes('backup') || lowerInput.includes('restore')) {
      return `💾 Backup-status: ${securityStatus.backup === 'success' ? 'Suksess' : 'Feil'}

**Siste backup:** 6. september 2024, 14:30
**RPO:** 5 minutter
**RTO:** 15 minutter
**Test restore:** Bestått i dag

**Anbefaling:** ${securityStatus.backup === 'success' ? 'Backup-strategi fungerer optimalt.' : 'Kritisk: Sjekk backup-konfigurasjon umiddelbart.'}`
    }
    
    if (lowerInput.includes('kostnad') || lowerInput.includes('cost') || lowerInput.includes('ai')) {
      return `💰 AI-kostnader i dag: $${aiCost.daily}

**Månedlig oversikt:**
- Totalt: $${aiCost.monthly}
- Tokens: ${aiCost.tokens.toLocaleString()}
- Forespørsler: ${aiCost.requests.toLocaleString()}
- Topp-endepunkt: ${aiCost.topEndpoint}

**Anbefaling:** Kostnadene er innenfor budsjett. Vurder å optimalisere prompt-lengde for å redusere token-forbruk.`
    }
    
    if (lowerInput.includes('performance') || lowerInput.includes('ytelse')) {
      return `⚡ Systemytelse: ${systemMetrics.cpu < 70 ? 'God' : 'Høy belastning'}

**Aktuelle metrics:**
- CPU: ${systemMetrics.cpu.toFixed(1)}%
- Minne: ${systemMetrics.memory.toFixed(1)}%
- Disk: ${systemMetrics.disk.toFixed(1)}%
- Latens: ${systemMetrics.latency.toFixed(1)}ms
- Aktive brukere: ${systemMetrics.activeUsers.toLocaleString()}

**Anbefaling:** ${systemMetrics.cpu < 70 ? 'Systemet presterer godt.' : 'Vurder å skale opp ressurser.'}`
    }
    
    return `Jeg forstår at du spør om "${input}". Som AI Sikkerhetsrådgiver kan jeg hjelpe deg med:

🔒 **Sikkerhet** - Overvåke trusler og sikkerhetstiltak
🚀 **Deploy** - Go/No-Go sjekker og release-strategier  
💾 **Backup** - RPO/RTO og gjenoppretting
⚡ **Ytelse** - Systemmetrics og optimalisering
💰 **Kostnader** - AI-forbruk og budsjettering

Hva vil du vite mer om?`
  }

  const determineMessageType = (input: string): ChatMessage['type'] => {
    const lowerInput = input.toLowerCase()
    if (lowerInput.includes('sikkerhet') || lowerInput.includes('security')) return 'security'
    if (lowerInput.includes('deploy') || lowerInput.includes('release')) return 'deployment'
    if (lowerInput.includes('backup') || lowerInput.includes('restore')) return 'backup'
    if (lowerInput.includes('performance') || lowerInput.includes('ytelse')) return 'performance'
    if (lowerInput.includes('kostnad') || lowerInput.includes('cost')) return 'cost'
    return 'security'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'valid':
      case 'success':
      case 'ready':
        return 'text-green-600 bg-green-100'
      case 'warning':
      case 'expiring':
      case 'high':
        return 'text-yellow-600 bg-yellow-100'
      case 'critical':
      case 'inactive':
      case 'invalid':
      case 'failed':
      case 'blocked':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'valid':
      case 'success':
      case 'ready':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
      case 'expiring':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />
      case 'critical':
      case 'inactive':
      case 'invalid':
      case 'failed':
      case 'blocked':
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const quickActions = [
    { label: 'Sikkerhetsstatus', action: () => setInputMessage('Hva er sikkerhetsstatusen?') },
    { label: 'Deploy sjekk', action: () => setInputMessage('Kan vi deploye nå?') },
    { label: 'Backup status', action: () => setInputMessage('Hvordan ser backup-statusen ut?') },
    { label: 'AI-kostnader', action: () => setInputMessage('Hvor mye koster AI i dag?') },
    { label: 'Systemytelse', action: () => setInputMessage('Hvordan presterer systemet?') }
  ]

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Bot className="h-8 w-8 mr-3 text-blue-600" />
            AI Sikkerhetsrådgiver
          </h1>
          <p className="text-gray-600">24/7 overvåking og intelligent sikkerhetsrådgivning</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Auto-modus:</span>
            <Button
              variant={autoMode ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoMode(!autoMode)}
            >
              {autoMode ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {autoMode ? 'På' : 'Av'}
            </Button>
          </div>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Oppdater
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="security">Sikkerhet</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
          <TabsTrigger value="monitoring">Overvåkning</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    AI Sikkerhetsrådgiver Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border shadow-sm'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('nb-NO')}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm p-3 rounded-lg">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Spør AI-rådgiveren om sikkerhet, drift eller optimalisering..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Status */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hurtighandlinger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={action.action}
                    >
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Overall Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sikkerhetsstatus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(securityStatus.overall)}`}>
                      {getStatusIcon(securityStatus.overall)}
                      <span className="ml-2 capitalize">{securityStatus.overall}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {securityStatus.overall === 'healthy' ? 'Alt fungerer som det skal' : 'Krever oppmerksomhet'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Risk Score & Auto-Healing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Sikkerhetsrisiko
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: securityStatus.riskScore < 30 ? '#10b981' : securityStatus.riskScore < 70 ? '#f59e0b' : '#ef4444' }}>
                    {securityStatus.riskScore}
                  </div>
                  <div className="text-sm text-gray-600">av 100</div>
                  <Progress value={securityStatus.riskScore} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {securityStatus.riskScore < 30 ? 'Lav risiko' : securityStatus.riskScore < 70 ? 'Moderat risiko' : 'Høy risiko'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Auto-Healing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${securityStatus.autoHealing ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                    {securityStatus.autoHealing ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                    {securityStatus.autoHealing ? 'Aktiv' : 'Inaktiv'}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {securityStatus.autoHealing ? 'Systemet reparerer seg automatisk' : 'Krever manuell intervensjon'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Hendelseslogg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {securityEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          event.severity === 'critical' ? 'bg-red-500' :
                          event.severity === 'high' ? 'bg-orange-500' :
                          event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="truncate">{event.message}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.floor((Date.now() - event.timestamp.getTime()) / (1000 * 60))}m
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WAF Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(securityStatus.waf)}
                  <span className="text-sm capitalize">{securityStatus.waf}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rate Limiting</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(securityStatus.rateLimit)}
                  <span className="text-sm capitalize">{securityStatus.rateLimit}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SSL Sertifikat</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(securityStatus.ssl)}
                  <span className="text-sm capitalize">{securityStatus.ssl}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Backup Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(securityStatus.backup)}
                  <span className="text-sm capitalize">{securityStatus.backup}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deploy Tab */}
        <TabsContent value="deploy" className="space-y-6">
          {/* Go/No-Go Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Deploy Status - Go/No-Go Sjekk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${deployStatus.status === 'ready' ? 'text-green-600' : deployStatus.status === 'deploying' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {deployStatus.status === 'ready' ? '✅ GO' : deployStatus.status === 'deploying' ? '⏳ DEPLOYING' : '❌ NO-GO'}
                  </div>
                  <div className="text-sm text-gray-600">Deploy Status</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{deployStatus.errorRate}%</div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                  <div className={`text-xs ${deployStatus.errorRate < 1 ? 'text-green-600' : deployStatus.errorRate < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {deployStatus.errorRate < 1 ? 'Utmerket' : deployStatus.errorRate < 5 ? 'Akseptabel' : 'Høy'}
                  </div>
                </div>

                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${deployStatus.testResults === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                    {deployStatus.testResults === 'pass' ? '✅' : '❌'}
                  </div>
                  <div className="text-sm text-gray-600">Test Results</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{deployStatus.dbLag}ms</div>
                  <div className="text-sm text-gray-600">DB Lag</div>
                  <div className={`text-xs ${deployStatus.dbLag < 50 ? 'text-green-600' : deployStatus.dbLag < 100 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {deployStatus.dbLag < 50 ? 'God' : deployStatus.dbLag < 100 ? 'Moderat' : 'Høy'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deploy Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Canary Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className={deployStatus.canaryStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {deployStatus.canaryStatus === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                  <Button className="w-full" disabled={deployStatus.status !== 'ready'}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Canary (1%)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Full Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Sist deploy: {deployStatus.lastDeploy.toLocaleString('nb-NO')}
                  </div>
                  <Button className="w-full" disabled={deployStatus.status !== 'ready'}>
                    <Play className="h-4 w-4 mr-2" />
                    Deploy til Produksjon
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rollback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Tilgjengelig i 24t
                  </div>
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Rollback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-6">
          {/* Backup Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup & Restore Helse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{backupHealth.rpo} min</div>
                  <div className="text-sm text-gray-600">RPO (Recovery Point)</div>
                  <div className="text-xs text-green-600">Mål: ≤5 min</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{backupHealth.rto} min</div>
                  <div className="text-sm text-gray-600">RTO (Recovery Time)</div>
                  <div className="text-xs text-green-600">Mål: ≤15 min</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Sist Snapshot</div>
                  <div className="text-sm font-medium">
                    {Math.floor((Date.now() - backupHealth.lastSnapshot.getTime()) / (1000 * 60))} min siden
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Sist Restore Test</div>
                  <div className="text-sm font-medium">
                    {Math.floor((Date.now() - backupHealth.lastRestoreTest.getTime()) / (1000 * 60 * 60))}t siden
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className={getStatusColor(backupHealth.status)}>
                      {getStatusIcon(backupHealth.status)}
                      <span className="ml-1 capitalize">{backupHealth.status}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Test Result</span>
                    <Badge className={backupHealth.testResult === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {backupHealth.testResult === 'pass' ? '✅ Pass' : '❌ Fail'}
                    </Badge>
                  </div>
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Kjør Backup Nå
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restore Test</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Test gjenoppretting til shadow-database
                  </div>
                  <Button className="w-full">
                    <TestTube className="h-4 w-4 mr-2" />
                    Start Restore Test
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disaster Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    One-click DR playbook
                  </div>
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Aktiver DR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GDPR Tab */}
        <TabsContent value="gdpr" className="space-y-6">
          {/* GDPR Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                GDPR & Personvern Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-blue-600">{gdprStatus.openRequests}</div>
                  <div className="text-sm text-gray-600">Åpne Forespørsler</div>
                  <div className="text-xs text-gray-500">SLA: 30 dager</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-red-600">{gdprStatus.slaBreaches}</div>
                  <div className="text-sm text-gray-600">SLA Brudd</div>
                  <div className="text-xs text-gray-500">Kritisk</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-orange-600">{gdprStatus.pendingDeletions}</div>
                  <div className="text-sm text-gray-600">Ventende Slettinger</div>
                  <div className="text-xs text-gray-500">Anonymisering</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-green-600">{gdprStatus.anonymizations}</div>
                  <div className="text-sm text-gray-600">Anonymiseringer</div>
                  <div className="text-xs text-gray-500">Denne måned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GDPR Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personvernhandlinger</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Behandle Slettingsforespørsler
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Anonymiser Brukerdata
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Eksporter Brukerdata
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Sist audit: {gdprStatus.lastAudit.toLocaleDateString('nb-NO')}
                  </div>
                  <Button className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generer Compliance Rapport
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    GDPR Sjekkliste
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          {/* Abuse Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Abuse Detection & API Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Topp API-brukere</h4>
                  <div className="space-y-2">
                    {abuseDetection.topUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${user.suspicious ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          <span className="font-medium">{user.userId}</span>
                          {user.suspicious && <Badge className="bg-red-100 text-red-700">Mistenkelig</Badge>}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.requests.toLocaleString()} requests • ${user.cost}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Uvanlige Mønstre</h4>
                  <div className="space-y-2">
                    {abuseDetection.unusualPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">{pattern.pattern}</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            pattern.severity === 'high' ? 'bg-red-100 text-red-700' :
                            pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {pattern.severity}
                          </Badge>
                          <span className="text-sm text-gray-600">{pattern.count} hendelser</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vulnerability Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sårbarhetsscanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-red-600">{vulnerabilityScan.critical}</div>
                  <div className="text-sm text-gray-600">Kritiske</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-orange-600">{vulnerabilityScan.high}</div>
                  <div className="text-sm text-gray-600">Høye</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-yellow-600">{vulnerabilityScan.medium}</div>
                  <div className="text-sm text-gray-600">Moderate</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-blue-600">{vulnerabilityScan.low}</div>
                  <div className="text-sm text-gray-600">Lave</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Dependencies</h4>
                    <p className="text-sm text-gray-600">
                      {vulnerabilityScan.dependencies} totalt • {vulnerabilityScan.outdated} utdaterte
                    </p>
                  </div>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Scan Nå
                  </Button>
                </div>
                <div className="text-xs text-gray-500">
                  Sist scan: {vulnerabilityScan.lastScan.toLocaleString('nb-NO')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Synthetic Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                Syntetiske Tester
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syntheticTests.tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        test.status === 'pass' ? 'bg-green-500' :
                        test.status === 'fail' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{test.responseTime}ms</span>
                      <Badge className={
                        test.status === 'pass' ? 'bg-green-100 text-green-700' :
                        test.status === 'fail' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Overall Health</h4>
                    <p className="text-sm text-gray-600">Syntetiske brukertester</p>
                  </div>
                  <Badge className={
                    syntheticTests.overallHealth === 'healthy' ? 'bg-green-100 text-green-700' :
                    syntheticTests.overallHealth === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {syntheticTests.overallHealth}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}