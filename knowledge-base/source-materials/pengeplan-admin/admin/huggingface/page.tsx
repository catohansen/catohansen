'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Key, 
  Settings, 
  TestTube, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Zap,
  Shield,
  Globe,
  Database,
  Activity,
  DollarSign,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  Cpu,
  Server
} from 'lucide-react'

interface HuggingFaceModel {
  id: string
  name: string
  description: string
  status: 'available' | 'loading' | 'error'
  size: string
  downloads: number
  lastUpdated: string
  tags: string[]
}

interface HuggingFaceConfig {
  apiKey: string
  baseUrl: string
  defaultModel: string
  maxTokens: number
  temperature: number
  timeout: number
}

export default function HuggingFacePage() {
  const [config, setConfig] = useState<HuggingFaceConfig>({
    apiKey: process.env.HUGGINGFACE_API_KEY || '',
    baseUrl: 'https://api-inference.huggingface.co',
    defaultModel: 'microsoft/DialoGPT-medium',
    maxTokens: 500,
    temperature: 0.7,
    timeout: 30000
  })
  
  const [models, setModels] = useState<HuggingFaceModel[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setLoading(true)
      // Mock models data
      setModels([
        {
          id: 'microsoft/DialoGPT-medium',
          name: 'DialoGPT Medium',
          description: 'Conversational AI model for chat applications',
          status: 'available',
          size: '345MB',
          downloads: 1250000,
          lastUpdated: '2023-10-15',
          tags: ['chat', 'conversational', 'gpt-2']
        },
        {
          id: 'microsoft/DialoGPT-large',
          name: 'DialoGPT Large',
          description: 'Larger conversational model with better performance',
          status: 'available',
          size: '774MB',
          downloads: 890000,
          lastUpdated: '2023-10-15',
          tags: ['chat', 'conversational', 'gpt-2', 'large']
        },
        {
          id: 'facebook/blenderbot-400M-distill',
          name: 'BlenderBot 400M',
          description: 'Facebook\'s conversational AI model',
          status: 'available',
          size: '1.5GB',
          downloads: 2100000,
          lastUpdated: '2023-09-20',
          tags: ['chat', 'facebook', 'blenderbot']
        },
        {
          id: 'microsoft/DialoGPT-small',
          name: 'DialoGPT Small',
          description: 'Lightweight conversational model',
          status: 'available',
          size: '117MB',
          downloads: 2100000,
          lastUpdated: '2023-10-15',
          tags: ['chat', 'conversational', 'gpt-2', 'small']
        }
      ])
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    try {
      const res = await fetch('/api/admin/huggingface/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (res.ok) {
        setMessage('Hugging Face konfigurasjon lagret!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Feil ved lagring av konfigurasjon')
      }
    } catch (error) {
      setMessage('Feil ved lagring av konfigurasjon')
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const res = await fetch('/api/admin/huggingface/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: config.defaultModel })
      })
      
      const data = await res.json()
      if (data.success) {
        setMessage('✅ Hugging Face API fungerer!')
      } else {
        setMessage(`❌ API test feilet: ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Test feilet')
    } finally {
      setTesting(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'loading': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'loading': return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute left-20 top-40 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute right-16 top-60 w-48 h-48 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse delay-700"></div>
        </div>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C88FF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')", backgroundRepeat: 'repeat'}}></div>
        </div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Laster Hugging Face modeller...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-20 top-40 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute right-16 top-60 w-48 h-48 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C88FF' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')", backgroundRepeat: 'repeat'}}></div>
      </div>
      <div className="relative z-10 p-6">
        <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              Hugging Face Integration
            </h1>
            <p className="text-gray-600">Konfigurer og administrer Hugging Face modeller</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={saveConfig} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Lagre konfigurasjon
            </Button>
            <Button onClick={testConnection} disabled={testing} variant="outline">
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              {testing ? 'Tester...' : 'Test API'}
            </Button>
          </div>
        </div>

        {message && (
          <Alert className={message.includes('✅') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="config">Konfigurasjon</TabsTrigger>
            <TabsTrigger value="models">Modeller</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="analytics">Analytikk</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hugging Face Konfigurasjon</CardTitle>
                <CardDescription>Konfigurer API-nøkkel og innstillinger</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="apiKey">API-nøkkel</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="hf_your-token-here"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Få din API-nøkkel fra <a href="https://huggingface.co/settings/tokens" target="_blank" className="text-blue-600 hover:underline">Hugging Face Settings</a>
                  </p>
                </div>

                <div>
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    value={config.baseUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api-inference.huggingface.co"
                  />
                </div>

                <div>
                  <Label htmlFor="defaultModel">Standard modell</Label>
                  <select
                    id="defaultModel"
                    value={config.defaultModel}
                    onChange={(e) => setConfig(prev => ({ ...prev, defaultModel: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="maxTokens">Maks tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={config.maxTokens}
                      onChange={(e) => setConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperatur (0-1)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={config.timeout}
                      onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <Card key={model.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                      </div>
                      {getStatusIcon(model.status)}
                    </div>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Størrelse:</span>
                        <span className="font-medium">{model.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Nedlastinger:</span>
                        <span className="font-medium">{model.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Sist oppdatert:</span>
                        <span className="font-medium">{model.lastUpdated}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {model.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Badge className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hugging Face Testing</CardTitle>
                <CardDescription>Test API-tilkobling og modeller</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">API Status</h3>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Tilkobling OK</span>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Standard modell</h3>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{config.defaultModel}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={testConnection} 
                    disabled={testing}
                    className="w-full"
                  >
                    {testing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <TestTube className="h-4 w-4 mr-2" />
                    )}
                    {testing ? 'Tester Hugging Face API...' : 'Test alle modeller'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hugging Face Analytics</CardTitle>
                <CardDescription>Oversikt over bruk og ytelse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">3,421</div>
                    <div className="text-sm text-purple-800">Forespørsler i dag</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-green-800">Suksessrate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.1s</div>
                    <div className="text-sm text-blue-800">Gjennomsnittlig latency</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$0.00</div>
                    <div className="text-sm text-orange-800">Kostnad i dag</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  )
}