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
 * Leads Management
 * Manage and convert leads to clients
 */

'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Search, Mail, Phone, Building2, Plus } from 'lucide-react'
import Link from 'next/link'

export default function LeadsPage() {
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/modules/client-management/leads', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setLeads(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">New This Month</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Qualified</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <Users className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Converted</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Leads List */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Leads ({filteredLeads.length})</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading leads...</div>
        ) : filteredLeads.length > 0 ? (
          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lead.name || 'Unknown'}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      {lead.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.company && (
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {lead.company}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Convert to Client
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No leads found</p>
            <p className="text-sm mt-2">Start capturing leads to see them here</p>
          </div>
        )}
      </div>
    </div>
  )
}
