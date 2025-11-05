'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  TrendingUp,
  AlertTriangle,
  Target,
  Brain,
  BarChart3,
  LineChart,
  Eye,
  Download,
  Shield,
  Activity,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { CashFlowTimeline } from '@/components/cashflow/CashFlowTimeline'
import { useAbility } from '@/hooks/useAbility'


interface SystemStats {
  totalUsers: number
  totalVerge: number
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  highRiskUsers: number
  criticalGaps: number
  aiProcessed: number
  systemUptime: number
}

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'VERGE' | 'ADMIN'
  status: 'active' | 'inactive' | 'pending'
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  projectedBalance: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lastActive: string
}

export default function AdminKontantstrømPage() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalVerge: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0,
    highRiskUsers: 0,
    criticalGaps: 0,
    aiProcessed: 0,
    systemUptime: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const { user, can, isOwner } = useAbility()

  // Mock data for development
  useEffect(() => {
    const mockStats: SystemStats = {
      totalUsers: 1200,
      totalVerge: 45,
      totalIncome: 54000000,
      totalExpenses: 48000000,
      netCashFlow: 6000000,
      highRiskUsers: 89,
      criticalGaps: 23,
      aiProcessed: 890,
      systemUptime: 99.9
    }

    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Anna Solberg',
        email: 'anna@example.no',
        role: 'USER',
        status: 'active',
        totalIncome: 45000,
        totalExpenses: 15000,
        netCashFlow: 30000,
        projectedBalance: 25000,
        riskLevel: 'low',
        lastActive: '2024-01-25'
      },
      {
        id: '2',
        name: 'Erik Hansen',
        email: 'erik@example.no',
        role: 'USER',
        status: 'active',
        totalIncome: 35000,
        totalExpenses: 32000,
        netCashFlow: 3000,
        projectedBalance: -2000,
        riskLevel: 'high',
        lastActive: '2024-01-24'
      },
      {
        id: '3',
        name: 'Maria Johansen',
        email: 'maria@example.no',
        role: 'VERGE',
        status: 'active',
        totalIncome: 28000,
        totalExpenses: 25000,
        netCashFlow: 3000,
        projectedBalance: 1000,
        riskLevel: 'medium',
        lastActive: '2024-01-23'
      }
    ]
    
    setTimeout(() => {
      setStats(mockStats)
      setUsers(mockUsers)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter
    return matchesSearch && matchesRole && matchesRisk
  })

  if (isLoading) {
    return (
      <AdminPageLayout title="Kontantstrøm-administrasjon" description="System-oversikt for kontantstrøm og gap-analyse">
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
      title="Kontantstrøm-administrasjon" 
      description="System-oversikt for kontantstrøm og gap-analyse"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kontantstrøm-administrasjon</h1>
            <p className="text-gray-600 mt-2">
              System-oversikt for kontantstrøm og gap-analyse
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
              <CardTitle className="text-sm font-medium">Total Brukere</CardTitle>
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
              <CardTitle className="text-sm font-medium">Total Inntekt</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(stats.totalIncome / 1000000).toFixed(1)}M kr
              </div>
              <p className="text-xs text-muted-foreground">
                Alle brukere
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Netto Kontantstrøm</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(stats.netCashFlow / 1000000).toFixed(1)}M kr
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.netCashFlow > 0 ? 'Positiv' : 'Negativ'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Høy Risiko</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highRiskUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.criticalGaps} kritiske gaps
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Kontantstrøm-analyser
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gjennomsnitt</CardTitle>
              <Target className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {(stats.netCashFlow / stats.totalUsers).toLocaleString('nb-NO')} kr
              </div>
              <p className="text-xs text-muted-foreground">
                Per bruker
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrer brukere
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Søk i brukere..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
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

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Risiko" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle risikonivåer</SelectItem>
                  <SelectItem value="low">Lav</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">Høy</SelectItem>
                  <SelectItem value="critical">Kritisk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Bruker-oversikt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                        >
                          {user.status}
                        </Badge>
                        <Badge variant="outline">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>{user.email}</p>
                      <p>Sist aktiv: {new Date(user.lastActive).toLocaleDateString('nb-NO')}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-lg font-bold text-green-600">
                          {user.totalIncome.toLocaleString('nb-NO')}
                        </p>
                        <p className="text-xs text-green-600">Inntekt</p>
                      </div>
                      <div className="p-2 bg-red-50 rounded">
                        <p className="text-lg font-bold text-red-600">
                          {user.totalExpenses.toLocaleString('nb-NO')}
                        </p>
                        <p className="text-xs text-red-600">Utgifter</p>
                      </div>
                    </div>
                    
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-lg font-bold text-blue-600">
                        {user.netCashFlow.toLocaleString('nb-NO')} kr
                      </p>
                      <p className="text-xs text-blue-600">Netto kontantstrøm</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline"
                        className={
                          user.riskLevel === 'high' || user.riskLevel === 'critical' 
                            ? 'text-red-600 border-red-200' 
                            : user.riskLevel === 'medium'
                            ? 'text-yellow-600 border-yellow-200'
                            : 'text-green-600 border-green-200'
                        }
                      >
                        {user.riskLevel}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              System Kontantstrøm-oversikt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowTimeline />
          </CardContent>
        </Card>

        {/* Admin Controls */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Shield className="h-5 w-5" />
              Admin-kontroller
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">AI-konfigurasjon</div>
                  <div className="text-sm text-gray-600">Juster prognose-algoritmer</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">System-rapporter</div>
                  <div className="text-sm text-gray-600">Generer kontantstrøm-analyser</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Risiko-monitoring</div>
                  <div className="text-sm text-gray-600">Overvåk kritiske gaps</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}





