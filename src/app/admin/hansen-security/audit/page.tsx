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
 * Audit Logs
 * View security audit logs
 */

'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, Shield, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/modules/hansen-security/audit', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setLogs(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        </div>
        <Link
          href="/admin/hansen-security"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Logs List */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Audit Logs ({logs.length})</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading audit logs...</div>
        ) : logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-gray-900">{log.action || 'Unknown'}</span>
                      <span className="text-sm text-gray-500">on</span>
                      <span className="text-sm font-medium text-gray-700">{log.resource || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      {log.userId && (
                        <span>User: {log.userId}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No audit logs yet</p>
            <p className="text-sm mt-2">Audit logs will appear here as activities occur</p>
          </div>
        )}
      </div>
    </div>
  )
}
