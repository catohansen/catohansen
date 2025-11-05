'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Users, 
  Settings, 
  Eye, 
  Save, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Upload,
  Crown,
  User
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

interface Permission {
  id: string
  category: string
  name: string
  description: string
  level: 'read' | 'write' | 'admin' | 'full'
}

interface Role {
  id: string
  name: string
  description: string
  color: string
  userCount: number
  isSystem: boolean
}

interface RolePermission {
  roleId: string
  permissionId: string
  access: 'all' | 'own' | 'dependent' | 'none'
}

export default function AccessControlMatrix() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize data
  useEffect(() => {
    const initialRoles: Role[] = [
      {
        id: 'superadmin',
        name: 'Super Administrator',
        description: 'Full systemtilgang og administrasjon',
        color: 'from-red-500 to-pink-500',
        userCount: 1,
        isSystem: true
      },
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Administrasjon av brukere og rapporter',
        color: 'from-orange-500 to-red-500',
        userCount: 2,
        isSystem: true
      },
      {
        id: 'verge',
        name: 'Verge',
        description: 'Administrasjon av vergehavere',
        color: 'from-green-500 to-emerald-500',
        userCount: 5,
        isSystem: true
      },
      {
        id: 'user',
        name: 'Bruker',
        description: 'Standard bruker med grunnleggende funksjoner',
        color: 'from-blue-500 to-cyan-500',
        userCount: 150,
        isSystem: true
      }
    ]

    const initialPermissions: Permission[] = [
      // AI & Assistent
      { id: 'ai.chat', category: 'AI & Assistent', name: 'ai.chat', description: 'AI-chat og rådgivning', level: 'read' },
      
      // Administrasjon
      { id: 'analytics.admin', category: 'Administrasjon', name: 'analytics.admin', description: 'Administrasjon av analytikk', level: 'admin' },
      { id: 'reports.admin', category: 'Administrasjon', name: 'reports.admin', description: 'Administrasjon av rapporter', level: 'admin' },
      { id: 'ai.manage', category: 'Administrasjon', name: 'ai.manage', description: 'Administrasjon av AI-system', level: 'admin' },
      { id: 'backup.manage', category: 'Administrasjon', name: 'backup.manage', description: 'Backup og gjenoppretting', level: 'admin' },
      { id: 'users.manage', category: 'Administrasjon', name: 'users.manage', description: 'Brukeradministrasjon', level: 'admin' },
      { id: 'integrations.manage', category: 'Administrasjon', name: 'integrations.manage', description: 'Integrasjonsadministrasjon', level: 'admin' },
      { id: 'permissions.manage', category: 'Administrasjon', name: 'permissions.manage', description: 'Tillatelsesadministrasjon', level: 'admin' },
      { id: 'roles.manage', category: 'Administrasjon', name: 'roles.manage', description: 'Rolleadministrasjon', level: 'admin' },
      { id: 'security.manage', category: 'Administrasjon', name: 'security.manage', description: 'Sikkerhetsadministrasjon', level: 'admin' },
      { id: 'admin.*', category: 'Administrasjon', name: 'admin.*', description: 'Alle admin-funksjoner', level: 'full' },
      { id: 'audit.read', category: 'Administrasjon', name: 'audit.read', description: 'Les audit-logger', level: 'read' },
      { id: 'system.settings', category: 'Administrasjon', name: 'system.settings', description: 'Systeminnstillinger', level: 'admin' },
      
      // Budsjett
      { id: 'budget.read', category: 'Budsjett', name: 'budget.read', description: 'Les budsjettdata', level: 'read' },
      { id: 'budget.write', category: 'Budsjett', name: 'budget.write', description: 'Rediger budsjett', level: 'write' },
      
      // Dokumenter
      { id: 'documents.crud', category: 'Dokumenter', name: 'documents.crud', description: 'Full dokumenthåndtering', level: 'write' },
      
      // Gjeld
      { id: 'debt.plan', category: 'Gjeld', name: 'debt.plan', description: 'Gjeldshåndtering', level: 'write' },
      
      // Mål & Sparing
      { id: 'goals.crud', category: 'Mål & Sparing', name: 'goals.crud', description: 'Målhåndtering', level: 'write' },
      { id: 'savings.crud', category: 'Mål & Sparing', name: 'savings.crud', description: 'Sparinghåndtering', level: 'write' },
      
      // NAV & Støtte
      { id: 'nav.read', category: 'NAV & Støtte', name: 'nav.read', description: 'NAV-informasjon', level: 'read' },
      
      // Oppgaver
      { id: 'tasks.crud', category: 'Oppgaver', name: 'tasks.crud', description: 'Oppgavehåndtering', level: 'write' },
      
      // Oversikt
      { id: 'dashboard.view', category: 'Oversikt', name: 'dashboard.view', description: 'Dashboard-visning', level: 'read' },
      
      // Profil & Innstillinger
      { id: 'settings.read', category: 'Profil & Innstillinger', name: 'settings.read', description: 'Les innstillinger', level: 'read' },
      { id: 'profile.update', category: 'Profil & Innstillinger', name: 'profile.update', description: 'Oppdater profil', level: 'write' },
      { id: 'settings.write', category: 'Profil & Innstillinger', name: 'settings.write', description: 'Rediger innstillinger', level: 'write' },
      
      // Rapporter
      { id: 'reports.read', category: 'Rapporter', name: 'reports.read', description: 'Les rapporter', level: 'read' },
      
      // Transaksjoner
      { id: 'transactions.read', category: 'Transaksjoner', name: 'transactions.read', description: 'Les transaksjoner', level: 'read' },
      { id: 'transactions.write', category: 'Transaksjoner', name: 'transactions.write', description: 'Rediger transaksjoner', level: 'write' },
      
      // Verge
      { id: 'dependents.manage', category: 'Verge', name: 'dependents.manage', description: 'Administrer vergehavere', level: 'admin' },
      { id: 'approvals.manage', category: 'Verge', name: 'approvals.manage', description: 'Administrer godkjenninger', level: 'admin' },
      { id: 'consent.manage', category: 'Verge', name: 'consent.manage', description: 'Administrer samtykke', level: 'admin' },
      { id: 'alerts.manage', category: 'Verge', name: 'alerts.manage', description: 'Administrer varsler', level: 'admin' },
      { id: 'dependents.read', category: 'Verge', name: 'dependents.read', description: 'Les vergehaverdata', level: 'read' },
      { id: 'limits.set', category: 'Verge', name: 'limits.set', description: 'Sett grenser', level: 'write' }
    ]

    const initialRolePermissions: RolePermission[] = [
      // Super Administrator - Full access to everything
      ...initialPermissions.map(perm => ({
        roleId: 'superadmin',
        permissionId: perm.id,
        access: 'all' as const
      })),
      
      // Administrator - Admin functions + user management
      { roleId: 'admin', permissionId: 'users.manage', access: 'all' },
      { roleId: 'admin', permissionId: 'reports.admin', access: 'all' },
      { roleId: 'admin', permissionId: 'analytics.admin', access: 'all' },
      { roleId: 'admin', permissionId: 'audit.read', access: 'all' },
      { roleId: 'admin', permissionId: 'reports.read', access: 'all' },
      { roleId: 'admin', permissionId: 'dashboard.view', access: 'all' },
      
      // Verge - Dependent management
      { roleId: 'verge', permissionId: 'dependents.manage', access: 'all' },
      { roleId: 'verge', permissionId: 'dependents.read', access: 'all' },
      { roleId: 'verge', permissionId: 'approvals.manage', access: 'all' },
      { roleId: 'verge', permissionId: 'consent.manage', access: 'all' },
      { roleId: 'verge', permissionId: 'alerts.manage', access: 'all' },
      { roleId: 'verge', permissionId: 'limits.set', access: 'all' },
      { roleId: 'verge', permissionId: 'dashboard.view', access: 'all' },
      { roleId: 'verge', permissionId: 'reports.read', access: 'own' },
      
      // User - Basic functions
      { roleId: 'user', permissionId: 'dashboard.view', access: 'own' },
      { roleId: 'user', permissionId: 'budget.read', access: 'own' },
      { roleId: 'user', permissionId: 'budget.write', access: 'own' },
      { roleId: 'user', permissionId: 'debt.plan', access: 'own' },
      { roleId: 'user', permissionId: 'goals.crud', access: 'own' },
      { roleId: 'user', permissionId: 'savings.crud', access: 'own' },
      { roleId: 'user', permissionId: 'tasks.crud', access: 'own' },
      { roleId: 'user', permissionId: 'transactions.read', access: 'own' },
      { roleId: 'user', permissionId: 'transactions.write', access: 'own' },
      { roleId: 'user', permissionId: 'documents.crud', access: 'own' },
      { roleId: 'user', permissionId: 'ai.chat', access: 'own' },
      { roleId: 'user', permissionId: 'nav.read', access: 'own' },
      { roleId: 'user', permissionId: 'reports.read', access: 'own' },
      { roleId: 'user', permissionId: 'settings.read', access: 'own' },
      { roleId: 'user', permissionId: 'profile.update', access: 'own' },
      { roleId: 'user', permissionId: 'settings.write', access: 'own' }
    ]

    setRoles(initialRoles)
    setPermissions(initialPermissions)
    setRolePermissions(initialRolePermissions)
  }, [])

  const categories = ['all', ...Array.from(new Set(permissions.map(p => p.category)))]
  const filteredPermissions = permissions.filter(perm => {
    if (selectedCategory !== 'all' && perm.category !== selectedCategory) return false
    if (searchTerm && !perm.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !perm.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getPermissionAccess = (roleId: string, permissionId: string): 'all' | 'own' | 'dependent' | 'none' => {
    const rolePerm = rolePermissions.find(rp => rp.roleId === roleId && rp.permissionId === permissionId)
    return rolePerm?.access || 'none'
  }

  const updatePermission = (roleId: string, permissionId: string, access: 'all' | 'own' | 'dependent' | 'none') => {
    setRolePermissions(prev => {
      const existing = prev.find(rp => rp.roleId === roleId && rp.permissionId === permissionId)
      if (existing) {
        if (access === 'none') {
          return prev.filter(rp => !(rp.roleId === roleId && rp.permissionId === permissionId))
        } else {
          return prev.map(rp => 
            rp.roleId === roleId && rp.permissionId === permissionId 
              ? { ...rp, access }
              : rp
          )
        }
      } else if (access !== 'none') {
        return [...prev, { roleId, permissionId, access }]
      }
      return prev
    })
    setHasChanges(true)
  }

  const getRoleColor = (role: Role) => {
    const colorMap = {
      'from-red-500 to-pink-500': 'bg-gradient-to-r from-red-500 to-pink-500',
      'from-orange-500 to-red-500': 'bg-gradient-to-r from-orange-500 to-red-500',
      'from-green-500 to-emerald-500': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'from-blue-500 to-cyan-500': 'bg-gradient-to-r from-blue-500 to-cyan-500'
    }
    return colorMap[role.color] || 'bg-gradient-to-r from-gray-500 to-gray-600'
  }

  const getAccessIcon = (access: string) => {
    switch (access) {
      case 'all': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'own': return <Eye className="h-4 w-4 text-blue-600" />
      case 'dependent': return <Users className="h-4 w-4 text-purple-600" />
      default: return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const saveRole = (roleId: string) => {
    // Here you would typically save to backend
    console.log(`Saving role: ${roleId}`)
    setHasChanges(false)
  }

  const handleUseTemplate = (templateType: string) => {
    // Apply template permissions
    console.log(`Applying template: ${templateType}`)
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Roller</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
                <p className="text-xs text-gray-500">System- og tilpassede roller</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rettigheter</p>
                <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
                <p className="text-xs text-gray-500">Tilgjengelige funksjoner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Brukere</p>
                <p className="text-2xl font-bold text-gray-900">{roles.reduce((sum, role) => sum + role.userCount, 0)}</p>
                <p className="text-xs text-gray-500">Aktive systembrukere</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Endringer</p>
                <p className="text-2xl font-bold text-gray-900">{hasChanges ? '1' : '0'}</p>
                <p className="text-xs text-gray-500">Siste 24 timer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Matrix */}
      <Card className="bg-white/80 backdrop-blur border-violet-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Roller & Rettigheter</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Konfigurer tilganger og tillatelser for alle roller</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-violet-200 text-violet-600 hover:bg-violet-50">
                <Download className="h-4 w-4 mr-2" />
                Eksporter
              </Button>
              <Button variant="outline" size="sm" className="border-violet-200 text-violet-600 hover:bg-violet-50">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrer funksjoner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-violet-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-300"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-violet-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-300"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Alle kategorier' : category}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 min-w-[300px]">Funksjon</th>
                  {roles.map(role => (
                    <th key={role.id} className="text-center p-4 min-w-[120px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`h-8 w-8 rounded-full ${getRoleColor(role)} flex items-center justify-center`}>
                          {role.isSystem ? <Crown className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{role.name}</p>
                          <p className="text-xs text-gray-500">{role.userCount} brukere</p>
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-4 font-semibold text-gray-900">Mal</th>
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.map((permission, index) => (
                  <tr key={permission.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {permission.category}
                          </Badge>
                          <Badge 
                            variant={permission.level === 'full' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {permission.level}
                          </Badge>
                        </div>
                        <p className="font-medium text-gray-900 mt-1">{permission.name}</p>
                        <p className="text-sm text-gray-600">{permission.description}</p>
                      </div>
                    </td>
                    
                    {roles.map(role => {
                      const access = getPermissionAccess(role.id, permission.id)
                      return (
                        <td key={role.id} className="p-4 text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => updatePermission(role.id, permission.id, access === 'all' ? 'none' : 'all')}
                              className={`p-1 rounded ${
                                access === 'all' 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                              title="Alle"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updatePermission(role.id, permission.id, access === 'own' ? 'none' : 'own')}
                              className={`p-1 rounded ${
                                access === 'own' 
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                              title="Egen"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updatePermission(role.id, permission.id, access === 'dependent' ? 'none' : 'dependent')}
                              className={`p-1 rounded ${
                                access === 'dependent' 
                                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                              title="Avhengig"
                            >
                              <Users className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )
                    })}
                    
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate(permission.category)}
                        className="text-xs"
                      >
                        Bruk mal
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Save and Template Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Save Role Buttons */}
        <Card className="bg-white/80 backdrop-blur border-violet-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Lagre Roller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map(role => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full ${getRoleColor(role)} flex items-center justify-center`}>
                    {role.isSystem ? <Crown className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{role.name}</p>
                    <p className="text-sm text-gray-600">{role.userCount} brukere</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => saveRole(role.id)}
                  disabled={!hasChanges}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lagre
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Template Buttons */}
        <Card className="bg-white/80 backdrop-blur border-violet-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Bruk Maler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map(role => (
              <div key={role.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full ${getRoleColor(role)} flex items-center justify-center`}>
                    {role.isSystem ? <Crown className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bruk "{role.name.toUpperCase()}" mal</p>
                    <p className="text-sm text-gray-600">Tilbakestill til standard</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(role.id.toUpperCase())}
                  className="border-violet-200 text-violet-600 hover:bg-violet-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Bruk mal
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Warning */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Sikkerhetsmerknad</h3>
              <p className="text-orange-700 text-sm mb-3">
                Endringer i roller og rettigheter påvirker umiddelbart alle brukere med den rollen. 
                Vær forsiktig når du endrer systemroller.
              </p>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• Alle endringer logges automatisk i audit-systemet</li>
                <li>• Systemroller (USER, GUARDIAN, ADMIN) kan ikke slettes</li>
                <li>• Test endringer i utviklingsmiljø først</li>
                <li>• Backup RBAC-konfigurasjon regelmessig</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

