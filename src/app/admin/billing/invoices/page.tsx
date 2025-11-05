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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600">
          This page is under development.
        </p>
      </div>
    </div>
  )
}
