/**
 * AI Act Compliance Dashboard
 * 
 * Frontend page for managing AI Act compliance
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Shield, Activity, Database, Brain, CheckCircle, AlertTriangle, XCircle,
  RefreshCw, Eye, Lock, TrendingUp, TrendingDown, Clock, Users, Zap, BarChart3,
  FileText, Globe, Server, Cpu, HardDrive, Network, Smartphone, Monitor, Bot,
  Sparkles, Target, Star, ArrowUpRight, ArrowDownRight, DollarSign, Search,
  Filter, Download, ExternalLink, Info, CreditCard, Settings, AlertCircle,
  X, Loader2, Pause, Play, Layers, Scale, Gauge, PieChart, AreaChart,
  Plus, Edit, Trash2, Save, AlertOctagon, CheckSquare, Square, UserCheck
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Area, Pie,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from 'recharts'
// Removed non-existent imports - using Card components instead

// Define interfaces for data structures
interface AIModel {
  id: string
  name: string
  version: string
  type: string
  riskLevel: 'minimal' | 'limited' | 'high'
  trainingData: string
  humanOversightRequired: boolean
  description: string
  createdAt: string
  updatedAt: string
}

interface UsageRecord {
  id: string
  modelId: string
  inputData: string
  outputData: string
  processingTime: number
  confidence: number
  userId: string
  context: string
  timestamp: Date
  humanReviewed: boolean
  decision?: 'approved' | 'rejected' | 'modified' | 'pending'
  reviewerId?: string
  reviewExplanation?: string
  reviewTimestamp?: Date
}

interface ComplianceData {
  overallComplianceScore: number
  totalModels: number
  highRiskModels: number
  humanOversightEnabled: number
  pendingReviews: number
  complianceStatus: Array<{ name: string; score: number }>
  recentUsage: Array<{ date: string; count: number }>
  riskDistribution: Array<{ level: string; count: number }>
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple'
  loading?: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = 'blue',
  loading = false
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200'
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'orange': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'red': return 'text-red-600 bg-red-50 border-red-200'
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card className={`${getColorClasses(color)} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-lg font-semibold">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{value}</p>
              )}
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {trend && trendValue && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(trend)}
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const AIActComplianceDashboard: React.FC = () => {
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(null)
  const [models, setModels] = useState<AIModel[]>([])
  const [pendingReviews, setPendingReviews] = useState<UsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)
  
  // Model management state
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<AIModel | null>(null)
  const [modelForm, setModelForm] = useState({
    name: '',
    version: '',
    type: '',
    riskLevel: 'minimal' as 'minimal' | 'limited' | 'high',
    trainingData: '',
    humanOversightRequired: false,
    description: ''
  })

  // Review state
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<UsageRecord | null>(null)
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'rejected' | 'modified'>('approved')
  const [reviewExplanation, setReviewExplanation] = useState('')

  const fetchComplianceData = useCallback(async () => {
    try {
      const [complianceResponse, modelsResponse, reviewsResponse] = await Promise.all([
        fetch('/api/admin/ai/compliance'),
        fetch('/api/admin/ai/models'),
        fetch('/api/admin/ai/review/pending')
      ])

      if (complianceResponse.ok) {
        const complianceResult = await complianceResponse.json()
        setComplianceData(complianceResult.data)
      }

      if (modelsResponse.ok) {
        const modelsResult = await modelsResponse.json()
        setModels(modelsResult.data)
      }

      if (reviewsResponse.ok) {
        const reviewsResult = await reviewsResponse.json()
        setPendingReviews(reviewsResult.data)
      }
    } catch (error) {
      console.error('Error fetching AI Act compliance data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchComplianceData()
  }, [fetchComplianceData])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        setRefreshing(true)
        fetchComplianceData()
      }, 30000) // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, fetchComplianceData])

  const handleModelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingModel ? `/api/admin/ai/models/${editingModel.id}` : '/api/admin/ai/models'
      const method = editingModel ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelForm)
      })

      if (response.ok) {
        await fetchComplianceData()
        setIsModelDialogOpen(false)
        setEditingModel(null)
        setModelForm({
          name: '',
          version: '',
          type: '',
          riskLevel: 'minimal',
          trainingData: '',
          humanOversightRequired: false,
          description: ''
        })
      }
    } catch (error) {
      console.error('Error saving model:', error)
    }
  }

  const handleReviewSubmit = async () => {
    if (!selectedReview) return

    try {
      const response = await fetch('/api/admin/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usageRecordId: selectedReview.id,
          decision: reviewDecision,
          explanation: reviewExplanation
        })
      })

      if (response.ok) {
        await fetchComplianceData()
        setIsReviewDialogOpen(false)
        setSelectedReview(null)
        setReviewExplanation('')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'minimal': return 'green'
      case 'limited': return 'orange'
      case 'high': return 'red'
      default: return 'blue'
    }
  }

  const getRiskLevelBadge = (riskLevel: string) => {
    const color = getRiskLevelColor(riskLevel)
    return (
      <Badge 
        variant={color === 'green' ? 'default' : color === 'orange' ? 'secondary' : 'destructive'}
        className={`bg-${color}-500 text-white`}
      >
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </Badge>
    )
  }

  if (loading) {
    return (
      <div>
        <h1>AI Act Compliance</h1>
        <p>Overvåkning og administrasjon av AI-modeller i henhold til AI Act.</p>
        <div className="text-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Laster AI Act compliance data...</p>
        </div>
      </div>
    )
  }

  if (!complianceData) {
    return (
      <div>
        <h1>AI Act Compliance</h1>
        <p>Overvåkning og administrasjon av AI-modeller i henhold til AI Act.</p>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feil</AlertTitle>
          <AlertDescription>
            Kunne ikke laste AI Act compliance data. Vennligst prøv igjen.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="h-8 w-8 text-blue-600" /> AI Act Compliance
          <p className="text-gray-600">
            Overvåkning og administrasjon av AI-modeller i henhold til AI Act, inkludert risikovurdering og menneskelig tilsyn.
          </p>
        </div>

        <div className="flex justify-end mb-4 space-x-2">
          <Button 
            onClick={() => { setLoading(true); fetchComplianceData() }} 
            disabled={refreshing}
            variant="outline"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {refreshing ? 'Oppdaterer...' : 'Manuell Oppdatering'}
          </Button>
          <Button 
            onClick={() => setAutoRefresh(!autoRefresh)} 
            variant={autoRefresh ? "default" : "outline"}
          >
            {autoRefresh ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            Auto-oppdatering {autoRefresh ? 'På' : 'Av'}
          </Button>
        </div>

        {/* Overall Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Overall Compliance Score"
            value={`${complianceData.overallComplianceScore}%`}
            icon={<Scale className="h-5 w-5" />}
            color={complianceData.overallComplianceScore < 90 ? 'orange' : 'green'}
            subtitle="AI Act compliance"
          />
          <MetricCard
            title="Total AI Models"
            value={complianceData.totalModels}
            icon={<Bot className="h-5 w-5" />}
            color="blue"
            subtitle={`${complianceData.highRiskModels} high-risk`}
          />
          <MetricCard
            title="Human Oversight Enabled"
            value={complianceData.humanOversightEnabled}
            icon={<Eye className="h-5 w-5" />}
            color="purple"
            subtitle="Models with oversight"
          />
          <MetricCard
            title="Pending Reviews"
            value={complianceData.pendingReviews}
            icon={<AlertOctagon className="h-5 w-5" />}
            color={complianceData.pendingReviews > 0 ? 'red' : 'green'}
            subtitle="Awaiting review"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="models">AI Modeller</TabsTrigger>
            <TabsTrigger value="reviews">Gjennomganger</TabsTrigger>
            <TabsTrigger value="analytics">Analytikk</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Compliance Status</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={complianceData.complianceStatus}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Compliance" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Risk Distribution</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={complianceData.riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ level, percent }) => `${level}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      >
                        {complianceData.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Recent AI Usage</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complianceData.recentUsage || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Usage Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">AI Modeller</h3>
              <Dialog>
                <DialogTrigger>
                  <Button onClick={() => setEditingModel(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ny AI Modell
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingModel ? 'Rediger AI Modell' : 'Ny AI Modell'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingModel ? 'Oppdater AI modell informasjon' : 'Registrer en ny AI modell for compliance overvåkning'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleModelSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Modell Navn</Label>
                        <Input
                          id="name"
                          value={modelForm.name}
                          onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="version">Versjon</Label>
                        <Input
                          id="version"
                          value={modelForm.version}
                          onChange={(e) => setModelForm({ ...modelForm, version: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Modell Type</Label>
                        <Input
                          id="type"
                          value={modelForm.type}
                          onChange={(e) => setModelForm({ ...modelForm, type: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="riskLevel">Risiko Nivå</Label>
                        <Select
                          value={modelForm.riskLevel}
                          onValueChange={(value: 'minimal' | 'limited' | 'high') => 
                            setModelForm({ ...modelForm, riskLevel: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">Minimal Risk</SelectItem>
                            <SelectItem value="limited">Limited Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="trainingData">Treningsdata</Label>
                      <Textarea
                        id="trainingData"
                        value={modelForm.trainingData}
                        onChange={(e) => setModelForm({ ...modelForm, trainingData: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Beskrivelse</Label>
                      <Textarea
                        id="description"
                        value={modelForm.description}
                        onChange={(e) => setModelForm({ ...modelForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="humanOversightRequired"
                        checked={modelForm.humanOversightRequired}
                        onChange={(e) => setModelForm({ ...modelForm, humanOversightRequired: e.target.checked })}
                      />
                      <Label htmlFor="humanOversightRequired">Menneskelig tilsyn påkrevd</Label>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {editingModel ? 'Oppdater' : 'Opprett'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {models.map((model) => (
                <Card key={model.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Bot className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{model.name} v{model.version}</h4>
                          <p className="text-sm text-gray-600">{model.type}</p>
                          <p className="text-xs text-gray-500">{model.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRiskLevelBadge(model.riskLevel)}
                        {model.humanOversightRequired && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Eye className="h-3 w-3 mr-1" />
                            Tilsyn
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingModel(model)
                            setModelForm({
                              name: model.name,
                              version: model.version,
                              type: model.type,
                              riskLevel: model.riskLevel,
                              trainingData: model.trainingData,
                              humanOversightRequired: model.humanOversightRequired,
                              description: model.description
                            })
                            setIsModelDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Venter på Gjennomgang</h3>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {pendingReviews.length} venter
              </Badge>
            </div>

            <div className="grid gap-4">
              {pendingReviews.length > 0 ? (
                pendingReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertOctagon className="h-5 w-5 text-red-500" />
                            <span className="font-semibold">AI Decision Review Required</span>
                            <Badge variant="destructive">Pending</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Input:</strong> {review.inputData.substring(0, 100)}...
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Output:</strong> {review.outputData.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-500">
                            Bruker: {review.userId} • Tid: {review.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedReview(review)
                            setIsReviewDialogOpen(true)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Gjennomgå
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ingen ventende gjennomganger</h3>
                    <p className="text-gray-600">Alle AI-beslutninger er gjennomgått.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Review Dialog */}
            <Dialog>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Gjennomgå AI Beslutning</DialogTitle>
                  <DialogDescription>
                    Vurder AI-modellens beslutning og gi din mening.
                  </DialogDescription>
                </DialogHeader>
                {selectedReview && (
                  <div className="space-y-4">
                    <div>
                      <Label>Input Data</Label>
                      <Textarea
                        value={selectedReview.inputData}
                        readOnly
                        rows={3}
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label>AI Output</Label>
                      <Textarea
                        value={selectedReview.outputData}
                        readOnly
                        rows={3}
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label>Din Beslutning</Label>
                      <Select
                        value={reviewDecision}
                        onValueChange={(value: 'approved' | 'rejected' | 'modified') => 
                          setReviewDecision(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Godkjent</SelectItem>
                          <SelectItem value="rejected">Avvist</SelectItem>
                          <SelectItem value="modified">Modifisert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Forklaring</Label>
                      <Textarea
                        value={reviewExplanation}
                        onChange={(e) => setReviewExplanation(e.target.value)}
                        placeholder="Forklar din beslutning..."
                        rows={3}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleReviewSubmit}>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Send Gjennomgang
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Compliance Trend</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceData.recentUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Risk Level Distribution</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={complianceData.riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ level, percent }) => `${level}: ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                      >
                        {complianceData.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AIActComplianceDashboard
