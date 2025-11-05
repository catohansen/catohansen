'use client'

import { useState, useEffect } from 'react'
import { 
  Download, 
  Trash2, 
  Pause, 
  Search, 
  User, 
  FileText, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  Mail
} from 'lucide-react'
import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { AdminCard } from '@/components/admin/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DSRRequest {
  id: string
  type: 'export' | 'delete' | 'pause' | 'search'
  userId: string
  userEmail: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  requestedAt: string
  completedAt?: string
  data?: any
}

export default function DSRWizardPage() {
  const [searchEmail, setSearchEmail] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [dsrRequests, setDsrRequests] = useState<DSRRequest[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    loadDSRRequests()
  }, [])

  const loadDSRRequests = async () => {
    try {
      const response = await fetch('/api/admin/gdpr/dsr-requests')
      if (response.ok) {
        const data = await response.json()
        setDsrRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Error loading DSR requests:', error)
    }
  }

  const searchUser = async () => {
    if (!searchEmail.trim()) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/gdpr/search-user?email=${encodeURIComponent(searchEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users || [])
      }
    } catch (error) {
      console.error('Error searching user:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const createDSRRequest = async (type: 'export' | 'delete' | 'pause', userId: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/gdpr/dsr-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          userId,
          reason: `GDPR ${type} request via admin panel`
        })
      })

      if (response.ok) {
        await loadDSRRequests()
        alert(`${type} request created successfully`)
      }
    } catch (error) {
      console.error('Error creating DSR request:', error)
      alert('Failed to create DSR request')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <AdminPageLayout 
      title="🛡️ GDPR DSR Wizard" 
      description="Data Subject Request management for GDPR compliance"
      headerColor="red"
    >
      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Søk Bruker</TabsTrigger>
          <TabsTrigger value="requests">DSR-forespørsler</TabsTrigger>
          <TabsTrigger value="retention">Bevaringspolicy</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <AdminCard color="white" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Søk etter Bruker
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-search">E-postadresse</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="email-search"
                    type="email"
                    placeholder="bruker@example.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={searchUser} disabled={isProcessing}>
                    {isProcessing ? 'Søker...' : 'Søk'}
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Søkeresultater:</h4>
                  {searchResults.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="font-medium">{user.name || 'Ukjent navn'}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">Rolle: {user.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => createDSRRequest('export', user.id)}
                            disabled={isProcessing}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Eksporter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => createDSRRequest('delete', user.id)}
                            disabled={isProcessing}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Slett
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => createDSRRequest('pause', user.id)}
                            disabled={isProcessing}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <AdminCard color="white" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              DSR-forespørsler
            </h3>
            
            <div className="space-y-3">
              {dsrRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Ingen DSR-forespørsler funnet
                </div>
              ) : (
                dsrRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <p className="font-medium capitalize">{request.type} Request</p>
                          <p className="text-sm text-gray-600">{request.userEmail}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.requestedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        {request.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Last ned
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <AdminCard color="white" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Bevaringspolicy
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Regningsvedlegg</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bevaringsperiode:</span>
                        <span className="font-medium">7 år</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-600">Automatisk sletting: 2028</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Audit Logger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bevaringsperiode:</span>
                        <span className="font-medium">3 år</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <p className="text-xs text-gray-600">Automatisk sletting: 2026</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Automatiske Oppgaver</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Daglig sjekk av utløpte data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Ukentlig rapport til admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Månedlig GDPR-compliance sjekk</span>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AdminCard color="white" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-orange-600" />
              GDPR Audit Log
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Eksporter denne måned</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">3</p>
                  <p className="text-sm text-gray-600">Slettinger denne måned</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                  <p className="text-sm text-gray-600">Pauser denne måned</p>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>Alle GDPR-handlinger logges automatisk for compliance og revisjon.</p>
                <p className="mt-2">
                  <strong>Neste automatiske sjekk:</strong> {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}
                </p>
              </div>
            </div>
          </AdminCard>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  )
}
