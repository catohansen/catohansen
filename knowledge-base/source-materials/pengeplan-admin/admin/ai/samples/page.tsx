/**
 * Admin AI Samples - Manage AI training samples and test data
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  Brain, 
  FileText, 
  MessageSquare, 
  Target, 
  Info, 
  Search, 
  Edit, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Star,
  Copy,
  Archive
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

interface AISample {
  id: string
  type: 'training' | 'validation' | 'test' | 'production'
  category: 'financial-advice' | 'budget-help' | 'debt-management' | 'investment-guidance' | 'general-chat' | 'support'
  input: string
  expectedOutput: string
  actualOutput?: string
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'unrated'
  status: 'active' | 'inactive' | 'pending-review' | 'approved' | 'rejected'
  source: 'user-interaction' | 'manual-creation' | 'synthetic-generation' | 'expert-curated'
  tags: string[]
  metadata: {
    createdAt: string
    updatedAt: string
    createdBy: string
    reviewedBy?: string
    usageCount: number
    successRate: number
    confidence: number
    difficulty: 'easy' | 'medium' | 'hard' | 'expert'
    language: string
    context?: string
  }
  feedback?: {
    rating: number
    comments: string
    reviewer: string
    timestamp: string
  }[]
  relatedSamples?: string[]
  variations?: {
    id: string
    input: string
    expectedOutput: string
    note: string
  }[]
}

interface SampleCollection {
  id: string
  name: string
  description: string
  category: string
  samples: string[]
  createdAt: string
  createdBy: string
  isPublic: boolean
  tags: string[]
  stats: {
    totalSamples: number
    avgQuality: number
    avgSuccessRate: number
  }
}

export default function AdminAISamplesPage() {
  const [samples, setSamples] = useState<AISample[]>([])
  const [collections, setCollections] = useState<SampleCollection[]>([])
  const [selectedSample, setSelectedSample] = useState<AISample | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterQuality, setFilterQuality] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showInactive, setShowInactive] = useState(false)
  const [_isLoading, _setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('samples')

  // Sample AI training data
  const sampleData: AISample[] = [
    {
      id: 'sample-001',
      type: 'training',
      category: 'financial-advice',
      input: 'Jeg har 50 000 kr på sparekonto. Hvor mye bør jeg investere i aksjer?',
      expectedOutput: 'Det er viktig å først sikre at du har en nødreserve på 3-6 måneder med utgifter før du investerer. Generelt anbefales det å ikke investere mer enn 80% av sparepengene dine i aksjer, og dette bør tilpasses din risikoprofil og tidshorisont. Jeg anbefaler at du konsulterer en finansrådgiver for personlig veiledning.',
      actualOutput: 'Du bør investere alt i aksjer for maksimal avkastning!',
      quality: 'poor',
      status: 'rejected',
      source: 'user-interaction',
      tags: ['investment', 'risk-assessment', 'savings', 'safety'],
      metadata: {
        createdAt: '2024-09-20T08:30:00Z',
        updatedAt: '2024-09-20T10:15:00Z',
        createdBy: 'AI Training System',
        reviewedBy: 'Financial Expert',
        usageCount: 156,
        successRate: 23.4,
        confidence: 0.45,
        difficulty: 'medium',
        language: 'no',
        context: 'New investor seeking guidance'
      },
      feedback: [
        {
          rating: 1,
          comments: 'Farlig råd! AI må ikke anbefale å investere alt uten risikovurdering.',
          reviewer: 'Safety Team',
          timestamp: '2024-09-20T10:15:00Z'
        }
      ]
    },
    {
      id: 'sample-002',
      type: 'training',
      category: 'budget-help',
      input: 'Hvordan kan jeg spare 2000 kr i måneden på mitt budsjett?',
      expectedOutput: 'For å spare 2000 kr månedlig, kan du: 1) Gjennomgå faste utgifter som abonnementer og forsikringer, 2) Reduser handleutgifter ved å planlegge måltider og handle med liste, 3) Vurder transport-alternativer som kollektivt vs bil, 4) Se på energibesparende tiltak hjemme. Jeg kan hjelpe deg analysere ditt spesifikke budsjett for mer målrettede forslag.',
      actualOutput: 'Her er noen praktiske tips for å spare 2000 kr månedlig: Gjennomgå abonnementer du ikke bruker, planlegg måltider for å redusere matsvinn, vurder kollektivtransport, og se på energibesparende tiltak. Vil du at jeg skal hjelpe deg analysere ditt budsjett mer detaljert?',
      quality: 'excellent',
      status: 'approved',
      source: 'expert-curated',
      tags: ['budgeting', 'savings', 'expense-reduction', 'practical-tips'],
      metadata: {
        createdAt: '2024-09-19T14:20:00Z',
        updatedAt: '2024-09-19T16:30:00Z',
        createdBy: 'Budget Expert',
        reviewedBy: 'Quality Team',
        usageCount: 342,
        successRate: 94.2,
        confidence: 0.92,
        difficulty: 'easy',
        language: 'no',
        context: 'User seeking practical savings advice'
      },
      feedback: [
        {
          rating: 5,
          comments: 'Utmerket balansert råd med konkrete, gjennomførbare forslag.',
          reviewer: 'Financial Advisor',
          timestamp: '2024-09-19T16:30:00Z'
        }
      ],
      variations: [
        {
          id: 'v1',
          input: 'Jeg trenger å kutte 2000 kr fra budsjettet mitt. Hva foreslår du?',
          expectedOutput: 'La oss se på hvor du kan kutte utgifter...',
          note: 'Alternative phrasing for same request'
        }
      ]
    },
    {
      id: 'sample-003',
      type: 'validation',
      category: 'debt-management',
      input: 'Jeg har 200 000 kr i kredittkortgjeld med 20% rente. Hva bør jeg gjøre?',
      expectedOutput: 'Med så høy rente er det kritisk å prioritere nedbetaling av kredittkortgjelden. Strategier: 1) Stopp all ny bruk av kredittkortet, 2) Betal mer enn minimum hver måned, 3) Vurder refinansiering til lavere rente, 4) Lag en streng nedbetalingsplan. Med 20% rente koster gjelden deg 40 000 kr årlig i renter alene. Kontakt banken for refinansieringsmuligheter.',
      actualOutput: 'Det er viktig å håndtere høy kredittkortgjeld raskt. Stopp ny bruk av kortet, betal mer enn minimum, og vurder refinansiering til lavere rente. Med 20% rente betaler du mye i renter, så prioriter nedbetaling høyt.',
      quality: 'good',
      status: 'approved',
      source: 'manual-creation',
      tags: ['debt', 'credit-card', 'high-interest', 'refinancing'],
      metadata: {
        createdAt: '2024-09-18T11:00:00Z',
        updatedAt: '2024-09-18T15:45:00Z',
        createdBy: 'Debt Counselor',
        reviewedBy: 'Senior Advisor',
        usageCount: 89,
        successRate: 87.6,
        confidence: 0.88,
        difficulty: 'hard',
        language: 'no',
        context: 'High-interest debt emergency'
      }
    },
    {
      id: 'sample-004',
      type: 'test',
      category: 'investment-guidance',
      input: 'Er det lurt å investere i kryptovaluta nå?',
      expectedOutput: 'Kryptovaluta er en høyrisiko-investering med stor volatilitet. Før du vurderer krypto: 1) Sørg for at du har en solid økonomi med nødreserve, 2) Invester aldri mer enn du har råd til å tape, 3) Forstå at verdien kan svinge dramatisk, 4) Vurder krypto som en liten del (maks 5-10%) av en diversifisert portefølje. Dette er ikke finansiell rådgivning - konsulter en rådgiver for personlig veiledning.',
      actualOutput: 'Kryptovaluta er høyrisiko med stor volatilitet. Invester kun det du har råd til å tape, maksimalt 5-10% av porteføljen din, og sørg for solid økonomi først. Konsulter finansrådgiver for personlig veiledning.',
      quality: 'excellent',
      status: 'approved',
      source: 'expert-curated',
      tags: ['cryptocurrency', 'high-risk', 'portfolio-allocation', 'volatility'],
      metadata: {
        createdAt: '2024-09-17T09:15:00Z',
        updatedAt: '2024-09-17T11:30:00Z',
        createdBy: 'Investment Expert',
        reviewedBy: 'Risk Team',
        usageCount: 234,
        successRate: 91.3,
        confidence: 0.89,
        difficulty: 'expert',
        language: 'no',
        context: 'Crypto investment inquiry'
      }
    },
    {
      id: 'sample-005',
      type: 'production',
      category: 'general-chat',
      input: 'Hei! Kan du hjelpe meg med økonomien min?',
      expectedOutput: 'Hei! Jeg er her for å hjelpe deg med økonomiske spørsmål. Jeg kan assistere med budsjettplanlegging, sparing, gjeldshåndtering, investeringsveiledning og generelle økonomiske råd. Hva ønsker du hjelp med i dag? Vær gjerne så spesifikk som mulig, så kan jeg gi deg best mulig veiledning.',
      actualOutput: 'Hei! Absolutt, jeg hjelper gjerne med økonomiske spørsmål. Jeg kan hjelpe med budsjett, sparing, gjeld, investeringer og mer. Hva kan jeg hjelpe deg med?',
      quality: 'good',
      status: 'active',
      source: 'synthetic-generation',
      tags: ['greeting', 'general-help', 'introduction'],
      metadata: {
        createdAt: '2024-09-16T13:30:00Z',
        updatedAt: '2024-09-16T14:00:00Z',
        createdBy: 'AI Generator',
        usageCount: 1247,
        successRate: 96.8,
        confidence: 0.95,
        difficulty: 'easy',
        language: 'no',
        context: 'Initial user interaction'
      }
    },
    {
      id: 'sample-006',
      type: 'training',
      category: 'support',
      input: 'Jeg forstår ikke hvordan jeg bruker budsjettkalkulatoren',
      expectedOutput: 'Jeg hjelper deg gjerne med budsjettkalkulatoren! Her er en enkel guide: 1) Gå til "Budsjett" i menyen, 2) Legg inn dine månedlige inntekter, 3) Registrer faste utgifter som husleie, strøm, forsikringer, 4) Legg til variable utgifter som mat, transport, fritid, 5) Kalkulatoren viser automatisk hvor mye du har igjen til sparing. Trenger du hjelp med noen spesifikke steg?',
      actualOutput: 'Budsjettkalkulatoren finner du under "Budsjett". Legg inn inntekter og utgifter, så beregner den automatisk hvor mye du kan spare. Trenger du mer detaljert hjelp?',
      quality: 'fair',
      status: 'pending-review',
      source: 'user-interaction',
      tags: ['support', 'tutorial', 'budget-calculator', 'user-guide'],
      metadata: {
        createdAt: '2024-09-15T10:45:00Z',
        updatedAt: '2024-09-15T10:45:00Z',
        createdBy: 'Support System',
        usageCount: 67,
        successRate: 73.1,
        confidence: 0.71,
        difficulty: 'easy',
        language: 'no',
        context: 'User needs help with app features'
      }
    }
  ]

  // Sample collections
  const sampleCollections: SampleCollection[] = [
    {
      id: 'collection-001',
      name: 'Financial Safety Training Set',
      description: 'Curated samples for training AI to give safe financial advice',
      category: 'safety',
      samples: ['sample-001', 'sample-004'],
      createdAt: '2024-09-20T08:00:00Z',
      createdBy: 'Safety Team',
      isPublic: false,
      tags: ['safety', 'financial-advice', 'risk-management'],
      stats: {
        totalSamples: 156,
        avgQuality: 4.2,
        avgSuccessRate: 89.3
      }
    },
    {
      id: 'collection-002',
      name: 'Budget Helper Responses',
      description: 'High-quality responses for budget-related queries',
      category: 'budgeting',
      samples: ['sample-002'],
      createdAt: '2024-09-19T12:00:00Z',
      createdBy: 'Budget Team',
      isPublic: true,
      tags: ['budgeting', 'savings', 'practical-advice'],
      stats: {
        totalSamples: 89,
        avgQuality: 4.7,
        avgSuccessRate: 94.1
      }
    }
  ]

  // Initialize with sample data
  useEffect(() => {
    setSamples(sampleData)
    setCollections(sampleCollections)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial-advice': return <Target className="h-4 w-4" />
      case 'budget-help': return <BarChart3 className="h-4 w-4" />
      case 'debt-management': return <TrendingDown className="h-4 w-4" />
      case 'investment-guidance': return <TrendingUp className="h-4 w-4" />
      case 'general-chat': return <MessageSquare className="h-4 w-4" />
      case 'support': return <Info className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'poor': return 'bg-red-100 text-red-800 border-red-300'
      case 'unrated': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'pending-review': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'training': return 'bg-purple-100 text-purple-800'
      case 'validation': return 'bg-blue-100 text-blue-800'
      case 'test': return 'bg-orange-100 text-orange-800'
      case 'production': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.expectedOutput.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || sample.type === filterType
    const matchesCategory = filterCategory === 'all' || sample.category === filterCategory
    const matchesQuality = filterQuality === 'all' || sample.quality === filterQuality
    const matchesStatus = filterStatus === 'all' || sample.status === filterStatus
    const matchesActive = showInactive || sample.status !== 'inactive'
    
    return matchesSearch && matchesType && matchesCategory && matchesQuality && matchesStatus && matchesActive
  }).sort((a, b) => {
    // Sort by quality and success rate
    const qualityOrder = { excellent: 5, good: 4, fair: 3, poor: 2, unrated: 1 }
    const aQuality = qualityOrder[a.quality as keyof typeof qualityOrder] || 0
    const bQuality = qualityOrder[b.quality as keyof typeof qualityOrder] || 0
    
    return (bQuality * 100 + b.metadata.successRate) - (aQuality * 100 + a.metadata.successRate)
  })

  const createNewSample = () => {
    const newSample: AISample = {
      id: `sample-${Date.now()}`,
      type: 'training',
      category: 'general-chat',
      input: 'New sample input',
      expectedOutput: 'Expected AI response',
      quality: 'unrated',
      status: 'pending-review',
      source: 'manual-creation',
      tags: ['new-sample'],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
        usageCount: 0,
        successRate: 0,
        confidence: 0,
        difficulty: 'medium',
        language: 'no'
      }
    }
    
    setSelectedSample(newSample)
    setIsCreating(true)
    setIsEditing(true)
  }

  const saveSample = () => {
    if (!selectedSample) return
    
    const existingIndex = samples.findIndex(s => s.id === selectedSample.id)
    if (existingIndex >= 0) {
      const updatedSamples = [...samples]
      updatedSamples[existingIndex] = {
        ...selectedSample,
        metadata: {
          ...selectedSample.metadata,
          updatedAt: new Date().toISOString()
        }
      }
      setSamples(updatedSamples)
    } else {
      setSamples([...samples, selectedSample])
    }
    
    setIsEditing(false)
    setIsCreating(false)
  }

  const deleteSample = (sampleId: string) => {
    if (confirm('Are you sure you want to delete this sample?')) {
      setSamples(samples.filter(s => s.id !== sampleId))
      if (selectedSample?.id === sampleId) {
        setSelectedSample(null)
      }
    }
  }

  const getSampleStats = () => {
    const total = samples.length
    const byType = {
      training: samples.filter(s => s.type === 'training').length,
      validation: samples.filter(s => s.type === 'validation').length,
      test: samples.filter(s => s.type === 'test').length,
      production: samples.filter(s => s.type === 'production').length
    }
    const avgQuality = samples.reduce((acc, s) => {
      const qualityScore = { excellent: 5, good: 4, fair: 3, poor: 2, unrated: 1 }
      return acc + (qualityScore[s.quality as keyof typeof qualityScore] || 1)
    }, 0) / samples.length
    const avgSuccessRate = samples.reduce((acc, s) => acc + s.metadata.successRate, 0) / samples.length
    
    return { total, byType, avgQuality: Math.round(avgQuality * 10) / 10, avgSuccessRate: Math.round(avgSuccessRate * 10) / 10 }
  }

  const stats = getSampleStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Training Samples
              </h1>
              <p className="text-gray-600 mt-1">
                Administrer AI-treningsdata og testsamples for bedre ytelse
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium">Total Samples</p>
                  <p className="text-lg font-bold text-purple-600">{stats.total}</p>
                </div>
                <Database className="h-6 w-6 text-purple-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">Training</p>
                  <p className="text-lg font-bold text-blue-600">{stats.byType.training}</p>
                </div>
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">Avg Quality</p>
                  <p className="text-lg font-bold text-green-600">{stats.avgQuality}/5</p>
                </div>
                <Star className="h-6 w-6 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-3 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium">Success Rate</p>
                  <p className="text-lg font-bold text-orange-600">{stats.avgSuccessRate}%</p>
                </div>
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Søk samples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filters */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm text-sm w-full"
              >
                <option value="all">All Types</option>
                <option value="training">Training</option>
                <option value="validation">Validation</option>
                <option value="test">Test</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm text-sm w-full"
              >
                <option value="all">All Categories</option>
                <option value="financial-advice">Financial Advice</option>
                <option value="budget-help">Budget Help</option>
                <option value="debt-management">Debt Management</option>
                <option value="investment-guidance">Investment Guidance</option>
                <option value="general-chat">General Chat</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div>
              <select
                value={filterQuality}
                onChange={(e) => setFilterQuality(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm text-sm w-full"
              >
                <option value="all">All Quality</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="unrated">Unrated</option>
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
              <Button onClick={createNewSample} className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                New Sample
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="samples" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Samples ({filteredSamples.length})
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Collections ({collections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="samples" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Samples List */}
            <div className="xl:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    AI Training Samples ({filteredSamples.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSamples.map((sample) => (
                      <Card
                        key={sample.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedSample?.id === sample.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                        onClick={() => setSelectedSample(sample)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                {getCategoryIcon(sample.category)}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 line-clamp-1">{sample.input}</h3>
                                <p className="text-sm text-gray-600">#{sample.id}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getTypeColor(sample.type)} variant="outline">
                                {sample.type}
                              </Badge>
                              <Badge className={getQualityColor(sample.quality)} variant="outline">
                                {sample.quality}
                              </Badge>
                              <Badge className={getStatusColor(sample.status)} variant="outline">
                                {sample.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500">Input:</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{sample.input}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Expected Output:</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{sample.expectedOutput}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Usage: {sample.metadata.usageCount}</span>
                              <span>Success: {sample.metadata.successRate}%</span>
                              <span>Confidence: {Math.round(sample.metadata.confidence * 100)}%</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3 text-green-600" />
                                <span className="text-green-600">{sample.metadata.successRate}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-600" />
                                <span className="text-yellow-600">{sample.quality}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {sample.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                                #{tag}
                              </Badge>
                            ))}
                            {sample.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-gray-50">
                                +{sample.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex justify-end gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSample(sample)
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
                                navigator.clipboard.writeText(sample.expectedOutput)
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSample(sample.id)
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

            {/* Sample Details */}
            <div className="xl:col-span-1">
              {selectedSample ? (
                <Card className="sticky top-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(selectedSample.category)}
                        Sample Details
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={saveSample}>
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
                          <label className="text-sm font-medium text-gray-700">Input</label>
                          <Textarea
                            value={selectedSample.input}
                            onChange={(e) => setSelectedSample({...selectedSample, input: e.target.value})}
                            className="mt-1"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Expected Output</label>
                          <Textarea
                            value={selectedSample.expectedOutput}
                            onChange={(e) => setSelectedSample({...selectedSample, expectedOutput: e.target.value})}
                            className="mt-1"
                            rows={4}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <select
                              value={selectedSample.type}
                              onChange={(e) => setSelectedSample({...selectedSample, type: e.target.value as any})}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="training">Training</option>
                              <option value="validation">Validation</option>
                              <option value="test">Test</option>
                              <option value="production">Production</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                              value={selectedSample.category}
                              onChange={(e) => setSelectedSample({...selectedSample, category: e.target.value as any})}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="financial-advice">Financial Advice</option>
                              <option value="budget-help">Budget Help</option>
                              <option value="debt-management">Debt Management</option>
                              <option value="investment-guidance">Investment Guidance</option>
                              <option value="general-chat">General Chat</option>
                              <option value="support">Support</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Quality</label>
                            <select
                              value={selectedSample.quality}
                              onChange={(e) => setSelectedSample({...selectedSample, quality: e.target.value as any})}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="excellent">Excellent</option>
                              <option value="good">Good</option>
                              <option value="fair">Fair</option>
                              <option value="poor">Poor</option>
                              <option value="unrated">Unrated</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                              value={selectedSample.status}
                              onChange={(e) => setSelectedSample({...selectedSample, status: e.target.value as any})}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="pending-review">Pending Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                          <Input
                            value={selectedSample.tags.join(', ')}
                            onChange={(e) => setSelectedSample({...selectedSample, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                            className="mt-1"
                            placeholder="tag1, tag2, tag3"
                          />
                        </div>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Sample #{selectedSample.id}</h3>
                          <div className="flex gap-2 mt-2">
                            <Badge className={getTypeColor(selectedSample.type)} variant="outline">
                              {selectedSample.type}
                            </Badge>
                            <Badge className={getQualityColor(selectedSample.quality)} variant="outline">
                              {selectedSample.quality}
                            </Badge>
                            <Badge className={getStatusColor(selectedSample.status)} variant="outline">
                              {selectedSample.status}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Input</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedSample.input}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Expected Output</h4>
                          <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">{selectedSample.expectedOutput}</p>
                        </div>

                        {selectedSample.actualOutput && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Actual Output</h4>
                            <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">{selectedSample.actualOutput}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Source:</span>
                            <p className="text-gray-600">{selectedSample.source}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Language:</span>
                            <p className="text-gray-600">{selectedSample.metadata.language}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Difficulty:</span>
                            <p className="text-gray-600">{selectedSample.metadata.difficulty}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Usage Count:</span>
                            <p className="text-gray-600">{selectedSample.metadata.usageCount}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Success Rate</span>
                                <span>{selectedSample.metadata.successRate}%</span>
                              </div>
                              <Progress value={selectedSample.metadata.successRate} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Confidence</span>
                                <span>{Math.round(selectedSample.metadata.confidence * 100)}%</span>
                              </div>
                              <Progress value={selectedSample.metadata.confidence * 100} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedSample.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {selectedSample.feedback && selectedSample.feedback.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Feedback</h4>
                            <div className="space-y-2">
                              {selectedSample.feedback.map((feedback, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{feedback.reviewer}</span>
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600">{feedback.comments}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 pt-3 border-t">
                          <p>Created: {new Date(selectedSample.metadata.createdAt).toLocaleString('no-NO')}</p>
                          <p>Updated: {new Date(selectedSample.metadata.updatedAt).toLocaleString('no-NO')}</p>
                          <p>Created by: {selectedSample.metadata.createdBy}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                // No sample selected
                <Card className="sticky top-6 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <Database className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Select a Sample</h3>
                    <p className="text-gray-600 mb-6">
                      Choose a training sample from the list to view details, edit content, or analyze performance.
                    </p>
                    
                    <div className="space-y-3">
                      <Button onClick={createNewSample} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Sample
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Samples
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-purple-600" />
                Sample Collections ({collections.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{collection.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                        </div>
                        <Badge variant={collection.isPublic ? "default" : "secondary"}>
                          {collection.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{collection.stats.totalSamples}</p>
                          <p className="text-xs text-blue-500">Samples</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{collection.stats.avgQuality}</p>
                          <p className="text-xs text-green-500">Avg Quality</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">{collection.stats.avgSuccessRate}%</p>
                          <p className="text-xs text-orange-500">Success Rate</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {collection.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-gray-500">
                        <p>Created: {new Date(collection.createdAt).toLocaleDateString('no-NO')}</p>
                        <p>By: {collection.createdBy}</p>
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
