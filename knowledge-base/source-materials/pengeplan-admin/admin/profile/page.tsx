'use client'

import { useState, useEffect } from 'react'
import { useAdminPage } from '@/contexts/AdminPageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Key, 
  Bell, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Camera as CameraIcon,
  Award,
  Clock,
  Activity,
  Star,
  TrendingUp,
  Users,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Crown,
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  ToggleLeft as SwitchIcon,
  UserCheck,
  UserX,
  Monitor,
  Server,
  Cpu,
  HardDrive,
  Network,
  Zap,
  AlertCircle,
  Info,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Share,
  MoreHorizontal
} from 'lucide-react'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  verified: boolean
  createdAt: string
  lastLoginAt?: string
  profile?: any
  subscription?: any
  activeSessions: number
  stats: {
    totalLogins: number
    budgetsCreated: number
    debtsTracked: number
    billsManaged: number
  }
  systemStats?: any
  recentActivity: any[]
}

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [superAdminControls, setSuperAdminControls] = useState<any>(null)
  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const [showSuperAdminPanel, setShowSuperAdminPanel] = useState(false)
  const { setPageInfo, resetPageInfo } = useAdminPage()
  
  // Role switching and impersonation
  const [currentRole, setCurrentRole] = useState('SUPERADMIN')
  const [availableRoles, setAvailableRoles] = useState<any[]>([])
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null)
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  
  // System health and monitoring
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [showSystemHealth, setShowSystemHealth] = useState(false)
  const [message, setMessage] = useState<string>('')

  // Fetch user data
  useEffect(() => {
    // Set page info for top bar
    setPageInfo(
      'Admin Profile',
      'Administrer profil, innstillinger og super admin kontroller',
      <User className="h-5 w-5 text-white" />
    )
    
    fetchUserData()
    
    // Cleanup function to reset when leaving page
    return () => {
      resetPageInfo()
    }
  }, [setPageInfo, resetPageInfo])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/profile')
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        
        // If super admin, fetch controls
        if (data.user.role === 'SUPERADMIN') {
          fetchSuperAdminControls()
        }
      }
    } catch (error) {
      setMessage('Feil ved henting av brukerdata')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuperAdminControls = async () => {
    try {
      const response = await fetch('/api/admin/super-admin/controls')
      const data = await response.json()
      
      if (data.success) {
        setSuperAdminControls(data)
        setAdminUsers(data.adminUsers || [])
      }
    } catch (error) {
      setMessage('Feil ved henting av super admin kontroller')
    }
  }

  const handleSaveProfile = async (formData: any) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        setIsEditing(false)
      }
    } catch (error) {
      setMessage('Feil ved lagring av profil')
    } finally {
      setSaving(false)
    }
  }

  const handleSuperAdminControlUpdate = async (adminId: string, permissions: any) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/super-admin/controls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, permissions })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchSuperAdminControls() // Refresh data
      }
    } catch (error) {
      console.error('Error updating super admin controls:', error)
    } finally {
      setSaving(false)
    }
  }

  // Role switching functions
  const fetchAvailableRoles = async () => {
    try {
      const response = await fetch('/api/admin/role-switch')
      const data = await response.json()
      
      if (data.success) {
        setAvailableRoles(data.availableRoles)
      }
    } catch (error) {
      console.error('Error fetching available roles:', error)
    }
  }

  const switchRole = async (targetRole: string) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/role-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentRole(targetRole)
        setUser(data.user)
        alert(`Switched to ${targetRole} role`)
      }
    } catch (error) {
      console.error('Error switching role:', error)
    } finally {
      setSaving(false)
    }
  }

  // Impersonation functions
  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch('/api/admin/impersonate')
      const data = await response.json()
      
      if (data.success) {
        setAvailableUsers(data.availableUsers)
      }
    } catch (error) {
      console.error('Error fetching available users:', error)
    }
  }

  const startImpersonation = async (targetUserId: string) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsImpersonating(true)
        setImpersonatedUser(data.user)
        setUser(data.user)
        alert(`Now impersonating ${data.user.name}`)
      }
    } catch (error) {
      console.error('Error starting impersonation:', error)
    } finally {
      setSaving(false)
    }
  }

  const endImpersonation = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/impersonate', {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsImpersonating(false)
        setImpersonatedUser(null)
        setUser(data.user)
        alert('Impersonation ended, returned to super admin')
      }
    } catch (error) {
      console.error('Error ending impersonation:', error)
    } finally {
      setSaving(false)
    }
  }

  // System health functions
  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/admin/system-health')
      const data = await response.json()
      
      if (data.success) {
        setSystemHealth(data.systemHealth)
        setShowSystemHealth(true)
      }
    } catch (error) {
      console.error('Error fetching system health:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-violet-600" />
          <p className="text-gray-600">Laster profil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Kunne ikke laste profil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-20 top-40 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute right-16 top-60 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="container mx-auto space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {user.name?.charAt(0) || 'A'}
                    </div>
                    <button className="absolute -bottom-2 -right-2 h-8 w-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
                      <Camera className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 text-lg">{user.role === 'SUPERADMIN' ? 'Super Administrator' : 'Administrator'}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {user.role === 'SUPERADMIN' ? (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                          <Crown className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1">
                        <Activity className="h-3 w-3 mr-1" />
                        {user.activeSessions > 0 ? 'Online' : 'Offline'}
                      </Badge>
                      {user.verified && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verifisert
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {user.role === 'SUPERADMIN' && (
                    <>
                      <Button 
                        onClick={() => setShowSuperAdminPanel(!showSuperAdminPanel)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Super Admin Panel
                      </Button>
                      <Button 
                        onClick={fetchSystemHealth}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        System Health
                      </Button>
                      {isImpersonating ? (
                        <Button 
                          onClick={endImpersonation}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          End Impersonation
                        </Button>
                      ) : (
                        <Button 
                          onClick={fetchAvailableUsers}
                          className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Impersonate User
                        </Button>
                      )}
                    </>
                  )}
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-lg"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? 'Avbryt' : 'Rediger profil'}
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50">
                    <Settings className="h-4 w-4 mr-2" />
                    Innstillinger
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Innlogginger</p>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.totalLogins.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budgets Opprettet</p>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.budgetsCreated}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gjeld Sporet</p>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.debtsTracked}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Regninger Håndtert</p>
                    <p className="text-2xl font-bold text-gray-900">{user.stats.billsManaged}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Super Admin System Stats */}
          {user.role === 'SUPERADMIN' && user.systemStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Totalt Brukere</p>
                      <p className="text-2xl font-bold text-gray-900">{user.systemStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aktive Brukere</p>
                      <p className="text-2xl font-bold text-gray-900">{user.systemStats.activeUsers.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Admin Brukere</p>
                      <p className="text-2xl font-bold text-gray-900">{user.systemStats.adminUsers}</p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Uptime</p>
                      <p className="text-2xl font-bold text-gray-900">{user.systemStats.systemHealth.uptime}</p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Role Switching Panel */}
          {user.role === 'SUPERADMIN' && (
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SwitchIcon className="h-5 w-5 text-blue-600" />
                  Rolle-bytting & Impersonation
                </CardTitle>
                <CardDescription>Bytt rolle eller impersoner andre brukere for testing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Role Switching */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Bytt Rolle</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['SUPERADMIN', 'ADMIN', 'VERGE', 'USER'].map((role) => (
                        <Button
                          key={role}
                          onClick={() => switchRole(role)}
                          variant={currentRole === role ? 'default' : 'outline'}
                          className={currentRole === role ? 'bg-blue-600 text-white' : ''}
                          disabled={saving}
                        >
                          {role}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Nåværende rolle: <strong>{currentRole}</strong>
                    </p>
                  </div>

                  {/* User Impersonation */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Impersoner Bruker</h3>
                    {isImpersonating ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">Impersonerer: {impersonatedUser?.name}</p>
                        <Button 
                          onClick={endImpersonation}
                          className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                          disabled={saving}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Avslutt Impersonation
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {availableUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.avatar}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => startImpersonation(user.id)}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              disabled={saving}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Impersoner
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Health Panel */}
          {showSystemHealth && systemHealth && (
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-green-600" />
                  System Health Monitor
                </CardTitle>
                <CardDescription>Real-time system health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Overall Status */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Overall Status</h3>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-green-800 font-medium">System Healthy</span>
                        <Badge className="bg-green-100 text-green-800">{systemHealth.overall.score}%</Badge>
                      </div>
                      <p className="text-sm text-green-600 mt-1">Uptime: {systemHealth.overall.uptime}</p>
                    </div>
                  </div>

                  {/* Server Metrics */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Server Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">{systemHealth.server.cpu.usage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Memory</span>
                        <span className="text-sm font-medium">{systemHealth.server.memory.percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Disk</span>
                        <span className="text-sm font-medium">{systemHealth.server.disk.percentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Services</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">API</span>
                        <Badge className="bg-green-100 text-green-800">Running</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">AI Service</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Super Admin Panel */}
          {showSuperAdminPanel && user.role === 'SUPERADMIN' && (
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  Super Admin Kontrollpanel
                </CardTitle>
                <CardDescription>Styr hva admin-brukere kan se og gjøre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {adminUsers.map((admin) => (
                      <Card key={admin.id} className="bg-gray-50/50 border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                {admin.name?.charAt(0) || 'A'}
                              </div>
                              <div>
                                <h3 className="font-semibold">{admin.name}</h3>
                                <p className="text-sm text-gray-600">{admin.email}</p>
                              </div>
                            </div>
                            <Badge className={admin.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {admin.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(admin.permissions).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm font-medium capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </span>
                                <Switch
                                  checked={value as boolean}
                                  onCheckedChange={(checked) => 
                                    handleSuperAdminControlUpdate(admin.id, { [key]: checked })
                                  }
                                  disabled={saving}
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`grid w-full ${user.role === 'SUPERADMIN' ? 'grid-cols-5' : 'grid-cols-4'} bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg`}>
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Oversikt
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Sikkerhet
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
                <Activity className="h-4 w-4 mr-2" />
                Aktivitet
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Innstillinger
              </TabsTrigger>
              {user.role === 'SUPERADMIN' && (
                <TabsTrigger value="superadmin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Super Admin
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-violet-600" />
                      Personlig Informasjon
                    </CardTitle>
                    <CardDescription>Din profil og kontaktinformasjon</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Fullt Navn</Label>
                        <Input 
                          id="name" 
                          value={user.name || ''} 
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                          onChange={(e) => setUser({...user, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-post</Label>
                        <Input 
                          id="email" 
                          value={user.email || ''} 
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                          onChange={(e) => setUser({...user, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input 
                          id="phone" 
                          value={user.profile?.phone || ''} 
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                          onChange={(e) => setUser({...user, profile: {...(user.profile || {}), phone: e.target.value}})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Adresse</Label>
                        <Input 
                          id="address" 
                          value={user.profile?.addressLine || ''} 
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                          onChange={(e) => setUser({...user, profile: {...(user.profile || {}), addressLine: e.target.value}})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Postnummer</Label>
                        <Input 
                          id="postalCode" 
                          value={user.profile?.postalCode || ''} 
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                          onChange={(e) => setUser({...user, profile: {...(user.profile || {}), postalCode: e.target.value}})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">By</Label>
                        <Input 
                          id="city" 
                          value={user.profile?.city || ''} 
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                          onChange={(e) => setUser({...user, profile: {...(user.profile || {}), city: e.target.value}})}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={() => handleSaveProfile({
                            name: user.name,
                            email: user.email,
                            phone: user.profile?.phone,
                            addressLine: user.profile?.addressLine,
                            postalCode: user.profile?.postalCode,
                            city: user.profile?.city
                          })}
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          {saving ? 'Lagrer...' : 'Lagre endringer'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Avbryt
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Konto Informasjon
                    </CardTitle>
                    <CardDescription>Din konto og tilgangsrettigheter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Rolle</p>
                            <p className="text-sm text-gray-600">
                              {user.role === 'SUPERADMIN' ? 'Super Administrator' : 'Administrator'}
                            </p>
                          </div>
                        </div>
                        <Badge className={user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Aktive Sesjoner</p>
                            <p className="text-sm text-gray-600">{user.activeSessions} sesjoner</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Medlem siden</p>
                            <p className="text-sm text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString('no-NO')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-orange-600" />
                          <div>
                            <p className="font-medium">Siste innlogging</p>
                            <p className="text-sm text-gray-600">
                              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('no-NO') : 'Aldri'}
                            </p>
                          </div>
                        </div>
                      </div>
                      {user.verified && (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">E-post verifisert</p>
                              <p className="text-sm text-gray-600">Kontoen er verifisert</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Verifisert</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Sikkerhetsinnstillinger
                  </CardTitle>
                  <CardDescription>Administrer din kontos sikkerhet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Endre passord</p>
                          <p className="text-sm text-gray-600">Oppdater ditt passord for bedre sikkerhet</p>
                        </div>
                      </div>
                      <Button variant="outline">Endre</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">To-faktor autentisering</p>
                          <p className="text-sm text-gray-600">Aktiver 2FA for ekstra sikkerhet</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Aktivert</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Sikkerhetsvarsler</p>
                          <p className="text-sm text-gray-600">Motta varsler om mistenkelig aktivitet</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Aktivert</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Aktivitetslogg
                  </CardTitle>
                  <CardDescription>Din siste aktivitet i systemet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.recentActivity && user.recentActivity.length > 0 ? (
                      user.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${
                              activity.action?.includes('success') || activity.action?.includes('created') ? 'bg-green-500' :
                              activity.action?.includes('warning') || activity.action?.includes('error') ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(activity.createdAt).toLocaleString('no-NO')}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            activity.action?.includes('success') || activity.action?.includes('created') ? 'border-green-200 text-green-800' :
                            activity.action?.includes('warning') || activity.action?.includes('error') ? 'border-yellow-200 text-yellow-800' : 'border-blue-200 text-blue-800'
                          }>
                            {activity.entity}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Ingen aktivitet funnet</p>
                        <p className="text-sm text-gray-500">Din aktivitet vil vises her</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Brukerinnstillinger
                  </CardTitle>
                  <CardDescription>Tilpass din opplevelse</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Mørk modus</p>
                        <p className="text-sm text-gray-600">Aktiver mørk tema</p>
                      </div>
                      <Switch 
                        checked={user.profile?.theme === 'dark'}
                        onCheckedChange={(checked) => setUser({...user, profile: {...(user.profile || {}), theme: checked ? 'dark' : 'light'}})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">E-post varsler</p>
                        <p className="text-sm text-gray-600">Motta varsler på e-post</p>
                      </div>
                      <Switch 
                        checked={user.profile?.notifyEmail}
                        onCheckedChange={(checked) => setUser({...user, profile: {...(user.profile || {}), notifyEmail: checked}})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium">Språk</p>
                        <p className="text-sm text-gray-600">{user.profile?.language || 'nb-NO'}</p>
                      </div>
                      <Button variant="outline" size="sm">Endre</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Super Admin Tab */}
            {user.role === 'SUPERADMIN' && (
              <TabsContent value="superadmin" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      Super Admin Kontrollpanel
                    </CardTitle>
                    <CardDescription>Styr hva admin-brukere kan se og gjøre i systemet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {adminUsers.map((admin) => (
                          <Card key={admin.id} className="bg-gray-50/50 border border-gray-200">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                    {admin.name?.charAt(0) || 'A'}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{admin.name}</h3>
                                    <p className="text-sm text-gray-600">{admin.email}</p>
                                  </div>
                                </div>
                                <Badge className={admin.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                  {admin.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {Object.entries(admin.permissions).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm font-medium capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                    </span>
                                    <Switch
                                      checked={value as boolean}
                                      onCheckedChange={(checked) => 
                                        handleSuperAdminControlUpdate(admin.id, { [key]: checked })
                                      }
                                      disabled={saving}
                                    />
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
