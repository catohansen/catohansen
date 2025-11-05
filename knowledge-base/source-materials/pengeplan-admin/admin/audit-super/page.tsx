'use client'

import { useState, useEffect } from 'react'
import { FileText, Activity, Download } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AuditEvent {
  id: string
  action: string
  userId: string
  userEmail: string
  details: Record<string, unknown>
  timestamp: string
  level: string
}

export default function AuditSuperPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [summary, setSummary] = useState({
    totalEvents: 0,
    eventsToday: 0,
    eventsThisWeek: 0,
    eventsThisMonth: 0,
    topActions: [],
    topUsers: []
  })

  useEffect(() => {
    setMounted(true)
    loadAuditData()
  }, [])

  const loadAuditData = async () => {
    try {
      const [eventsResponse, summaryResponse] = await Promise.all([
        fetch('/api/admin/audit'),
        fetch('/api/admin/audit-summary-super')
      ])

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setAuditEvents(eventsData.auditLogs || [])
      }

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setSummary(summaryData)
      }
    } catch (error) {
      console.error('Error loading audit data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
      <div>
            <h1 className="text-3xl font-bold mb-2">Superadmin Audit Log</h1>
            <p className="text-purple-100">Avansert audit logging og sikkerhetsovervåking</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Superadmin</div>
            <div className="text-purple-200">Sikkerhet & Overvåking</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Events</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Alle audit events</p>
            </CardContent>
          </Card>
          
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">I Dag</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.eventsToday}</div>
            <p className="text-xs text-muted-foreground">Events i dag</p>
            </CardContent>
          </Card>
          
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denne Uken</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.eventsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Events denne uken</p>
            </CardContent>
          </Card>
          
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denne Måneden</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.eventsThisMonth}</div>
            <p className="text-xs text-muted-foreground">Events denne måneden</p>
            </CardContent>
          </Card>
            </div>
            
      {/* Main Content */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Audit Events</TabsTrigger>
          <TabsTrigger value="summary">Sammendrag</TabsTrigger>
          <TabsTrigger value="export">Eksport</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
      <Card>
        <CardHeader>
              <CardTitle>Audit Events</CardTitle>
          <CardDescription>
                Alle sikkerhetsrelaterte events og aktiviteter
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Laster audit events...</p>
            </div>
              ) : auditEvents.length === 0 ? (
            <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ingen audit events</h3>
                  <p className="text-muted-foreground mb-4">
                    Ingen audit events funnet
                  </p>
            </div>
          ) : (
                <div className="space-y-4">
                  {auditEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{event.action}</h3>
                          <Badge variant="outline">{event.level}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString('no-NO')}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Bruker: {event.userEmail} ({event.userId})
                      </p>
                      <div className="bg-gray-100 rounded p-2 text-sm">
                        <pre>{JSON.stringify(event.details, null, 2)}</pre>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Actions</CardTitle>
                <CardDescription>
                  Mest utførte handlinger
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.topActions.map((action: Record<string, unknown>, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{String(action.action)}</span>
                      <Badge variant="outline">{String(action.count)}</Badge>
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Users</CardTitle>
                <CardDescription>
                  Brukere med mest aktivitet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.topUsers.map((user: Record<string, unknown>, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{String(user.email)}</span>
                      <Badge variant="outline">{String(user.count)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
                  </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eksport Audit Data</CardTitle>
              <CardDescription>
                Eksporter audit data for analyse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter CSV</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter JSON</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter PDF</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter Excel</span>
                  </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}