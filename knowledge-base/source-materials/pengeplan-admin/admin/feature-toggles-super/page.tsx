'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Zap,
  BarChart3,
  MessageCircle,
  CreditCard,
  Target,
  Bot,
  PiggyBank
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

interface FeatureToggle {
  name: string
  key: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

const featureDefinitions: Omit<FeatureToggle, 'enabled'>[] = [
  {
    name: 'Budsjett-modul',
    key: 'budget',
    description: 'Inntekter, utgifter og budsjettplanlegging',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    name: 'Rapporter-modul',
    key: 'reports', 
    description: 'Månedlige og årlige rapporter med analyser',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    name: 'Gjeld-modul',
    key: 'debt',
    description: 'Gjeldsrådgivning og nedbetalingsplaner',
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    name: 'Sparing-modul',
    key: 'savings',
    description: 'Sparemål og investeringsrådgivning',
    icon: <PiggyBank className="h-5 w-5" />
  },
  {
    name: 'AI-rådgiver',
    key: 'ai_advisor',
    description: 'AI-rådgivning og premium coaching',
    icon: <Bot className="h-5 w-5" />
  }
]

export default function FeatureTogglesPage() {
  const [features, setFeatures] = useState<FeatureToggle[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const localFeatureDefinitions = [
    {
      name: 'Budsjett-modul',
      key: 'budget',
      description: 'Inntekter, utgifter og budsjettplanlegging',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: 'Rapporter-modul',
      key: 'reports',
      description: 'Månedlige og årlige rapporter med analyser',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: 'Rådgivning-modul',
      key: 'advice',
      description: 'NAV-lenker og økonomisk rådgivning',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      name: 'Gjeld-modul',
      key: 'debts',
      description: 'Gjeldsadministrasjon og nedbetalingsplaner',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      name: 'Mål-modul',
      key: 'goals',
      description: 'Økonomiske mål og spareplaner',
      icon: <Target className="h-5 w-5" />
    },
    {
      name: 'AI-modul',
      key: 'ai',
      description: 'AI-rådgivning og premium coaching',
      icon: <Bot className="h-5 w-5" />
    }
  ]

  const fetchFeatureToggles = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/feature-toggles')
      
      if (response.ok) {
        const data = await response.json()
        const updatedFeatures = featureDefinitions.map(feature => ({
          ...feature,
          enabled: data.features[feature.key] ?? true
        }))
        setFeatures(updatedFeatures)
      } else {
        console.error('Failed to fetch feature toggles')
      }
    } catch (error) {
      console.error('Error fetching feature toggles:', error)
    } finally {
      setLoading(false)
    }
  }, [localFeatureDefinitions])

  useEffect(() => {
    fetchFeatureToggles()
  }, [fetchFeatureToggles])

  const toggleFeature = async (featureKey: string, enabled: boolean) => {
    try {
      setUpdating(featureKey)
      
      const response = await fetch('/api/admin/feature-toggles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feature: featureKey,
          enabled
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update local state
        setFeatures(prev => prev.map(feature => 
          feature.key === featureKey 
            ? { ...feature, enabled }
            : feature
        ))

        // Show success message
        console.log(data.message)
      } else {
        const errorData = await response.json()
        console.error('Failed to update feature toggle:', errorData.error)
        
        // Revert the toggle if update failed
        setFeatures(prev => prev.map(feature => 
          feature.key === featureKey 
            ? { ...feature, enabled: !enabled }
            : feature
        ))
      }
    } catch (error) {
      console.error('Error updating feature toggle:', error)
      
      // Revert the toggle if update failed
      setFeatures(prev => prev.map(feature => 
        feature.key === featureKey 
          ? { ...feature, enabled: !enabled }
          : feature
      ))
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (enabled: boolean) => {
    if (enabled) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aktiv
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          <XCircle className="h-3 w-3 mr-1" />
          Inaktiv
        </Badge>
      )
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laster funksjonsbrytere...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Funksjonsbrytere</h1>
        </div>
        <p className="text-gray-600">
          Aktiver eller deaktiver moduler i systemet. Endringer påvirker alle brukere umiddelbart.
        </p>
      </div>

      <div className="grid gap-6">
        {features.map((feature) => (
          <Card key={feature.key} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(feature.enabled)}
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(enabled) => toggleFeature(feature.key, enabled)}
                    disabled={updating === feature.key}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {feature.enabled ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Modulen er aktiv og tilgjengelig for alle brukere
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      Modulen er deaktivert og utilgjengelig
                    </span>
                  )}
                </span>
                
                {updating === feature.key && (
                  <span className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Oppdaterer...
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Viktig informasjon
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Endringer påvirker alle brukere umiddelbart</li>
              <li>• Deaktiverte moduler vil ikke være tilgjengelige i brukergrensesnittet</li>
              <li>• Data i deaktiverte moduler beholdes og kan gjenaktiveres</li>
              <li>• AI-QA systemet vil teste tilgjengelige moduler automatisk</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          onClick={fetchFeatureToggles}
          variant="outline"
          className="mr-4"
        >
          <Zap className="h-4 w-4 mr-2" />
          Oppdater Status
        </Button>
        
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
        >
          Tilbake
        </Button>
      </div>
    </div>
  )
}








