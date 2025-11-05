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
 * Nora Emotion Feed Panel
 * Shows real-time emotion trends and visualizations
 */

'use client'

import { useState, useEffect } from 'react'
import { Heart, TrendingUp } from 'lucide-react'

export default function EmotionFeed() {
  const [emotions, setEmotions] = useState<Array<{
    emotion: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }>>([])

  useEffect(() => {
    // Mock data - in production, fetch from API
    setEmotions([
      { emotion: 'happy', count: 45, trend: 'up' },
      { emotion: 'curious', count: 32, trend: 'stable' },
      { emotion: 'empathetic', count: 28, trend: 'up' },
      { emotion: 'confident', count: 24, trend: 'down' },
      { emotion: 'neutral', count: 18, trend: 'stable' }
    ])
  }, [])

  return (
    <div className="bg-[#171721] border border-[#24243A] rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Heart className="w-5 h-5 text-[#00FFC2]" />
        Emotion Feed
      </h3>
      
      <div className="space-y-3">
        {emotions.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex-1 bg-[#0E0E16] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-300 capitalize">
                  {item.emotion}
                </span>
                <span className="text-sm text-[#00FFC2] font-semibold">
                  {item.count}
                </span>
              </div>
              <div className="w-full bg-[#24243A] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] transition-all duration-300"
                  style={{ width: `${(item.count / 50) * 100}%` }}
                />
              </div>
            </div>
            <div className={`text-sm ${
              item.trend === 'up' ? 'text-[#00FFC2]' :
              item.trend === 'down' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              <TrendingUp className={`w-5 h-5 ${
                item.trend === 'down' ? 'rotate-180' : ''
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

