'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  CogIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline'

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard'
import { FinancialHealthPredictionEngine } from '@/lib/ai/FinancialHealthPredictionEngine'
import { PersonalizedFinancialCoach } from '@/lib/ai/PersonalizedFinancialCoach'
import { SmartAutomationEngine } from '@/lib/automation/SmartAutomationEngine'

interface AdvancedAnalytics {
  financialHealth: {
    totalUsers: number
    averageRiskScore: number
    criticalUsers: number
    healthyUsers: number
    bankruptcyRisk: {
      low: number
      medium: number
      high: number
      critical: number
    }
  }
  aiCoaching: {
    activeCoaches: number
    personalityTypes: {
      conservative: number
      balanced: number
      aggressive: number
    }
    communicationStyles: {
      direct: number
      supportive: number
      analytical: number
    }
    averageMotivation: number
  }
  automation: {
    activeRules: number
    aiRecommended: number
    executionsToday: number
    successRate: number
    topRules: Array<{
      name: string
      executions: number
      successRate: number
    }>
  }
  predictions: {
    userGrowth: number
    revenueProjection: number
    riskTrends: string[]
    opportunities: string[]
  }
}

export default function AdvancedAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('financialHealth')

  useEffect(() => {
    fetchAdvancedAnalytics()
  }, [selectedTimeframe])

  const fetchAdvancedAnalytics = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/advanced-analytics?timeframe=${selectedTimeframe}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        // Fallback til mock data
        setAnalytics(getMockAnalytics())
      }
    } catch (error) {
      console.error('Error fetching advanced analytics:', error)
      setAnalytics(getMockAnalytics())
    } finally {
      setLoading(false)
    }
  }

  const getMockAnalytics = (): AdvancedAnalytics => ({
    financialHealth: {
      totalUsers: 1247,
      averageRiskScore: 34,
      criticalUsers: 23,
      healthyUsers: 892,
      bankruptcyRisk: {
        low: 892,
        medium: 332,
        high: 23,
        critical: 0
      }
    },
    aiCoaching: {
      activeCoaches: 1247,
      personalityTypes: {
        conservative: 445,
        balanced: 623,
        aggressive: 179
      },
      communicationStyles: {
        direct: 312,
        supportive: 567,
        analytical: 368
      },
      averageMotivation: 73
    },
    automation: {
      activeRules: 89,
      aiRecommended: 34,
      executionsToday: 1247,
      successRate: 94.2,
      topRules: [
        { name: 'Automatisk sparing', executions: 456, successRate: 98.5 },
        { name: 'Varsle ved lav saldo', executions: 234, successRate: 100 },
        { name: 'Auto-betaling regninger', executions: 189, successRate: 96.8 }
      ]
    },
    predictions: {
      userGrowth: 23.4,
      revenueProjection: 156000,
      riskTrends: [
        'Redusert gjeldsgrad blant nye brukere',
        'Økt sparegrad i Q4',
        'Forbedret betalingshistorikk'
      ],
      opportunities: [
        'AI-coaching for høyrisiko brukere',
        'Automatisering av spareprosesser',
        'Personlig rådgivning for konservative brukere'
    ]
    }
  })

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('no-NO').format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK'
    }).format(amount)
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400'
    if (score < 60) return 'text-yellow-400'
    if (score < 80) return 'text-orange-400'
    return 'text-red-400'
  }

  const getRiskIcon = (score: number) => {
    if (score < 30) return <CheckCircleIcon className="w-5 h-5 text-green-400" />
    if (score < 60) return <ClockIcon className="w-5 h-5 text-yellow-400" />
    if (score < 80) return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
    return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-white/20 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 Avanserte Analytics
          </h1>
          <p className="text-blue-200 text-lg">
            AI-drevet analyse av brukernes økonomiske helse og atferd
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20"
          >
            <option value="7d">Siste 7 dager</option>
            <option value="30d">Siste 30 dager</option>
            <option value="90d">Siste 90 dager</option>
            <option value="1y">Siste år</option>
          </select>
          
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20"
          >
            <option value="financialHealth">Økonomisk Helse</option>
            <option value="aiCoaching">AI-Coaching</option>
            <option value="automation">Automasjon</option>
            <option value="predictions">Prediksjoner</option>
          </select>
        </div>

        {/* Financial Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Brukere</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(analytics?.financialHealth.totalUsers || 0)}
                </p>
                <div className="flex items-center mt-2">
                  <UserGroupIcon className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-sm">Aktive brukere</span>
                </div>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-400" />
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Gjennomsnittlig Risikoscore</p>
                <p className={`text-2xl font-bold ${getRiskColor(analytics?.financialHealth.averageRiskScore || 0)}`}>
                  {analytics?.financialHealth.averageRiskScore || 0}/100
                </p>
                <div className="flex items-center mt-2">
                  {getRiskIcon(analytics?.financialHealth.averageRiskScore || 0)}
                  <span className="text-blue-400 text-sm ml-1">Lav risiko</span>
                </div>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-400" />
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Kritiske Brukere</p>
                <p className="text-2xl font-bold text-red-400">
                  {analytics?.financialHealth.criticalUsers || 0}
                </p>
                <div className="flex items-center mt-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-400 mr-1" />
                  <span className="text-red-400 text-sm">Trenger hjelp</span>
                </div>
              </div>
              <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Helse Brukere</p>
                <p className="text-2xl font-bold text-green-400">
                  {analytics?.financialHealth.healthyUsers || 0}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">God økonomi</span>
                </div>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </GlassmorphismCard>
        </div>

        {/* AI Coaching Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">AI-Coaching Oversikt</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Aktive Coaches</span>
                <span className="text-white font-bold">{analytics?.aiCoaching.activeCoaches || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Gjennomsnittlig Motivasjon</span>
                <span className="text-white font-bold">{analytics?.aiCoaching.averageMotivation || 0}%</span>
              </div>
              <div className="space-y-2">
                <p className="text-blue-200 text-sm">Personlighetstyper:</p>
                <div className="flex justify-between">
                  <span className="text-blue-200">Konservativ</span>
                  <span className="text-white">{analytics?.aiCoaching.personalityTypes.conservative || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Balansert</span>
                  <span className="text-white">{analytics?.aiCoaching.personalityTypes.balanced || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Aggressiv</span>
                  <span className="text-white">{analytics?.aiCoaching.personalityTypes.aggressive || 0}</span>
                </div>
              </div>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Automasjon Statistikk</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Aktive Regler</span>
                <span className="text-white font-bold">{analytics?.automation.activeRules || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">AI-anbefalte</span>
                <span className="text-white font-bold">{analytics?.automation.aiRecommended || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Kjøringer i dag</span>
                <span className="text-white font-bold">{analytics?.automation.executionsToday || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Suksessrate</span>
                <span className="text-green-400 font-bold">{analytics?.automation.successRate || 0}%</span>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Predictions and Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Prediksjoner</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Brukervekst</span>
                <span className="text-green-400 font-bold">+{analytics?.predictions.userGrowth || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Inntektsprognose</span>
                <span className="text-white font-bold">{formatCurrency(analytics?.predictions.revenueProjection || 0)}</span>
              </div>
              <div className="space-y-2">
                <p className="text-blue-200 text-sm">Risikotrender:</p>
                {analytics?.predictions.riskTrends.map((trend, index) => (
                  <div key={index} className="flex items-center">
                    <ArrowTrendingDownIcon className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-white text-sm">{trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Muligheter</h3>
            <div className="space-y-2">
              {analytics?.predictions.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center p-3 bg-white/10 rounded-lg">
                  <ArrowUpIcon className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">{opportunity}</span>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
        </div>

        {/* Top Automation Rules */}
        <GlassmorphismCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Topp Automasjonsregler</h3>
          <div className="space-y-4">
            {analytics?.automation.topRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{rule.name}</p>
                    <p className="text-blue-200 text-sm">{rule.executions} kjøringer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{rule.successRate}%</p>
                  <p className="text-blue-200 text-sm">Suksessrate</p>
                </div>
              </div>
            ))}
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  )
}














