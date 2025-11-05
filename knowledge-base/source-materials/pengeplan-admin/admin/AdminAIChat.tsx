/**
 * Admin AI Chat Assistant
 * Pengeplan 2.0 - Intelligent admin assistance with analytics
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Send, 
  Loader2, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Brain,
  Zap,
  Target,
  Activity
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface AdminAIChatProps {
  onAnalyticsUpdate?: (analytics: any) => void
  onAlert?: (alert: { type: string; message: string; severity: 'low' | 'medium' | 'high' }) => void
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  metadata?: {
    analytics?: any
    insights?: string[]
    recommendations?: string[]
    confidence?: number
  }
}

interface SystemAnalytics {
  totalUsers: number
  activeUsers: number
  churnRisk: number
  revenue: number
  engagement: number
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
  alerts: Array<{
    type: string
    message: string
    severity: 'low' | 'medium' | 'high'
    timestamp: Date
  }>
}

export function AdminAIChat({ onAnalyticsUpdate, onAlert }: AdminAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'ai',
      content: 'Hei! Jeg er din AI-administrator. Jeg kan hjelpe deg med systemanalyser, brukerinsikter, churn-prediksjoner og mye mer. Hva vil du vite?',
      timestamp: new Date(),
      metadata: {
        insights: [
          'Systemet kjører optimalt',
          'Ingen kritiske varsler',
          'Brukerengasjement er høy'
        ],
        confidence: 0.95
      }
    }
    setMessages([welcomeMessage])
    
    // Load initial analytics
    loadSystemAnalytics()
  }, [])

  const loadSystemAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
        onAnalyticsUpdate?.(data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          context: 'admin_analytics',
          includeAnalytics: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        metadata: {
          analytics: data.analytics,
          insights: data.insights,
          recommendations: data.recommendations,
          confidence: data.confidence
        }
      }

      setMessages(prev => [...prev, aiMessage])

      // Handle alerts
      if (data.alerts && data.alerts.length > 0) {
        data.alerts.forEach((alert: any) => {
          onAlert?.(alert)
          toast({
            title: alert.severity === 'high' ? '🚨 Kritisk varsel' : 
                   alert.severity === 'medium' ? '⚠️ Varsel' : 'ℹ️ Info',
            description: alert.message,
            variant: alert.severity === 'high' ? 'destructive' : 'default'
          })
        })
      }

    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Beklager, jeg kunne ikke behandle forespørselen din. Feil: ${error.message}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSystemHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />
      case 'good': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Administrator Assistant
        </CardTitle>
        <div className="flex items-center gap-2">
          {analytics && (
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${getSystemHealthColor(analytics.systemHealth)}`}
            >
              {getSystemHealthIcon(analytics.systemHealth)}
              {analytics.systemHealth.toUpperCase()}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Minimer' : 'Utvid'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* System Overview */}
        {analytics && isExpanded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
              <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Totale brukere</div>
            </div>
            <div className="text-center">
              <Activity className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <div className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Aktive brukere</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-600" />
              <div className="text-2xl font-bold">{analytics.revenue.toLocaleString('nb-NO')} kr</div>
              <div className="text-sm text-gray-600">Inntekter</div>
            </div>
            <div className="text-center">
              <Target className="h-6 w-6 mx-auto mb-1 text-orange-600" />
              <div className="text-2xl font-bold">{analytics.churnRisk}%</div>
              <div className="text-sm text-gray-600">Churn-risiko</div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.metadata?.insights && (
                      <div className="mt-2 space-y-1">
                        {message.metadata.insights.map((insight, index) => (
                          <div key={index} className="text-xs opacity-75">
                            💡 {insight}
                          </div>
                        ))}
                      </div>
                    )}
                    {message.metadata?.recommendations && (
                      <div className="mt-2 space-y-1">
                        {message.metadata.recommendations.map((rec, index) => (
                          <div key={index} className="text-xs opacity-75">
                            🎯 {rec}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI tenker...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Spør AI-administratoren om systemet..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Vis meg systemstatistikk')}
            disabled={isLoading}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Statistikk
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Hvilke brukere har høy churn-risiko?')}
            disabled={isLoading}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Churn-risiko
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput('Gi meg anbefalinger for å forbedre systemet')}
            disabled={isLoading}
          >
            <Zap className="h-4 w-4 mr-1" />
            Anbefalinger
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}




