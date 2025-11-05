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
 * Analytics Dashboard
 * View analytics and reports
 */

'use client'

import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/analytics/website" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Website Analytics</p>
              <p className="text-2xl font-bold text-gray-900">View Reports</p>
            </div>
            <BarChart3 className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </Link>

        <Link href="/admin/analytics/clients" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Client Analytics</p>
              <p className="text-2xl font-bold text-gray-900">View Reports</p>
            </div>
            <Users className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </Link>

        <Link href="/admin/analytics/revenue" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Revenue Analytics</p>
              <p className="text-2xl font-bold text-gray-900">View Reports</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </Link>
      </div>
    </div>
  )
}
