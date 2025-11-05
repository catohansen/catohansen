'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Shield, 
  Target, 
  Bug,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface ImprovementProposal {
  id: string
  title: string
  description: string
  category: 'performance' | 'security' | 'feature' | 'optimization' | 'bugfix'
  priority: 'critical' | 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  aiConfidence: number
  codeChanges: string[]
  estimatedTime: string
  benefits: string[]
  risks: string[]
  dependencies: string[]
  status: 'proposed' | 'approved' | 'rejected' | 'implemented'
  createdAt: string
  approvedBy?: string
  implementedAt?: string
}

interface SystemAnalysis {
  performance: {
    responseTime: number
    accuracy: number
    userSatisfaction: number
    errorRate: number
    throughput: number
  }
  issues: {
    critical: string[]
    high: string[]
    medium: string[]
    low: string[]
  }
  improvements: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
    experimental: string[]
  }
  metrics: {
    codeQuality: number
    testCoverage: number
    documentationScore: number
    maintainabilityIndex: number
  }
}

export function AIImprovementsPanel() {
  const [proposals, setProposals] = useState<ImprovementProposal[]>([])
  const [analysis, setAnalysis] = useState<SystemAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProposal, setSelectedProposal] = useState<ImprovementProposal | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchImprovements()
  }, [])

  const fetchImprovements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/ai-improvements')
      const data = await response.json()
      
      if (data.success) {
        setProposals(data.data.proposals)
        setAnalysis(data.data.analysis)
      }
    } catch (error) {
      console.error('Error fetching AI improvements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (proposalId: string) => {
    try {
      setActionLoading(proposalId)
      const response = await fetch('/api/admin/ai-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          proposalId,
          approvedBy: 'admin'
        })
      })
      
      if (response.ok) {
        await fetchImprovements()
      }
    } catch (error) {
      console.error('Error approving proposal:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (proposalId: string, reason: string) => {
    try {
      setActionLoading(proposalId)
      const response = await fetch('/api/admin/ai-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          proposalId,
          reason
        })
      })
      
      if (response.ok) {
        await fetchImprovements()
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'feature': return <Target className="h-4 w-4" />
      case 'optimization': return <TrendingUp className="h-4 w-4" />
      case 'bugfix': return <Bug className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'proposed': return <Clock className="h-4 w-4 text-blue-500" />
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />
      case 'implemented': return <CheckCircle className="h-4 w-4 text-green-600" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Forbedringsforslag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Laster AI-forbedringer...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🧠 AI Forbedringsforslag</h2>
          <p className="text-gray-600">AI analyserer systemet og foreslår forbedringer</p>
        </div>
        <Button onClick={fetchImprovements} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Oppdater
        </Button>
      </div>

      {/* System Analysis */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Systemanalyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Responstid</span>
                  <span className="text-sm text-gray-600">{analysis.performance.responseTime.toFixed(0)}ms</span>
                </div>
                <Progress value={Math.min(100, (3000 - analysis.performance.responseTime) / 30)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nøyaktighet</span>
                  <span className="text-sm text-gray-600">{analysis.performance.accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={analysis.performance.accuracy} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Brukertilfredshet</span>
                  <span className="text-sm text-gray-600">{analysis.performance.userSatisfaction.toFixed(1)}%</span>
                </div>
                <Progress value={analysis.performance.userSatisfaction} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kodekvalitet</span>
                  <span className="text-sm text-gray-600">{analysis.metrics.codeQuality.toFixed(1)}%</span>
                </div>
                <Progress value={analysis.metrics.codeQuality} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposals */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Alle ({proposals.length})</TabsTrigger>
          <TabsTrigger value="proposed">Venter ({proposals.filter(p => p.status === 'proposed').length})</TabsTrigger>
          <TabsTrigger value="approved">Godkjent ({proposals.filter(p => p.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="implemented">Implementert ({proposals.filter(p => p.status === 'implemented').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(proposal.category)}
                    <div>
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <CardDescription>{proposal.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(proposal.status)}
                    <Badge className={getPriorityColor(proposal.priority)}>
                      {proposal.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">AI Konfidens</span>
                    <div className="flex items-center gap-2">
                      <Progress value={proposal.aiConfidence * 100} className="flex-1" />
                      <span className="text-sm">{(proposal.aiConfidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Påvirkning</span>
                    <Badge variant="outline" className="ml-2">
                      {proposal.impact.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Estimert tid</span>
                    <span className="text-sm ml-2">{proposal.estimatedTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {proposal.category.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {proposal.status === 'proposed' && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Detaljer
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{proposal.title}</DialogTitle>
                              <DialogDescription>{proposal.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Kodeendringer:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {proposal.codeChanges.map((change, index) => (
                                    <li key={index} className="text-sm">{change}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Fordeler:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {proposal.benefits.map((benefit, index) => (
                                    <li key={index} className="text-sm">{benefit}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Risikoer:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {proposal.risks.map((risk, index) => (
                                    <li key={index} className="text-sm">{risk}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleReject(proposal.id, 'Ikke relevant')}
                                disabled={actionLoading === proposal.id}
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Avslå
                              </Button>
                              <Button
                                onClick={() => handleApprove(proposal.id)}
                                disabled={actionLoading === proposal.id}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Godkjenn
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    
                    {proposal.status === 'implemented' && (
                      <Badge className="bg-green-100 text-green-800">
                        ✅ Implementert
                      </Badge>
                    )}
                    
                    {proposal.status === 'rejected' && (
                      <Badge className="bg-red-100 text-red-800">
                        ❌ Avslått
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="proposed">
          {proposals.filter(p => p.status === 'proposed').map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(proposal.category)}
                  <div>
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <CardDescription>{proposal.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={getPriorityColor(proposal.priority)}>
                    {proposal.priority.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(proposal.id, 'Ikke relevant')}
                      disabled={actionLoading === proposal.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Avslå
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(proposal.id)}
                      disabled={actionLoading === proposal.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Godkjenn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved">
          {proposals.filter(p => p.status === 'approved').map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(proposal.category)}
                  <div>
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <CardDescription>{proposal.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Godkjent av {proposal.approvedBy}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="implemented">
          {proposals.filter(p => p.status === 'implemented').map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getCategoryIcon(proposal.category)}
                  <div>
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <CardDescription>{proposal.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">
                    🚀 Implementert
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {proposal.implementedAt && new Date(proposal.implementedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}



