'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Plus, 
  Calendar,
  MoreHorizontal,
  UserCheck,
  Key,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  MapPin,
  Building
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { AdminCard } from '@/components/admin/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface User {
  id: string
  email: string
  name: string
  role: string
  status: string
  plan: string
  mustChangePassword: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  phone?: string
  address?: string
  postalCode?: string
  city?: string
  country?: string
  bank?: string
  birthDate?: string
  emailVerified?: boolean
  profile?: any
  sessions?: any[]
  notifications?: any[]
}

export default function AdminUsers() {
  const [mounted, setMounted] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showUserActionsModal, setShowUserActionsModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: string, data?: any) => {
    setActionLoading(userId)
    setError(null)
    setSuccess(null)

    try {
      let response: Response
      
      switch (action) {
        case 'reset-password':
          response = await fetch(`/api/admin/users/${userId}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data || {})
          })
          break
        case 'change-role':
          response = await fetch(`/api/admin/users/${userId}/change-role`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data || {})
          })
          break
        case 'delete':
          response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
          })
          break
        case 'export':
          response = await fetch(`/api/gdpr/export`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
          })
          break
        default:
          throw new Error('Invalid action')
      }

      if (response.ok) {
        const result = await response.json()
        setSuccess(result.message || 'Action completed successfully')
        await loadUsers() // Refresh users list
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Action failed')
      }
    } catch (error) {
      console.error('Error performing action:', error)
      setError('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedUsers.length === 0) {
      setError('No users selected')
      return
    }

    setActionLoading('bulk')
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userIds: selectedUsers,
          data
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSuccess(`Bulk action completed: ${result.processed} users processed`)
        setSelectedUsers([])
        await loadUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Bulk action failed')
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      setError('Bulk action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id))
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  const filterUsers = () => {
    let filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const exportUsers = () => {
    const csvContent = [
      ['Navn', 'E-post', 'Rolle', 'Status', 'Plan', 'Opprettet', 'Siste innlogging'].join(','),
      ...filteredUsers.map(user => [
        user.name || '',
        user.email,
        user.role,
        user.status,
        user.plan,
        new Date(user.createdAt).toLocaleDateString('nb-NO'),
        user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('nb-NO') : 'Aldri'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `brukere_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'destructive'
      case 'ADMIN':
        return 'default'
      case 'USER':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'SUSPENDED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('nb-NO')
  }

  useEffect(() => {
    setMounted(true)
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter, statusFilter])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  if (loading) {
    return (
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading users...</span>
          </div>
        </div>
    )
  }

  return (
    <AdminPageLayout 
      title="👥 Brukeradministrasjon" 
      description="Administrer alle brukere i Pengeplan 2.0"
      headerColor="blue"
    >
      {/* Search and Actions */}
      <AdminCard color="white" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Søk brukere..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-violet-200 focus:border-violet-400 focus:ring-violet-400"
              />
            </div>
            <Button variant="outline" onClick={loadUsers} disabled={loading} className="border-violet-200">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Oppdater
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setShowBulkActionsModal(true)}
                className="border-orange-200 text-orange-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Bulk Actions ({selectedUsers.length})
              </Button>
            )}
            <Button onClick={() => setShowAddUserModal(true)} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Legg til bruker
            </Button>
          </div>
        </div>
      </AdminCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminCard color="violet">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Totalt brukere</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </AdminCard>
        
        <AdminCard color="green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Aktive brukere</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'ACTIVE').length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </AdminCard>
        
        <AdminCard color="purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Administratorer</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'ADMIN' || u.role === 'SUPERADMIN').length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Key className="h-6 w-6 text-white" />
            </div>
          </div>
        </AdminCard>
        
        <AdminCard color="orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Nye denne måneden</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => {
                const created = new Date(u.createdAt)
                const now = new Date()
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
              }).length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Filters and Actions */}
      <AdminCard color="white" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Filtrer på rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle roller</SelectItem>
                <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">Bruker</SelectItem>
                <SelectItem value="VERGE">Verge</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Filtrer på status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statuser</SelectItem>
                <SelectItem value="ACTIVE">Aktiv</SelectItem>
                <SelectItem value="SUSPENDED">Suspendert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportUsers} className="bg-white border-gray-200 text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Eksporter
            </Button>
          </div>
        </div>
      </AdminCard>

      {/* Error/Success Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <AdminCard title={`👥 Brukere (${filteredUsers.length})`} color="white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">
                  <Checkbox 
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={(checked) => checked ? selectAllUsers() : clearSelection()}
                  />
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Bruker</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Rolle</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Plan</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Siste innlogging</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Opprettet</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Sist oppdatert</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-200">
                  <td className="py-4 px-4">
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.name || 'Ikke satt'}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      {user.mustChangePassword && (
                        <Badge variant="destructive" className="mt-1">Må endre passord</Badge>
                      )}
                      {user.emailVerified && (
                        <Badge variant="default" className="mt-1">E-post verifisert</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{user.plan}</td>
                  <td className="py-4 px-4 text-gray-600">{formatDate(user.lastLoginAt)}</td>
                  <td className="py-4 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="py-4 px-4 text-gray-600">{formatDate(user.updatedAt)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserDetailsModal(true)
                        }}
                        className="bg-white border-gray-200 text-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserActionsModal(true)
                        }}
                        className="bg-white border-gray-200 text-gray-700"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Smart Admin Insights */}
      <AdminCard color="purple" className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🎯 Brukeradministrasjon-innsikter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.filter(u => u.mustChangePassword).length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-600">🔒</span>
                <span className="font-medium text-gray-900">Passord-sikkerhet</span>
              </div>
              <p className="text-sm text-gray-600">
                {users.filter(u => u.mustChangePassword).length} bruker(e) må bytte passord. 
                Send påminnelse for økt sikkerhet.
              </p>
            </div>
          )}
          
          {users.filter(u => u.role === 'USER').length > 100 && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">📈</span>
                <span className="font-medium text-gray-900">Skaleringsanbefaling</span>
              </div>
              <p className="text-sm text-gray-600">
                {users.filter(u => u.role === 'USER').length}+ brukere! Vurder å implementere 
                automatiserte onboarding-prosesser.
              </p>
            </div>
          )}
          
          {users.filter(u => u.plan === 'free').length > users.length * 0.8 && (
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">💰</span>
                <span className="font-medium text-gray-900">Konverteringsmulighet</span>
              </div>
              <p className="text-sm text-gray-600">
                {Math.round((users.filter(u => u.plan === 'free').length / users.length) * 100)}% bruker gratis plan. 
                Lag kampanje for å øke konvertering til betalt.
              </p>
            </div>
          )}
        </div>
      </AdminCard>

      {/* User Details Modal */}
      {showUserDetailsModal && (
      <Dialog>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Brukerdetaljer</DialogTitle>
            <DialogDescription>
              Detaljert informasjon om {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Oversikt</TabsTrigger>
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="sessions">Sesjoner</TabsTrigger>
                <TabsTrigger value="activity">Aktivitet</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Navn</Label>
                    <p className="text-lg font-semibold">{selectedUser.name || 'Ikke satt'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">E-post</Label>
                    <p className="text-lg">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Rolle</Label>
                    <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge variant={getStatusBadgeVariant(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Plan</Label>
                    <p className="text-lg">{selectedUser.plan}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Siste innlogging</Label>
                    <p className="text-lg">{formatDate(selectedUser.lastLoginAt)}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Telefon</Label>
                    <p className="text-lg">{selectedUser.phone || 'Ikke satt'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Adresse</Label>
                    <p className="text-lg">{selectedUser.address || 'Ikke satt'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Postnummer</Label>
                    <p className="text-lg">{selectedUser.postalCode || 'Ikke satt'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">By</Label>
                    <p className="text-lg">{selectedUser.city || 'Ikke satt'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Land</Label>
                    <p className="text-lg">{selectedUser.country || 'Ikke satt'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bank</Label>
                    <p className="text-lg">{selectedUser.bank || 'Ikke satt'}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sessions" className="space-y-4">
                <div className="space-y-2">
                  {selectedUser.sessions?.map((session: any) => (
                    <div key={session.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Sesjon {session.id.slice(0, 8)}...</p>
                          <p className="text-sm text-gray-600">
                            Opprettet: {new Date(session.createdAt).toLocaleString('nb-NO')}
                          </p>
                        </div>
                        <Badge variant={session.rememberMe ? 'default' : 'secondary'}>
                          {session.rememberMe ? 'Husk meg' : 'Standard'}
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">Ingen sesjoner funnet</p>}
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-2">
                  {selectedUser.notifications?.map((notification: any) => (
                    <div key={notification.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(notification.createdAt).toLocaleString('nb-NO')}
                          </p>
                        </div>
                        <Badge variant={notification.read ? 'default' : 'destructive'}>
                          {notification.read ? 'Lest' : 'Ulest'}
                        </Badge>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">Ingen aktivitet funnet</p>}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      )}

      {/* User Actions Modal */}
      {showUserActionsModal && (
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Brukerhandlinger</DialogTitle>
            <DialogDescription>
              Velg handling for {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => {
                setShowUserActionsModal(false)
                handleUserAction(selectedUser!.id, 'reset-password', { sendEmail: true })
              }}
              disabled={actionLoading === selectedUser?.id}
              className="bg-blue-600"
            >
              <Lock className="h-4 w-4 mr-2" />
              {actionLoading === selectedUser?.id ? 'Laster...' : 'Reset passord'}
            </Button>
            
            <Button
              onClick={() => {
                setShowUserActionsModal(false)
                handleUserAction(selectedUser!.id, 'export')
              }}
              disabled={actionLoading === selectedUser?.id}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {actionLoading === selectedUser?.id ? 'Laster...' : 'Eksporter data'}
            </Button>
            
            <Button
              onClick={() => {
                setShowUserActionsModal(false)
                handleUserAction(selectedUser!.id, 'change-role', { newRole: 'ADMIN', reason: 'Admin promotion' })
              }}
              disabled={actionLoading === selectedUser?.id}
              variant="outline"
            >
              <Shield className="h-4 w-4 mr-2" />
              {actionLoading === selectedUser?.id ? 'Laster...' : 'Endre rolle'}
            </Button>
            
            <Button
              onClick={() => {
                setShowUserActionsModal(false)
                handleUserAction(selectedUser!.id, 'delete')
              }}
              disabled={actionLoading === selectedUser?.id}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {actionLoading === selectedUser?.id ? 'Laster...' : 'Slett bruker'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      )}

      {/* Bulk Actions Modal */}
      {showBulkActionsModal && (
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Handlinger</DialogTitle>
            <DialogDescription>
              Velg handling for {selectedUsers.length} valgte brukere
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => {
                setShowBulkActionsModal(false)
                handleBulkAction('change_role', { role: 'ADMIN' })
              }}
              disabled={actionLoading === 'bulk'}
              className="bg-blue-600"
            >
              <Shield className="h-4 w-4 mr-2" />
              {actionLoading === 'bulk' ? 'Laster...' : 'Endre rolle til ADMIN'}
            </Button>
            
            <Button
              onClick={() => {
                setShowBulkActionsModal(false)
                handleBulkAction('change_status', { status: 'SUSPENDED' })
              }}
              disabled={actionLoading === 'bulk'}
              variant="outline"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              {actionLoading === 'bulk' ? 'Laster...' : 'Suspendere brukere'}
            </Button>
            
            <Button
              onClick={() => {
                setShowBulkActionsModal(false)
                handleBulkAction('export')
              }}
              disabled={actionLoading === 'bulk'}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {actionLoading === 'bulk' ? 'Laster...' : 'Eksporter data'}
            </Button>
            
            <Button
              onClick={() => {
                setShowBulkActionsModal(false)
                handleBulkAction('delete')
              }}
              disabled={actionLoading === 'bulk'}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {actionLoading === 'bulk' ? 'Laster...' : 'Slett brukere'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      )}
    </AdminPageLayout>
  )
}