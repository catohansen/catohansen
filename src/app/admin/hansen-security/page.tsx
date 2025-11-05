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
 * Security 2.0 Dashboard
 * Security overview and management
 */

'use client'

import { useState, useEffect } from 'react'
import { Shield, Activity, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function HansenSecurityDashboard() {
  const [stats, setStats] = useState({
    totalPolicies: 0,
    totalChecks: 0,
    successRate: 100,
    auditLogs: 0
  })

  useEffect(() => {
    // Load stats from API
    fetch('/api/modules/hansen-security/metrics', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setStats({
            totalPolicies: data.data.totalPolicies || 0,
            totalChecks: data.data.totalChecks || 0,
            successRate: data.data.successRate || 100,
            auditLogs: data.data.auditLogs || 0
          })
        }
      })
      .catch(() => {
        // Fallback to defaults
      })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Security 2.0</h1>
        </div>
        <Link
          href="/admin/hansen-security/settings"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Settings
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Policies</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPolicies}</p>
            </div>
            <Shield className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Checks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalChecks}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Audit Logs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.auditLogs}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/hansen-security/audit"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CheckCircle2 className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Audit Logs</h3>
            <p className="text-sm text-gray-600">View security audit logs</p>
          </Link>

          <Link
            href="/admin/hansen-security/policies"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Shield className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Policies</h3>
            <p className="text-sm text-gray-600">Manage security policies</p>
          </Link>

          <Link
            href="/admin/hansen-security/metrics"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Metrics</h3>
            <p className="text-sm text-gray-600">View security metrics</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
