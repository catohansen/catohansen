/**
 * Admin Subscriptions Page
 * Overvåker abonnementsstatus, grace periods og betalingsstatus
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react'

interface SubscriptionStatus {
  userId: string
  email: string
  role: string
  plan: string
  status: 'active' | 'past_due' | 'cancelled' | 'expired' | 'grace_period'
  currentPeriodEnd: string
  gracePeriodDaysLeft?: number
  monthlyAmountNOK: number
  lastPaymentAt?: string
  lastPaymentFailedAt?: string
}

interface SubscriptionStats {
  totalUsers: number
  activeSubscriptions: number
  gracePeriodUsers: number
  expiredUsers: number
  monthlyRevenue: number
  churnRate: number
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionStatus[]>([])
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/subscriptions')
      const data = await response.json()
      
      if (data.success) {
        setSubscriptions(data.data.subscriptions)
        setStats(data.data.stats)
      } else {
        console.error('Failed to fetch subscriptions:', data.error)
        setSubscriptions([])
        setStats(null)
      }
      
      setLastSync(new Date())
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerSync = async () => {
    try {
      const response = await fetch('/api/cron/subscription-sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'dev-secret'}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        await loadSubscriptions()
      }
    } catch (error) {
      console.error('Error triggering sync:', error)
    }
  }

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'grace_period': return 'text-yellow-600 bg-yellow-100'
      case 'past_due': return 'text-orange-600 bg-orange-100'
      case 'expired': return 'text-red-600 bg-red-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'grace_period': return <Clock className="w-4 h-4" />
      case 'past_due': return <AlertTriangle className="w-4 h-4" />
      case 'expired': return <AlertTriangle className="w-4 h-4" />
      case 'cancelled': return <CreditCard className="w-4 h-4" />
      default: return <CreditCard className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                💳 Abonnementsoversikt
              </h1>
              <p className="text-gray-600">
                Overvåker abonnementsstatus, grace periods og betalingsstatus
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {lastSync && (
                <div className="text-sm text-gray-500">
                  Sist synkronisert: {lastSync.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={triggerSync}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Synkroniser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-sm text-gray-600">Totalt brukere</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-sm text-gray-600">Aktive abonnementer</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <div className="text-sm text-gray-600">Grace period</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.gracePeriodUsers}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-sm text-gray-600">Månedlig inntekt</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue} kr</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Søk etter e-post eller rolle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle statuser</option>
                <option value="active">Aktiv</option>
                <option value="grace_period">Grace period</option>
                <option value="past_due">Forfalt</option>
                <option value="expired">Utløpt</option>
                <option value="cancelled">Kansellert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bruker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beløp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utløper
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sist betalt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.role}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {subscription.plan.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                        {getStatusIcon(subscription.status)}
                        <span className="ml-1">
                          {subscription.status === 'grace_period' ? `Grace period (${subscription.gracePeriodDaysLeft} dager)` : subscription.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscription.monthlyAmountNOK} kr/mnd
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('nb-NO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscription.lastPaymentAt ? new Date(subscription.lastPaymentAt).toLocaleDateString('nb-NO') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          Detaljer
                        </button>
                        {subscription.status === 'grace_period' && (
                          <button className="text-green-600 hover:text-green-900">
                            Send påminnelse
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grace Period Alerts */}
        {subscriptions.filter(s => s.status === 'grace_period').length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Grace Period Varsler
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {subscriptions.filter(s => s.status === 'grace_period').length} brukere er i grace period og trenger påminnelser.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}














