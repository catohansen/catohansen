/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

/**
 * System Insights - Revolutionary AI-Powered System Analysis
 * 
 * Features:
 * - AI-powered system analysis
 * - Performance insights
 * - Architecture recommendations
 * - Security analysis
 * - Code quality metrics
 * - Auto-suggestions for improvements
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Database,
  Code2,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Activity,
  Package,
  Network,
  FileText,
  Star,
  ArrowRight
} from 'lucide-react'

interface Insight {
  id: string
  category: 'performance' | 'security' | 'architecture' | 'code-quality' | 'best-practice'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  priority: number
  suggestions: string[]
  status: 'implemented' | 'pending' | 'in-progress'
}

export default function SystemInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    setLoading(true)

    try {
      // Fetch insights from API
      const response = await fetch('/api/knowledge-base/insights', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.insights) {
          // Map API insights to component format
          const mappedInsights: Insight[] = data.insights.map((insight: any) => ({
            id: insight.id,
            category: insight.category as 'performance' | 'security' | 'architecture' | 'code-quality' | 'best-practice',
            title: insight.title,
            description: insight.description,
            impact: insight.impact as 'high' | 'medium' | 'low',
            priority: insight.priority,
            suggestions: insight.suggestions || [],
            status: insight.status as 'implemented' | 'pending' | 'in-progress'
          }))

          setInsights(mappedInsights)
        }
      }
    } catch (error) {
      console.error('Error loading insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', label: 'All', icon: Activity, color: 'from-purple-500 to-blue-500' },
    { id: 'performance', label: 'Performance', icon: Zap, color: 'from-green-500 to-emerald-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-red-500 to-orange-500' },
    { id: 'architecture', label: 'Architecture', icon: Network, color: 'from-blue-500 to-cyan-500' },
    { id: 'code-quality', label: 'Code Quality', icon: Code2, color: 'from-purple-500 to-pink-500' },
    { id: 'best-practice', label: 'Best Practices', icon: Star, color: 'from-yellow-500 to-amber-500' }
  ]

  const filteredInsights = selectedCategory === 'all' || !selectedCategory
    ? insights
    : insights.filter(i => i.category === selectedCategory)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              System Insights
              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                AI-Powered
              </span>
            </h2>
            <p className="text-gray-600">
              AI-basert systemanalyse og forbedringsforslag
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id || (!selectedCategory && category.id === 'all')
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap
                  ${isSelected
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">AI analyserer systemet...</p>
        </div>
      )}

      {/* Insights */}
      {!loading && filteredInsights.length > 0 && (
        <div className="space-y-4">
          {filteredInsights
            .sort((a, b) => b.priority - a.priority)
            .map((insight, i) => {
              const CategoryIcon = categories.find(c => c.id === insight.category)?.icon || Activity
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{insight.title}</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">{insight.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getImpactColor(insight.impact)}`}>
                            {insight.impact.toUpperCase()} IMPACT
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(insight.status)}`}>
                            {insight.status}
                          </span>
                          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                            <Star className="w-3 h-3 fill-purple-600" />
                            {insight.priority}/10
                          </div>
                        </div>
                      </div>

                      {/* Suggestions */}
                      {insight.suggestions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-blue-900">AI Forslag</h4>
                          </div>
                          <div className="space-y-2">
                            {insight.suggestions.map((suggestion, j) => (
                              <div key={j} className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-blue-800">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Implementer Med AI
                        </button>
                        <button className="px-4 py-2 glass rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Les Dokumentasjon
                        </button>
                        <button className="px-4 py-2 glass rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          Mer Info
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Insights', value: insights.length, icon: Lightbulb, color: 'text-purple-600' },
            { label: 'High Priority', value: insights.filter(i => i.impact === 'high').length, icon: AlertCircle, color: 'text-red-600' },
            { label: 'Implemented', value: insights.filter(i => i.status === 'implemented').length, icon: CheckCircle2, color: 'text-green-600' },
            { label: 'Pending', value: insights.filter(i => i.status === 'pending').length, icon: Activity, color: 'text-yellow-600' }
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredInsights.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen Insights</h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory
              ? `Ingen ${selectedCategory} insights funnet.`
              : 'AI har ikke identifisert noen forbedringsforslag ennå.'
            }
          </p>
          <button
            onClick={loadInsights}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Analyser Systemet Igjen
          </button>
        </div>
      )}
    </div>
  )
}





