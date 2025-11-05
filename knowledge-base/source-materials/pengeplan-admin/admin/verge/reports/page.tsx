/**
 * Admin Verge Reports Management Dashboard
 * Comprehensive reports management system for verge-client relationships
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Download, 
  RefreshCw, 
  FileText, 
  FileCheck, 
  FileX, 
  FileClock, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Plus, 
  Filter, 
  BarChart3,
  Star,
  Target,
  PieChart,
  Copy,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Bookmark,
  Scale,
  Timer,
  Calendar as CalendarIcon,
  TrendingUp,
  Send,
  Paperclip
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

interface Report {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  vergeId: string
  vergeName: string
  vergeEmail: string
  type: 'MONTHLY_REVIEW' | 'QUARTERLY_REVIEW' | 'ANNUAL_REPORT' | 'COMPLIANCE_REPORT' | 'SENIOR_REVIEW'
  title: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'OVERDUE' | 'PENDING'
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  createdAt: string
  completedAt: string | null
  dueDate: string
  reviewPeriod: {
    startDate: string
    endDate: string
  }
  summary: string
  executiveSummary: string
  metrics: {
    budgetAdherence: number
    savingsProgress: number
    goalCompletion: number
    overallScore: number
    incomeGrowth: number
    expenseReduction: number
    debtReduction: number
    investmentReturn: number
  }
  financialSnapshot: {
    totalAssets: number
    totalLiabilities: number
    netWorth: number
    monthlyIncome: number
    monthlyExpenses: number
    savingsRate: number
    emergencyFundMonths: number
  }
  recommendations: string[]
  achievements: string[]
  concerns: string[]
  nextSteps: string[]
  attachments: Array<{
    id: string
    name: string
    type: string
    size: number
    uploadedAt: string
  }>
  compliance: {
    gdprCompliant: boolean
    dataRetentionCompliant: boolean
    clientConsentValid: boolean
    auditTrailComplete: boolean
    lastAuditDate: string
  }
  feedback: {
    clientRating: number
    clientComments: string
    vergeNotes: string
    adminNotes: string
  }
}

interface ReportTemplate {
  id: string
  name: string
  type: string
  description: string
  sections: string[]
  requiredMetrics: string[]
  estimatedDuration: number
  defaultSchedule: string
}

interface ReportStatistics {
  totalReports: number
  completedReports: number
  inProgressReports: number
  overdueReports: number
  criticalPriority: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  avgCompletionTime: number
  avgClientRating: number
  complianceIssues: number
  dueSoon: number
}

export default function AdminVergeReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [statistics, setStatistics] = useState<ReportStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const fetchData = useCallback(async (type: string = 'reports') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { reportType: typeFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/verge/reports?${params}`)
      if (response.ok) {
        const result = await response.json()
        
        switch (type) {
          case 'reports':
            setReports(result.data)
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
  }, [statusFilter, typeFilter, priorityFilter, searchTerm])

  useEffect(() => {
    fetchData('reports')
    fetchData('templates')
  }, [fetchData])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchData(activeTab === 'overview' ? 'reports' : activeTab)
      }, refreshInterval * 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, activeTab, fetchData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MONTHLY_REVIEW': return 'bg-blue-100 text-blue-800'
      case 'QUARTERLY_REVIEW': return 'bg-purple-100 text-purple-800'
      case 'ANNUAL_REPORT': return 'bg-indigo-100 text-indigo-800'
      case 'COMPLIANCE_REPORT': return 'bg-red-100 text-red-800'
      case 'SENIOR_REVIEW': return 'bg-green-100 text-green-800'
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
      case 'COMPLETED':
        return <FileCheck className="h-4 w-4 text-green-600" />
      case 'IN_PROGRESS':
        return <FileClock className="h-4 w-4 text-blue-600" />
      case 'OVERDUE':
        return <FileX className="h-4 w-4 text-red-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleAction = async (action: string, data: any) => {
    try {
      const response = await fetch('/api/admin/verge/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`${action} successful:`, result.message)
        // Refresh data
        fetchData('reports')
        fetchData('templates')
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
    }
  }

  const handleBulkAction = async (operation: string) => {
    if (selectedReports.length === 0) return
    
    await handleAction('bulk_action', {
      operation,
      reportIds: selectedReports
    })
    
    setSelectedReports([])
  }

  const exportData = async () => {
    try {
      const dataToExport = {
        reports,
        templates,
        statistics,
        exportedAt: new Date().toISOString()
      }
      
      const dataStr = JSON.stringify(dataToExport, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reports-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.vergeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports management system...</p>
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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Reports Management
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive reports management for verge-client relationships
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <label className="text-sm text-gray-600">Auto-refresh</label>
            </div>
            <Button onClick={() => fetchData('reports')} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Report
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
                    <p className="text-xs font-medium text-gray-600">Total Reports</p>
                    <p className="text-xl font-bold text-blue-600">{statistics.totalReports}</p>
                  </div>
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Completed</p>
                    <p className="text-xl font-bold text-green-600">{statistics.completedReports}</p>
                  </div>
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">In Progress</p>
                    <p className="text-xl font-bold text-blue-600">{statistics.inProgressReports}</p>
                  </div>
                  <FileClock className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Overdue</p>
                    <p className="text-xl font-bold text-red-600">{statistics.overdueReports}</p>
                  </div>
                  <FileX className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Avg Rating</p>
                    <p className="text-xl font-bold text-yellow-600">{statistics.avgClientRating.toFixed(1)}/5</p>
                  </div>
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Due Soon</p>
                    <p className="text-xl font-bold text-orange-600">{statistics.dueSoon}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
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
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Compliance
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
                          value={statistics.totalReports > 0 ? (priority.count / statistics.totalReports) * 100 : 0} 
                          className="w-20 h-2" 
                        />
                        <span className="text-sm font-bold">{priority.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Overdue Reports */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileX className="h-5 w-5 text-red-600" />
                  Overdue Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports
                    .filter(r => r.status === 'OVERDUE')
                    .map((report) => {
                      const daysOverdue = Math.abs(getDaysUntilDue(report.dueDate) || 0)
                      return (
                        <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                          <div className="flex items-center gap-2">
                            <FileX className="h-4 w-4 text-red-600" />
                            <div>
                              <p className="font-medium text-sm">{report.clientName}</p>
                              <p className="text-xs text-gray-600">{report.title}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-red-100 text-red-800" variant="outline">
                              {daysOverdue} days overdue
                            </Badge>
                            <div className="flex gap-1 mt-1">
                              <Button size="sm" onClick={() => handleAction('assign_verge', { id: report.id })}>
                                Assign
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAction('extend_deadline', { id: report.id })}>
                                Extend
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  
                  {reports.filter(r => r.status === 'OVERDUE').length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No overdue reports</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Due Soon */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-orange-600" />
                  Due Soon (7 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports
                    .filter(r => {
                      const daysUntil = getDaysUntilDue(r.dueDate)
                      return daysUntil !== null && daysUntil <= 7 && daysUntil >= 0 && r.status !== 'COMPLETED'
                    })
                    .sort((a, b) => {
                      const daysA = getDaysUntilDue(a.dueDate) || 999
                      const daysB = getDaysUntilDue(b.dueDate) || 999
                      return daysA - daysB
                    })
                    .map((report) => {
                      const daysUntil = getDaysUntilDue(report.dueDate)
                      return (
                        <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <div>
                              <p className="font-medium text-sm">{report.clientName}</p>
                              <p className="text-xs text-gray-600">{report.title}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPriorityColor(report.priority)} variant="outline">
                              {daysUntil} days left
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{report.vergeName}</p>
                          </div>
                        </div>
                      )
                    })}
                  
                  {reports.filter(r => {
                    const daysUntil = getDaysUntilDue(r.dueDate)
                    return daysUntil !== null && daysUntil <= 7 && daysUntil >= 0 && r.status !== 'COMPLETED'
                  }).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No reports due within 7 days</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Completions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  Recent Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports
                    .filter(r => r.status === 'COMPLETED')
                    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
                    .slice(0, 5)
                    .map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">{report.clientName}</p>
                          <p className="text-xs text-gray-600">{report.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < report.feedback.clientRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(report.completedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
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
                  {selectedReports.length > 0 && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBulkAction('send_reminder')}>
                        Send Reminder ({selectedReports.length})
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('extend_deadline')}>
                        Extend Deadline
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
                    placeholder="Search reports..."
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
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>

                <div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="MONTHLY_REVIEW">Monthly Review</option>
                    <option value="QUARTERLY_REVIEW">Quarterly Review</option>
                    <option value="ANNUAL_REPORT">Annual Report</option>
                    <option value="COMPLIANCE_REPORT">Compliance Report</option>
                    <option value="SENIOR_REVIEW">Senior Review</option>
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
                  <Button onClick={() => fetchData('reports')} variant="outline" size="sm">
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

          {/* Reports List */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Reports Management ({filteredReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => {
                  const daysUntilDue = getDaysUntilDue(report.dueDate)
                  const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0
                  const isOverdue = report.status === 'OVERDUE'
                  
                  return (
                    <Card 
                      key={report.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedReport?.id === report.id ? 'ring-2 ring-purple-500' : ''
                      } ${isOverdue ? 'border-red-300 bg-red-50/50' : isDueSoon ? 'border-orange-300 bg-orange-50/50' : ''}`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedReports.includes(report.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                if (e.target.checked) {
                                  setSelectedReports([...selectedReports, report.id])
                                } else {
                                  setSelectedReports(selectedReports.filter(id => id !== report.id))
                                }
                              }}
                              className="rounded"
                            />
                            {getStatusIcon(report.status)}
                            <div>
                              <h3 className="font-bold text-gray-900">{report.title}</h3>
                              <p className="text-sm text-gray-600">Client: {report.clientName}</p>
                              <p className="text-sm text-gray-500">Verge: {report.vergeName}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(report.status)} variant="outline">
                                {report.status}
                              </Badge>
                              <Badge className={getTypeColor(report.type)} variant="outline">
                                {report.type}
                              </Badge>
                              <Badge className={getPriorityColor(report.priority)} variant="outline">
                                {report.priority}
                              </Badge>
                            </div>
                            {isOverdue && (
                              <Badge className="bg-red-100 text-red-800" variant="outline">
                                {Math.abs(daysUntilDue || 0)} days overdue
                              </Badge>
                            )}
                            {isDueSoon && !isOverdue && (
                              <Badge className="bg-orange-100 text-orange-800" variant="outline">
                                Due in {daysUntilDue} days
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <p className="text-gray-600">{formatDate(report.createdAt)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Due:</span>
                            <p className="text-gray-600">{formatDate(report.dueDate)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Completed:</span>
                            <p className="text-gray-600">{formatDate(report.completedAt)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Overall Score:</span>
                            <p className="text-gray-600">{report.metrics.overallScore}%</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{report.summary}</p>
                        </div>

                        {report.status === 'COMPLETED' && (
                          <div className="mb-3">
                            <span className="font-medium text-gray-700 text-sm">Client Rating:</span>
                            <div className="flex items-center gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < report.feedback.clientRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">({report.feedback.clientRating}/5)</span>
                            </div>
                          </div>
                        )}

                        {report.attachments.length > 0 && (
                          <div className="mb-3">
                            <span className="font-medium text-gray-700 text-sm">Attachments:</span>
                            <div className="flex gap-2 mt-1">
                              {report.attachments.slice(0, 3).map((attachment) => (
                                <Badge key={attachment.id} variant="outline" className="text-xs bg-gray-50">
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  {attachment.name.split('.').pop()?.toUpperCase()}
                                </Badge>
                              ))}
                              {report.attachments.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-gray-50">
                                  +{report.attachments.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          {report.status === 'IN_PROGRESS' && (
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction('complete_report', { id: report.id })
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          )}
                          {report.status === 'OVERDUE' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction('assign_verge', { id: report.id })
                                }}
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Assign
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction('extend_deadline', { id: report.id })
                                }}
                              >
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                Extend
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAction('send_reminder', { id: report.id })
                            }}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Remind
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
                Report Templates ({templates.length})
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
                          <Badge className={getTypeColor(template.type)} variant="outline">
                            {template.type}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="text-sm mb-2">
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="text-gray-600">{template.estimatedDuration} hours</p>
                      </div>
                      
                      <div className="text-sm mb-2">
                        <span className="font-medium text-gray-700">Schedule:</span>
                        <p className="text-gray-600">{template.defaultSchedule}</p>
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && [
                    { label: 'Avg Completion Time', value: `${statistics.avgCompletionTime} days`, color: 'text-blue-600' },
                    { label: 'Avg Client Rating', value: `${statistics.avgClientRating.toFixed(1)}/5`, color: 'text-yellow-600' },
                    { label: 'Completion Rate', value: `${((statistics.completedReports / statistics.totalReports) * 100).toFixed(1)}%`, color: 'text-green-600' },
                    { label: 'On-time Delivery', value: `${(((statistics.totalReports - statistics.overdueReports) / statistics.totalReports) * 100).toFixed(1)}%`, color: 'text-purple-600' }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <span className={`text-lg font-bold ${metric.color}`}>{metric.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Types Distribution */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Report Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['MONTHLY_REVIEW', 'QUARTERLY_REVIEW', 'ANNUAL_REPORT', 'COMPLIANCE_REPORT', 'SENIOR_REVIEW'].map((type) => {
                    const count = reports.filter(r => r.type === type).length
                    const percentage = reports.length > 0 ? (count / reports.length) * 100 : 0
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getTypeColor(type)} variant="outline">
                            {type.replace('_', ' ')}
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
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {report.compliance.gdprCompliant && report.compliance.clientConsentValid && report.compliance.auditTrailComplete ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{report.clientName}</p>
                          <p className="text-xs text-gray-600">{report.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {report.compliance.gdprCompliant && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">GDPR ✓</Badge>
                        )}
                        {report.compliance.clientConsentValid && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Consent ✓</Badge>
                        )}
                        {report.compliance.auditTrailComplete && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">Audit ✓</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Issues */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Compliance Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports
                    .filter(r => !r.compliance.gdprCompliant || !r.compliance.clientConsentValid || !r.compliance.auditTrailComplete)
                    .map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="font-medium text-sm">{report.clientName}</p>
                          <p className="text-xs text-gray-600">{report.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!report.compliance.gdprCompliant && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700">GDPR ✗</Badge>
                        )}
                        {!report.compliance.clientConsentValid && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Consent ✗</Badge>
                        )}
                        {!report.compliance.auditTrailComplete && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Audit ✗</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {reports.filter(r => !r.compliance.gdprCompliant || !r.compliance.clientConsentValid || !r.compliance.auditTrailComplete).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No compliance issues found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
