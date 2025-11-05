'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  Bug, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Eye, 
  User, 
  Shield, 
  Globe, 
  Plus, 
  Edit,
  Server,
  Brain,
  Heart,
  Lock,
  Scale,
  Network
} from 'lucide-react'

interface AIIssue {
  id: string
  title: string
  description: string
  category: 'performance' | 'accuracy' | 'safety' | 'privacy' | 'ethics' | 'system' | 'integration'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'in-progress' | 'resolved' | 'closed' | 'wont-fix'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  reportedBy: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  affectedSystems: string[]
  tags: string[]
  reproductionSteps?: string[]
  expectedBehavior?: string
  actualBehavior?: string
  workaround?: string
  resolution?: string
  relatedIssues?: string[]
  metrics?: {
    usersAffected: number
    errorRate: number
    responseTime: number
    downtime: number
  }
}

// Sample AI issues data
const sampleIssues: AIIssue[] = [
  {
    id: 'issue-001',
    title: 'AI Financial Advisor Giving Incorrect Investment Advice',
    description: 'Users report that the AI is recommending high-risk investments to conservative investors without proper risk assessment.',
    category: 'safety',
    severity: 'critical',
    status: 'open',
    priority: 'high',
    assignedTo: 'AI Safety Team',
    reportedBy: 'User Feedback System',
    createdAt: '2024-09-15T10:30:00Z',
    updatedAt: '2024-09-20T14:22:00Z',
    affectedSystems: ['AI Coach', 'Investment Advisor', 'Risk Assessment'],
    tags: ['investment', 'risk-assessment', 'user-safety'],
    reproductionSteps: [
      'User sets risk tolerance to "Conservative"',
      'AI recommends cryptocurrency investments',
      'No risk warning displayed'
    ],
    expectedBehavior: 'AI should recommend low-risk investments for conservative users',
    actualBehavior: 'AI recommends high-risk investments without proper risk assessment',
    metrics: {
      usersAffected: 127,
      errorRate: 15.2,
      responseTime: 2.3,
      downtime: 0
    }
  },
  {
    id: 'issue-002',
    title: 'Slow Response Times in Budget Calculator',
    description: 'AI-powered budget calculations are taking longer than 5 seconds, causing user frustration.',
    category: 'performance',
    severity: 'high',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Performance Team',
    reportedBy: 'User Analytics',
    createdAt: '2024-09-18T14:20:00Z',
    updatedAt: '2024-09-20T09:45:00Z',
    affectedSystems: ['Budget Calculator', 'AI Engine'],
    tags: ['performance', 'budget-calculator', 'user-experience'],
    reproductionSteps: [
      'Navigate to budget calculator',
      'Enter income and expenses',
      'Click "Calculate Budget"'
    ],
    expectedBehavior: 'Budget calculation should complete within 2 seconds',
    actualBehavior: 'Budget calculation takes 5-8 seconds to complete',
    metrics: {
      usersAffected: 89,
      errorRate: 0,
      responseTime: 6.2,
      downtime: 0
    }
  },
  {
    id: 'issue-003',
    title: 'AI Coach Providing Inconsistent Advice',
    description: 'The AI coach gives different advice for similar financial situations, causing user confusion.',
    category: 'accuracy',
    severity: 'medium',
    status: 'investigating',
    priority: 'medium',
    assignedTo: 'AI Quality Team',
    reportedBy: 'User Support',
    createdAt: '2024-09-19T08:15:00Z',
    updatedAt: '2024-09-20T11:30:00Z',
    affectedSystems: ['AI Coach', 'Advice Engine'],
    tags: ['consistency', 'coaching', 'user-experience'],
    metrics: {
      usersAffected: 45,
      errorRate: 8.7,
      responseTime: 1.8,
      downtime: 0
    }
  }
]

export default function AdminAIIssuesPage() {
  const [issues, setIssues] = useState<AIIssue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<AIIssue[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIssues(sampleIssues)
    setFilteredIssues(sampleIssues)
  }, [])

  useEffect(() => {
    let filtered = issues

    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(issue => issue.category === selectedCategory)
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(issue => issue.severity === selectedSeverity)
    }

    setFilteredIssues(filtered)
  }, [issues, searchTerm, selectedCategory, selectedSeverity])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />
      case 'accuracy': return <CheckCircle className="h-4 w-4" />
      case 'safety': return <AlertTriangle className="h-4 w-4" />
      case 'privacy': return <Lock className="h-4 w-4" />
      case 'ethics': return <Heart className="h-4 w-4" />
      case 'system': return <Server className="h-4 w-4" />
      case 'integration': return <Network className="h-4 w-4" />
      default: return <Bug className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100'
      case 'investigating': return 'text-blue-600 bg-blue-100'
      case 'in-progress': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      case 'wont-fix': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const categories = [
    { value: 'all', label: 'Alle kategorier' },
    { value: 'performance', label: 'Ytelse' },
    { value: 'accuracy', label: 'Nøyaktighet' },
    { value: 'safety', label: 'Sikkerhet' },
    { value: 'privacy', label: 'Personvern' },
    { value: 'ethics', label: 'Etikk' },
    { value: 'system', label: 'System' },
    { value: 'integration', label: 'Integrasjon' }
  ]

  const severities = [
    { value: 'all', label: 'Alle alvorlighetsgrader' },
    { value: 'critical', label: 'Kritisk' },
    { value: 'high', label: 'Høy' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Lav' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                AI Issues Management
              </h1>
              <p className="text-xl text-gray-600">
                Overvåk og administrer AI-system problemer
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsLoading(!isLoading)} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Oppdater
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Ny Issue
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 mt-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Søk
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Søk i issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Alvorlighetsgrad
                </label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {severities.map(severity => (
                    <option key={severity.value} value={severity.value}>
                      {severity.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSelectedSeverity('all')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Nullstill filtre
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <div className="space-y-6">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getCategoryIcon(issue.category)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{issue.title}</CardTitle>
                      <CardDescription className="text-sm mb-3">
                        {issue.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority.toUpperCase()}
                        </Badge>
                        {issue.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Se
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Rediger
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tildelt til</p>
                    <p className="text-sm text-gray-600">{issue.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Rapportert av</p>
                    <p className="text-sm text-gray-600">{issue.reportedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Opprettet</p>
                    <p className="text-sm text-gray-600">
                      {new Date(issue.createdAt).toLocaleDateString('no-NO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Sist oppdatert</p>
                    <p className="text-sm text-gray-600">
                      {new Date(issue.updatedAt).toLocaleDateString('no-NO')}
                    </p>
                  </div>
                </div>

                {issue.metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {issue.metrics.usersAffected}
                      </div>
                      <p className="text-xs text-gray-600">Brukere påvirket</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {issue.metrics.errorRate}%
                      </div>
                      <p className="text-xs text-gray-600">Feilrate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {issue.metrics.responseTime}s
                      </div>
                      <p className="text-xs text-gray-600">Responsetid</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {issue.metrics.downtime}h
                      </div>
                      <p className="text-xs text-gray-600">Nedetid</p>
                    </div>
                  </div>
                )}

                {issue.affectedSystems && issue.affectedSystems.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Påvirkede systemer:</p>
                    <div className="flex flex-wrap gap-2">
                      {issue.affectedSystems.map((system, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardContent className="p-12 text-center">
              <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ingen issues funnet
              </h3>
              <p className="text-gray-600">
                Prøv å justere søkekriteriene eller opprett en ny issue.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}