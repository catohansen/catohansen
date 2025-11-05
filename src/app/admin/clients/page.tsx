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
 * Clients Page (CRM Dashboard)
 * Main CRM dashboard for client management
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  Mail,
  Phone,
  Building2,
  MapPin,
  Tag,
  Activity,
  Sparkles,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  industry?: string | null
  lifecycleStage?: string | null
  status: string
  tags: string[]
  createdAt: Date
  _count?: {
    communications?: number
    pipelines?: number
    projects?: number
  }
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    leads: 0,
    churned: 0
  })
  const router = useRouter()

  useEffect(() => {
    fetchClients()
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/modules/client-management/clients', {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/admin/login?redirect=/admin/clients')
          return
        }
        throw new Error(`Failed to fetch clients: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setClients(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch clients')
      }
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError(err instanceof Error ? err.message : 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/modules/client-management/clients/stats', {
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      client.name.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.company?.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-200 rounded-lg p-6 h-32"></div>
          <div className="bg-gray-200 rounded-lg p-6 h-32"></div>
          <div className="bg-gray-200 rounded-lg p-6 h-32"></div>
          <div className="bg-gray-200 rounded-lg p-6 h-32"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 text-center text-red-600">
        <h1 className="text-2xl font-bold">Error Loading Clients</h1>
        <p>{error}</p>
        <button 
          onClick={fetchClients}
          className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span>Hansen CRM - Clients</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your clients and customer relationships</p>
        </div>
        <Link
          href="/admin/clients/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto touch-manipulation"
        >
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Activity className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Leads</p>
              <p className="text-3xl font-bold text-orange-600">{stats.leads}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Churned</p>
              <p className="text-3xl font-bold text-red-600">{stats.churned}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-red-500 opacity-50 rotate-180" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base touch-manipulation"
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 touch-manipulation">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Filter</span>
          </button>
        </div>
      </div>

      {/* Clients List */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">All Clients ({filteredClients.length})</h2>
        <div className="space-y-3 sm:space-y-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                className="block p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{client.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                        client.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        client.status === 'LEAD' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      {client.email && (
                        <div className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.company && (
                        <div className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{client.company}</span>
                        </div>
                      )}
                      {client.industry && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{client.industry}</span>
                        </div>
                      )}
                    </div>
                    {client.tags && client.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {client.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {client._count && (
                    <div className="text-left sm:text-right text-xs sm:text-sm text-gray-500 flex-shrink-0">
                      <div className="flex flex-col gap-1">
                        {client._count.pipelines !== undefined && (
                          <div>{client._count.pipelines} pipelines</div>
                        )}
                        {client._count.communications !== undefined && (
                          <div>{client._count.communications} communications</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-base sm:text-lg">No clients found</p>
              <p className="text-sm mt-2">Start by adding your first client</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

