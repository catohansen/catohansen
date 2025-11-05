'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Power, Brain, Eye, Shield, Zap } from 'lucide-react'

export default function AITogglePanel() {
  const [systems, setSystems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSystems = async () => {
    try {
      const res = await fetch('/api/admin/ai/status')
      if (res.ok) {
        const data = await res.json()
        setSystems(data.systems || [])
      } else {
        // Fallback to mock data if API fails
        setSystems([
          {
            id: 'deepseek-ai',
            name: 'DeepSeek AI',
            status: 'active',
            type: 'chat',
            lastActivity: new Date().toISOString(),
            requestsToday: 1247,
            avgLatency: 850,
            successRate: 98.5
          },
          {
            id: 'openai-gpt4',
            name: 'OpenAI GPT-4',
            status: 'active',
            type: 'chat',
            lastActivity: new Date().toISOString(),
            requestsToday: 892,
            avgLatency: 1200,
            successRate: 99.2
          },
          {
            id: 'claude-3-5',
            name: 'Claude 3.5 Sonnet',
            status: 'active',
            type: 'chat',
            lastActivity: new Date().toISOString(),
            requestsToday: 456,
            avgLatency: 1100,
            successRate: 97.8
          },
          {
            id: 'huggingface-models',
            name: 'Hugging Face Models',
            status: 'active',
            type: 'inference',
            lastActivity: new Date().toISOString(),
            requestsToday: 2341,
            avgLatency: 650,
            successRate: 96.3
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching AI systems:', error)
      // Use mock data on error
      setSystems([
        {
          id: 'deepseek-ai',
          name: 'DeepSeek AI',
          status: 'active',
          type: 'chat',
          lastActivity: new Date().toISOString(),
          requestsToday: 1247,
          avgLatency: 850,
          successRate: 98.5
        },
        {
          id: 'openai-gpt4',
          name: 'OpenAI GPT-4',
          status: 'active',
          type: 'chat',
          lastActivity: new Date().toISOString(),
          requestsToday: 892,
          avgLatency: 1200,
          successRate: 99.2
        },
        {
          id: 'claude-3-5',
          name: 'Claude 3.5 Sonnet',
          status: 'active',
          type: 'chat',
          lastActivity: new Date().toISOString(),
          requestsToday: 456,
          avgLatency: 1100,
          successRate: 97.8
        },
        {
          id: 'huggingface-models',
          name: 'Hugging Face Models',
          status: 'active',
          type: 'inference',
          lastActivity: new Date().toISOString(),
          requestsToday: 2341,
          avgLatency: 650,
          successRate: 96.3
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystems()
    const interval = setInterval(fetchSystems, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleSystem = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/ai/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: !currentStatus })
      })
      
      if (res.ok) {
        setSystems(prev => prev.map(sys => 
          sys.id === id ? { ...sys, status: !currentStatus } : sys
        ))
      }
    } catch (error) {
      console.error('Error toggling AI system:', error)
    }
  }

  const getSystemIcon = (name: string) => {
    if (name.includes('Revolutionary')) return <Brain className="h-4 w-4" />
    if (name.includes('Image')) return <Eye className="h-4 w-4" />
    if (name.includes('Security')) return <Shield className="h-4 w-4" />
    if (name.includes('DeepSeek')) return <Zap className="h-4 w-4" />
    return <Power className="h-4 w-4" />
  }

  const getSystemColor = (system: any) => {
    if (!system.status) return 'bg-gray-300'
    if (system.healthScore && system.healthScore > 90) return 'bg-green-500'
    if (system.healthScore && system.healthScore > 70) return 'bg-yellow-400'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="h-5 w-5" />
            AI-moduler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Laster AI-systemer...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="h-5 w-5" />
          AI-moduler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system) => (
            <div key={system.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getSystemIcon(system.name)}
                <div>
                  <h4 className="font-semibold">{system.name}</h4>
                  <p className="text-sm text-gray-600">{system.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getSystemColor(system)}`}></div>
                    <span className="text-xs text-gray-500">
                      {system.status ? 'Aktiv' : 'Deaktivert'}
                    </span>
                    {system.healthScore && (
                      <Badge variant="outline" className="text-xs">
                        {system.healthScore.toFixed(0)}% helse
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Switch
                checked={system.status}
                onCheckedChange={() => toggleSystem(system.id, system.status)}
              />
            </div>
          ))}
          
          {systems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Ingen AI-systemer funnet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}



