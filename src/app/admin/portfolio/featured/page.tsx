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
 * Featured Projects
 * Manage featured portfolio items
 */

'use client'

import { Crown, Plus, Star } from 'lucide-react'

export default function FeaturedPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Featured Projects</h1>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Portfolio Items</h2>
        <div className="text-center py-12 text-gray-500">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">No featured items yet</p>
          <p className="text-sm mt-2">Mark portfolio items as featured to highlight them</p>
        </div>
      </div>
    </div>
  )
}
