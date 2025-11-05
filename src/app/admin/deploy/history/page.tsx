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
 * Deployment History
 * View deployment history with status and details
 */

'use client'

import { useState, useEffect } from 'react'
import { FileText, CheckCircle2, AlertCircle, Clock, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface DeploymentHistory {
  id: string
  status: string
  step?: string | null
  buildDuration?: number | null
  ftpDuration?: number | null
  filesUploaded?: number | null
  deployedUrl?: string | null
  error?: string | null
  startedAt: string
  completedAt?: string | null
  config?: {
    id: string
    name: string
    serverUrl?: string | null
  } | null
  createdBy?: {
    id: string
    name?: string | null
    email: string
  } | null
}

export default function DeploymentHistoryPage() {
  const [history, setHistory] = useState<DeploymentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/admin/deploy/history?limit=100', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setHistory(data.history || [])
          setTotal(data.total || 0)
        }
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'Ikke fullført'
    return new Date(date).toLocaleString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'pending':
      case 'building':
      case 'uploading':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'pending':
      case 'building':
      case 'uploading':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Vellykket'
      case 'failed':
        return 'Feilet'
      case 'pending':
        return 'Venter'
      case 'building':
        return 'Bygger'
      case 'uploading':
        return 'Laster opp'
      default:
        return status
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Deployment History</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchHistory}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Oppdater
          </button>
          <Link
            href="/admin/deploy"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Laster deployment historikk...</div>
        </div>
      ) : history.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg text-gray-600">Ingen deployments enda</p>
          <p className="text-sm text-gray-500 mt-2">
            Deployment historikk vil vises her etter første deployment
          </p>
          <Link
            href="/admin/deploy"
            className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Deploy nå
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Totalt {total} deployment{total !== 1 ? 's' : ''}
          </div>
          
          {history.map((deployment) => (
            <div
              key={deployment.id}
              className={`glass rounded-2xl p-6 border ${getStatusColor(deployment.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <h3 className="font-bold text-lg">
                      {getStatusText(deployment.status)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(deployment.startedAt)}
                    </p>
                  </div>
                </div>
                {deployment.deployedUrl && (
                  <a
                    href={deployment.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Vis side
                  </a>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
                {deployment.buildDuration !== undefined && deployment.buildDuration !== null && (
                  <div>
                    <span className="text-gray-600">Build tid:</span>
                    <span className="font-semibold ml-2">{deployment.buildDuration}s</span>
                  </div>
                )}
                {deployment.ftpDuration !== undefined && deployment.ftpDuration !== null && (
                  <div>
                    <span className="text-gray-600">FTP upload:</span>
                    <span className="font-semibold ml-2">{deployment.ftpDuration}s</span>
                  </div>
                )}
                {deployment.filesUploaded !== undefined && deployment.filesUploaded !== null && (
                  <div>
                    <span className="text-gray-600">Filer opplastet:</span>
                    <span className="font-semibold ml-2">{deployment.filesUploaded}</span>
                  </div>
                )}
              </div>

              {deployment.step && (
                <div className="mt-2 text-sm text-gray-600">
                  Steg: <span className="font-medium">{deployment.step}</span>
                </div>
              )}

              {deployment.error && (
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <p className="text-sm text-red-900 font-semibold">Feil:</p>
                  <p className="text-sm text-red-800 mt-1">{deployment.error}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <div>
                  {deployment.config && (
                    <span>Config: {deployment.config.name}</span>
                  )}
                </div>
                <div>
                  {deployment.createdBy && (
                    <span>Deployed av: {deployment.createdBy.name || deployment.createdBy.email}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
