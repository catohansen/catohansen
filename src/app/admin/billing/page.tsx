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
 * Billing Dashboard
 * Manage invoices, payments, and revenue
 */

'use client'

import { useState, useEffect } from 'react'
import { CreditCard, DollarSign, TrendingUp, FileText, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function BillingPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/billing/stats', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats({
            totalRevenue: data.data.totalRevenue || 0,
            pendingInvoices: data.data.pendingInvoices || 0,
            paidInvoices: data.data.paidInvoices || 0,
            overdueInvoices: data.data.overdueInvoices || 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching billing stats:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
        </div>
        <Link
          href="/admin/billing/invoices"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/admin/billing/reports" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">NOK {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </Link>

        <Link href="/admin/billing/invoices" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingInvoices}</p>
            </div>
            <FileText className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </Link>

        <Link href="/admin/billing/invoices" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">{stats.paidInvoices}</p>
            </div>
            <CreditCard className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </Link>

        <Link href="/admin/billing/invoices" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdueInvoices}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-red-500 opacity-50 rotate-180" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/billing/invoices"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Invoices</h3>
            <p className="text-sm text-gray-600">Manage all invoices</p>
          </Link>

          <Link
            href="/admin/billing/payments"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CreditCard className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Payments</h3>
            <p className="text-sm text-gray-600">Track payments</p>
          </Link>

          <Link
            href="/admin/billing/reports"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Revenue Reports</h3>
            <p className="text-sm text-gray-600">View revenue analytics</p>
          </Link>

          <Link
            href="/admin/billing/pricing"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Pricing Calculator</h3>
            <p className="text-sm text-gray-600">Calculate pricing</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
