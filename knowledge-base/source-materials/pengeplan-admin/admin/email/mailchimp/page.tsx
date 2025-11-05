'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mail, 
  Users, 
  BarChart3, 
  Settings, 
  Send,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react'

interface MailchimpStats {
  totalSubscribers: number
  activeSubscribers: number
  unsubscribed: number
  bounced: number
  recentSubscribers: number
  openRate: number
  clickRate: number
}

interface Subscriber {
  id: string
  email: string
  name?: string
  status: string
  tags: string[]
  subscribedAt: string
  lastActivity?: string
}

export default function MailchimpAdminPage() {
  const [stats, setStats] = useState<MailchimpStats | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [syncLoading, setSyncLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    fetchMailchimpData()
  }, [])

  const fetchMailchimpData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/mailchimp/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data.stats)
        setSubscribers(data.data.subscribers)
      }
    } catch (error) {
      console.error('Error fetching Mailchimp data:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncWithMailchimp = async () => {
    try {
      setSyncLoading(true)
      const response = await fetch('/api/admin/mailchimp/sync', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        await fetchMailchimpData()
        alert('Synkronisering fullført!')
      } else {
        alert('Feil ved synkronisering: ' + data.error)
      }
    } catch (error) {
      console.error('Sync error:', error)
      alert('Feil ved synkronisering')
    } finally {
      setSyncLoading(false)
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'subscribed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aktiv</Badge>
      case 'unsubscribed':
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Avmeldt</Badge>
      case 'bounced':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Bounce</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laster Mailchimp data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mailchimp Administrasjon</h1>
        <p className="text-gray-600">Administrer nyhetsbrev og abonnenter</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totalt Abonnenter</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalSubscribers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktive</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeSubscribers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Åpningsrate</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.openRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Klikkrate</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.clickRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={syncWithMailchimp}
            disabled={syncLoading}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncLoading ? 'animate-spin' : ''}`} />
            {syncLoading ? 'Synkroniserer...' : 'Synkroniser med Mailchimp'}
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Eksporter Abonnenter
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          Sist oppdatert: {new Date().toLocaleString('nb-NO')}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscribers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscribers">Abonnenter</TabsTrigger>
          <TabsTrigger value="campaigns">Kampanjer</TabsTrigger>
          <TabsTrigger value="settings">Innstillinger</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Abonnenter ({filteredSubscribers.length})</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      placeholder="Søk abonnenter..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {subscriber.name ? subscriber.name.charAt(0).toUpperCase() : subscriber.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{subscriber.name || 'Ukjent navn'}</p>
                        <p className="text-sm text-gray-600">{subscriber.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {subscriber.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(subscriber.status)}
                      
                      <div className="text-sm text-gray-500">
                        {new Date(subscriber.subscribedAt).toLocaleDateString('nb-NO')}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          Se detaljer
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Send className="h-4 w-4 mr-1" />
                          Send e-post
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Kampanjer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen kampanjer ennå</h3>
                <p className="text-gray-600 mb-4">Opprett din første e-post kampanje</p>
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                  <Send className="h-4 w-4 mr-2" />
                  Opprett Kampanje
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Mailchimp Innstillinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="apiKey">API Nøkkel</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Mailchimp API nøkkel"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="serverPrefix">Server Prefix</Label>
                <Input
                  id="serverPrefix"
                  placeholder="Server prefix (f.eks. us1, us2)"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="listId">Liste ID</Label>
                <Input
                  id="listId"
                  placeholder="Mailchimp liste ID"
                  className="mt-1"
                />
              </div>
              
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                <Settings className="h-4 w-4 mr-2" />
                Lagre Innstillinger
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


