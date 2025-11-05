'use client'

import '../../globals.css'
import { useState, useEffect } from 'react'
import { 
  Globe, 
  Languages, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Settings,
  Flag,
  Brain,
  Zap,
  Shield,
  Monitor,
  Database,
  FileText,
  BarChart3,
  AlertCircle,
  Info,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  History,
  Activity,
  TrendingUp,
  Clock,
  Users,
  Target,
  AlertCircle as AlertCircleIcon,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { AdminCard } from '@/components/admin/AdminCard'
import { SystemHealthCard } from './components/SystemHealthCard'
import SmartDetectionPanel from './components/SmartDetectionPanel'
import EnhancedAIPanel from './components/EnhancedAIPanel'
import AutoTranslationPanel from './components/AutoTranslationPanel'
import AIDisabledPanel from './components/AIDisabledPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface Translation {
  id: string
  key: string
  en: string
  no: string
  category: string
  description?: string
  lastModified: string
  status: 'active' | 'draft' | 'archived'
  autoTranslated?: boolean
  confidence?: number
}

interface TranslationCategory {
  id: string
  name: string
  description: string
  count: number
  coverage: number
}

interface SystemLanguageSettings {
  backendLanguage: 'en'
  frontendDefaultLanguage: 'en' | 'no' | 'se' | 'de' | 'da' | 'fi'
  availableFrontendLanguages: ('en' | 'no' | 'se' | 'de' | 'da' | 'fi')[]
  autoTranslateMissingKeys: boolean
  translationMode: 'development' | 'production'
  showMissingTranslationWarnings: boolean
  realTimeTranslation: boolean
  aiAssistedTranslation: boolean
  supportedLanguages: LanguageConfig[]
  languageFiles: LanguageFile[]
}

interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  flag: string
  region: string
  currency: string
  timezone: string
  enabled: boolean
  coverage: number
  lastUpdated: string
}

interface LanguageFile {
  id: string
  languageCode: string
  fileName: string
  filePath: string
  fileSize: number
  lastModified: string
  status: 'active' | 'draft' | 'archived'
  translations: Translation[]
}

interface TranslationStats {
  totalKeys: number
  translatedKeys: number
  missingKeys: number
  coveragePercentage: number
  autoTranslatedKeys: number
  manualTranslatedKeys: number
  lastUpdated: string
  realTimeStats?: {
    activeUsers: number
    translationsPerMinute: number
    averageResponseTime: number
    errorRate: number
  }
}

interface ValidationResult {
  valid: boolean
  errors: Array<{
    key: string
    language: string
    message: string
    severity: 'error' | 'warning'
  }>
  warnings: Array<{
    key: string
    language: string
    message: string
  }>
  missingKeys: Record<string, string[]>
  duplicates: Array<{
    key: string
    languages: string[]
  }>
}

interface TranslationHistory {
  id: string
  language: string
  source: string
  translatedCount: number
  duration_ms: number
  user: string
  backupFile: string
  savedTo: string
  time: string
  type: 'ai' | 'manual' | 'import'
}

interface AITranslationJob {
  id: string
  language: string
  sourceLanguage: string
  totalKeys: number
  completedKeys: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  error?: string
  confidence: number
}

