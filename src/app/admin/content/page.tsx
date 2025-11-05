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
 * Content Management Dashboard
 * Main content management page with navigation to sub-pages
 */

'use client'

import { useState, useEffect } from 'react'
import { FileText, Palette, Image as ImageIcon, Search, Plus, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export default function ContentManagementPage() {
  const [stats, setStats] = useState({
    totalPages: 0,
    totalSections: 0,
    totalMedia: 0,
    seoPages: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/content/stats', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats({
            totalPages: data.data.totalPages || 0,
            totalSections: data.data.totalSections || 0,
            totalMedia: data.data.totalMedia || 0,
            seoPages: data.data.seoPages || 0
          })
        }
      }
    } catch (error) {
      console.error('Error fetching content stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        </div>
        <Link
          href="/admin/content/pages"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/admin/content/pages" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Pages</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalPages}
              </p>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </Link>

        <Link href="/admin/content/sections" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Sections</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalSections}
              </p>
            </div>
            <Palette className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </Link>

        <Link href="/admin/content/media" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Media Files</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalMedia}
              </p>
            </div>
            <ImageIcon className="w-12 h-12 text-green-500 opacity-50" aria-hidden="true" />
          </div>
        </Link>

        <Link href="/admin/content/seo" className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">SEO Pages</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.seoPages}
              </p>
            </div>
            <Search className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/content/pages"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Manage Pages</h3>
            <p className="text-sm text-gray-600">Create and edit website pages</p>
          </Link>

          <Link
            href="/admin/content/sections"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Palette className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Manage Sections</h3>
            <p className="text-sm text-gray-600">Edit page sections and components</p>
          </Link>

          <Link
            href="/admin/content/media"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ImageIcon className="w-6 h-6 text-green-600 mb-2" aria-hidden="true" />
            <h3 className="font-semibold text-gray-900 mb-1">Media Library</h3>
            <p className="text-sm text-gray-600">Upload and manage media files</p>
          </Link>

          <Link
            href="/admin/content/seo"
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Search className="w-6 h-6 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">SEO Manager</h3>
            <p className="text-sm text-gray-600">Manage SEO settings and meta tags</p>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="glass rounded-2xl p-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <LinkIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">About Content Management</h3>
            <p className="text-sm text-blue-700">
              This module allows you to manage all content on your website. Create pages, edit sections, 
              upload media, and optimize SEO settings. All content is stored in the database and can be 
              easily edited through this admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
