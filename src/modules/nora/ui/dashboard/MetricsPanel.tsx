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
 * Nora Metrics Panel
 * Shows system performance metrics, latency, and cache hit rate
 */

'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Zap, Database } from 'lucide-react'

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState({
    latency: 0,
    cacheHitRate: 0,
    requestsPerMinute: 0,
    activeUsers: 0
  })

  useEffect(() => {
    // Poll metrics every 5 seconds
    const interval = setInterval(() => {
      fetch('/api/nora/analytics')
        .then(res => res.json())
        .then(data => {
          setMetrics(data.metrics || metrics)
        })
        .catch(() => {})
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#171721] border border-[#24243A] rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-[#00FFC2]" />
        System Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0E0E16] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#7A5FFF]" />
            <span className="text-sm text-gray-400">Latency</span>
          </div>
          <div className="text-2xl font-bold text-[#00FFC2]">
            {metrics.latency}ms
          </div>
        </div>

        <div className="bg-[#0E0E16] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-[#C6A0FF]" />
            <span className="text-sm text-gray-400">Cache Hit Rate</span>
          </div>
          <div className="text-2xl font-bold text-[#00FFC2]">
            {metrics.cacheHitRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-[#0E0E16] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#7A5FFF]" />
            <span className="text-sm text-gray-400">Requests/min</span>
          </div>
          <div className="text-2xl font-bold text-[#00FFC2]">
            {metrics.requestsPerMinute}
          </div>
        </div>

        <div className="bg-[#0E0E16] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[#C6A0FF]" />
            <span className="text-sm text-gray-400">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-[#00FFC2]">
            {metrics.activeUsers}
          </div>
        </div>
      </div>
    </div>
  )
}

