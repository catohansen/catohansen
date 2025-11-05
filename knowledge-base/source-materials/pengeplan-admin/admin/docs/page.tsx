'use client'

import { useEffect, useState } from 'react'
import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { AdminCard } from '@/components/admin/AdminCard'
import { SystemHealthCard } from '../translations/components/SystemHealthCard'
import { Button } from '@/components/ui/button'
import { RefreshCw, BookOpen, Database, Activity } from 'lucide-react'

interface Metrics {
  uptime: number
  uptimeFormatted: string
  memory: {
    formatted: {
      rss: string
      heapTotal: string
      heapUsed: string
    }
  }
  database: {
    latency: number
    status: string
  }
  translation: {
    activeUsers: number
    translationsPerMinute: number
    averageResponseTime: number
    errorRate: number
    coverage: {
      overall: number
      totalKeys: number
      translated: number
      missing: number
    }
  }
  timestamp: string
}

export default function DocsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [erdContent, setErdContent] = useState<string>('')

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/metrics')
      const data = await res.json()
      setMetrics(data)
    } catch (err) {
      console.error('Failed to fetch metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    
    // Try to load ERD markdown
    fetch('/docs/language-system-erd.md')
      .then(res => res.ok ? res.text() : Promise.resolve(''))
      .then(setErdContent)
      .catch(() => setErdContent(''))

    // Auto-refresh metrics every 60 seconds
    const interval = setInterval(fetchMetrics, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AdminPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Docs & Schema Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              System dokumentasjon, metrics og overvåking
            </p>
          </div>
          <Button onClick={fetchMetrics} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Metrics
          </Button>
        </div>

        {/* System Health Card */}
        <SystemHealthCard />

        {/* Metrics Section */}
        <AdminCard noHover={true}>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-6 w-6" />
              System Metrics
            </h2>

            {metrics ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-600 mb-1">Uptime</div>
                  <div className="text-2xl font-bold text-blue-900">{metrics.uptimeFormatted}</div>
                  <div className="text-xs text-blue-600 mt-1">{metrics.uptime} seconds</div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm font-medium text-purple-600 mb-1">Memory (RSS)</div>
                  <div className="text-2xl font-bold text-purple-900">{metrics.memory.formatted.rss}</div>
                  <div className="text-xs text-purple-600 mt-1">Heap: {metrics.memory.formatted.heapUsed}</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-600 mb-1">DB Latency</div>
                  <div className="text-2xl font-bold text-green-900">{metrics.database.latency}ms</div>
                  <div className="text-xs text-green-600 mt-1">Status: {metrics.database.status}</div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-sm font-medium text-orange-600 mb-1">Coverage</div>
                  <div className="text-2xl font-bold text-orange-900">{metrics.translation.coverage.overall}%</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {metrics.translation.coverage.translated}/{metrics.translation.coverage.totalKeys} keys
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="text-sm font-medium text-indigo-600 mb-1">Active Users</div>
                  <div className="text-2xl font-bold text-indigo-900">{metrics.translation.activeUsers}</div>
                  <div className="text-xs text-indigo-600 mt-1">
                    {metrics.translation.translationsPerMinute} trans/min
                  </div>
                </div>

                <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="text-sm font-medium text-teal-600 mb-1">Avg Response</div>
                  <div className="text-2xl font-bold text-teal-900">{metrics.translation.averageResponseTime}ms</div>
                  <div className="text-xs text-teal-600 mt-1">
                    Error rate: {metrics.translation.errorRate.toFixed(2)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Loading metrics...</p>
              </div>
            )}

            {metrics && (
              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Last updated: {new Date(metrics.timestamp).toLocaleString('nb-NO')}
              </div>
            )}
          </div>
        </AdminCard>

        {/* ER Diagram Section */}
        <AdminCard noHover={true}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="h-6 w-6" />
              ER-Diagram (Auto-Generated)
            </h2>
            
            {erdContent ? (
              <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {erdContent}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>ER-diagram not found</p>
                <p className="text-sm mt-1">Run <code className="bg-gray-100 px-2 py-1 rounded">npm run docs:generate</code> to generate</p>
              </div>
            )}
          </div>
        </AdminCard>

        {/* Changelog Section */}
        <AdminCard noHover={true}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">🕓 Database & System Changelog</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✅</span>
                <div>
                  <strong>Added Translation Models:</strong> TranslationHistory, TranslationJob, TranslationBackup, TranslationValidation
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✅</span>
                <div>
                  <strong>Upgraded Rate Limiting:</strong> Added Upstash Redis support with in-memory fallback
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✅</span>
                <div>
                  <strong>Backup System:</strong> Physical JSON files saved to <code className="bg-gray-100 px-1 rounded">backups/translations/</code>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✅</span>
                <div>
                  <strong>Metrics API:</strong> New <code className="bg-gray-100 px-1 rounded">/api/metrics</code> endpoint for real-time monitoring
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">🔜</span>
                <div>
                  <strong>Next Phase:</strong> BullMQ Job Queue + Notifications + Cerbos Policy Integration
                </div>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </AdminPageLayout>
  )
}






