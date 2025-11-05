// app/admin/database-optimization/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { AdminErrorBoundary } from '@/components/core/ErrorBoundary'

interface DatabaseStats {
  performance: {
    totalTables: number
    totalIndexes: number
    slowQueries: number
    missingIndexes: string[]
    recommendations: string[]
  }
  tableSizes: Array<{
    table: string
    size: string
    recommendation: string
  }>
  queryMetrics: {
    averageQueryTime: number
    slowestQueries: Array<{ query: string; time: number }>
    cacheHitRate: number
  }
  cacheStats: {
    size: number
    keys: string[]
  }
  queryStats: Record<string, { avg: number; max: number; count: number }>
}

const DatabaseOptimizationPage: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/database-optimization')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Failed to fetch database stats')
      }
    } catch (err) {
      console.warn('Failed to fetch database stats:', err)
      setError('Failed to fetch database statistics')
    } finally {
      setLoading(false)
    }
  }

  const executeAction = async (action: string) => {
    try {
      setActionLoading(action)
      const response = await fetch('/api/admin/database-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Action completed successfully')
        fetchStats() // Refresh stats
      } else {
        alert(data.error || 'Action failed')
      }
    } catch (err) {
      console.warn(`Failed to execute ${action}:`, err)
      alert(`Failed to execute ${action}`)
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3">Loading database optimization data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No database statistics available</p>
      </div>
    )
  }

  return (
    <AdminErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Database Optimization
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and optimize database performance
          </p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Tables
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.performance.totalTables}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Indexes
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.performance.totalIndexes}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Slow Queries
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {stats.performance.slowQueries}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cache Hit Rate
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(stats.queryMetrics.cacheHitRate * 100)}%
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Optimization Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => executeAction('create_indexes')}
              disabled={actionLoading === 'create_indexes'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading === 'create_indexes' ? 'Creating...' : 'Create Missing Indexes'}
            </button>

            <button
              onClick={() => executeAction('clear_cache')}
              disabled={actionLoading === 'clear_cache'}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {actionLoading === 'clear_cache' ? 'Clearing...' : 'Clear Cache'}
            </button>

            <button
              onClick={() => executeAction('analyze_tables')}
              disabled={actionLoading === 'analyze_tables'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading === 'analyze_tables' ? 'Analyzing...' : 'Analyze Tables'}
            </button>
          </div>
        </div>

        {/* Missing Indexes */}
        {stats.performance.missingIndexes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Missing Indexes ({stats.performance.missingIndexes.length})
            </h2>
            <ul className="space-y-2">
              {stats.performance.missingIndexes.map((index, i) => (
                <li key={i} className="text-gray-600 dark:text-gray-400">
                  • {index}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Table Sizes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Table Sizes
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Table</th>
                  <th className="text-left py-2">Size</th>
                  <th className="text-left py-2">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {stats.tableSizes.map((table, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 font-mono">{table.table}</td>
                    <td className="py-2">{table.size}</td>
                    <td className="py-2 text-sm text-gray-600 dark:text-gray-400">
                      {table.recommendation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Query Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Query Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Average Query Time</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.queryMetrics.averageQueryTime}ms
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Cache Stats</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.cacheStats.size} cached items
              </p>
            </div>
          </div>

          {Object.keys(stats.queryStats).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Query Statistics</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Query</th>
                      <th className="text-left py-2">Avg Time</th>
                      <th className="text-left py-2">Max Time</th>
                      <th className="text-left py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.queryStats).map(([query, stats]) => (
                      <tr key={query} className="border-b">
                        <td className="py-2 font-mono text-sm">{query}</td>
                        <td className="py-2">{stats.avg}ms</td>
                        <td className="py-2">{stats.max}ms</td>
                        <td className="py-2">{stats.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recommendations
          </h2>
          <ul className="space-y-2">
            {stats.performance.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-600 dark:text-gray-400">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminErrorBoundary>
  )
}

export default DatabaseOptimizationPage

