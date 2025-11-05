'use client'

import { useState } from 'react'
import { 
  User, 
  Mail, 
  Key, 
  Shield, 
  Calendar, 
  Settings,
  X,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
}

interface UserActionsModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onUserUpdated: () => void
}

export function UserActionsModal({ user, isOpen, onClose, onUserUpdated }: UserActionsModalProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | 'actions'>('details')
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    role: '',
    plan: '',
    status: ''
  })

  // Initialize edit data when user changes
  useState(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email,
        role: user.role,
        plan: user.plan,
        status: user.status
      })
    }
  })

  const handleUpdateUser = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
      
      if (response.ok) {
        onUserUpdated()
        onClose()
      } else {
        const error = await response.json()
        alert(`Feil ved oppdatering: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Feil ved oppdatering av bruker')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!user) return
    
    if (!confirm('Er du sikker på at du vil tilbakestille passordet for denne brukeren?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: 'POST'
      })
      
      if (response.ok) {
        alert('Passord tilbakestillings-e-post sendt!')
        onUserUpdated()
      } else {
        const error = await response.json()
        alert(`Feil: ${error.error}`)
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('Feil ved tilbakestilling av passord')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!user) return
    
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const action = newStatus === 'ACTIVE' ? 'aktivere' : 'suspendere'
    
    if (!confirm(`Er du sikker på at du vil ${action} denne brukeren?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        alert(`Bruker ${action}d!`)
        onUserUpdated()
      } else {
        const error = await response.json()
        alert(`Feil: ${error.error}`)
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      alert(`Feil ved ${action} av bruker`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!user) return
    
    if (!confirm('ER DU SIKKER PÅ AT DU VIL SLETTE DENNE BRUKEREN? Dette kan ikke angres!')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        alert('Bruker slettet!')
        onUserUpdated()
        onClose()
      } else {
        const error = await response.json()
        alert(`Feil: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Feil ved sletting av bruker')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Aldri'
    return new Date(dateString).toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return 'destructive'
      case 'ADMIN': return 'default'
      case 'VERGE': return 'secondary'
      case 'USER': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default'
      case 'SUSPENDED': return 'destructive'
      default: return 'secondary'
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {user.name || 'Bruker'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'details' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detaljer
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'edit' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rediger
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'actions' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Handlinger
            </button>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Navn
                  </Label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {user.name || 'Ikke satt'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-post
                  </Label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {user.email}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Rolle
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                    {user.mustChangePassword && (
                      <Badge variant="destructive">
                        Må endre passord
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded capitalize">
                    {user.plan}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Opprettet
                  </Label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Siste innlogging
                  </Label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {formatDate(user.lastLoginAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Navn</Label>
                  <Input
                    id="edit-name"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-post</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rolle</Label>
                  <Select value={editData.role} onValueChange={(value) => setEditData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">USER</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="VERGE">VERGE</SelectItem>
                      {user.role !== 'SUPERADMIN' && (
                        <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-plan">Plan</Label>
                  <Select value={editData.plan} onValueChange={(value) => setEditData(prev => ({ ...prev, plan: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleUpdateUser} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Lagrer...' : 'Lagre endringer'}
                </Button>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Tilbakestill passord
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleToggleStatus}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  {user.status === 'ACTIVE' ? 'Suspendere' : 'Aktivere'}
                </Button>
              </div>
              
              {user.role !== 'SUPERADMIN' && (
                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteUser}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Slett bruker
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    Dette kan ikke angres!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



































