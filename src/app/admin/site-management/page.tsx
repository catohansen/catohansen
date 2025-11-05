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
 * Site Management Dashboard
 * Control all landing pages, modules, and projects from here
 */

'use client'

import { useState, useEffect } from 'react'
import { Globe, Edit, Eye, Settings, Layers, FileText, Sparkles, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Site {
  id: string
  name: string
  url: string
  type: 'landing' | 'module' | 'project'
  status: 'active' | 'draft' | 'archived'
  lastUpdated: string
  modules?: string[]
}

export default function SiteManagementPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/admin/site-management/sites', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setSites(data.data.sites || [])
        }
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const sitesByType = {
    landing: sites.filter(s => s.type === 'landing'),
    module: sites.filter(s => s.type === 'module'),
    project: sites.filter(s => s.type === 'project'),
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Management</h1>
            <p className="text-sm text-gray-600 mt-1">Styr alle landing-sider, moduler og prosjekter fra her</p>
          </div>
        </div>
        <Link
          href="/admin/site-management/new"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          Ny Side
        </Link>
      </div>

      {/* Main Landing Page */}
      <div className="glass rounded-2xl p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hoved Landing Side</h2>
              <p className="text-sm text-gray-600">Cato Hansen - AI Ekspert & Systemarkitekt</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-purple-600" />
              Vis Side
            </Link>
            <Link
              href="/admin/content/pages?page=/"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Rediger
            </Link>
            <Link
              href="/admin/content?section=hero"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Innstillinger
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Sections</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">Active</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">SEO Score</p>
            <p className="text-2xl font-bold text-purple-600">95/100</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Sist Oppdatert</p>
            <p className="text-sm font-semibold text-gray-900">I dag</p>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Moduler & Landing Sider</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'hansen-security',
              name: 'Hansen Security',
              url: '/hansen-security',
              type: 'module' as const,
              status: 'active' as const,
              description: 'Enterprise-grade authorization system',
              icon: '🛡️'
            },
            {
              id: 'hansen-crm',
              name: 'CRM 2.0',
              url: '/hansen-crm',
              type: 'module' as const,
              status: 'active' as const,
              description: 'Client management system',
              icon: '📊'
            },
            {
              id: 'mindmap',
              name: 'MindMap 2.0',
              url: '/hansen-mindmap-2.0',
              type: 'module' as const,
              status: 'active' as const,
              description: 'Kunnskapsorganisering',
              icon: '🧠'
            },
            {
              id: 'pengeplan',
              name: 'Pengeplan 2.0',
              url: '/pengeplan-2.0',
              type: 'module' as const,
              status: 'active' as const,
              description: 'Personlig økonomi',
              icon: '💰'
            },
            {
              id: 'hansen-hub',
              name: 'Hansen Hub',
              url: '/hansen-hub',
              type: 'module' as const,
              status: 'active' as const,
              description: 'Module showcase',
              icon: '🚀'
            },
            {
              id: 'hansen-auth',
              name: 'Hansen Auth',
              url: '/hansen-auth',
              type: 'module' as const,
              status: 'draft' as const,
              description: 'Authentication system',
              icon: '🔐'
            }
          ].map((module) => (
            <div key={module.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{module.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{module.name}</h3>
                    <p className="text-xs text-gray-600">{module.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  module.status === 'active' ? 'bg-green-100 text-green-700' :
                  module.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {module.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={module.url}
                  target="_blank"
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Vis
                </Link>
                <Link
                  href={`/admin/content/pages?page=${module.url}`}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Rediger
                </Link>
                <Link
                  href={`/admin/content?site=${module.id}`}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hurtighandlinger</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/content"
            className="p-4 bg-white rounded-lg border border-purple-200 hover:shadow-lg transition-all"
          >
            <FileText className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Rediger Innhold</h3>
            <p className="text-sm text-gray-600">Endre tekst, bilder og innhold på alle sider</p>
          </Link>
          <Link
            href="/admin/content/seo"
            className="p-4 bg-white rounded-lg border border-purple-200 hover:shadow-lg transition-all"
          >
            <Sparkles className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">SEO Optimalisering</h3>
            <p className="text-sm text-gray-600">Optimaliser SEO for alle sider</p>
          </Link>
          <Link
            href="/admin/site-management/settings"
            className="p-4 bg-white rounded-lg border border-purple-200 hover:shadow-lg transition-all"
          >
            <Settings className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Site Settings</h3>
            <p className="text-sm text-gray-600">Konfigurer globale innstillinger</p>
          </Link>
        </div>
      </div>
    </div>
  )
}



