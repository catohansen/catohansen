'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle2, XCircle, Globe, Database, Mail, Shield } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import OpenAiKeyManager from '@/components/admin/OpenAiKeyManager'

interface IntegrationStatus {
  name: string
  status: 'ok' | 'error' | 'warning'
  description: string
  lastChecked: string
  icon: unknown
}

export default function IntegrationsPage() {
  const [mounted, setMounted] = useState(false)
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      name: 'OpenAI API',
      status: 'ok',
      description: 'AI chat og analyse',
      lastChecked: new Date().toISOString(),
      icon: Globe
    },
    {
      name: 'Database',
      status: 'ok',
      description: 'SQLite lokalt',
      lastChecked: new Date().toISOString(),
      icon: Database
    },
    {
      name: 'E-post System',
      status: 'warning',
      description: 'SMTP konfigurasjon mangler',
      lastChecked: new Date().toISOString(),
      icon: Mail
    },
    {
      name: 'Sikkerhet',
      status: 'ok',
      description: 'Rate limiting og audit',
      lastChecked: new Date().toISOString(),
      icon: Shield
    }
  ])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const testAllIntegrations = async () => {
    setLoading(true)
    try {
      // Test OpenAI
      const aiResponse = await fetch('/api/admin/ai/info')
      const aiData = await aiResponse.json()
      
      // Update integrations based on test results
      setIntegrations(prev => prev.map(integration => {
        if (integration.name === 'OpenAI API') {
          return {
            ...integration,
            status: aiData.success && aiData.data.status === 'ok' ? 'ok' : 'error',
            lastChecked: new Date().toISOString()
          }
        }
        return integration
      }))
      
      if (aiData.success && aiData.data.status === 'ok') {
        toast.success('Integrasjoner testet!', {
          description: 'OpenAI API fungerer normalt'
        })
      } else {
        toast.error(aiData.error || 'Integrasjoner testet med feil', {
          description: aiData.suggestions ? aiData.suggestions.join(', ') : undefined
        })
      }
    } catch {
      toast.error('Feil ved testing av integrasjoner', {
        description: 'Sjekk internettforbindelse og prøv igjen'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-700'
      case 'error': return 'bg-red-100 text-red-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle2 className="h-3 w-3 mr-1"/>
      case 'error': return <XCircle className="h-3 w-3 mr-1"/>
      case 'warning': return <RefreshCw className="h-3 w-3 mr-1"/>
      default: return null
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laster...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrasjoner</h1>
            <p className="text-gray-600 mt-2">Overvåk og administrer systemintegrasjoner</p>
          </div>
          <Button 
            onClick={testAllIntegrations} 
            disabled={loading}
            className="rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Test alle integrasjoner
          </Button>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => {
            const IconComponent = integration.icon as React.ComponentType<{ className?: string }>
            return (
              <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    {integration.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(integration.status)}>
                      {getStatusIcon(integration.status)}
                      {integration.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(integration.lastChecked).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600">{integration.description}</p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-lg"
                    onClick={() => {
                      if (integration.name === 'OpenAI API') {
                        testAllIntegrations()
                      }
                    }}
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Test tilkobling
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* OpenAI Key Manager */}
        <OpenAiKeyManager />

        {/* System Status */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.status === 'ok').length}
                </div>
                <div className="text-sm text-gray-600">Fungerende</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {integrations.filter(i => i.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-600">Advarsler</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {integrations.filter(i => i.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600">Feil</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
