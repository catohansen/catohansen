'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Key, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

interface KeyInfo {
  provider: string
  baseUrl: string
  model: string
  keyMasked: string
  keyLoaded: boolean
  keyLength: number
  lastUpdated: string
}

type Status = 'idle' | 'testing' | 'ok' | 'fail'

export default function OpenAiKeyManager() {
  const [info, setInfo] = useState<KeyInfo | null>(null)
  const [newKey, setNewKey] = useState('')
  const [confirmKey, setConfirmKey] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKeyInfo()
  }, [])

  const loadKeyInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/ai/key')
      const data = await response.json()
      
      if (data.success) {
        setInfo(data.data)
        setStatus('ok')
      } else {
        setStatus('fail')
        setError(data.error)
      }
    } catch (err: any) {
      setStatus('fail')
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setStatus('testing')
    try {
      const response = await fetch('/api/admin/ai/info')
      const data = await response.json()
      
      if (data.success && data.data.status === 'ok') {
        setStatus('ok')
        toast.success('Tilkobling OK!')
      } else {
        setStatus('fail')
        toast.error('Tilkobling feilet')
      }
    } catch (err: any) {
      setStatus('fail')
      toast.error('Test feilet: ' + err.message)
    }
  }

  const rotateKey = async () => {
    if (!newKey || !confirmKey) {
      setError('Begge feltene må fylles ut')
      return
    }

    if (newKey !== confirmKey) {
      setError('Nøklene matcher ikke')
      return
    }

    if (!newKey.startsWith('sk-') || newKey.length < 24) {
      setError('Nøkkel må starte med "sk-" og være minst 24 tegn')
      return
    }

    setStatus('testing')
    setError('')

    try {
      const response = await fetch('/api/admin/ai/key/rotate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newKey, confirmKey })
      })

      const data = await response.json()

      if (data.success) {
        setStatus('ok')
        setNewKey('')
        setConfirmKey('')
        setError('')
        toast.success('Nøkkel rotert og testet!')
        await loadKeyInfo()
      } else {
        setStatus('fail')
        setError(data.error)
        toast.error('Rotasjon feilet: ' + data.error)
      }
    } catch (err: any) {
      setStatus('fail')
      setError(err.message)
      toast.error('Rotasjon feilet: ' + err.message)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'ok':
        return <Badge className="bg-green-100 text-green-700">OK</Badge>
      case 'fail':
        return <Badge className="bg-red-100 text-red-700">Feil</Badge>
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-700">Tester...</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">Ukjent</Badge>
    }
  }

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2">Laster nøkkelinfo...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenAI API-nøkkel Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Key Status */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Provider:</span>
            <Badge variant="outline">{info?.provider || '–'}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Base URL:</span>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{info?.baseUrl || '–'}</code>
          </div>
          <div className="flex items-center justify-between">
            <span>Modell:</span>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{info?.model || '–'}</code>
          </div>
          <div className="flex items-center justify-between">
            <span>API Key:</span>
            {info?.keyLoaded ? (
              <Badge className="bg-green-100 text-green-700">{info.keyMasked}</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700">Ikke lastet</Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Rotate Key Section */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium text-sm">Roter API-nøkkel</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="newKey">Ny nøkkel</Label>
              <Input
                id="newKey"
                type="password"
                placeholder="sk-..."
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmKey">Bekreft ny nøkkel</Label>
              <Input
                id="confirmKey"
                type="password"
                placeholder="sk-..."
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Krav: starter med <code>sk-</code>, min 24 tegn. Vi lagrer alltid kryptert og logger aldri nøkkelen.
          </div>
          
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={rotateKey} 
              disabled={status === 'testing' || !newKey || !confirmKey}
              className="rounded-xl"
            >
              {status === 'testing' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Roterer...
                </>
              ) : (
                'Roter nøkkel'
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={testConnection} 
              disabled={status === 'testing'}
              className="rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Test tilkobling
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



































