'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mail, 
  Plus, 
  Send, 
  Eye,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  subject: string
  templateId: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  recipientCount: number
  sentCount: number
  openRate: number
  clickRate: number
  scheduledAt?: string
  sentAt?: string
  createdAt: string
}

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    templateId: '',
    scheduledAt: ''
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      // Mock data for now
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Velkommen til Pengeplan 2.0',
          subject: 'Velkommen til Pengeplan 2.0! 🎉',
          templateId: 'welcome-template',
          status: 'sent',
          recipientCount: 150,
          sentCount: 150,
          openRate: 45.2,
          clickRate: 12.8,
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Venteliste Invitasjoner',
          subject: 'Din invitasjon til Pengeplan 2.0 er klar! 🚀',
          templateId: 'invitation-template',
          status: 'sending',
          recipientCount: 50,
          sentCount: 23,
          openRate: 0,
          clickRate: 0,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Månedlig Nyhetsbrev',
          subject: 'Pengeplan Nyhetsbrev - Januar 2025',
          templateId: 'newsletter-template',
          status: 'draft',
          recipientCount: 0,
          sentCount: 0,
          openRate: 0,
          clickRate: 0,
          createdAt: new Date().toISOString()
        }
      ]
      setCampaigns(mockCampaigns)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    try {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: formData.name,
        subject: formData.subject,
        templateId: formData.templateId,
        status: 'draft',
        recipientCount: 0,
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        scheduledAt: formData.scheduledAt || undefined,
        createdAt: new Date().toISOString()
      }
      
      setCampaigns([newCampaign, ...campaigns])
      setShowCreateForm(false)
      setFormData({ name: '', subject: '', templateId: '', scheduledAt: '' })
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const handleSendCampaign = async (campaignId: string) => {
    if (confirm('Er du sikker på at du vil sende denne kampanjen?')) {
      setCampaigns(campaigns.map(campaign =>
        campaign.id === campaignId
          ? { ...campaign, status: 'sending' as const }
          : campaign
      ))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Kladd</Badge>
      case 'scheduled':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Planlagt</Badge>
      case 'sending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><Send className="h-3 w-3 mr-1" />Sender</Badge>
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Sendt</Badge>
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Feilet</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laster kampanjer...</p>
        </div>
      </div>
    )
  }

  const totalRecipients = campaigns.reduce((sum, campaign) => sum + campaign.recipientCount, 0)
  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0)
  const avgOpenRate = campaigns.length > 0 
    ? campaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / campaigns.length 
    : 0
  const avgClickRate = campaigns.length > 0 
    ? campaigns.reduce((sum, campaign) => sum + campaign.clickRate, 0) / campaigns.length 
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">E-post Kampanjer</h1>
        <p className="text-gray-600">Administrer og send e-post kampanjer til dine abonnenter</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totalt Mottakere</p>
                <p className="text-2xl font-bold text-gray-900">{totalRecipients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sendt</p>
                <p className="text-2xl font-bold text-gray-900">{totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gjennomsnittlig Åpningsrate</p>
                <p className="text-2xl font-bold text-gray-900">{avgOpenRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gjennomsnittlig Klikkrate</p>
                <p className="text-2xl font-bold text-gray-900">{avgClickRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Opprett Ny Kampanje
        </Button>
      </div>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Opprett Ny Kampanje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Kampanje Navn</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="F.eks. Velkommen til Pengeplan 2.0"
              />
            </div>
            
            <div>
              <Label htmlFor="subject">E-post Emne</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="F.eks. Velkommen til Pengeplan 2.0! 🎉"
              />
            </div>
            
            <div>
              <Label htmlFor="templateId">Velg Mal</Label>
              <select
                id="templateId"
                value={formData.templateId}
                onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="">Velg mal...</option>
                <option value="welcome-template">Velkommen Mal</option>
                <option value="invitation-template">Invitasjon Mal</option>
                <option value="newsletter-template">Nyhetsbrev Mal</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="scheduledAt">Planlegg Sending (valgfritt)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleCreateCampaign}
                className="bg-gradient-to-r from-violet-600 to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Opprett Kampanje
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setFormData({ name: '', subject: '', templateId: '', scheduledAt: '' })
                }}
              >
                Avbryt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Alle Kampanjer</TabsTrigger>
          <TabsTrigger value="draft">Kladder</TabsTrigger>
          <TabsTrigger value="sent">Sendt</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Emne:</strong> {campaign.subject}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{campaign.recipientCount}</p>
                          <p className="text-sm text-gray-600">Mottakere</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{campaign.sentCount}</p>
                          <p className="text-sm text-gray-600">Sendt</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{campaign.openRate.toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">Åpningsrate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{campaign.clickRate.toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">Klikkrate</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Opprettet: {new Date(campaign.createdAt).toLocaleDateString('nb-NO')}
                        {campaign.sentAt && (
                          <span className="ml-4">
                            Sendt: {new Date(campaign.sentAt).toLocaleDateString('nb-NO')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Forhåndsvis
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleSendCampaign(campaign.id)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Statistikk
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="grid gap-6">
            {campaigns.filter(c => c.status === 'draft').map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Forhåndsvis
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleSendCampaign(campaign.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sent">
          <div className="grid gap-6">
            {campaigns.filter(c => c.status === 'sent').map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.subject}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          {campaign.sentCount} av {campaign.recipientCount} sendt
                        </span>
                        <span className="text-sm text-gray-500">
                          Åpningsrate: {campaign.openRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Statistikk
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


