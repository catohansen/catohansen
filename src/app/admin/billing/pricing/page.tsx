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

'use client'

import { Clock } from 'lucide-react'

export default function PlaceholderPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="glass rounded-2xl p-8 text-center">
        <Clock className="w-16 h-16 text-purple-500 mx-auto mb-4 opacity-50" />
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full mb-4">
          <span className="font-semibold">Coming Soon - Mars 2026</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing Calculator</h2>
        <p className="text-gray-600">
          Advanced pricing calculator and management. Coming Soon - Mars 2026.
        </p>
      </div>
    </div>
  )
}