export default function TranslationPanel() {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [categories, setCategories] = useState<TranslationCategory[]>([])
  const [systemSettings, setSystemSettings] = useState<SystemLanguageSettings>({
    backendLanguage: 'en',
    frontendDefaultLanguage: 'no',
    availableFrontendLanguages: ['en', 'no'],
    autoTranslateMissingKeys: true,
    translationMode: 'development',
    showMissingTranslationWarnings: true,
    realTimeTranslation: true,
    aiAssistedTranslation: true,
    supportedLanguages: [
      {
        code: 'no',
        name: 'Norwegian',
        nativeName: 'Norsk',
        flag: '🇳🇴',
        region: 'NO',
        currency: 'NOK',
        timezone: 'Europe/Oslo',
        enabled: true,
        coverage: 95,
        lastUpdated: new Date().toISOString()
      },
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        region: 'US',
        currency: 'USD',
        timezone: 'America/New_York',
        enabled: true,
        coverage: 100,
        lastUpdated: new Date().toISOString()
      }
    ],
    languageFiles: []
  })
  const [stats, setStats] = useState<TranslationStats>({
    totalKeys: 0,
    translatedKeys: 0,
    missingKeys: 0,
    coveragePercentage: 0,
    autoTranslatedKeys: 0,
    manualTranslatedKeys: 0,
    lastUpdated: new Date().toISOString()
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false)
  const [newLanguage, setNewLanguage] = useState<Partial<LanguageConfig>>({
    code: '',
    name: '',
    nativeName: '',
    flag: '',
    region: '',
    currency: '',
    timezone: '',
    enabled: false,
    coverage: 0
  })
  
  // New state for enhanced functionality
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [translationHistory, setTranslationHistory] = useState<TranslationHistory[]>([])
  const [aiTranslationJobs, setAiTranslationJobs] = useState<AITranslationJob[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isRunningAI, setIsRunningAI] = useState(false)
  const [realTimeStats, setRealTimeStats] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    fetchTranslations()
    fetchTranslationHistory()
    fetchRealTimeStats()
  }, [])

  const fetchTranslations = async () => {
    try {
      setLoading(true)
      
      // Enhanced mock data with more realistic content
      const mockTranslations: Translation[] = [
        {
          id: '1',
          key: 'ownerPanel',
          en: 'Owner Panel',
          no: 'Eier Panel',
          category: 'admin',
          description: 'Main title for owner panel',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: false,
          confidence: 100
        },
        {
          id: '2',
          key: 'systemOwnerControlPanel',
          en: 'System owner control panel - Full system access',
          no: 'Systemeier kontrollpanel - Full systemtilgang',
          category: 'admin',
          description: 'Subtitle for owner panel',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: false,
          confidence: 100
        },
        {
          id: '3',
          key: 'totalUsers',
          en: 'Total Users',
          no: 'Totalt Brukere',
          category: 'stats',
          description: 'Total users count label',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: true,
          confidence: 95
        },
        {
          id: '4',
          key: 'emergencyControls',
          en: 'Emergency Controls',
          no: 'Nødkontroller',
          category: 'admin',
          description: 'Emergency controls section title',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: false,
          confidence: 100
        },
        {
          id: '5',
          key: 'securityMetrics',
          en: 'Security Metrics',
          no: 'Sikkerhetsmetrikker',
          category: 'security',
          description: 'Security metrics section title',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: true,
          confidence: 92
        },
        {
          id: '6',
          key: 'realTimeMonitoring',
          en: 'Real-time Monitoring',
          no: 'Sanntids overvåking',
          category: 'system',
          description: 'Real-time monitoring section',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: true,
          confidence: 88
        },
        {
          id: '7',
          key: 'aiInsights',
          en: 'AI Insights',
          no: 'AI Innblikk',
          category: 'ai',
          description: 'AI insights section',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: true,
          confidence: 90
        },
        {
          id: '8',
          key: 'systemHealth',
          en: 'System Health',
          no: 'Systemhelse',
          category: 'system',
          description: 'System health monitoring',
          lastModified: '2025-01-28T16:58:16Z',
          status: 'active',
          autoTranslated: true,
          confidence: 85
        }
      ]

      const mockCategories: TranslationCategory[] = [
        { id: 'admin', name: 'Admin Panel', description: 'Administrative interface translations', count: 3, coverage: 100 },
        { id: 'stats', name: 'Statistics', description: 'Statistical labels and metrics', count: 1, coverage: 100 },
        { id: 'security', name: 'Security', description: 'Security-related translations', count: 1, coverage: 100 },
        { id: 'system', name: 'System Messages', description: 'System notifications and messages', count: 2, coverage: 100 },
        { id: 'ai', name: 'AI Components', description: 'AI-related interface elements', count: 1, coverage: 100 },
        { id: 'user', name: 'User Interface', description: 'User-facing interface translations', count: 0, coverage: 0 }
      ]

      const mockStats: TranslationStats = {
        totalKeys: 8,
        translatedKeys: 8,
        missingKeys: 0,
        coveragePercentage: 100,
        autoTranslatedKeys: 5,
        manualTranslatedKeys: 3,
        lastUpdated: new Date().toISOString()
      }

      setTranslations(mockTranslations)
      setCategories(mockCategories)
      setStats(mockStats)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         translation.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         translation.no.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || translation.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSaveTranslation = async (translation: Translation) => {
    try {
      // In production, this would make an API call
      setTranslations(prev => prev.map(t => t.id === translation.id ? translation : t))
      setEditingTranslation(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAddTranslation = async (newTranslation: Omit<Translation, 'id' | 'lastModified'>) => {
    try {
      const translation: Translation = {
        ...newTranslation,
        id: Date.now().toString(),
        lastModified: new Date().toISOString()
      }
      setTranslations(prev => [...prev, translation])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteTranslation = async (id: string) => {
    try {
      setTranslations(prev => prev.filter(t => t.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const exportTranslations = () => {
    const dataStr = JSON.stringify(translations, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'translations.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ai-disabled', label: 'AI Deaktivert', icon: AlertTriangle, badge: 'FIX' },
    { id: 'auto-system', label: 'Auto System', icon: Zap, badge: 'AUTO' },
    { id: 'smart-detection', label: 'Smart Detection', icon: Search, badge: 'NEW' },
    { id: 'enhanced-ai', label: 'Enhanced AI', icon: Brain, badge: 'AI' },
    { id: 'translations', label: 'Translations', icon: Languages },
    { id: 'languages', label: 'Language Management', icon: Globe },
    { id: 'categories', label: 'Categories', icon: Search },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-translation', label: 'AI Translation', icon: Brain, badge: 'AI' },
    { id: 'history', label: 'Translation History', icon: History },
    { id: 'validation', label: 'Validation', icon: CheckCircle }
  ]

  const handleSystemSettingChange = (key: keyof SystemLanguageSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleAddLanguage = () => {
    if (!newLanguage.code || !newLanguage.name || !newLanguage.nativeName) {
      alert('Please fill in all required fields')
      return
    }

    const language: LanguageConfig = {
      code: newLanguage.code,
      name: newLanguage.name!,
      nativeName: newLanguage.nativeName!,
      flag: newLanguage.flag || '🌍',
      region: newLanguage.region || 'XX',
      currency: newLanguage.currency || 'USD',
      timezone: newLanguage.timezone || 'UTC',
      enabled: false,
      coverage: 0,
      lastUpdated: new Date().toISOString()
    }

    setSystemSettings(prev => ({
      ...prev,
      supportedLanguages: [...prev.supportedLanguages, language]
    }))

    setNewLanguage({
      code: '',
      name: '',
      nativeName: '',
      flag: '',
      region: '',
      currency: '',
      timezone: '',
      enabled: false,
      coverage: 0
    })
    setShowAddLanguageModal(false)
  }

  const handleToggleLanguage = (code: string) => {
    setSystemSettings(prev => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.map(lang =>
        lang.code === code ? { ...lang, enabled: !lang.enabled } : lang
      )
    }))
  }

  const handleDeleteLanguage = (code: string) => {
    if (confirm('Are you sure you want to delete this language?')) {
      setSystemSettings(prev => ({
        ...prev,
        supportedLanguages: prev.supportedLanguages.filter(lang => lang.code !== code)
      }))
    }
  }

  const generateLanguageTemplate = (languageCode: string) => {
    const template = {
      language: languageCode,
      translations: {
        // Copy existing Norwegian translations as template
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.create': 'Create',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'navigation.home': 'Home',
        'navigation.dashboard': 'Dashboard',
        'navigation.budget': 'Budget',
        'navigation.debts': 'Debts',
        'navigation.bills': 'Bills',
        'navigation.calendar': 'Calendar',
        'navigation.advisor': 'AI Advisor',
        'navigation.admin': 'Admin',
        'navigation.settings': 'Settings',
        'navigation.logout': 'Logout'
      }
    }
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${languageCode}_translations.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const autoTranslateMissingKeys = async () => {
    try {
      setIsRunningAI(true)
      
      // Get missing keys for all languages
      const missingKeys = await fetch('/api/translations/missing-keys', {
        method: 'GET'
      }).then(res => res.json())
      
      if (missingKeys.status === 'success') {
        // Start AI translation job
        const jobResponse = await fetch('/api/translations/auto-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: 'en', // Target language
            source: 'no',   // Source language
            missingKeys: missingKeys.missingKeys
          })
        })
        
        const result = await jobResponse.json()
        
        if (result.status === 'success') {
          // Update translations with AI results
          setTranslations(prev => prev.map(t => {
            const aiTranslation = result.translated[t.key]
            if (aiTranslation) {
              return { 
                ...t, 
                en: aiTranslation, 
                autoTranslated: true, 
                confidence: result.confidence || 85 
              }
            }
            return t
          }))
          
          // Refresh stats
          fetchTranslations()
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsRunningAI(false)
    }
  }

  const validateTranslations = async () => {
    try {
      setIsValidating(true)
      
      const response = await fetch('/api/translations/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        setValidationResult(result.validation)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsValidating(false)
    }
  }

  const fetchTranslationHistory = async () => {
    try {
      const response = await fetch('/api/translations/history')
      const result = await response.json()
      
      if (result.status === 'success') {
        setTranslationHistory(result.history || [])
      }
    } catch (err: any) {
      console.error('Failed to fetch translation history:', err)
    }
  }

  const fetchRealTimeStats = async () => {
    try {
      const response = await fetch('/api/translations/stats')
      const result = await response.json()
      
      if (result.status === 'success') {
        setRealTimeStats(result.stats)
        setStats(prev => ({ ...prev, ...result.stats }))
      }
    } catch (err: any) {
      console.error('Failed to fetch real-time stats:', err)
    }
  }

  const revertTranslation = async (backupFile: string, language: string) => {
    try {
      const response = await fetch('/api/translations/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupFile, language })
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        // Refresh translations and history
        fetchTranslations()
        fetchTranslationHistory()
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Validation function moved to async version above

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading translations...</span>
        </div>
      </AdminPageLayout>
    )
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  Translation Panel
                  <Badge variant="default" className="ml-2">Enhanced!</Badge>
                </h1>
                <p className="text-gray-600 mt-2">
                  Advanced translation management - Backend: English (Fixed) | Frontend: English ↔ Norwegian
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Backend: English (Fixed)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Frontend: {systemSettings.frontendDefaultLanguage === 'en' ? 'English' : 'Norwegian'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">AI-Assisted: {systemSettings.aiAssistedTranslation ? 'ON' : 'OFF'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={autoTranslateMissingKeys}
                className="flex items-center gap-2"
                disabled={!systemSettings.aiAssistedTranslation}
              >
                <Brain className="h-4 w-4" />
                AI Translate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportTranslations}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTranslations}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* System Status Alert */}
        {systemSettings.translationMode === 'development' && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode:</strong> Translation warnings are enabled. Missing translations will be highlighted.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Custom Toggle Menu */}
        <div className="space-y-6">
          <div className="flex w-full space-x-1 bg-muted p-1 rounded-md">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-sm flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Enhanced Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Translation Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AdminCard noHover={true}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{stats.totalKeys}</div>
                      <div className="text-sm text-gray-600">Total Keys</div>
                    </div>
                  </AdminCard>
                  <AdminCard noHover={true}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{stats.translatedKeys}</div>
                      <div className="text-sm text-gray-600">Translated</div>
                    </div>
                  </AdminCard>
                  <AdminCard noHover={true}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{stats.missingKeys}</div>
                      <div className="text-sm text-gray-600">Missing</div>
                    </div>
                  </AdminCard>
                  <AdminCard noHover={true}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{stats.coveragePercentage}%</div>
                      <div className="text-sm text-gray-600">Coverage</div>
                    </div>
                  </AdminCard>
                </div>

                {/* Translation Coverage Progress */}
                <AdminCard noHover={true}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Translation Coverage</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Norwegian Coverage</span>
                        <span>{stats.coveragePercentage}%</span>
                      </div>
                      <Progress value={stats.coveragePercentage} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.manualTranslatedKeys}</div>
                        <div className="text-sm text-gray-600">Manual Translations</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.autoTranslatedKeys}</div>
                        <div className="text-sm text-gray-600">AI Translations</div>
                      </div>
                    </div>
                  </div>
                </AdminCard>

                {/* System Language Configuration */}
                <AdminCard noHover={true}>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">System Language Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">Backend Language</div>
                              <div className="text-sm text-gray-600">API, Database, Logs</div>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            English (Fixed)
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Monitor className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Frontend Default</div>
                              <div className="text-sm text-gray-600">User Interface</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {systemSettings.frontendDefaultLanguage === 'en' ? 'English' : 'Norwegian'}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Brain className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="font-medium">AI Translation</div>
                              <div className="text-sm text-gray-600">Auto-translate missing keys</div>
                            </div>
                          </div>
                          <Badge variant={systemSettings.aiAssistedTranslation ? "default" : "outline"}>
                            {systemSettings.aiAssistedTranslation ? 'ON' : 'OFF'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Zap className="h-5 w-5 text-orange-600" />
                            <div>
                              <div className="font-medium">Translation Mode</div>
                              <div className="text-sm text-gray-600">Development/Production</div>
                            </div>
                          </div>
                          <Badge variant={systemSettings.translationMode === 'development' ? "default" : "outline"}>
                            {systemSettings.translationMode}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </div>
            )}

            {activeTab === 'languages' && (
              <div className="space-y-6">
                {/* Language Management Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Supported Languages</h3>
                    <p className="text-sm text-gray-600">Manage available languages and their translations</p>
                  </div>
                  <Button onClick={() => setShowAddLanguageModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Language
                  </Button>
                </div>

                {/* Language Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {systemSettings.supportedLanguages.map((lang) => (
                    <AdminCard key={lang.code} noHover={true}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{lang.flag}</span>
                            <div>
                              <div className="font-semibold">{lang.nativeName}</div>
                              <div className="text-sm text-gray-600">{lang.name}</div>
                              <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                            </div>
                          </div>
                          <Badge variant={lang.enabled ? "default" : "outline"}>
                            {lang.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Coverage</span>
                            <span>{lang.coverage}%</span>
                          </div>
                          <Progress value={lang.coverage} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>Region: {lang.region}</div>
                          <div>Currency: {lang.currency}</div>
                          <div>Timezone: {lang.timezone}</div>
                          <div>Updated: {new Date(lang.lastUpdated).toLocaleDateString()}</div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleLanguage(lang.code)}
                          >
                            {lang.enabled ? 'Disable' : 'Enable'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateLanguageTemplate(lang.code)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Template
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteLanguage(lang.code)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AdminCard>
                  ))}
                </div>

                {/* Add Language Modal */}
                <Dialog>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Language</DialogTitle>
                      <DialogDescription>
                        Add a new language to the system
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="languageCode">Language Code *</Label>
                        <Input 
                          id="languageCode"
                          placeholder="e.g., 'se', 'de', 'da'"
                          value={newLanguage.code}
                          onChange={(e) => setNewLanguage({...newLanguage, code: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="languageName">Language Name *</Label>
                        <Input 
                          id="languageName"
                          placeholder="e.g., 'Swedish'"
                          value={newLanguage.name}
                          onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="nativeName">Native Name *</Label>
                        <Input 
                          id="nativeName"
                          placeholder="e.g., 'Svenska'"
                          value={newLanguage.nativeName}
                          onChange={(e) => setNewLanguage({...newLanguage, nativeName: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="flag">Flag Emoji</Label>
                        <Input 
                          id="flag"
                          placeholder="🇸🇪"
                          value={newLanguage.flag}
                          onChange={(e) => setNewLanguage({...newLanguage, flag: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="region">Region</Label>
                          <Input 
                            id="region"
                            placeholder="SE"
                            value={newLanguage.region}
                            onChange={(e) => setNewLanguage({...newLanguage, region: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="currency">Currency</Label>
                          <Input 
                            id="currency"
                            placeholder="SEK"
                            value={newLanguage.currency}
                            onChange={(e) => setNewLanguage({...newLanguage, currency: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleAddLanguage} className="flex-1">
                          Add Language
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddLanguageModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {activeTab === 'translations' && (
              <AdminCard noHover={true}>
                <div className="space-y-6">
                  {/* Enhanced Search and Filters */}
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="Search translations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={() => setEditingTranslation({
                        id: '',
                        key: '',
                        en: '',
                        no: '',
                        category: 'admin',
                        status: 'draft',
                        lastModified: '',
                        autoTranslated: false,
                        confidence: 100
                      })}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Translation
                    </Button>
                  </div>

                  {/* Enhanced Translations List */}
                  <div className="space-y-4">
                    {filteredTranslations.map((translation) => (
                      <div key={translation.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div>
                                <h3 className="font-semibold text-gray-900">{translation.key}</h3>
                                <p className="text-sm text-gray-500">{translation.description}</p>
                              </div>
                              <Badge variant="outline">{translation.category}</Badge>
                              <Badge variant={
                                translation.status === 'active' ? 'default' :
                                translation.status === 'draft' ? 'secondary' : 'outline'
                              }>
                                {translation.status}
                              </Badge>
                              {translation.autoTranslated && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI ({translation.confidence}%)
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-2">
                                  <Database className="h-3 w-3" />
                                  English (Backend)
                                </Label>
                                <p className="text-sm">{translation.en}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-2">
                                  <Monitor className="h-3 w-3" />
                                  Norwegian (Frontend)
                                </Label>
                                <p className="text-sm">{translation.no}</p>
                                {translation.autoTranslated && translation.confidence && translation.confidence < 90 && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3 text-orange-500" />
                                    <span className="text-xs text-orange-600">Low confidence</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {isClient && (
                              <div className="mt-2 text-xs text-gray-400">
                                Last modified: {new Date(translation.lastModified).toLocaleString('nb-NO')}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingTranslation(translation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTranslation(translation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AdminCard>
            )}

            {activeTab === 'categories' && (
              <AdminCard noHover={true}>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Translation Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div key={category.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{category.count} translations</Badge>
                            <Badge variant={category.coverage === 100 ? "default" : "secondary"}>
                              {category.coverage}% coverage
                            </Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${category.coverage}%` }}
                            ></div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Manage Category
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AdminCard>
            )}

            {activeTab === 'system-settings' && (
              <div className="space-y-6">
                <AdminCard noHover={true}>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">System Language Settings</h2>
                    
                    {/* Backend Language (Fixed) */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database className="h-6 w-6 text-green-600" />
                          <div>
                            <h3 className="font-semibold text-green-800">Backend Language</h3>
                            <p className="text-sm text-green-600">API endpoints, database, logs, and system internals</p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          English (Fixed)
                        </Badge>
                      </div>
                    </div>

                    {/* Frontend Language Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Frontend Language Configuration</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Default Frontend Language</h4>
                              <p className="text-sm text-gray-600">Primary language for user interface</p>
                            </div>
                            <select
                              value={systemSettings.frontendDefaultLanguage}
                              onChange={(e) => handleSystemSettingChange('frontendDefaultLanguage', e.target.value as 'en' | 'no')}
                              className="px-3 py-2 border rounded-md"
                            >
                              <option value="en">English</option>
                              <option value="no">Norwegian</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Translation Mode</h4>
                              <p className="text-sm text-gray-600">Development vs Production mode</p>
                            </div>
                            <select
                              value={systemSettings.translationMode}
                              onChange={(e) => handleSystemSettingChange('translationMode', e.target.value as 'development' | 'production')}
                              className="px-3 py-2 border rounded-md"
                            >
                              <option value="development">Development</option>
                              <option value="production">Production</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Show Translation Warnings</h4>
                              <p className="text-sm text-gray-600">Highlight missing translations</p>
                            </div>
                            <Switch
                              checked={systemSettings.showMissingTranslationWarnings}
                              onCheckedChange={(checked) => handleSystemSettingChange('showMissingTranslationWarnings', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">Real-time Translation</h4>
                              <p className="text-sm text-gray-600">Live translation updates</p>
                            </div>
                            <Switch
                              checked={systemSettings.realTimeTranslation}
                              onCheckedChange={(checked) => handleSystemSettingChange('realTimeTranslation', checked)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Translation Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">AI Translation Settings</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">AI-Assisted Translation</h4>
                            <p className="text-sm text-gray-600">Enable AI translation for missing keys</p>
                          </div>
                          <Switch
                            checked={systemSettings.aiAssistedTranslation}
                            onCheckedChange={(checked) => handleSystemSettingChange('aiAssistedTranslation', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Auto-translate Missing Keys</h4>
                            <p className="text-sm text-gray-600">Automatically translate missing Norwegian keys</p>
                          </div>
                          <Switch
                            checked={systemSettings.autoTranslateMissingKeys}
                            onCheckedChange={(checked) => handleSystemSettingChange('autoTranslateMissingKeys', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Settings */}
                    <div className="flex justify-end">
                      <Button className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </AdminCard>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* System Health Card */}
                <SystemHealthCard />
                
                <AdminCard noHover={true}>
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Translation Analytics</h2>
                    
                    {/* Translation Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">{stats.totalKeys}</div>
                        <div className="text-sm text-gray-600">Total Translation Keys</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">{stats.translatedKeys}</div>
                        <div className="text-sm text-gray-600">Translated Keys</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-3xl font-bold text-orange-600">{stats.missingKeys}</div>
                        <div className="text-sm text-gray-600">Missing Keys</div>
                      </div>
                    </div>

                    {/* Translation Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">{stats.manualTranslatedKeys}</div>
                        <div className="text-sm text-gray-600">Manual Translations</div>
                        <div className="text-xs text-gray-500 mt-1">Human-reviewed</div>
                      </div>
                      <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <div className="text-3xl font-bold text-indigo-600">{stats.autoTranslatedKeys}</div>
                        <div className="text-sm text-gray-600">AI Translations</div>
                        <div className="text-xs text-gray-500 mt-1">AI-assisted</div>
                      </div>
                    </div>

                    {/* Translation Validation */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Translation Validation</h3>
                      <Button
                        onClick={async () => {
                          await validateTranslations()
                          alert('✅ Translation validation completed!')
                        }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Validate All Translations
                      </Button>
                    </div>

                    {/* Last Updated */}
                    {isClient && (
                      <div className="text-center text-sm text-gray-500">
                        Last updated: {new Date(stats.lastUpdated).toLocaleString('nb-NO')}
                      </div>
                    )}
                  </div>
                </AdminCard>
              </div>
            )}

            {/* AI Disabled Tab */}
            {activeTab === 'ai-disabled' && (
              <AIDisabledPanel />
            )}

            {/* Auto System Tab */}
            {activeTab === 'auto-system' && (
              <AutoTranslationPanel />
            )}

            {/* Smart Detection Tab */}
            {activeTab === 'smart-detection' && (
              <SmartDetectionPanel
                onDetectedTexts={(texts) => {
                  console.log('Detected texts:', texts)
                }}
                onAutoTranslate={(texts) => {
                  console.log('Auto translate texts:', texts)
                }}
              />
            )}

            {/* Enhanced AI Tab */}
            {activeTab === 'enhanced-ai' && (
              <EnhancedAIPanel
                onJobComplete={(job) => {
                  console.log('Job completed:', job)
                }}
                onJobError={(job) => {
                  console.log('Job error:', job)
                }}
              />
            )}

            {/* AI Translation Tab */}
            {activeTab === 'ai-translation' && (
              <div className="space-y-6">
                <AdminCard noHover={true}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-600" />
                        AI Translation Center
                      </h2>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        AI Powered
                      </Badge>
                    </div>

                    {/* AI Translation Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Auto Translation</h3>
                        <div className="space-y-3">
                          <Button
                            onClick={autoTranslateMissingKeys}
                            disabled={isRunningAI}
                            className="w-full flex items-center gap-2"
                          >
                            {isRunningAI ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Brain className="h-4 w-4" />
                            )}
                            {isRunningAI ? 'AI Translating...' : 'Start AI Translation'}
                          </Button>
                          
                          <div className="text-sm text-gray-600">
                            <p>• Automatically translates missing keys</p>
                            <p>• Uses AI with confidence scoring</p>
                            <p>• Creates backup before changes</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Translation Jobs</h3>
                        <div className="space-y-2">
                          {aiTranslationJobs.length > 0 ? (
                            aiTranslationJobs.map((job) => (
                              <div key={job.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{job.language}</span>
                                  <Badge variant={
                                    job.status === 'completed' ? 'default' :
                                    job.status === 'running' ? 'secondary' :
                                    job.status === 'failed' ? 'destructive' : 'outline'
                                  }>
                                    {job.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {job.completedKeys}/{job.totalKeys} keys completed
                                </div>
                                {job.status === 'running' && (
                                  <Progress value={(job.completedKeys / job.totalKeys) * 100} className="mt-2" />
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No active translation jobs</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">AI Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Confidence Threshold</Label>
                          <Input type="number" placeholder="85" min="0" max="100" />
                          <p className="text-xs text-gray-500">Minimum confidence for auto-approval</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Source Language</Label>
                          <select className="w-full p-2 border rounded">
                            <option value="no">Norwegian (Norsk)</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </div>
            )}

            {/* Translation History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <AdminCard noHover={true}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <History className="h-6 w-6 text-blue-600" />
                        Translation History
                      </h2>
                      <Button onClick={fetchTranslationHistory} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {translationHistory.length > 0 ? (
                        translationHistory.map((entry) => (
                          <div key={entry.id} className="p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {entry.type === 'ai' && <Brain className="h-4 w-4 text-purple-600" />}
                                  {entry.type === 'manual' && <Edit className="h-4 w-4 text-blue-600" />}
                                  {entry.type === 'import' && <Upload className="h-4 w-4 text-green-600" />}
                                  <span className="font-medium">{entry.language.toUpperCase()}</span>
                                </div>
                                <Badge variant="outline">
                                  {entry.translatedCount} keys
                                </Badge>
                              </div>
                              <div className="text-right text-sm text-gray-600">
                                <div>{entry.user}</div>
                                <div>{new Date(entry.time).toLocaleString('nb-NO')}</div>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <p>Source: {entry.source}</p>
                              <p>Duration: {entry.duration_ms}ms</p>
                              <p>Backup: {entry.backupFile}</p>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => revertTranslation(entry.backupFile, entry.language)}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Revert
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No translation history found</p>
                          <p className="text-sm">Translation activities will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AdminCard>
              </div>
            )}

            {/* Validation Tab */}
            {activeTab === 'validation' && (
              <div className="space-y-6">
                <AdminCard noHover={true}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        Translation Validation
                      </h2>
                      <Button
                        onClick={validateTranslations}
                        disabled={isValidating}
                        className="flex items-center gap-2"
                      >
                        {isValidating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        {isValidating ? 'Validating...' : 'Run Validation'}
                      </Button>
                    </div>

                    {validationResult && (
                      <div className="space-y-4">
                        {/* Validation Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {validationResult.errors.length}
                            </div>
                            <div className="text-sm text-gray-600">Errors</div>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                              {validationResult.warnings.length}
                            </div>
                            <div className="text-sm text-gray-600">Warnings</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {validationResult.valid ? 'Valid' : 'Invalid'}
                            </div>
                            <div className="text-sm text-gray-600">Status</div>
                          </div>
                        </div>

                        {/* Errors */}
                        {validationResult.errors.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-red-600">Errors</h3>
                            {validationResult.errors.map((error, index) => (
                              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  <span className="font-medium">{error.key}</span>
                                  <Badge variant="destructive">{error.severity}</Badge>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{error.message}</p>
                                <p className="text-xs text-gray-500">Language: {error.language}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Warnings */}
                        {validationResult.warnings.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-yellow-600">Warnings</h3>
                            {validationResult.warnings.map((warning, index) => (
                              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  <span className="font-medium">{warning.key}</span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{warning.message}</p>
                                <p className="text-xs text-gray-500">Language: {warning.language}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Missing Keys */}
                        {Object.keys(validationResult.missingKeys).length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-orange-600">Missing Keys</h3>
                            {Object.entries(validationResult.missingKeys).map(([language, keys]) => (
                              <div key={language} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <div className="font-medium">{language.toUpperCase()}</div>
                                <div className="text-sm text-gray-700 mt-1">
                                  {keys.length} missing keys: {keys.slice(0, 5).join(', ')}
                                  {keys.length > 5 && ` ... and ${keys.length - 5} more`}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!validationResult && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Click "Run Validation" to check translation integrity</p>
                        <p className="text-sm">This will validate all translation keys and files</p>
                      </div>
                    )}
                  </div>
                </AdminCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  )
}
