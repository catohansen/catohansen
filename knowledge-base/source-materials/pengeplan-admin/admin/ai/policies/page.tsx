/**
 * Admin AI Policies - Manage AI behavior policies and guidelines
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  FileText, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Edit, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Download,
  Lock,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Target
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface AIPolicy {
  id: string
  name: string
  category: 'safety' | 'privacy' | 'accuracy' | 'ethics' | 'performance' | 'compliance'
  status: 'active' | 'inactive' | 'draft' | 'review'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  rules: string[]
  conditions: string[]
  actions: string[]
  lastUpdated: string
  updatedBy: string
  version: string
  appliesTo: string[]
  metrics?: {
    triggered: number
    blocked: number
    warnings: number
    effectiveness: number
  }
}

interface PolicyTemplate {
  id: string
  name: string
  category: string
  description: string
  template: Partial<AIPolicy>
}

export default function AdminAIPoliciesPage() {
  const [policies, setPolicies] = useState<AIPolicy[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<AIPolicy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showInactive, setShowInactive] = useState(false)

  // Sample AI policies data
  const samplePolicies: AIPolicy[] = [
    {
      id: 'safety-001',
      name: 'Financial Advice Safety',
      category: 'safety',
      status: 'active',
      priority: 'critical',
      description: 'Ensures AI does not provide specific investment advice without proper disclaimers',
      rules: [
        'Never provide specific stock recommendations',
        'Always include risk disclaimers for investment advice',
        'Redirect complex financial questions to human advisors',
        'Avoid guaranteeing financial outcomes'
      ],
      conditions: [
        'User asks for investment advice',
        'Discussion involves specific stocks or crypto',
        'Questions about guaranteed returns'
      ],
      actions: [
        'Add disclaimer about financial risks',
        'Suggest consulting with financial advisor',
        'Provide general educational information only'
      ],
      lastUpdated: '2024-09-20T10:30:00Z',
      updatedBy: 'Cato Hansen',
      version: '2.1.0',
      appliesTo: ['financial-advisor', 'chat-assistant', 'budget-helper'],
      metrics: {
        triggered: 1247,
        blocked: 23,
        warnings: 156,
        effectiveness: 94
      }
    },
    {
      id: 'privacy-001',
      name: 'Personal Data Protection',
      category: 'privacy',
      status: 'active',
      priority: 'critical',
      description: 'Protects user personal and financial information from unauthorized access',
      rules: [
        'Never store sensitive financial data in logs',
        'Anonymize user data in analytics',
        'Require explicit consent for data sharing',
        'Automatically delete expired session data'
      ],
      conditions: [
        'Processing personal financial data',
        'Generating reports with user information',
        'Sharing data with third parties'
      ],
      actions: [
        'Encrypt sensitive data',
        'Request user consent',
        'Apply data anonymization',
        'Log access attempts'
      ],
      lastUpdated: '2024-09-19T14:20:00Z',
      updatedBy: 'Security Team',
      version: '1.8.2',
      appliesTo: ['all-systems'],
      metrics: {
        triggered: 2341,
        blocked: 45,
        warnings: 234,
        effectiveness: 98
      }
    },
    {
      id: 'accuracy-001',
      name: 'Financial Calculation Accuracy',
      category: 'accuracy',
      status: 'active',
      priority: 'high',
      description: 'Ensures all financial calculations are accurate and properly validated',
      rules: [
        'Validate all mathematical operations',
        'Cross-check calculations with multiple methods',
        'Flag unusual or extreme results for review',
        'Provide calculation breakdowns for transparency'
      ],
      conditions: [
        'Performing budget calculations',
        'Computing loan payments',
        'Calculating investment returns'
      ],
      actions: [
        'Run validation algorithms',
        'Show calculation steps',
        'Flag for human review if uncertain',
        'Provide confidence scores'
      ],
      lastUpdated: '2024-09-18T09:15:00Z',
      updatedBy: 'AI Team',
      version: '3.0.1',
      appliesTo: ['budget-calculator', 'loan-calculator', 'investment-tracker'],
      metrics: {
        triggered: 5678,
        blocked: 12,
        warnings: 89,
        effectiveness: 96
      }
    },
    {
      id: 'ethics-001',
      name: 'Ethical AI Behavior',
      category: 'ethics',
      status: 'active',
      priority: 'high',
      description: 'Ensures AI behaves ethically and does not discriminate or manipulate users',
      rules: [
        'Treat all users fairly regardless of background',
        'Avoid manipulative language or dark patterns',
        'Respect user autonomy and decision-making',
        'Be transparent about AI limitations'
      ],
      conditions: [
        'Interacting with users from different backgrounds',
        'Providing recommendations or suggestions',
        'Handling sensitive financial situations'
      ],
      actions: [
        'Apply fairness algorithms',
        'Use neutral, respectful language',
        'Provide balanced perspectives',
        'Disclose AI involvement clearly'
      ],
      lastUpdated: '2024-09-17T16:45:00Z',
      updatedBy: 'Ethics Committee',
      version: '1.5.0',
      appliesTo: ['all-ai-systems'],
      metrics: {
        triggered: 892,
        blocked: 8,
        warnings: 34,
        effectiveness: 92
      }
    },
    {
      id: 'performance-001',
      name: 'Response Time Optimization',
      category: 'performance',
      status: 'active',
      priority: 'medium',
      description: 'Ensures AI responses are delivered within acceptable time limits',
      rules: [
        'Respond to user queries within 3 seconds',
        'Use caching for frequently asked questions',
        'Optimize model inference for speed',
        'Gracefully handle timeout scenarios'
      ],
      conditions: [
        'User submits a query',
        'System load is high',
        'Complex calculations required'
      ],
      actions: [
        'Use cached responses when appropriate',
        'Implement progressive loading',
        'Show loading indicators',
        'Provide partial results if needed'
      ],
      lastUpdated: '2024-09-16T11:30:00Z',
      updatedBy: 'Performance Team',
      version: '2.3.1',
      appliesTo: ['chat-interface', 'calculation-engine'],
      metrics: {
        triggered: 12456,
        blocked: 234,
        warnings: 567,
        effectiveness: 87
      }
    },
    {
      id: 'compliance-001',
      name: 'GDPR Compliance',
      category: 'compliance',
      status: 'active',
      priority: 'critical',
      description: 'Ensures all AI operations comply with GDPR and Norwegian data protection laws',
      rules: [
        'Obtain explicit consent for data processing',
        'Provide clear data usage explanations',
        'Enable data portability and deletion',
        'Maintain detailed processing logs'
      ],
      conditions: [
        'Processing EU citizen data',
        'Storing personal information',
        'Sharing data with partners'
      ],
      actions: [
        'Request consent with clear explanations',
        'Log all data processing activities',
        'Provide data export functionality',
        'Enable account deletion'
      ],
      lastUpdated: '2024-09-15T13:20:00Z',
      updatedBy: 'Legal Team',
      version: '1.9.0',
      appliesTo: ['all-systems'],
      metrics: {
        triggered: 3456,
        blocked: 67,
        warnings: 123,
        effectiveness: 99
      }
    }
  ]

  // Policy templates
  const policyTemplates: PolicyTemplate[] = [
    {
      id: 'template-safety',
      name: 'Safety Policy Template',
      category: 'safety',
      description: 'Template for creating new safety policies',
      template: {
        category: 'safety',
        status: 'draft',
        priority: 'high',
        rules: ['Define safety rule here'],
        conditions: ['Define trigger condition here'],
        actions: ['Define action to take here'],
        appliesTo: ['specify-ai-system']
      }
    },
    {
      id: 'template-privacy',
      name: 'Privacy Policy Template',
      category: 'privacy',
      description: 'Template for creating new privacy policies',
      template: {
        category: 'privacy',
        status: 'draft',
        priority: 'critical',
        rules: ['Define privacy rule here'],
        conditions: ['Define privacy trigger here'],
        actions: ['Define privacy action here'],
        appliesTo: ['all-systems']
      }
    }
  ]

  // Initialize with sample data
  useEffect(() => {
    setPolicies(samplePolicies)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return <Shield className="h-4 w-4" />
      case 'privacy': return <Lock className="h-4 w-4" />
      case 'accuracy': return <Target className="h-4 w-4" />
      case 'ethics': return <Users className="h-4 w-4" />
      case 'performance': return <Zap className="h-4 w-4" />
      case 'compliance': return <FileText className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus
    const matchesActive = showInactive || policy.status !== 'inactive'
    
    return matchesSearch && matchesCategory && matchesStatus && matchesActive
  })

  const createNewPolicy = (template?: PolicyTemplate) => {
    const newPolicy: AIPolicy = {
      id: `policy-${Date.now()}`,
      name: template ? `New ${template.name}` : 'New Policy',
      category: template?.template.category || 'safety',
      status: 'draft',
      priority: template?.template.priority || 'medium',
      description: template ? template.description : 'New policy description',
      rules: template?.template.rules || ['Define rule here'],
      conditions: template?.template.conditions || ['Define condition here'],
      actions: template?.template.actions || ['Define action here'],
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Current User',
      version: '1.0.0',
      appliesTo: template?.template.appliesTo || ['specify-system']
    }
    
    setSelectedPolicy(newPolicy)
    setIsEditing(true)
  }

  const savePolicy = () => {
    if (!selectedPolicy) return
    
    const existingIndex = policies.findIndex(p => p.id === selectedPolicy.id)
    if (existingIndex >= 0) {
      const updatedPolicies = [...policies]
      updatedPolicies[existingIndex] = {
        ...selectedPolicy,
        lastUpdated: new Date().toISOString(),
        version: `${selectedPolicy.version.split('.')[0]}.${parseInt(selectedPolicy.version.split('.')[1]) + 1}.0`
      }
      setPolicies(updatedPolicies)
    } else {
      setPolicies([...policies, selectedPolicy])
    }
    
    setIsEditing(false)
  }

  const deletePolicy = (policyId: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      setPolicies(policies.filter(p => p.id !== policyId))
      if (selectedPolicy?.id === policyId) {
        setSelectedPolicy(null)
      }
    }
  }

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' as any }
        : p
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Policies & Guidelines
              </h1>
              <p className="text-gray-600 mt-1">
                Administrer AI-atferdspolicyer og retningslinjer for trygg og etisk AI-bruk
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">Active Policies</p>
                  <p className="text-lg font-bold text-green-600">
                    {policies.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium">Critical Policies</p>
                  <p className="text-lg font-bold text-orange-600">
                    {policies.filter(p => p.priority === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">Avg Effectiveness</p>
                  <p className="text-lg font-bold text-blue-600">
                    {Math.round(policies.reduce((acc, p) => acc + (p.metrics?.effectiveness || 0), 0) / policies.length)}%
                  </p>
                </div>
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Søk policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="all">All Categories</option>
                <option value="safety">Safety</option>
                <option value="privacy">Privacy</option>
                <option value="accuracy">Accuracy</option>
                <option value="ethics">Ethics</option>
                <option value="performance">Performance</option>
                <option value="compliance">Compliance</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
              </select>
            </div>

            {/* Options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={showInactive} onCheckedChange={setShowInactive} />
                <label className="text-sm text-gray-600">Show Inactive</label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={() => createNewPolicy()} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                New Policy
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Policies List */}
        <div className="xl:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                AI Policies ({filteredPolicies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPolicies.map((policy) => (
                  <Card
                    key={policy.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPolicy?.id === policy.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            {getCategoryIcon(policy.category)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{policy.name}</h3>
                            <p className="text-sm text-gray-600">v{policy.version}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(policy.status)} variant="outline">
                            {policy.status}
                          </Badge>
                          <Badge className={getPriorityColor(policy.priority)} variant="outline">
                            {policy.priority}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{policy.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Updated: {new Date(policy.lastUpdated).toLocaleDateString('no-NO')}</span>
                          <span>By: {policy.updatedBy}</span>
                          <span>Applies to: {policy.appliesTo.length} systems</span>
                        </div>
                        
                        {policy.metrics && (
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3 text-green-600" />
                              <span className="text-green-600">{policy.metrics.effectiveness}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-blue-600" />
                              <span className="text-blue-600">{policy.metrics.triggered}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePolicyStatus(policy.id)
                          }}
                        >
                          {policy.status === 'active' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPolicy(policy)
                            setIsEditing(true)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePolicy(policy.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Details/Editor */}
        <div className="xl:col-span-1">
          {selectedPolicy ? (
            <Card className="sticky top-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(selectedPolicy.category)}
                    {isEditing ? 'Edit Policy' : 'Policy Details'}
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={savePolicy}>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  // Edit Mode
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <Input
                        value={selectedPolicy.name}
                        onChange={(e) => setSelectedPolicy({...selectedPolicy, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        value={selectedPolicy.description}
                        onChange={(e) => setSelectedPolicy({...selectedPolicy, description: e.target.value})}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={selectedPolicy.category}
                          onChange={(e) => setSelectedPolicy({...selectedPolicy, category: e.target.value as any})}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="safety">Safety</option>
                          <option value="privacy">Privacy</option>
                          <option value="accuracy">Accuracy</option>
                          <option value="ethics">Ethics</option>
                          <option value="performance">Performance</option>
                          <option value="compliance">Compliance</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Priority</label>
                        <select
                          value={selectedPolicy.priority}
                          onChange={(e) => setSelectedPolicy({...selectedPolicy, priority: e.target.value as any})}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Rules</label>
                      <Textarea
                        value={selectedPolicy.rules.join('\n')}
                        onChange={(e) => setSelectedPolicy({...selectedPolicy, rules: e.target.value.split('\n').filter(r => r.trim())})}
                        className="mt-1"
                        rows={4}
                        placeholder="Enter each rule on a new line"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Conditions</label>
                      <Textarea
                        value={selectedPolicy.conditions.join('\n')}
                        onChange={(e) => setSelectedPolicy({...selectedPolicy, conditions: e.target.value.split('\n').filter(c => c.trim())})}
                        className="mt-1"
                        rows={3}
                        placeholder="Enter each condition on a new line"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Actions</label>
                      <Textarea
                        value={selectedPolicy.actions.join('\n')}
                        onChange={(e) => setSelectedPolicy({...selectedPolicy, actions: e.target.value.split('\n').filter(a => a.trim())})}
                        className="mt-1"
                        rows={3}
                        placeholder="Enter each action on a new line"
                      />
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{selectedPolicy.name}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(selectedPolicy.status)} variant="outline">
                          {selectedPolicy.status}
                        </Badge>
                        <Badge className={getPriorityColor(selectedPolicy.priority)} variant="outline">
                          {selectedPolicy.priority}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedPolicy.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Rules ({selectedPolicy.rules.length})</h4>
                      <ul className="space-y-1">
                        {selectedPolicy.rules.map((rule, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Conditions ({selectedPolicy.conditions.length})</h4>
                      <ul className="space-y-1">
                        {selectedPolicy.conditions.map((condition, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Actions ({selectedPolicy.actions.length})</h4>
                      <ul className="space-y-1">
                        {selectedPolicy.actions.map((action, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Applies To</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPolicy.appliesTo.map((system) => (
                          <Badge key={system} variant="outline" className="text-xs">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedPolicy.metrics && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">{selectedPolicy.metrics.triggered}</p>
                            <p className="text-xs text-blue-500">Triggered</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-red-600">{selectedPolicy.metrics.blocked}</p>
                            <p className="text-xs text-red-500">Blocked</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-yellow-600">{selectedPolicy.metrics.warnings}</p>
                            <p className="text-xs text-yellow-500">Warnings</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">{selectedPolicy.metrics.effectiveness}%</p>
                            <p className="text-xs text-green-500">Effectiveness</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-3 border-t">
                      <p>Last updated: {new Date(selectedPolicy.lastUpdated).toLocaleString('no-NO')}</p>
                      <p>Updated by: {selectedPolicy.updatedBy}</p>
                      <p>Version: {selectedPolicy.version}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            // No policy selected
            <Card className="sticky top-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <Shield className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Select a Policy</h3>
                <p className="text-gray-600 mb-6">
                  Choose a policy from the list to view details, edit rules, or monitor performance.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Quick Actions:</h4>
                  <div className="space-y-2">
                    {policyTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => createNewPolicy(template)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
