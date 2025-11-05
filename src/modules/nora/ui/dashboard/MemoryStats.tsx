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
 * Nora Memory Statistics Panel
 * Shows memory statistics, top contexts, and recent memories
 */

'use client'

import { useState, useEffect } from 'react'
import { Database as Memory, TrendingUp, Database, Clock } from 'lucide-react'

export default function MemoryStats() {
  const [stats, setStats] = useState({
    totalMemories: 0,
    recentMemories: 0,
    averageRelevance: 0,
    topContexts: [] as Array<{ context: string; count: number }>
  })

  useEffect(() => {
    fetch('/api/nora/memory?', {
      method: 'PATCH'
    })
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || stats)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="bg-[#171721] border border-[#24243A] rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Memory className="w-5 h-5 text-[#00FFC2]" />
        Memory Statistics
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0E0E16] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-[#7A5FFF]" />
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-[#00FFC2]">
              {stats.totalMemories}
            </div>
          </div>

          <div className="bg-[#0E0E16] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#C6A0FF]" />
              <span className="text-sm text-gray-400">Recent (7d)</span>
            </div>
            <div className="text-2xl font-bold text-[#00FFC2]">
              {stats.recentMemories}
            </div>
          </div>

          <div className="bg-[#0E0E16] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#7A5FFF]" />
              <span className="text-sm text-gray-400">Avg Relevance</span>
            </div>
            <div className="text-2xl font-bold text-[#00FFC2]">
              {stats.averageRelevance.toFixed(2)}
            </div>
          </div>
        </div>

        {stats.topContexts.length > 0 && (
          <div className="bg-[#0E0E16] rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3 text-gray-400">Top Contexts</h4>
            <div className="space-y-2">
              {stats.topContexts.slice(0, 5).map((context, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{context.context}</span>
                  <span className="text-sm text-[#00FFC2] font-semibold">{context.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

