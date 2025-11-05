'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle2, XCircle, Settings, Key, Globe } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

import ErrorDisplay from './ErrorDisplay'

interface AIInfo {
  provider: string
  baseUrl: string
  modelChat: string
  modelReason: string
  routes: Record<string, string>
  models: Record<string, string>
  status: 'ok' | 'error' | 'loading'
  latency?: number
  error?: string
  hasApiKey: boolean
}

export default function AiSettingsForm() {
  const [info, setInfo] = useState<AIInfo | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'fail'>('idle')
  const [cachedAge, setCachedAge] = useState<number | null>(null)
  const [error, setError] = useState<{message: string, details?: string, suggestions?: string[]} | null>(null)
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    openaiBaseUrl: 'https://api.openai.com/v1',
    openaiModelChat: 'gpt-4o-mini',
    openaiModelReason: 'gpt-4o'
  })

  const fetchInfo = async () => {
    try {
      setStatus('loading')
      const response = await fetch('/api/admin/ai/info')
      const data = await response.json()
      
      if (data.success) {
        setInfo(data.data)
        setStatus(data.data.status)
        setCachedAge(0)
      } else {
        setStatus('fail')
        setError({
          message: data.error || 'Kunne ikke hente AI-info',
          details: data.details,
          suggestions: data.suggestions
        })
        toast.error(data.error || 'Kunne ikke hente AI-info', {
          description: data.suggestions ? data.suggestions.join(', ') : undefined
        })
      }
    } catch (error) {
      setStatus('fail')
      toast.error('Feil ved henting av AI-info', {
        description: 'Sjekk internettforbindelse og prøv igjen'
      })
    }
  }

  const testConnection = async () => {
    try {
      setStatus('loading')
      const response = await fetch('/api/admin/ai/info')
      const data = await response.json()
      
      if (data.success && data.data.status === 'ok') {
        setStatus('ok')
        toast.success('AI-tilkobling fungerer!', {
          description: `Latency: ${data.data.latency}ms`
        })
      } else {
        setStatus('fail')
        setError({
          message: data.error || 'AI-tilkobling feilet',
          details: data.details,
          suggestions: data.suggestions
        })
        toast.error(data.error || 'AI-tilkobling feilet', {
          description: data.suggestions ? data.suggestions.join(', ') : undefined
        })
      }
    } catch (error) {
      setStatus('fail')
      toast.error('Feil ved testing av tilkobling', {
        description: 'Sjekk internettforbindelse og prøv igjen'
      })
    }
  }

  const saveSettings = async () => {
    try {
      // In a real implementation, this would save to a secure settings store
      toast.success('Innstillinger lagret! (Mock)')
    } catch (error) {
      toast.error('Feil ved lagring av innstillinger')
    }
  }

  useEffect(() => {
    fetchInfo()
  }, [])

  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Settings className="h-5 w-5 text-blue-600" />
            AI Integrasjoner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <ErrorDisplay
              error={error.message}
              details={error.details}
              suggestions={error.suggestions}
              onRetry={() => {
                setError(null)
                fetchInfo()
              }}
            />
          )}
          
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Provider</Label>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-900">{info?.provider ?? '–'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <div className="flex items-center gap-2">
                {status === 'ok' && <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1"/>OK</Badge>}
                {status === 'fail' && <Badge className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1"/>Feil</Badge>}
                {status === 'loading' && <Badge className="bg-yellow-100 text-yellow-700"><RefreshCw className="h-3 w-3 mr-1 animate-spin"/>Laster</Badge>}
                {status === 'idle' && <span className="text-xs text-gray-500">Klikk for å teste</span>}
              </div>
            </div>
          </div>

          {/* Configuration Display */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Konfigurasjon</Label>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">API Key:</span>
                <span className="text-sm font-mono text-gray-900">
                  {info?.hasApiKey ? '••••••••••••••••' : 'Ikke satt'}
                </span>
              </div>
              <div>Base URL: <code className="text-sm bg-gray-200 px-2 py-1 rounded">{info?.baseUrl ?? "–"}</code></div>
              <div>Modell (chat): <code className="text-sm bg-gray-200 px-2 py-1 rounded">{info?.modelChat ?? "–"}</code></div>
              <div>Modell (reasoning): <code className="text-sm bg-gray-200 px-2 py-1 rounded">{info?.modelReason ?? "–"}</code></div>
            </div>
          </div>

          {/* Test Connection */}
          <div className="flex gap-2 items-center">
            <Button onClick={testConnection} className="rounded-xl" disabled={status === "loading"}>
              <RefreshCw className="h-4 w-4 mr-2" /> Test tilkobling
            </Button>
            {typeof cachedAge === "number" && status !== "idle" && (
              <span className="text-xs text-gray-500">Cache-alder: {cachedAge}s</span>
            )}
          </div>

          {/* Settings Form */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-sm font-medium text-gray-700">Innstillinger</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey" className="text-sm font-medium text-gray-700">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  placeholder="sk-..."
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openaiBaseUrl" className="text-sm font-medium text-gray-700">Base URL</Label>
                <Input
                  id="openaiBaseUrl"
                  value={settings.openaiBaseUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, openaiBaseUrl: e.target.value }))}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openaiModelChat" className="text-sm font-medium text-gray-700">Chat Model</Label>
                <Input
                  id="openaiModelChat"
                  value={settings.openaiModelChat}
                  onChange={(e) => setSettings(prev => ({ ...prev, openaiModelChat: e.target.value }))}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openaiModelReason" className="text-sm font-medium text-gray-700">Reasoning Model</Label>
                <Input
                  id="openaiModelReason"
                  value={settings.openaiModelReason}
                  onChange={(e) => setSettings(prev => ({ ...prev, openaiModelReason: e.target.value }))}
                  className="rounded-lg"
                />
              </div>
            </div>
            <Button onClick={saveSettings} className="rounded-xl">
              <Settings className="h-4 w-4 mr-2" /> Lagre innstillinger
            </Button>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t">
            Merk: API-nøkler lagres kryptert og brukes kun for AI-funksjonalitet. 
            Ingen data deles med tredjeparter uten din tillatelse.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
