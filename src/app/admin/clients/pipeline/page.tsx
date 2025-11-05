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
 * Pipeline Kanban View
 * Visual drag-and-drop pipeline management
 * World-class sales pipeline tracking
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Filter,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface Pipeline {
  id: string
  name: string
  stage: string
  value?: number | null
  currency?: string | null
  probability?: number | null
  expectedClose?: Date | null
  client?: {
    id: string
    name: string
    company?: string | null
  }
  createdBy?: {
    name?: string | null
  }
}

interface PipelinesByStage {
  [stage: string]: Pipeline[]
}

const STAGES = [
  { key: 'DISCOVERY', label: 'Discovery', color: 'bg-gray-100 text-gray-800' },
  { key: 'QUALIFICATION', label: 'Qualification', color: 'bg-blue-100 text-blue-800' },
  { key: 'PROPOSAL', label: 'Proposal', color: 'bg-purple-100 text-purple-800' },
  { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { key: 'CLOSED_WON', label: 'Won', color: 'bg-green-100 text-green-800' },
  { key: 'CLOSED_LOST', label: 'Lost', color: 'bg-red-100 text-red-800' }
]

export default function PipelineKanbanPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pipelines, setPipelines] = useState<PipelinesByStage>({})
  const [forecast, setForecast] = useState({
    totalValue: 0,
    weightedValue: 0,
    winRate: 0
  })
  const [draggedPipeline, setDraggedPipeline] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPipelines()
    fetchForecast()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPipelines = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/modules/client-management/pipelines/stages', {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/admin/login?redirect=/admin/clients/pipeline')
          return
        }
        throw new Error(`Failed to fetch pipelines: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        // Initialize all stages
        const initialized: PipelinesByStage = {}
        STAGES.forEach(stage => {
          initialized[stage.key] = result.data[stage.key] || []
        })
        setPipelines(initialized)
      } else {
        throw new Error(result.error || 'Failed to fetch pipelines')
      }
    } catch (err) {
      console.error('Error fetching pipelines:', err)
      setError(err instanceof Error ? err.message : 'Failed to load pipelines')
    } finally {
      setLoading(false)
    }
  }

  const fetchForecast = async () => {
    try {
      const response = await fetch('/api/modules/client-management/pipelines/forecast', {
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setForecast(result.data)
        }
      }
    } catch (err) {
      console.error('Error fetching forecast:', err)
    }
  }

  const handleDragStart = (e: React.DragEvent, pipelineId: string) => {
    setDraggedPipeline(pipelineId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    
    if (!draggedPipeline) return

    try {
      const response = await fetch(`/api/modules/client-management/pipelines/${draggedPipeline}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ stage: targetStage })
      })

      if (response.ok) {
        // Refresh pipelines
        await fetchPipelines()
        await fetchForecast()
      }
    } catch (err) {
      console.error('Error updating pipeline stage:', err)
      alert('Failed to update pipeline stage')
    }

    setDraggedPipeline(null)
  }

  const formatCurrency = (value: number | null | undefined, currency: string | null | undefined = 'NOK') => {
    if (!value) return '—'
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: currency || 'NOK',
      minimumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg p-4 h-96"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 text-center text-red-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Error Loading Pipeline</h1>
        <p>{error}</p>
        <button 
          onClick={fetchPipelines}
          className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <span>Sales Pipeline</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Drag & drop deals between stages</p>
        </div>
        <Link
          href="/admin/clients/pipeline/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors w-full sm:w-auto touch-manipulation"
        >
          <Plus className="w-5 h-5" />
          <span>New Deal</span>
        </Link>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Pipeline</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formatCurrency(forecast.totalValue)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Weighted Forecast</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {formatCurrency(forecast.weightedValue)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Win Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {forecast.winRate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-w-max">
          {STAGES.map((stage) => {
            const stagePipelines = pipelines[stage.key] || []
            const stageValue = stagePipelines.reduce((sum, p) => sum + (p.value || 0), 0)
            const stageCount = stagePipelines.length

            return (
              <div
                key={stage.key}
                className="flex-shrink-0 w-full sm:w-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.key)}
              >
                <div className={`glass rounded-2xl p-4 min-h-[500px] ${stage.color}`}>
                  {/* Stage Header */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm sm:text-base">{stage.label}</h3>
                      <span className="px-2 py-1 text-xs bg-white rounded-full font-semibold">
                        {stageCount}
                      </span>
                    </div>
                    {stageValue > 0 && (
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatCurrency(stageValue)}
                      </p>
                    )}
                  </div>

                  {/* Pipelines in Stage */}
                  <div className="space-y-3">
                    {stagePipelines.length > 0 ? (
                      stagePipelines.map((pipeline) => (
                        <div
                          key={pipeline.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, pipeline.id)}
                          className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move touch-manipulation"
                        >
                          <Link href={`/admin/clients/pipeline/${pipeline.id}`}>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                                {pipeline.name}
                              </h4>
                              
                              {pipeline.client && (
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <User className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{pipeline.client.name}</span>
                                </div>
                              )}

                              {pipeline.value && (
                                <div className="flex items-center gap-2 text-xs font-semibold text-purple-600">
                                  <DollarSign className="w-3 h-3 flex-shrink-0" />
                                  <span>{formatCurrency(pipeline.value, pipeline.currency)}</span>
                                  {pipeline.probability && (
                                    <span className="text-gray-500">
                                      ({pipeline.probability}%)
                                    </span>
                                  )}
                                </div>
                              )}

                              {pipeline.expectedClose && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 flex-shrink-0" />
                                  <span>
                                    {new Date(pipeline.expectedClose).toLocaleDateString('no-NO', {
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        <p>No deals</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

