'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Database, 
  Users, 
  Shield, 
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2,
  Edit
} from 'lucide-react'

interface DatabaseStats {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  databaseSize: string
  lastBackup: string
}

interface User {
  id: string
  email: string
  name: string
  role: string
  status: string
  createdAt: string
  lastLoginAt?: string
}

export default function DatabaseAccessPage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchDatabaseData()
  }, [])

  const fetchDatabaseData = async () => {
    try {
      setLoading(true)
      // Mock data for now
      const mockStats: DatabaseStats = {
        totalUsers: 150,
        activeUsers: 120,
        totalSessions: 45,
        databaseSize: '2.4 GB',
        lastBackup: new Date().toISOString()
      }

      const mockUsers: User[] = [
        {
          id: '1',
          email: 'cato@catohansen.no',
          name: 'Cato Hansen',
          role: 'SUPERADMIN',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'admin@test.no',
          name: 'Test Admin',
          role: 'ADMIN',
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]

      setStats(mockStats)
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching database data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return <Badge variant="default" className="bg-red-100 text-red-800"><Shield className="h-3 w-3 mr-1" />Super Admin</Badge>
      case 'ADMIN':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Admin</Badge>
      case 'GUARDIAN':
        return <Badge variant="default" className="bg-green-100 text-green-800">Verge</Badge>
      case 'USER':
        return <Badge variant="outline">Bruker</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aktiv</Badge>
      case 'INACTIVE':
        return <Badge variant="secondary">Inaktiv</Badge>
      case 'SUSPENDED':
        return <Badge variant="destructive">Suspender</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laster database data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Access</h1>
        <p className="text-gray-600">Super Admin database tilgang og administrasjon</p>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totalt Brukere</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktive Brukere</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Database Størrelse</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.databaseSize || '0 GB'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Siste Backup</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats?.lastBackup ? new Date(stats.lastBackup).toLocaleDateString('nb-NO') : 'Ukjent'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={fetchDatabaseData}
            className="bg-gradient-to-r from-violet-600 to-purple-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Oppdater Data
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Eksporter Database
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          Sist oppdatert: {new Date().toLocaleString('nb-NO')}
        </div>
      </div>

      {/* Database Tables */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Brukere</TabsTrigger>
          <TabsTrigger value="sessions">Sesjoner</TabsTrigger>
          <TabsTrigger value="logs">Logg</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Brukere ({filteredUsers.length})</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Søk brukere..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        <div>Opprettet: {new Date(user.createdAt).toLocaleDateString('nb-NO')}</div>
                        {user.lastLoginAt && (
                          <div>Sist innlogget: {new Date(user.lastLoginAt).toLocaleDateString('nb-NO')}</div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Se
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Rediger
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Aktive Sesjoner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sesjoner</h3>
                <p className="text-gray-600">Aktive brukersesjoner vises her</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">System Logg</h3>
                <p className="text-gray-600">System og sikkerhetslogg vises her</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Backup Management</h3>
                <p className="text-gray-600">Database backup og gjenoppretting</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


