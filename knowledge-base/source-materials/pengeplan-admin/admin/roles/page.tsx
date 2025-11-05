'use client'

import '../../globals.css'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Shield, 
  Users, 
  Settings, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lock,
  Key,
  UserCheck,
  UserX,
  Crown,
  Award,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  Save,
  X,
  AlertCircle,
  Info,
  Clock,
  UserPlus,
  UserMinus,
  ShieldCheck,
  ShieldX,
  Database,
  Cpu,
  HardDrive,
  Network,
  Smartphone,
  Monitor,
  Bot,
  Sparkles,
  SlidersHorizontal,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Share2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Keyboard,
  Volume2,
  Hand,
  BookOpen,
  FileText,
  Image,
  Video,
  Music,
  Camera,
  Mic,
  Headphones,
  Wifi,
  Bluetooth,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Power,
  PowerOff,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Minimize2,
  Maximize2,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Diamond,
  Star as StarIcon,
  Heart as HeartIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as TrashIcon,
  Plus as PlusIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshIcon,
  BarChart3 as BarChartIcon,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  Crown as CrownIcon,
  Award as AwardIcon,
  Bot as BotIcon,
  Sparkles as SparklesIcon,
  Star as StarIcon2,
  Heart as HeartIcon2,
  ThumbsUp as ThumbsUpIcon,
  MessageSquare as MessageSquareIcon,
  Share2 as Share2Icon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Keyboard as KeyboardIcon,
  Volume2 as Volume2Icon,
  Hand as HandIcon,
  BookOpen as BookOpenIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  Camera as CameraIcon,
  Mic as MicIcon,
  Headphones as HeadphonesIcon,
  Wifi as WifiIcon,
  Bluetooth as BluetoothIcon,
  Battery as BatteryIcon,
  BatteryLow as BatteryLowIcon,
  BatteryMedium as BatteryMediumIcon,
  BatteryFull as BatteryFullIcon,
  Power as PowerIcon,
  PowerOff as PowerOffIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  RotateCcw as RotateCcwIcon,
  RotateCw as RotateCwIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Minimize2 as Minimize2Icon,
  Maximize2 as Maximize2Icon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Hexagon as HexagonIcon,
  Octagon as OctagonIcon,
  Pentagon as PentagonIcon,
  Diamond as DiamondIcon
} from 'lucide-react'

import { useAdminDataRefresh } from '@/hooks/useAdminDataRefresh'
import { RefreshIndicator } from '@/components/admin/RefreshIndicator'
import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { AdminCard } from '@/components/admin/AdminCard'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Role {
  role: string
  level: number
  permissions: string[]
  userCount: number
}

interface RoleStats {
  overview: {
    totalUsers: number
    activeSessions: number
    securityScore: number
    roleHealth: {
      balanced: boolean
      secure: boolean
      active: boolean
      monitored: boolean
    }
  }
  roleMetrics: Array<{
    role: string
    count: number
    percentage: number
  }>
  roleHierarchy: Record<string, number>
  recentChanges: Array<{
    id: string
    action: string
    timestamp: string
    details: string
  }>
  roleActivity: Array<{
    action: string
    count: number
  }>
  trends: {
    roleChanges: Record<string, number>
    lastWeek: number
  }
}

