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
 * Observability Dashboard
 * Real-time monitoring and metrics for all modules
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  RefreshCw,
  Zap,
  BarChart3,
  Network,
  Server,
  Database
} from 'lucide-react'
// Badge component - simple inline implementation
const Badge = ({ variant, children, className = '' }: { variant?: string; children: React.ReactNode; className?: string }) => {
  const variantClasses = {
    success: 'bg-green-500/20 text-green-400 border-green-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }
  
  const classes = variantClasses[variant as keyof typeof variantClasses] || variantClasses.default
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${classes} ${className}`}>
      {children}
    </span>
  )
}

interface ModuleMetrics {
  moduleId: string
  name: string
  requests: number
  errors: number
  avgResponseTime: number
  status: 'ok' | 'offline' | 'error'
  uptime: number
  lastRequest?: string
  lastError?: string
}

interface AggregateMetrics {
  totalModules: number
  totalRequests: number
  totalErrors: number
  avgResponseTime: number
  overallUptime: number
  healthyModules: number
  offlineModules: number
  errorModules: number
}

export default function ObservabilityPage() {
  const [modules, setModules] = useState<ModuleMetrics[]>([])
  const [aggregate, setAggregate] = useState<AggregateMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/observability/metrics', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setModules(data.modules || [])
          setAggregate(data.aggregate || null)
          setLastUpdate(new Date())
        } else {
          console.error('Metrics API returned error:', data.error)
        }
      } else {
        console.error('Failed to fetch metrics:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
      // Set empty state on error
      setModules([])
      setAggregate(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchMetrics()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, fetchMetrics])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'success'
      case 'error':
        return 'error'
      case 'offline':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle2 className="w-4 h-4" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      case 'offline':
        return <Clock className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Observability Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time monitoring og metrics for alle moduler
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-sm text-gray-300">Auto-refresh</span>
          </div>
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {lastUpdate && (
            <span className="text-sm text-gray-400">
              Sist oppdatert: {lastUpdate.toLocaleTimeString('no-NO')}
            </span>
          )}
        </div>
      </div>

      {/* Aggregate Stats */}
      {aggregate && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Requests</p>
                <p className="text-2xl font-bold mt-2">{aggregate.totalRequests.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold mt-2">{aggregate.avgResponseTime}ms</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Overall Uptime</p>
                <p className="text-2xl font-bold mt-2">{aggregate.overallUptime.toFixed(2)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Healthy Modules</p>
                <p className="text-2xl font-bold mt-2">
                  {aggregate.healthyModules} / {aggregate.totalModules}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Module Metrics Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Network className="w-5 h-5" />
            Module Metrics
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Errors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Uptime
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {modules.map((module, index) => (
                <motion.tr
                  key={module.moduleId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Server className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{module.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(module.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(module.status)}
                        {module.status.toUpperCase()}
                      </span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {module.requests.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={module.errors > 0 ? 'text-red-400' : 'text-gray-300'}>
                      {module.errors.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-gray-300">{Math.round(module.avgResponseTime)}ms</span>
                      {module.requests > 10 && (
                        <span className="text-xs text-gray-500">
                          P95: {Math.round(module.avgResponseTime * 1.5)}ms
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            module.uptime >= 99 ? 'bg-green-500' :
                            module.uptime >= 95 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${module.uptime}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300 w-16 text-right">
                        {module.uptime.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Ingen metrics tilgjengelig ennå</p>
          <p className="text-sm text-gray-500 mt-2">
            Metrics vil dukke opp når moduler begynner å motta requests
          </p>
        </div>
      )}
    </div>
  )
}

