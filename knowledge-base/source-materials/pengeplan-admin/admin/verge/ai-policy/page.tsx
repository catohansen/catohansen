/**
 * Admin Verge AI Policy Management Dashboard
 * Comprehensive AI policy management system for ethical AI governance
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Download, 
  RefreshCw, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Edit, 
  Plus, 
  Filter, 
  Calendar, 
  BarChart3,
  Award,
  Target,
  PieChart,
  Copy,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Scale,
  TrendingUp,
  Brain,
  Cpu
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

interface AiPolicy {
  id: string
  name: string
  version: string
  status: 'ACTIVE' | 'DRAFT' | 'UNDER_REVIEW' | 'INACTIVE'
  category: 'ETHICS' | 'DATA_PROTECTION' | 'MODEL_GOVERNANCE' | 'INCIDENT_MANAGEMENT' | 'TRANSPARENCY'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  scope: string
  createdAt: string
  updatedAt: string
  lastReviewDate: string
  nextReviewDate: string
  approvedBy: string | null
  approvalDate: string | null
  effectiveDate: string | null
  expiryDate: string
  description: string
  summary: string
  objectives: string[]
  principles: Array<{
    id: string
    name: string
    description: string
    requirements: string[]
    complianceLevel: 'MANDATORY' | 'RECOMMENDED' | 'OPTIONAL'
    implementationStatus: 'IMPLEMENTED' | 'IN_PROGRESS' | 'IN_DEVELOPMENT' | 'UNDER_REVIEW' | 'NOT_STARTED'
  }>
  rules: Array<{
    id: string
    title: string
    description: string
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    category: string
    conditions: string[]
    actions: string[]
    violations: Array<{
      type: 'MINOR' | 'MAJOR'
      description: string
      penalty: string
    }>
    complianceMetrics: Record<string, number>
  }>
  complianceStatus: {
    overallScore: number
    lastAssessmentDate: string
    nextAssessmentDate: string
    criticalIssues: number
    highIssues: number
    mediumIssues: number
    lowIssues: number
    resolvedIssues: number
    openIssues: number
    complianceHistory: Array<{
      date: string
      score: number
      issues: number
    }>
  }
  implementation: {
    status: 'DEPLOYED' | 'IN_DEVELOPMENT' | 'UNDER_REVIEW' | 'NOT_STARTED'
    coverage: number
    affectedSystems: string[]
    deploymentDate: string | null
    rollbackPlan: string
    monitoringMetrics: {
      systemUptime: number
      responseTime: number
      errorRate: number
      userSatisfaction: number
    }
  }
  stakeholders: Array<{
    id: string
    name: string
    role: string
    email: string
    responsibilities: string[]
  }>
  auditTrail: Array<{
    id: string
    timestamp: string
    action: string
    user: string
    changes: string[]
    reason: string
  }>
}

interface PolicyTemplate {
  id: string
  name: string
  category: string
  description: string
  sections: string[]
  requiredFields: string[]
  estimatedCompletionTime: number
  complexity: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface PolicyStatistics {
  totalPolicies: number
  activePolicies: number
  draftPolicies: number
  underReviewPolicies: number
  inactivePolicies: number
  criticalPriority: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  avgComplianceScore: number
  totalOpenIssues: number
  totalResolvedIssues: number
  criticalIssues: number
  highIssues: number
  upcomingReviews: number
  implementationCoverage: number
}

export default function AdminVergeAiPolicyPage() {
  const [policies, setPolicies] = useState<AiPolicy[]>([])
  const [templates, setTemplates] = useState<PolicyTemplate[]>([])
  const [statistics, setStatistics] = useState<PolicyStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedPolicy, setSelectedPolicy] = useState<AiPolicy | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])

  const fetchData = useCallback(async (type: string = 'policies') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/verge/ai-policy?${params}`)
      if (response.ok) {
        const result = await response.json()
        
        switch (type) {
          case 'policies':
            setPolicies(result.data)
            break
          case 'templates':
            setTemplates(result.data)
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
  }, [statusFilter, categoryFilter, priorityFilter, searchTerm])

  useEffect(() => {
    fetchData('policies')
    fetchData('templates')
  }, [fetchData])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData(activeTab === 'overview' ? 'policies' : activeTab)
      }, refreshInterval * 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, activeTab, fetchData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ETHICS': return 'bg-purple-100 text-purple-800'
      case 'DATA_PROTECTION': return 'bg-blue-100 text-blue-800'
      case 'MODEL_GOVERNANCE': return 'bg-indigo-100 text-indigo-800'
      case 'INCIDENT_MANAGEMENT': return 'bg-red-100 text-red-800'
      case 'TRANSPARENCY': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <ShieldCheck className="h-4 w-4 text-green-600" />
      case 'DRAFT':
        return <Shield className="h-4 w-4 text-yellow-600" />
      case 'UNDER_REVIEW':
        return <ShieldAlert className="h-4 w-4 text-blue-600" />
      case 'INACTIVE':
        return <ShieldX className="h-4 w-4 text-gray-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getImplementationStatusIcon = (status: string) => {
    switch (status) {
      case 'DEPLOYED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'IN_DEVELOPMENT':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'UNDER_REVIEW':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'NOT_STARTED':
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('no-NO')
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('no-NO')
  }

  const getDaysUntilReview = (reviewDate: string | null) => {
    if (!reviewDate) return null
    const review = new Date(reviewDate)
    const now = new Date()
    const diffTime = review.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleAction = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/admin/verge/ai-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`${action} successful:`, result.message)
        // Refresh data
        fetchData('policies')
        fetchData('templates')
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
    }
  }

  const handleBulkAction = async (operation: string) => {
    if (selectedPolicies.length === 0) return
    
    await handleAction('bulk_action', {
      operation,
      policyIds: selectedPolicies
    })
    
    setSelectedPolicies([])
  }

  const exportData = async () => {
    try {
      const dataToExport = {
        policies,
        templates,
        statistics,
        exportedAt: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(dataToExport, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-policy-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || policy.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  if (loading && policies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI policy management system...</p>
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
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Policy Management
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive AI policy governance and ethical compliance system
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <label className="text-sm text-gray-600">Auto-refresh</label>
            </div>
            <Button onClick={() => fetchData('policies')} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Policy
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Total Policies</p>
                    <p className="text-xl font-bold text-blue-600">{statistics.totalPolicies}</p>
                  </div>
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Active</p>
                    <p className="text-xl font-bold text-green-600">{statistics.activePolicies}</p>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Compliance Score</p>
                    <p className="text-xl font-bold text-purple-600">{statistics.avgComplianceScore.toFixed(1)}%</p>
                  </div>
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Open Issues</p>
                    <p className="text-xl font-bold text-red-600">{statistics.totalOpenIssues}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Implementation</p>
                    <p className="text-xl font-bold text-indigo-600">{statistics.implementationCoverage.toFixed(1)}%</p>
                  </div>
                  <Cpu className="h-6 w-6 text-indigo-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Due Reviews</p>
                    <p className="text-xl font-bold text-orange-600">{statistics.upcomingReviews}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Policies ({policies.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && [
                    { label: 'Critical', count: statistics.criticalPriority, color: 'bg-red-500' },
                    { label: 'High', count: statistics.highPriority, color: 'bg-orange-500' },
                    { label: 'Medium', count: statistics.mediumPriority, color: 'bg-yellow-500' },
                    { label: 'Low', count: statistics.lowPriority, color: 'bg-green-500' }
                  ].map((priority) => (
                    <div key={priority.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${priority.color}`}></div>
                        <span className="text-sm font-medium">{priority.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={statistics.totalPolicies > 0 ? (priority.count / statistics.totalPolicies) * 100 : 0} 
                          className="w-20 h-2" 
                        />
                        <span className="text-sm font-bold">{priority.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {policies
                    .filter(p => p.complianceStatus.criticalIssues > 0)
                    .map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="font-medium text-sm">{policy.name}</p>
                            <p className="text-xs text-gray-600">v{policy.version}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          < Badge className="bg-red-100 text-red-800" variant="outline">
                            {policy.complianceStatus.criticalIssues} critical issues
                          </Badge>
                          <div className="flex gap-1 mt-1">
                            <Button size="sm" onClick={() => handleAction('run_compliance_check', { id: policy.id })}>
                              Check
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setSelectedPolicy(policy)}>
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {policies.filter(p => p.complianceStatus.criticalIssues > 0).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No critical issues found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Reviews */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Upcoming Reviews (30 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {policies
                    .filter(p => {
                      const daysUntil = getDaysUntilReview(p.nextReviewDate)
                      return daysUntil !== null && daysUntil <= 30 && daysUntil >= 0
                    })
                    .sort((a, b) => {
                      const daysA = getDaysUntilReview(a.nextReviewDate) || 999
                      const daysB = getDaysUntilReview(b.nextReviewDate) || 999
                      return daysA - daysB
                    })
                    .map((policy) => {
                      const daysUntil = getDaysUntilReview(policy.nextReviewDate)
                      return (
                        <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <div>
                              <p className="font-medium text-sm">{policy.name}</p>
                              <p className="text-xs text-gray-600">v{policy.version} - {policy.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            < Badge className={getPriorityColor(policy.priority)} variant="outline">
                              {daysUntil} days left
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(policy.nextReviewDate)}</p>
                          </div>
                        </div>
                      )
                    })}
                  
                  {policies.filter(p => {
                    const daysUntil = getDaysUntilReview(p.nextReviewDate)
                    return daysUntil !== null && daysUntil <= 30 && daysUntil >= 0
                  }).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No reviews due within 30 days</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-600" />
                  Implementation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['DEPLOYED', 'IN_DEVELOPMENT', 'UNDER_REVIEW', 'NOT_STARTED'].map((status) => {
                    const count = policies.filter(p => p.implementation.status === status).length
                    const percentage = policies.length > 0 ? (count / policies.length) * 100 : 0
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getImplementationStatusIcon(status)}
                          <span className="text-sm font-medium">{status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-purple-600" />
                  Filters & Search
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                    Advanced
                  </Button>
                  {selectedPolicies.length > 0 && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBulkAction('run_compliance_check')}>
                        Check Compliance ({selectedPolicies.length})
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve_policy')}>
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search policies..."
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
                    <option value="DRAFT">Draft</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="ETHICS">Ethics</option>
                    <option value="DATA_PROTECTION">Data Protection</option>
                    <option value="MODEL_GOVERNANCE">Model Governance</option>
                    <option value="INCIDENT_MANAGEMENT">Incident Management</option>
                    <option value="TRANSPARENCY">Transparency</option>
                  </select>
                </div>

                <div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => fetchData('policies')} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={() => setShowCreateForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policies List */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                AI Policies Management ({filteredPolicies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPolicies.map((policy) => {
                  const daysUntilReview = getDaysUntilReview(policy.nextReviewDate)
                  const isReviewDue = daysUntilReview !== null && daysUntilReview <= 7 && daysUntilReview >= 0
                  const hasCriticalIssues = policy.complianceStatus.criticalIssues > 0
                  
                  return (
                    <Card 
                      key={policy.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedPolicy?.id === policy.id ? 'ring-2 ring-purple-500' : ''
                      } ${hasCriticalIssues ? 'border-red-300 bg-red-50/50' : isReviewDue ? 'border-orange-300 bg-orange-50/50' : ''}`}
                      onClick={() => setSelectedPolicy(policy)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedPolicies.includes(policy.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                if (e.target.checked) {
                                  setSelectedPolicies([...selectedPolicies, policy.id])
                                } else {
                                  setSelectedPolicies(selectedPolicies.filter(id => id !== policy.id))
                                }
                              }}
                              className="rounded"
                            />
                            {getStatusIcon(policy.status)}
                            <div>
                              <h3 className="font-bold text-gray-900">{policy.name}</h3>
                              <p className="text-sm text-gray-600">Version: {policy.version}</p>
                              <p className="text-sm text-gray-500">Scope: {policy.scope}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(policy.status)} variant="outline">
                                {policy.status}
                              </Badge>
                              <Badge className={getCategoryColor(policy.category)} variant="outline">
                                {policy.category}
                              </Badge>
                              <Badge className={getPriorityColor(policy.priority)} variant="outline">
                                {policy.priority}
                              </Badge>
                            </div>
                            {hasCriticalIssues && (
                              < Badge className="bg-red-100 text-red-800" variant="outline">
                                {policy.complianceStatus.criticalIssues} critical issues
                              </Badge>
                            )}
                            {isReviewDue && !hasCriticalIssues && (
                              < Badge className="bg-orange-100 text-orange-800" variant="outline">
                                Review due in {daysUntilReview} days
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <p className="text-gray-600">{formatDate(policy.createdAt)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Last Review:</span>
                            <p className="text-gray-600">{formatDate(policy.lastReviewDate)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Compliance Score:</span>
                            <p className="text-gray-600">{policy.complianceStatus.overallScore}%</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Implementation:</span>
                            <p className="text-gray-600">{policy.implementation.coverage}%</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{policy.summary}</p>
                        </div>

                        <div className="mb-3">
                          <span className="font-medium text-gray-700 text-sm">Principles:</span>
                          <div className="flex gap-2 mt-1">
                            {policy.principles.slice(0, 3).map((principle) => (
                              <Badge key={principle.id} variant="outline" className="text-xs bg-gray-50">
                                {principle.name}
                              </Badge>
                            ))}
                            {policy.principles.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-gray-50">
                                +{policy.principles.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="font-medium text-gray-700 text-sm">Affected Systems:</span>
                          <div className="flex gap-2 mt-1">
                            {policy.implementation.affectedSystems.slice(0, 2).map((system) => (
                              <Badge key={system} variant="outline" className="text-xs bg-blue-50">
                                {system}
                              </Badge>
                            ))}
                            {policy.implementation.affectedSystems.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-blue-50">
                                +{policy.implementation.affectedSystems.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                          {policy.status === 'DRAFT' && (
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction('approve_policy', { id: policy.id })
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          )}
                          {policy.status === 'ACTIVE' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction('run_compliance_check', { id: policy.id })
                              }}
                            >
                              <Scale className="h-3 w-3 mr-1" />
                              Check
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPolicy(policy)
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-purple-600" />
                Policy Templates ({templates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{template.name}</h3>
                          < Badge className={getCategoryColor(template.category)} variant="outline">
                            {template.category}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="text-sm mb-2">
                        <span className="font-medium text-gray-700">Completion Time:</span>
                        <p className="text-gray-600">{template.estimatedCompletionTime} hours</p>
                      </div>
                      
                      <div className="text-sm mb-2">
                        <span className="font-medium text-gray-700">Complexity:</span>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            template.complexity === 'HIGH' ? 'bg-red-100 text-red-800' :
                            template.complexity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {template.complexity}
                        </Badge>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Sections:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.sections.slice(0, 3).map((section) => (
                            <Badge key={section} variant="outline" className="text-xs bg-gray-50">
                              {section}
                            </Badge>
                          ))}
                          {template.sections.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50">
                              +{template.sections.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Scores */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  Compliance Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          policy.complianceStatus.overallScore >= 90 ? 'bg-green-500' :
                          policy.complianceStatus.overallScore >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">{policy.name}</p>
                          <p className="text-xs text-gray-600">v{policy.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={policy.complianceStatus.overallScore} className="w-20 h-2" />
                        <span className="text-sm font-bold">{policy.complianceStatus.overallScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Issue Summary */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Issue Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && [
                    { label: 'Critical Issues', count: statistics.criticalIssues, color: 'text-red-600' },
                    { label: 'High Issues', count: statistics.highIssues, color: 'text-orange-600' },
                    { label: 'Total Open Issues', count: statistics.totalOpenIssues, color: 'text-yellow-600' },
                    { label: 'Resolved Issues', count: statistics.totalResolvedIssues, color: 'text-green-600' }
                  ].map((issue) => (
                    <div key={issue.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">{issue.label}</span>
                      <span className={`text-lg font-bold ${issue.color}`}>{issue.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Policy Categories */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Policy Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['ETHICS', 'DATA_PROTECTION', 'MODEL_GOVERNANCE', 'INCIDENT_MANAGEMENT', 'TRANSPARENCY'].map((category) => {
                    const count = policies.filter(p => p.category === category).length
                    const percentage = policies.length > 0 ? (count / policies.length) * 100 : 0
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          < Badge className={getCategoryColor(category)} variant="outline">
                            {category.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Implementation Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && [
                    { label: 'Average Implementation', value: `${statistics.implementationCoverage.toFixed(1)}%`, color: 'text-blue-600' },
                    { label: 'Average Compliance', value: `${statistics.avgComplianceScore.toFixed(1)}%`, color: 'text-purple-600' },
                    { label: 'Active Policies', value: `${((statistics.activePolicies / statistics.totalPolicies) * 100).toFixed(1)}%`, color: 'text-green-600' },
                    { label: 'Review Compliance', value: `${(((statistics.totalPolicies - statistics.upcomingReviews) / statistics.totalPolicies) * 100).toFixed(1)}%`, color: 'text-orange-600' }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <span className={`text-lg font-bold ${metric.color}`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