export default function AdminRoles() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [roles, setRoles] = useState<Role[]>([])
  const [roleStats, setRoleStats] = useState<RoleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  // New advanced state management
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'users'>('level')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterBy, setFilterBy] = useState<'all' | 'admin' | 'user' | 'verge'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<string | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    level: 50,
    permissions: [] as string[],
    description: ''
  })
  const [permissionFormData, setPermissionFormData] = useState<Record<string, boolean>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30000)

  const { isUpdating, lastRefresh, error: refreshError, refreshData } = useAdminDataRefresh({
    refreshInterval: refreshInterval,
    autoRefresh: autoRefresh
  })

  // Memoized filtered and sorted roles
  const filteredRoles = useMemo(() => {
    let filtered = roles

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(role => 
        role.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.permissions.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(role => {
        switch (filterBy) {
          case 'admin':
            return ['SUPERADMIN', 'ADMIN'].includes(role.role)
          case 'user':
            return ['USER', 'GUEST'].includes(role.role)
          case 'verge':
            return role.role === 'VERGE'
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.role.localeCompare(b.role)
          break
        case 'level':
          comparison = a.level - b.level
          break
        case 'users':
          comparison = a.userCount - b.userCount
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [roles, searchQuery, filterBy, sortBy, sortOrder])

  // Available permissions
  const availablePermissions = useMemo(() => [
    { key: 'admin:all', label: 'Full Admin Access', description: 'Complete administrative control', category: 'admin' },
    { key: 'users:all', label: 'User Management', description: 'Manage all users', category: 'admin' },
    { key: 'roles:all', label: 'Role Management', description: 'Manage roles and permissions', category: 'admin' },
    { key: 'system:all', label: 'System Control', description: 'System configuration and monitoring', category: 'admin' },
    { key: 'billing:all', label: 'Billing Management', description: 'Financial and subscription management', category: 'admin' },
    { key: 'analytics:all', label: 'Analytics Access', description: 'View all analytics and reports', category: 'admin' },
    { key: 'security:all', label: 'Security Management', description: 'Security settings and monitoring', category: 'admin' },
    { key: 'users:read', label: 'View Users', description: 'Read-only user access', category: 'user' },
    { key: 'users:write', label: 'Edit Users', description: 'Modify user information', category: 'user' },
    { key: 'clients:all', label: 'Client Management', description: 'Manage client accounts', category: 'verge' },
    { key: 'reports:all', label: 'Report Access', description: 'Generate and view reports', category: 'verge' },
    { key: 'profile:all', label: 'Profile Management', description: 'Manage own profile', category: 'user' },
    { key: 'budget:all', label: 'Budget Management', description: 'Financial planning tools', category: 'user' },
    { key: 'debt:all', label: 'Debt Management', description: 'Debt tracking and planning', category: 'user' },
    { key: 'savings:all', label: 'Savings Tools', description: 'Savings goals and tracking', category: 'user' },
    { key: 'bills:all', label: 'Bill Management', description: 'Bill tracking and payments', category: 'user' },
    { key: 'profile:read', label: 'View Profile', description: 'Read-only profile access', category: 'guest' }
  ], [])

  // Permission categories
  const permissionCategories = useMemo(() => {
    const categories = availablePermissions.reduce((acc, perm) => {
      if (!acc[perm.category]) {
        acc[perm.category] = []
      }
      acc[perm.category].push(perm)
      return acc
    }, {} as Record<string, typeof availablePermissions>)
    return categories
  }, [availablePermissions])

  const loadRoles = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true)
      }
      setError(null)

      const response = await fetch('/api/admin/roles', {
        headers: {
          'x-user-email': 'cato@catohansen.no'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRoles(data.data.roleHierarchy || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load roles')
      }
    } catch (error) {
      console.error('Error loading roles:', error)
      setError('Failed to load roles')
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      }
    }
  }

  const loadRoleStats = async () => {
    try {
      const response = await fetch('/api/admin/roles/stats', {
        headers: {
          'x-user-email': 'cato@catohansen.no'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRoleStats(data.data || null)
      }
    } catch (error) {
      console.error('Error loading role stats:', error)
    }
  }

  const handleRoleAction = async (action: string, role: string, data?: any) => {
    setActionLoading(role)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'cato@catohansen.no'
        },
        body: JSON.stringify({
          action,
          role,
          ...data
        })
      })

      if (response.ok) {
        const result = await response.json()
        setSuccess(result.message || 'Action completed successfully')
        loadRoles(false) // Refresh data
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Action failed')
      }
    } catch (error) {
      console.error('Error performing role action:', error)
      setError('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return <Crown className="h-5 w-5 text-yellow-600" />
      case 'ADMIN': return <Shield className="h-5 w-5 text-blue-600" />
      case 'VERGE': return <UserCheck className="h-5 w-5 text-green-600" />
      case 'USER': return <Users className="h-5 w-5 text-purple-600" />
      case 'GUEST': return <Eye className="h-5 w-5 text-gray-600" />
      default: return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ADMIN': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'VERGE': return 'bg-green-100 text-green-800 border-green-200'
      case 'USER': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'GUEST': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSecurityLevel = (level: number) => {
    if (level >= 90) return { label: 'Kritisk', color: 'text-red-600' }
    if (level >= 70) return { label: 'Høy', color: 'text-orange-600' }
    if (level >= 50) return { label: 'Medium', color: 'text-yellow-600' }
    return { label: 'Lav', color: 'text-green-600' }
  }

  useEffect(() => {
    setMounted(true)
    loadRoles(true)
    loadRoleStats()
    const interval = setInterval(() => {
      loadRoles(false)
      loadRoleStats()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

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
          <span className="ml-2">Loading roles...</span>
        </div>
      </div>
    )
  }

  return (
    <AdminPageLayout
      title="🔐 Roller & Tillatelser"
      description="Administrer brukerroller og deres tilganger i Pengeplan 2.0"
      headerColor="purple"
    >
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

      {/* Role Statistics Cards */}
      {roleStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminCard color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Totalt brukere</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.overview.totalUsers}</p>
                <p className="text-xs text-gray-500">Alle roller</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </AdminCard>

          <AdminCard color="green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Aktive sesjoner</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.overview.activeSessions}</p>
                <p className="text-xs text-gray-500">Online nå</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </AdminCard>

          <AdminCard color="orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sikkerhetsscore</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.overview.securityScore}/100</p>
                <p className="text-xs text-gray-500">Rollebalanse</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </AdminCard>

          <AdminCard color="purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Endringer siste uke</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.trends.lastWeek}</p>
                <p className="text-xs text-gray-500">Rolleendringer</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Toggle System Controller */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5"/>Rolle Administrasjon
          </h2>
        </div>

        {/* Toggle Menu - Single Row */}
        <div className="flex w-full bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl p-1.5">
          {[
            { id: "overview", label: "Oversikt", icon: BarChart3, color: "blue" },
            { id: "roles", label: "Roller", icon: Shield, color: "purple" },
            { id: "permissions", label: "Tillatelser", icon: Key, color: "green" },
            { id: "analytics", label: "Analytics", icon: TrendingUp, color: "orange" }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const colorVariants = {
              blue: isActive ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 border-blue-400' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/90',
              purple: isActive ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl shadow-purple-500/30 border-purple-400' : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50/90',
              green: isActive ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl shadow-green-500/30 border-green-400' : 'text-green-600 hover:text-green-700 hover:bg-green-50/90',
              orange: isActive ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 border-orange-400' : 'text-orange-600 hover:text-orange-700 hover:bg-orange-50/90'
            }
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 font-semibold text-sm",
                  "hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent",
                  colorVariants[tab.color as keyof typeof colorVariants],
                  isActive && "scale-105 animate-pulse animate-duration-1000"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-8 space-y-6">

        {activeTab === "overview" && (
          <div className="space-y-6">
          {/* Role Hierarchy */}
          <AdminCard color="white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Rollehierarki</h3>
                <p className="text-sm text-gray-600">Roller sortert etter tilgangsnivå</p>
              </div>
              <RefreshIndicator
                isUpdating={isUpdating}
                lastRefresh={lastRefresh}
                error={refreshError}
                onRefresh={() => loadRoles(false)}
                variant="button"
                size="sm"
              />
            </div>

            <div className="space-y-4">
              {roles.map((role, index) => {
                const securityLevel = getSecurityLevel(role.level)
                return (
                  <div key={role.role} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.role)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{role.role}</h4>
                          <p className="text-sm text-gray-600">
                            Nivå {role.level} • {role.userCount} brukere
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{role.userCount}</p>
                        <p className="text-xs text-gray-500">brukere</p>
                      </div>
                      
                      <Badge className={`${getRoleColor(role.role)} border`}>
                        {securityLevel.label}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRole(role.role)
                            setShowRoleModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </AdminCard>

          {/* Recent Role Changes */}
          {roleStats && roleStats.recentChanges.length > 0 && (
            <AdminCard color="white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nylige rolleendringer</h3>
              <div className="space-y-3">
                {roleStats.recentChanges.slice(0, 5).map((change) => (
                  <div key={change.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{change.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(change.timestamp).toLocaleString('nb-NO')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{change.action}</Badge>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}
          </div>
        )}

        {activeTab === "roles" && (
          <div className="space-y-6">
          <AdminCard color="white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Rolleadministrasjon</h3>
                <p className="text-sm text-gray-600">Administrer roller og deres tilganger</p>
              </div>
              <Button onClick={() => setShowRoleModal(true)} className="bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                Ny rolle
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card key={role.role} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.role)}
                        <CardTitle className="text-lg">{role.role}</CardTitle>
                      </div>
                      <Badge className={getRoleColor(role.role)}>
                        Nivå {role.level}
                      </Badge>
                    </div>
                    <CardDescription>
                      {role.userCount} brukere • {role.permissions.length} tillatelser
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Tillatelser:</p>
                        <div className="space-y-1">
                          {role.permissions.slice(0, 3).map((permission, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              {permission}
                            </div>
                          ))}
                          {role.permissions.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{role.permissions.length - 3} flere...
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRole(role.role)
                            setShowRoleModal(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Rediger
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRole(role.role)
                            setShowPermissionModal(true)
                          }}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          Tillatelser
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AdminCard>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-6">
          <AdminCard color="white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tillatelsesmatrise</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Rolle</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Admin</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Brukere</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Analytics</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Billing</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Sikkerhet</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.role} className="border-b border-gray-200">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role.role)}
                          <span className="font-medium">{role.role}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Checkbox 
                          checked={role.permissions.some(p => p.includes('admin'))}
                          disabled
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Checkbox 
                          checked={role.permissions.some(p => p.includes('users'))}
                          disabled
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Checkbox 
                          checked={role.permissions.some(p => p.includes('analytics'))}
                          disabled
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Checkbox 
                          checked={role.permissions.some(p => p.includes('billing'))}
                          disabled
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Checkbox 
                          checked={role.permissions.some(p => p.includes('security'))}
                          disabled
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
          {roleStats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminCard color="white">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rollefordeling</h3>
                  <div className="space-y-3">
                    {roleStats.roleMetrics.map((metric) => (
                      <div key={metric.role} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(metric.role)}
                          <span className="text-sm font-medium">{metric.role}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${metric.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {metric.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AdminCard>

                <AdminCard color="white">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sikkerhetsstatus</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sikkerhetsscore</span>
                      <span className="text-lg font-semibold">{roleStats.overview.securityScore}/100</span>
                    </div>
                    <Progress value={roleStats.overview.securityScore} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${roleStats.overview.roleHealth.balanced ? 'text-green-600' : 'text-red-600'}`}>
                          {roleStats.overview.roleHealth.balanced ? '✓' : '✗'}
                        </div>
                        <p className="text-xs text-gray-600">Balansert</p>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${roleStats.overview.roleHealth.secure ? 'text-green-600' : 'text-red-600'}`}>
                          {roleStats.overview.roleHealth.secure ? '✓' : '✗'}
                        </div>
                        <p className="text-xs text-gray-600">Sikker</p>
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </div>

              <AdminCard color="white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rolleaktivitet</h3>
                <div className="space-y-3">
                  {roleStats.roleActivity.map((activity) => (
                    <div key={activity.action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{activity.action}</span>
                      </div>
                      <Badge variant="outline">{activity.count} ganger</Badge>
                    </div>
                  ))}
                </div>
              </AdminCard>
            </>
          )}
          </div>
        )}
      </div>

      {/* Role Edit Modal */}
      {showRoleModal && selectedRole && (
        <Dialog>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rediger rolle: {selectedRole}</DialogTitle>
            <DialogDescription>
              Administrer rolleinnstillinger og tilganger
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName">Rollenavn</Label>
              <Input id="roleName" value={selectedRole || ''} disabled />
            </div>
            
            <div>
              <Label htmlFor="roleLevel">Tilgangsnivå</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Velg tilgangsnivå" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">Kritisk (100)</SelectItem>
                  <SelectItem value="80">Høy (80)</SelectItem>
                  <SelectItem value="60">Medium (60)</SelectItem>
                  <SelectItem value="40">Lav (40)</SelectItem>
                  <SelectItem value="20">Minimal (20)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tillatelser</Label>
              <div className="space-y-2 mt-2">
                {['admin:all', 'users:all', 'analytics:all', 'billing:all', 'security:all'].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox id={permission} />
                    <Label htmlFor={permission} className="text-sm">{permission}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleModal(false)}>
              Avbryt
            </Button>
            <Button 
              onClick={() => {
                // Handle role update
                setShowRoleModal(false)
              }}
              disabled={actionLoading === selectedRole}
            >
              {actionLoading === selectedRole ? 'Lagrer...' : 'Lagre endringer'}
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
      )}

      {/* Permission Modal */}
      {showPermissionModal && selectedRole && (
        <Dialog>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tillatelser for: {selectedRole}</DialogTitle>
            <DialogDescription>
              Administrer tillatelser for denne rollen
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Tillatelser</Label>
              <div className="space-y-2 mt-2">
                {['admin:all', 'users:all', 'analytics:all', 'billing:all', 'security:all'].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox id={`perm-${permission}`} />
                    <Label htmlFor={`perm-${permission}`} className="text-sm">{permission}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionModal(false)}>
              Avbryt
            </Button>
            <Button 
              onClick={() => {
                // Handle permission update
                setShowPermissionModal(false)
              }}
              disabled={actionLoading === selectedRole}
            >
              {actionLoading === selectedRole ? 'Lagrer...' : 'Lagre tillatelser'}
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
      )}

      {/* Last Updated */}
      <div className="text-center mt-6">
        <RefreshIndicator
          isUpdating={isUpdating}
          lastRefresh={lastRefresh}
          error={refreshError}
          variant="inline"
          size="sm"
        />
      </div>
    </AdminPageLayout>
  )
}
