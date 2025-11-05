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
 * Security Policies
 * Manage security policies
 */

'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Search, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function PoliciesPage() {
  const [loading, setLoading] = useState(true)
  const [policies, setPolicies] = useState<any[]>([])

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/modules/hansen-security/policies', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPolicies(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Security Policies</h1>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Policy
        </button>
      </div>

      {/* Policies List */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Policies ({policies.length})</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading policies...</div>
        ) : policies.length > 0 ? (
          <div className="space-y-3">
            {policies.map((policy) => (
              <div key={policy.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{policy.name || policy.id}</h3>
                    <p className="text-sm text-gray-600 mt-1">{policy.description || 'No description'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No policies yet</p>
            <p className="text-sm mt-2">Create security policies to control access</p>
          </div>
        )}
      </div>
    </div>
  )
}
