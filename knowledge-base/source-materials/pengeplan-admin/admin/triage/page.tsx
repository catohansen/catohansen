'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Eye,
  Edit,
  Filter,
  Search,
  Target,
  FileText,
  Shield,
  Activity,
  RefreshCw,
  Download
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { BillTriageKanban } from '@/components/triage/BillTriageKanban'
import { useAbility } from '@/hooks/useAbility'


interface SystemStats {
  totalBills: number
  totalUsers: number
  totalVerge: number
  redBills: number
  yellowBills: number
  greenBills: number
  completedBills: number
  aiProcessed: number
  systemUptime: number
}

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'VERGE' | 'ADMIN'
  status: 'active' | 'inactive' | 'pending'
  totalBills: number
  unpaidBills: number
  overdueBills: number
  lastActive: string
}

export default function AdminTriagePage() {
  const [stats, setStats] = useState<SystemStats>({
    totalBills: 0,
    totalUsers: 0,
    totalVerge: 0,
    redBills: 0,
    yellowBills: 0,
    greenBills: 0,
    completedBills: 0,
    aiProcessed: 0,
    systemUptime: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { user, can, isOwner } = useAbility()

  // Mock data for development
  useEffect(() => {
    const mockStats: SystemStats = {
      totalBills: 1247,
      totalUsers: 1200,
      totalVerge: 45,
      redBills: 89,
      yellowBills: 234,
      greenBills: 567,
      completedBills: 357,
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
        totalBills: 12,
        unpaidBills: 3,
        overdueBills: 1,
        lastActive: '2024-01-25'
      },
      {
        id: '2',
        name: 'Erik Hansen',
        email: 'erik@example.no',
        role: 'USER',
        status: 'active',
        totalBills: 8,
        unpaidBills: 2,
        overdueBills: 0,
        lastActive: '2024-01-24'
      },
      {
        id: '3',
        name: 'Maria Johansen',
        email: 'maria@example.no',
        role: 'VERGE',
        status: 'active',
        totalBills: 45,
        unpaidBills: 12,
        overdueBills: 3,
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
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  if (isLoading) {
    return (
      <AdminPageLayout title="Triage-administrasjon" description="System-oversikt for regnings-triage">
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
      title="Triage-administrasjon" 
      description="System-oversikt for regnings-triage og prioritet"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Triage-administrasjon</h1>
            <p className="text-gray-600 mt-2">
              System-oversikt for regnings-triage og prioritet
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
                {stats.aiProcessed} AI-prosesserte
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Røde Regninger</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.redBills}</div>
              <p className="text-xs text-muted-foreground">
                Krever umiddelbar oppmerksomhet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gule Regninger</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.yellowBills}</div>
              <p className="text-xs text-muted-foreground">
                Håndteres denne uken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grønne Regninger</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.greenBills}</div>
              <p className="text-xs text-muted-foreground">
                Kan vente litt
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Priority Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <CardTitle className="text-sm font-medium">Fullførte</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedBills}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.completedBills / stats.totalBills) * 100)}% av totalen
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle statuser</SelectItem>
                  <SelectItem value="active">Aktive</SelectItem>
                  <SelectItem value="inactive">Inaktive</SelectItem>
                  <SelectItem value="pending">Ventende</SelectItem>
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
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-lg font-bold text-blue-600">{user.totalBills}</p>
                        <p className="text-xs text-blue-600">Total</p>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        <p className="text-lg font-bold text-yellow-600">{user.unpaidBills}</p>
                        <p className="text-xs text-yellow-600">Ubetalte</p>
                      </div>
                      <div className="p-2 bg-red-50 rounded">
                        <p className="text-lg font-bold text-red-600">{user.overdueBills}</p>
                        <p className="text-xs text-red-600">Forfalt</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Se regninger
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Triage Kanban */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              System Triage-oversikt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BillTriageKanban />
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
                  <div className="text-sm text-gray-600">Juster triage-algoritmer</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">System-rapporter</div>
                  <div className="text-sm text-gray-600">Generer triage-analyser</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Bruker-administrasjon</div>
                  <div className="text-sm text-gray-600">Administrer tilganger</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
















