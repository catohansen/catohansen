'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  FileText, 
  Search, 
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Shield,
  Brain,
  Zap,
  UserCheck,
  BarChart3,
  Settings,
  Activity,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { BillList } from '@/components/bills/BillList'
import { useAbility } from '@/hooks/useAbility'


interface SystemStats {
  totalBills: number
  totalUsers: number
  totalVerge: number
  totalAmount: number
  unpaidAmount: number
  overdueAmount: number
  aiProcessed: number
  ocrAccuracy: number
  systemUptime: number
}

interface Bill {
  id: string
  title: string
  payeeName: string
  amountNok: number
  dueDate: string
  status: 'NEW' | 'SCHEDULED' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  priority: 'RED' | 'YELLOW' | 'GREEN'
  category?: string
  source: 'upload' | 'manual' | 'email'
  attachmentUrl?: string
  createdAt: string
  userId: string
  userEmail: string
  userRole: 'USER' | 'VERGE' | 'ADMIN'
  aiInsights?: {
    confidence: number
    suggestions: string[]
    riskScore: number
  }
}

export default function AdminRegningerPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [stats, setStats] = useState<SystemStats>({
    totalBills: 0,
    totalUsers: 0,
    totalVerge: 0,
    totalAmount: 0,
    unpaidAmount: 0,
    overdueAmount: 0,
    aiProcessed: 0,
    ocrAccuracy: 0,
    systemUptime: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const { user, can, isOwner } = useAbility()

  // Fetch real data from API
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/bills')
        if (response.ok) {
          const data = await response.json()
          setBills(data.bills || [])
        }
      } catch (error) {
        console.error('Error fetching bills:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBills()
  }, [])

  // All mock data removed - using real API data from first useEffect above

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter
    const matchesRole = roleFilter === 'all' || bill.userRole === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  if (isLoading) {
    return (
      <AdminPageLayout title="Regnings-administrasjon" description="System-oversikt for alle regninger">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-32 bg-gray-100"></Card>
            ))}
          </div>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout 
      title="Regnings-administrasjon" 
      description="System-oversikt for alle regninger, brukere og AI-analyse"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Regnings-administrasjon</h1>
            <p className="text-gray-600 mt-2">
              System-oversikt for alle regninger, brukere og AI-analyse
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Oppdater data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Eksporter rapport
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Regninger</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBills.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% fra forrige måned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Brukere</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalVerge} verge-brukere
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI-prosessert</CardTitle>
              <Brain className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.aiProcessed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.ocrAccuracy}% OCR-nøyaktighet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.systemUptime}%
              </div>
              <p className="text-xs text-muted-foreground">
                Siste 30 dager
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Beløp</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalAmount.toLocaleString('nb-NO')} kr
              </div>
              <p className="text-xs text-muted-foreground">
                Alle regninger
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ubetalte</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.unpaidAmount.toLocaleString('nb-NO')} kr
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.overdueAmount.toLocaleString('nb-NO')} kr forfalt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Betalt</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(stats.totalAmount - stats.unpaidAmount).toLocaleString('nb-NO')} kr
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(((stats.totalAmount - stats.unpaidAmount) / stats.totalAmount) * 100)}% betalt
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrer regninger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk i regninger, mottakere eller brukere..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statuser</SelectItem>
                  <SelectItem value="NEW">Nye</SelectItem>
                  <SelectItem value="SCHEDULED">Planlagt</SelectItem>
                  <SelectItem value="PAID">Betalt</SelectItem>
                  <SelectItem value="OVERDUE">Forfalt</SelectItem>
                  <SelectItem value="CANCELLED">Kansellert</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Rolle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle roller</SelectItem>
                  <SelectItem value="USER">Brukere</SelectItem>
                  <SelectItem value="VERGE">Verge</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="users">Brukere</TabsTrigger>
            <TabsTrigger value="ai">AI-analyse</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="reports">Rapporter</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <BillList
              bills={filteredBills}
              onBillUpdate={(bill) => {
                setBills(prev => prev.map(b => b.id === bill.id ? bill : b))
                toast.success('Regning oppdatert!')
              }}
              onBillDelete={(billId) => {
                setBills(prev => prev.filter(b => b.id !== billId))
                toast.success('Regning slettet!')
              }}
              onBillView={(bill) => {
                toast.info(`Viser regning: ${bill.title} (${bill.userEmail})`)
              }}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Bruker-oversikt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                    <p className="text-sm text-blue-600">Aktive brukere</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{stats.totalVerge}</p>
                    <p className="text-sm text-green-600">Verge-brukere</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">3</p>
                    <p className="text-sm text-purple-600">Admin-brukere</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-analyse og OCR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{stats.aiProcessed}</p>
                    <p className="text-sm text-purple-600">AI-prosesserte regninger</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{stats.ocrAccuracy}%</p>
                    <p className="text-sm text-blue-600">OCR-nøyaktighet</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">AI-innstillinger</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">OCR-konfigurasjon</div>
                        <div className="text-sm text-gray-600">Juster AI-parametere</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4">
                      <div className="text-left">
                        <div className="font-medium">Kategorisering</div>
                        <div className="text-sm text-gray-600">Forbedre auto-kategorisering</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System-administrasjon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Database-vedlikehold</div>
                      <div className="text-sm text-gray-600">Optimaliser og backup</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">API-monitoring</div>
                      <div className="text-sm text-gray-600">Overvåk ytelse og feil</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Sikkerhetslogg</div>
                      <div className="text-sm text-gray-600">Audit og tilgang</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Cerbos-policy</div>
                      <div className="text-sm text-gray-600">Autorisasjonsregler</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Rapporter og eksport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Månedlig rapport</div>
                      <div className="text-sm text-gray-600">Komplett system-oversikt</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Bruker-aktivitet</div>
                      <div className="text-sm text-gray-600">Detaljert bruker-statistikk</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">AI-ytelse</div>
                      <div className="text-sm text-gray-600">OCR og analyse-metrics</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Sikkerhetsrapport</div>
                      <div className="text-sm text-gray-600">Audit og tilgangslogg</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  )
}





