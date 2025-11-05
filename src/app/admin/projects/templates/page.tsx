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
 * Project Templates
 * Manage project templates for quick project creation
 */

'use client'

import { FolderKanban, Plus, FileText, Search } from 'lucide-react'

export default function ProjectTemplatesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Project Templates</h1>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Templates</h2>
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">No templates yet</p>
          <p className="text-sm mt-2">Create project templates for quick project setup</p>
        </div>
      </div>
    </div>
  )
}
