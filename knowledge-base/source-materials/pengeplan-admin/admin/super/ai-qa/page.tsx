'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Bot, 
  Send, 
  Trash2, 
  MessageCircle, 
  TestTube,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import AppShell from '@/components/layout/AppShell'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface QASuggestion {
  id: string
  title: string
  description: string
  type: 'e2e' | 'audit' | 'ux' | 'security'
}

export default function AIQA() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [systemStatus, setSystemStatus] = useState<{dbStatus?: string, apiStatus?: string, aiStatus?: string, version?: string, uptime?: number, featureFlags?: any[]} | null>(null)
  const [aiConfig, setAiConfig] = useState({
    openaiApiKey: '',
    systemPrompt: 'Du er en hjelpsom AI-assistent for Pengeplan, et finanshåndteringssystem. Hjelp brukere med spørsmål om systemet, funksjoner, og anbefal kontaktalternativer når det er nødvendig.',
    maxTokens: 500,
    temperature: 0.7,
    showApiKey: false
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadConversationHistory()
    loadSystemStatus()
    loadAIConfig()
  }, [])

  const loadAIConfig = async () => {
    try {
      const response = await fetch('/api/superadmin/ai-config')
      if (response.ok) {
        const data = await response.json()
        setAiConfig(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error loading AI config:', error)
    }
  }

  const saveAIConfig = async () => {
    try {
      const response = await fetch('/api/superadmin/ai-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiConfig),
      })
      if (response.ok) {
        alert('AI-konfigurasjon lagret!')
      }
    } catch (error) {
      console.error('Error saving AI config:', error)
      alert('Feil ved lagring av AI-konfigurasjon')
    }
  }

  const loadConversationHistory = async () => {
    try {
      const response = await fetch('/api/superadmin/ai-qa/conversations')
      if (response.ok) {
        const data = await response.json()
        if (data.messages) {
          setMessages(data.messages)
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error)
    }
  }

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/superadmin/system-status')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data)
      }
    } catch (error) {
      console.error('Error loading system status:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/superadmin/ai-qa/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'I could not generate a response at this time.',
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorData = await response.json()
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${errorData.error || 'Unknown error'}`,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error occurred. Please try again later.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = async () => {
    try {
      const response = await fetch('/api/superadmin/ai-qa/conversations', {
        method: 'DELETE',
      })
      if (response.ok) {
        setMessages([])
      }
    } catch (error) {
      console.error('Error clearing conversation:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('nb-NO', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const qaSuggestions: QASuggestion[] = [
    {
      id: '1',
      title: 'Generate E2E Test Scenarios',
      description: 'Create comprehensive end-to-end test scenarios for all user flows',
      type: 'e2e'
    },
    {
      id: '2',
      title: 'Audit Log Analysis',
      description: 'Analyze recent audit logs for anomalies and security issues',
      type: 'audit'
    },
    {
      id: '3',
      title: 'UX Review',
      description: 'Review current features and suggest UX improvements',
      type: 'ux'
    },
    {
      id: '4',
      title: 'Security Assessment',
      description: 'Assess system security and suggest hardening measures',
      type: 'security'
    }
  ]

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'e2e':
        return <TestTube className="w-4 h-4" />
      case 'audit':
        return <FileText className="w-4 h-4" />
      case 'ux':
        return <MessageCircle className="w-4 h-4" />
      case 'security':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'e2e':
        return 'bg-blue-100 text-blue-800'
      case 'audit':
        return 'bg-green-100 text-green-800'
      case 'ux':
        return 'bg-purple-100 text-purple-800'
      case 'security':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AppShell role="superadmin">
      <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI-QA System</h1>
        <p className="text-gray-600">AI-powered quality assurance and system testing assistant</p>
      </div>

      {/* AI Configuration Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            AI-konfigurasjon for Landing Page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">OpenAI API-nøkkel</label>
                <div className="flex gap-2">
                  <Input
                    type={aiConfig.showApiKey ? "text" : "password"}
                    value={aiConfig.openaiApiKey}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAiConfig(prev => ({ ...prev, showApiKey: !prev.showApiKey }))}
                  >
                    {aiConfig.showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">System Prompt</label>
                <textarea
                  value={aiConfig.systemPrompt}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  rows={4}
                  placeholder="Beskriv hvordan AI-assistenten skal oppføre seg..."
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Max Tokens</label>
                <Input
                  type="number"
                  value={aiConfig.maxTokens}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  min="100"
                  max="2000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <Input
                  type="number"
                  step="0.1"
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  min="0"
                  max="2"
                />
              </div>
              
              <div className="pt-4">
                <Button onClick={saveAIConfig} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Lagre AI-konfigurasjon
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Tips for AI-assistenten på landing-siden:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Anbefal alltid kontaktalternativer (ring, e-post, video-demo)</li>
              <li>• Fokuser på Pengeplan&apos;s hovedfunksjoner og fordeler</li>
              <li>• Vær hjelpsom og vennlig i tonen</li>
              <li>• Gi konkrete eksempler på hvordan systemet kan hjelpe</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* System Status Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {systemStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    {systemStatus.dbStatus === 'healthy' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Version</span>
                    <Badge variant="outline">{systemStatus.version}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-xs text-gray-600">
                      {systemStatus.uptime ? Math.floor(systemStatus.uptime / 3600) : 0}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feature Flags</span>
                    <Badge variant="outline">
                      {systemStatus.featureFlags?.length || 0}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Loading system status...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  AI-QA Assistant
                </div>
                <Button variant="outline" size="sm" onClick={clearConversation}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Ask me to generate test scenarios, analyze audit logs, review UX, or assess security.
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with the AI-QA assistant.</p>
                    <div className="mt-4 space-y-2">
                      {qaSuggestions.map((suggestion) => (
                        <Button
                          key={suggestion.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setInput(suggestion.title)}
                          className="w-full justify-start"
                        >
                          {getSuggestionIcon(suggestion.type)}
                          <span className="ml-2">{suggestion.title}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask AI-QA assistant..."
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QA Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TestTube className="w-5 h-5 mr-2" />
                QA Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {qaSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setInput(suggestion.title)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getSuggestionColor(suggestion.type)}>
                        {getSuggestionIcon(suggestion.type)}
                        <span className="ml-1">{suggestion.type.toUpperCase()}</span>
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-gray-600">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </AppShell>
  )
}
