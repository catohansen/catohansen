'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard'
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface FinanceStats {
  totalRevenue: number
  totalPayouts: number
  netProfit: number
  pendingPayouts: number
  activeUsers: number
  monthlyGrowth: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  createdAt: string
  description: string
}

export default function FinanceAdminPage() {
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    totalPayouts: 0,
    netProfit: 0,
    pendingPayouts: 0,
    activeUsers: 0,
    monthlyGrowth: 0
  })

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinanceData()
  }, [])

  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      
      // Fetch finance stats
      const statsResponse = await fetch('/api/admin/finance/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch recent transactions
      const transactionsResponse = await fetch('/api/admin/finance/transactions')
      const transactionsData = await transactionsResponse.json()
      setTransactions(transactionsData.transactions || [])

    } catch (error) {
      console.error('Error fetching finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'pending':
        return 'text-yellow-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/20 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Pengeplan Økonomi
          </h1>
          <p className="text-blue-200 text-lg">
            Administrer betalinger, utbetalinger og økonomi for Pengeplan 2.0
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Inntekt</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+{stats.monthlyGrowth}%</span>
                </div>
              </div>
                <BanknotesIcon className="w-8 h-8 text-green-400" />
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Utbetalinger</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.totalPayouts)}
                </p>
                <p className="text-blue-200 text-sm mt-2">
                  {stats.activeUsers} aktive brukere
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-blue-400" />
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Netto Fortjeneste</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.netProfit)}
                </p>
                <div className="flex items-center mt-2">
                  {stats.netProfit > 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${stats.netProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.netProfit > 0 ? 'Profitt' : 'Tap'}
                  </span>
                </div>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-400" />
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Ventende Utbetalinger</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(stats.pendingPayouts)}
                </p>
                <p className="text-yellow-400 text-sm mt-2">
                  Krever behandling
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-400" />
            </div>
          </GlassmorphismCard>
        </div>

        {/* Recent Transactions */}
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Siste Transaksjoner</h2>
            <button
              onClick={fetchFinanceData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Oppdater
            </button>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-200">Ingen transaksjoner funnet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-blue-200 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString('no-NO')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  )
}



