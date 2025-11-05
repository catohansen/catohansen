/**
 * Admin Verge Management Dashboard
 * Comprehensive management system for financial guardians (verger)
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Download, 
  RefreshCw, 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Edit, 
  Plus, 
  Filter, 
  BarChart3, 
  Star,
  Award,
  Target,
  DollarSign,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

interface Verge {
  id: string
  name: string
  email: string
  phone: string | null
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'TERMINATED'
  type: 'PROFESSIONAL' | 'CORPORATE' | 'INDIVIDUAL'
  licenseNumber: string
  specializations: string[]
  createdAt: string
  updatedAt: string
  lastActiveAt: string | null
  statistics: {
    totalClients: number
    activeClients: number
    pendingConsents: number
    completedReports: number
    avgClientSatisfaction: number
    totalRevenue: number
  }
  contact: {
    address: string
    website: string | null
    businessHours: string
  }
  compliance: {
    lastAudit: string | null
    nextAuditDue: string
    complianceScore: number
    certifications: string[]
    insuranceCoverage: number
  }
}

interface Client {
  id: string
  name: string
  email: string
  vergeId: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  consentStatus: 'GRANTED' | 'PENDING' | 'EXPIRED' | 'REVOKED'
  consentExpiry: string
  joinedAt: string
  lastInteraction: string
  financialSummary: {
    totalAssets: number
    totalDebts: number
    monthlyIncome: number
    monthlyExpenses: number
    savingsRate: number
  }
  goals: string[]
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
}

interface Statistics {
  totalVerger: number
  activeVerger: number
  pendingVerger: number
  totalClients: number
  activeConsents: number
  pendingConsents: number
  completedReports: number
  totalRevenue: number
  avgSatisfaction: number
}

export default function AdminVergePage() {
  const [verger, setVerger] = useState<Verge[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedVerge, setSelectedVerge] = useState<Verge | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const fetchData = useCallback(async (type: string = 'verger') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/verge?${params}`)
      if (response.ok) {
        const result = await response.json()
        
        switch (type) {
          case 'verger':
            setVerger(result.data)
            break
          case 'clients':
            setClients(result.data)
            break
        }
        
        if (result.statistics) {
          setStatistics(result.statistics)
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchTerm])

  useEffect(() => {
    fetchData('verger')
    fetchData('clients')
  }, [fetchData])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData(activeTab === 'overview' ? 'verger' : activeTab)
      }, refreshInterval * 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, activeTab, fetchData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': case 'GRANTED': case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PENDING': case 'PENDING_APPROVAL': case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'SUSPENDED': case 'EXPIRED': case 'OVERDUE':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'TERMINATED': case 'REVOKED': case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PROFESSIONAL': return 'bg-blue-100 text-blue-800'
      case 'CORPORATE': return 'bg-purple-100 text-purple-800'
      case 'INDIVIDUAL': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': case 'GRANTED': case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PENDING': case 'PENDING_APPROVAL': case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'SUSPENDED': case 'EXPIRED': case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'TERMINATED': case 'REVOKED': case 'INACTIVE':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO')
  }

  const handleAction = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/admin/verge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`${action} successful:`, result.message)
        // Refresh data
        fetchData('verger')
        fetchData('clients')
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
    }
  }

  const exportData = async () => {
    try {
      const dataToExport = {
        verger,
        clients,
        statistics,
        exportedAt: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(dataToExport, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `verge-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const filteredVerger = verger.filter(verge => {
    const matchesSearch = verge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verge.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || verge.status === statusFilter
    const matchesType = typeFilter === 'all' || verge.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading && verger.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verge management system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Verge Management
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive management system for financial guardians
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <label className="text-sm text-gray-600">Auto-refresh</label>
            </div>
            <Button onClick={() => fetchData('verger')} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Total Verger</p>
                    <p className="text-xl font-bold text-blue-600">{statistics.totalVerger}</p>
                  </div>
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Active Verger</p>
                    <p className="text-xl font-bold text-green-600">{statistics.activeVerger}</p>
                  </div>
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Total Clients</p>
                    <p className="text-xl font-bold text-purple-600">{statistics.totalClients}</p>
                  </div>
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-orange-600">{formatCurrency(statistics.totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Avg Satisfaction</p>
                    <p className="text-xl font-bold text-yellow-600">{statistics.avgSatisfaction.toFixed(1)}/5</p>
                  </div>
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="verger" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Verger ({verger.length})
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Clients ({clients.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Verger */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold-600" />
                  Top Performing Verger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verger
                    .filter(v => v.status === 'ACTIVE')
                    .sort((a, b) => b.statistics.avgClientSatisfaction - a.statistics.avgClientSatisfaction)
                    .slice(0, 5)
                    .map((verge, index) => (
                    <div key={verge.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{verge.name}</p>
                          <p className="text-sm text-gray-600">{verge.statistics.activeClients} active clients</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-bold text-yellow-600">{verge.statistics.avgClientSatisfaction.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-gray-500">{formatCurrency(verge.statistics.totalRevenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verger
                    .filter(v => v.status === 'ACTIVE')
                    .map((verge) => (
                    <div key={verge.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">{verge.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={verge.compliance.complianceScore} className="w-16 h-2" />
                        <span className="text-sm font-bold text-green-600">{verge.compliance.complianceScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Pending Verge Approvals */}
                  {verger.filter(v => v.status === 'PENDING_APPROVAL').map((verge) => (
                    <div key={verge.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <UserX className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="font-medium text-sm">Approve {verge.name}</p>
                          <p className="text-xs text-gray-600">Pending since {formatDate(verge.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleAction('approve_verge', { id: verge.id })}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAction('suspend_verge', { id: verge.id })}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}

                  {verger.filter(v => v.status === 'PENDING_APPROVAL').length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No pending actions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Verger Tab */}
        <TabsContent value="verger" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-purple-600" />
                  Filters & Search
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {showAdvancedFilters ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                  Advanced
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search verger..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_APPROVAL">Pending Approval</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="TERMINATED">Terminated</option>
                  </select>
                </div>

                <div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="INDIVIDUAL">Individual</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => fetchData('verger')} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Verge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verger List */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Verger ({filteredVerger.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVerger.map((verge) => (
                  <Card 
                    key={verge.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedVerge?.id === verge.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedVerge(verge)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(verge.status)}
                          <div>
                            <h3 className="font-bold text-gray-900">{verge.name}</h3>
                            <p className="text-sm text-gray-600">{verge.email}</p>
                            <p className="text-sm text-gray-500">License: {verge.licenseNumber}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(verge.status)} variant="outline">
                              {verge.status}
                            </Badge>
                            <Badge className={getTypeColor(verge.type)} variant="outline">
                              {verge.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{verge.statistics.avgClientSatisfaction.toFixed(1)}/5</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Clients:</span>
                          <p className="text-gray-600">{verge.statistics.activeClients}/{verge.statistics.totalClients}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Revenue:</span>
                          <p className="text-gray-600">{formatCurrency(verge.statistics.totalRevenue)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Compliance:</span>
                          <p className="text-gray-600">{verge.compliance.complianceScore}%</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Last Active:</span>
                          <p className="text-gray-600">
                            {verge.lastActiveAt ? formatDate(verge.lastActiveAt) : 'Never'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {verge.specializations.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs bg-gray-50">
                            {spec.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                        {verge.status === 'PENDING_APPROVAL' && (
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAction('approve_verge', { id: verge.id })
                            }}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Client Management ({clients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <Card key={client.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(client.status)}
                          <div>
                            <h3 className="font-bold text-gray-900">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.email}</p>
                            <p className="text-sm text-gray-500">
                              Verge: {verger.find(v => v.id === client.vergeId)?.name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(client.status)} variant="outline">
                            {client.status}
                          </Badge>
                          <Badge className={getStatusColor(client.consentStatus)} variant="outline">
                            {client.consentStatus}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Assets:</span>
                          <p className="text-gray-600">{formatCurrency(client.financialSummary.totalAssets)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Income:</span>
                          <p className="text-gray-600">{formatCurrency(client.financialSummary.monthlyIncome)}/mo</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Savings Rate:</span>
                          <p className="text-gray-600">{client.financialSummary.savingsRate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Risk Profile:</span>
                          <p className="text-gray-600">{client.riskProfile}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {client.goals.map((goal) => (
                          <Badge key={goal} variant="outline" className="text-xs bg-gray-50">
                            {goal.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Reports
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Manage Consent
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
