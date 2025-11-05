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
 * Security Metrics
 * View security metrics and statistics
 */

'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Shield, Activity, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function MetricsPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/modules/hansen-security/metrics', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setMetrics(data.data || {})
        }
      }
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Security Metrics</h1>
        </div>
        <Link
          href="/admin/hansen-security"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Checks</p>
              <p className="text-3xl font-bold text-gray-900">{metrics?.totalChecks || 0}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Allowed</p>
              <p className="text-3xl font-bold text-green-600">{metrics?.allowed || 0}</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Denied</p>
              <p className="text-3xl font-bold text-red-600">{metrics?.denied || 0}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {metrics?.successRate ? `${metrics.successRate}%` : '100%'}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  )
}
