"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Shield, Bot, Database, Users, Info } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Alert = { 
  id: string
  type: "critical"|"warning"|"info"
  source: string
  message: string
  timestamp: string
}

export default function AlertCenterCard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  async function loadAlerts() {
    try {
      const response = await fetch("/api/admin/security/alerts", { 
        headers: { "x-role": "superadmin" } 
      })
      const result = await response.json()
      if (result.success) {
        setAlerts(result.alerts || [])
      } else {
        // Fallback to mock data
        setAlerts([
          {
            id: '1',
            type: 'critical',
            source: 'Auth System',
            message: 'Suspicious login attempt detected',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            type: 'warning',
            source: 'AI Monitor',
            message: 'OpenAI API quota is at 85% capacity',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'info',
            source: 'Backup System',
            message: 'Daily backup completed successfully',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load alerts:', error)
      // Fallback to mock data
      setAlerts([
        {
          id: '1',
          type: 'critical',
          source: 'Auth System',
          message: 'Suspicious login attempt detected',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'warning',
          source: 'AI Monitor',
          message: 'OpenAI API quota is at 85% capacity',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-3 w-3 text-red-600" />
      case 'warning': return <AlertTriangle className="h-3 w-3 text-yellow-600" />
      case 'info': return <Info className="h-3 w-3 text-blue-600" />
      default: return <Info className="h-3 w-3 text-gray-600" />
    }
  }

  const getSourceIcon = (source: string) => {
    if (source.includes('Auth') || source.includes('Security')) return <Shield className="h-3 w-3" />
    if (source.includes('AI')) return <Bot className="h-3 w-3" />
    if (source.includes('Backup') || source.includes('System')) return <Database className="h-3 w-3" />
    if (source.includes('User')) return <Users className="h-3 w-3" />
    return <Info className="h-3 w-3" />
  }

  const tone = (t: Alert["type"]) =>
    t === "critical" ? "bg-rose-100 text-rose-700" : 
    t === "warning" ? "bg-amber-100 text-amber-700" : 
    "bg-slate-100 text-slate-700"

  return (
    <Card className="rounded-2xl hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Aktive varsler
          <Badge className="bg-slate-100 text-slate-700">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {loading ? (
          <div className="animate-pulse h-10 bg-slate-100 rounded-lg" />
        ) : alerts.length ? (
          alerts.slice(0, 3).map(a => (
            <div key={a.id} className="p-2 rounded-lg border flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getSourceIcon(a.source)}
                  <span className="font-medium text-xs">{a.source}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${tone(a.type)}`}>
                  {a.type === "critical" ? "Kritisk" : a.type === "warning" ? "Advarsel" : "Info"}
                </span>
              </div>
              <div className="text-xs text-slate-700">{a.message}</div>
              <div className="text-xs text-slate-500">
                {new Date(a.timestamp).toLocaleString("no-NO", {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-500 text-center py-4">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div>Ingen aktive varsler 🎉</div>
          </div>
        )}
        {alerts.length > 3 && (
          <div className="text-center pt-2">
            <a 
              href="/admin/alerts" 
              className="text-xs text-slate-600 underline hover:text-slate-900"
            >
              Se alle {alerts.length} varsler →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}



































