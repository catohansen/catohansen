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
 * Module Hierarchy Page
 * Tree view of all modules organized by category
 */

'use client'

import { useState, useEffect } from 'react'
import { FolderTree, Package, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Module {
  id: string
  name: string
  displayName: string
  category?: string
  status?: string
  version?: string
  link?: string
}

const moduleCategories = [
  { name: 'Security', modules: ['hansen-security', 'hansen-auth', 'user-management'] },
  { name: 'AI & Automation', modules: ['ai-agents'] },
  { name: 'Content', modules: ['content-management'] },
  { name: 'Business', modules: ['client-management', 'project-management', 'billing-system'] },
  { name: 'Analytics', modules: ['analytics'] },
  { name: 'Productivity', modules: ['hansen-mindmap-2.0'] },
  { name: 'AI & Finance', modules: ['pengeplan-2.0'] }
]

export default function ModuleHierarchyPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules/public', {
        cache: 'no-store'
      })

      if (response.ok) {
        const data = await response.json()
        setModules(data.modules || [])
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const getModule = (id: string) => modules.find(m => m.id === id)

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Production Ready':
        return 'text-green-600'
      case 'Coming Soon':
        return 'text-purple-600'
      case 'In Development':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Production Ready':
        return <CheckCircle2 className="w-4 h-4" />
      case 'Coming Soon':
        return <Clock className="w-4 h-4" />
      case 'In Development':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FolderTree className="w-8 h-8 text-purple-600" />
          Modul Hierarki
        </h1>
        <p className="text-gray-600">
          Oversikt over alle moduler organisert etter kategori. Auto-oppdateres når nye moduler registreres.
        </p>
      </div>

      <div className="space-y-8">
        {moduleCategories.map((category) => (
          <div key={category.name} className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              {category.name}
            </h2>
            <div className="ml-8 space-y-2">
              {category.modules.map((moduleId) => {
                const module = getModule(moduleId)
                if (!module) return null

                return (
                  <div
                    key={module.id}
                    className="flex items-center gap-3 py-2 border-l-2 border-gray-200 pl-4 hover:border-purple-500 transition-colors"
                  >
                    <div className={`flex items-center gap-2 ${getStatusColor(module.status)}`}>
                      {getStatusIcon(module.status)}
                    </div>
                    <div className="flex-1">
                      {module.link ? (
                        <Link
                          href={module.link}
                          className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                        >
                          {module.displayName || module.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-gray-900">{module.displayName || module.name}</span>
                      )}
                      {module.version && (
                        <span className="ml-2 text-sm text-gray-500">v{module.version}</span>
                      )}
                    </div>
                    {module.status && (
                      <span className={`text-sm font-medium ${getStatusColor(module.status)}`}>
                        {module.status}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




