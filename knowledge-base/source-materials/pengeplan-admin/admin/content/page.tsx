'use client'

import { useState, useEffect } from 'react'
import { useAdminPage } from '@/contexts/AdminPageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancedTabs, TabsContent } from '@/components/ui/EnhancedTabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Mail, 
  Database, 
  FileText, 
  Edit, 
  Plus, 
  Search, 
  Filter,
  Upload,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Globe,
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Lock,
  Star,
  Heart,
  MessageSquare,
  Send,
  Archive,
  Tag,
  Calendar,
  User,
  Bell,
  Target,
  Info
} from 'lucide-react'

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [contentItems, setContentItems] = useState<any[]>([])
  const { setPageInfo, resetPageInfo } = useAdminPage()

  useEffect(() => {
    // Set page info for top bar
    setPageInfo(
      'Innhold & Kommunikasjon',
      'Administrer kunnskapsbase, e-post og data',
      <BookOpen className="h-5 w-5 text-white" />
    )
    
    // Cleanup function to reset when leaving page
    return () => {
      resetPageInfo()
    }
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
      setContentItems([
        {
          id: 1,
          title: 'Velkommen til Pengeplan 2.0',
          type: 'article',
          status: 'published',
          author: 'Cato Hansen',
          createdAt: '2024-01-15',
          views: 1250,
          category: 'Getting Started'
        },
        {
          id: 2,
          title: 'Hvordan sette opp budsjett',
          type: 'guide',
          status: 'draft',
          author: 'AI Assistant',
          createdAt: '2024-01-20',
          views: 890,
          category: 'Tutorials'
        },
        {
          id: 3,
          title: 'Sikkerhet og personvern',
          type: 'policy',
          status: 'published',
          author: 'Legal Team',
          createdAt: '2024-01-10',
          views: 2100,
          category: 'Legal'
        }
      ])
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster innhold...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Totalt Innhold</p>
                  <p className="text-2xl font-bold text-violet-600">1,247</p>
                </div>
                <FileText className="h-8 w-8 text-violet-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+12%</span>
                <span className="text-sm text-gray-500 ml-2">fra forrige måned</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktive Artikler</p>
                  <p className="text-2xl font-bold text-blue-600">892</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+8%</span>
                <span className="text-sm text-gray-500 ml-2">fra forrige måned</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">E-post Sendt</p>
                  <p className="text-2xl font-bold text-green-600">15,420</p>
                </div>
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+23%</span>
                <span className="text-sm text-gray-500 ml-2">fra forrige måned</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Oppbevaret</p>
                  <p className="text-2xl font-bold text-orange-600">2.4 TB</p>
                </div>
                <Database className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">+5%</span>
                <span className="text-sm text-gray-500 ml-2">fra forrige måned</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <EnhancedTabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
          tabs={[
            { 
              value: 'overview', 
              label: 'Oversikt', 
              icon: <BarChart3 className="h-4 w-4" />, 
              color: 'blue' 
            },
            { 
              value: 'content', 
              label: 'Innhold', 
              icon: <FileText className="h-4 w-4" />, 
              color: 'purple' 
            },
            { 
              value: 'email', 
              label: 'E-post', 
              icon: <Mail className="h-4 w-4" />, 
              color: 'green' 
            },
            { 
              value: 'data', 
              label: 'Data', 
              icon: <Database className="h-4 w-4" />, 
              color: 'orange' 
            }
          ]}
        >

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Innhold Statistikk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Artikler publisert</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Guider opprettet</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Policies oppdatert</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Totalt visninger</span>
                      <span className="font-semibold">4,250</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Siste Aktivitet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Ny artikkel publisert</span>
                      <span className="text-xs text-gray-500 ml-auto">2 timer siden</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">E-post kampanje sendt</span>
                      <span className="text-xs text-gray-500 ml-auto">5 timer siden</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Data backup fullført</span>
                      <span className="text-xs text-gray-500 ml-auto">1 dag siden</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-violet-600" />
                    Innholdshåndtering
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Søk innhold..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Nytt Innhold
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.category} • {item.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {item.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{item.views} visninger</span>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  E-post Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Sendt i dag</h3>
                    <p className="text-2xl font-bold text-green-600">1,250</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Åpningsrate</h3>
                    <p className="text-2xl font-bold text-blue-600">24.5%</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Klikkrate</h3>
                    <p className="text-2xl font-bold text-purple-600">8.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Lagringsbruk</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Brukerdata</span>
                        <span className="text-sm font-medium">1.2 TB</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="flex justify-between">
                        <span className="text-sm">Innhold</span>
                        <span className="text-sm font-medium">0.8 TB</span>
                      </div>
                      <Progress value={40} className="h-2" />
                      <div className="flex justify-between">
                        <span className="text-sm">Backups</span>
                        <span className="text-sm font-medium">0.4 TB</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Siste Backups</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Full Backup</span>
                        <Badge className="bg-green-100 text-green-800">Success</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Incremental</span>
                        <Badge className="bg-green-100 text-green-800">Success</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </EnhancedTabs>
    </div>
  )
}
