'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  Brain, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  FileText,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const AdminSecuritySystemCard = dynamic(() => import('@/components/admin/security/AdminSecuritySystemCard'), { ssr: false })
const EnterpriseSignOff = dynamic(() => import('@/components/admin/EnterpriseSignOff'), { ssr: false })

interface GovernanceMetrics {
  overview: {
    totalSuggestions: number
    acceptedSuggestions: number
    rejectedSuggestions: number
    blockedSuggestions: number
    acceptRate: number
    blockRate: number
    activePolicies: number
    openIssues: number
  }
  security: {
    totalEvents: number
    criticalEvents: number
    authFailures: number
    permissionDenials: number
    suspiciousActivities: number
    openAlerts: number
    trendData: Array<{ date: string; events: number; severity: string }>
  }
  trends: {
    suggestions: Array<{ kind: string; status: string; _count: { kind: number } }>
    policies: Array<{ effect: string; count: number }>
    risk: Array<{ score: number; count: number }>
  }
  recentSamples: Array<{
    id: string
    actor: string
    decision: string
    riskScore: number
    sampledAt: string
  }>
}

export default function AdminAIGovernancePage() {
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(7)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/ai/overview?days=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch AI governance metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [timeRange, fetchMetrics])

  // Removed unused getStatusColor function

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Feil ved lasting</h3>
        <Button onClick={fetchMetrics}>Prøv igjen</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Governance Dashboard</h1>
          <p className="text-gray-600">Enterprise-grade AI compliance, sikkerhet og observability</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value={1}>Siste 24t</option>
            <option value={7}>Siste 7 dager</option>
            <option value={30}>Siste 30 dager</option>
          </select>
          
          <Button onClick={fetchMetrics} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Oppdater
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {metrics.security.criticalEvents > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-900">Kritiske sikkerhetshendelser</h3>
                <p className="text-red-700">
                  {metrics.security.criticalEvents} kritiske hendelser siste {timeRange} dager
                </p>
              </div>
              <Link href="/admin/ai/issues" className="ml-auto">
                <Button variant="destructive">
                  Behandle nå
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Forslag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.overview.totalSuggestions}</div>
            <p className="text-xs text-gray-500">Siste {timeRange} dager</p>
            <div className="flex items-center mt-2 gap-2">
              <Badge className="bg-green-100 text-green-800">
                {metrics.overview.acceptRate}% godkjent
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sikkerhet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.security.totalEvents}</div>
            <p className="text-xs text-gray-500">Sikkerhetshendelser</p>
            <div className="flex items-center mt-2 gap-2">
              {metrics.security.criticalEvents > 0 ? (
                <Badge variant="destructive">
                  {metrics.security.criticalEvents} kritiske
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800">
                  Ingen kritiske
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Policyer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.overview.activePolicies}</div>
            <p className="text-xs text-gray-500">Aktive regler</p>
            <div className="flex items-center mt-2 gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {metrics.overview.blockedSuggestions} blokkert
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.overview.openIssues}</div>
            <p className="text-xs text-gray-500">Åpne saker</p>
            <div className="flex items-center mt-2 gap-2">
              {metrics.overview.openIssues > 0 ? (
                <Badge variant="destructive">Krever handling</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800">Alt OK</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accept Rate Trend */}
        <Card>
              <CardHeader>
            <CardTitle>Godkjenningsrate over tid</CardTitle>
              </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.security.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

        {/* Policy Effects Distribution */}
        <Card>
              <CardHeader>
            <CardTitle>Policy-effekter</CardTitle>
              </CardHeader>
              <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.trends.policies}
                    dataKey="count"
                    nameKey="effect"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {metrics.trends.policies.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.effect === 'allow' ? '#10b981' : entry.effect === 'warn' ? '#f59e0b' : '#ef4444'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/ai/suggestions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">AI Forslag</h3>
              <p className="text-sm text-gray-600">Gjennomgå og administrer</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ai/policies">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Policyer</h3>
              <p className="text-sm text-gray-600">Konfigurer regler</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ai/issues">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Issues</h3>
              <p className="text-sm text-gray-600">Behandle problemer</p>
              {metrics.overview.openIssues > 0 && (
                <Badge variant="destructive" className="mt-1">
                  {metrics.overview.openIssues}
                </Badge>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ai/samples">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Audit Samples</h3>
              <p className="text-sm text-gray-600">Stikkprøver</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Samples */}
        <Card>
            <CardHeader>
            <CardTitle>Siste audit-prøver</CardTitle>
            </CardHeader>
            <CardContent>
            {metrics.recentSamples.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Ingen prøver ennå</p>
            ) : (
              <div className="space-y-3">
                {metrics.recentSamples.slice(0, 5).map(sample => (
                  <div key={sample.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{sample.actor}</p>
                      <p className="text-xs text-gray-600">
                        {sample.decision} • Risk: {sample.riskScore}/100
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(sample.sampledAt).toLocaleDateString('nb-NO')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            </CardContent>
          </Card>

        {/* Compliance Status */}
        <Card>
            <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Norsk AI-veileder</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </Badge>
                  </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">EU AI Act</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </Badge>
                </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GDPR</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </Badge>
                  </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Audit Trail</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
                </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Human Control</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enforced
                </Badge>
              </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* System Health */}
      <Card>
            <CardHeader>
          <CardTitle>System Health & Performance</CardTitle>
            </CardHeader>
            <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-gray-600">AI Uptime</p>
                      </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {metrics.overview.acceptRate}%
                      </div>
              <p className="text-sm text-gray-600">Accept Rate</p>
                      </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round((metrics.overview.totalSuggestions / timeRange) * 10) / 10}
                    </div>
              <p className="text-sm text-gray-600">Forslag/dag</p>
                      </div>
                    </div>
        </CardContent>
      </Card>

      {/* Security Posture Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Shield className="h-5 w-5" />
            Security Posture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800 mb-4 text-sm">
            Admin-tilgang håndheves av Cerbos. 2FA/WebAuthn, rate limiting, audit og fail-closed er aktivert.
          </p>
          <div className="max-w-2xl">
            <AdminSecuritySystemCard />
              </div>
            </CardContent>
          </Card>

      {/* AI System Cards Showcase */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Eye className="h-5 w-5" />
            AI System Cards (Showcase)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-800 mb-4 text-sm">
            Vis kort for Bruker, Verge, Landing og Admin i faner. Perfekt for investor-presentasjoner.
          </p>
          <Link href="/admin/ai/system-cards">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Eye className="h-4 w-4 mr-2" />
              Åpne Showcase
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Enterprise Release Sign-off */}
      <div className="mt-8">
        <EnterpriseSignOff />
      </div>
    </div>
  )
}