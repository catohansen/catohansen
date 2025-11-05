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
 * Pages Management
 * Manage website pages
 */

'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

interface Page {
  id: string
  title: string
  excerpt: string | null
  status: string
  slug: string
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export default function PagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [searchQuery])

  const fetchPages = async () => {
    try {
      setLoading(true)
      const url = searchQuery
        ? `/api/admin/content/pages?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/content/pages'

      const response = await fetch(url, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setPages(data.data.pages || [])
        }
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Pages</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading pages...</div>
        ) : pages.length > 0 ? (
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{page.title}</h3>
                    {page.excerpt && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{page.excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                        page.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {page.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {new Date(page.updatedAt).toLocaleDateString('no-NO')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/admin/content/pages/${page.id}`}>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No pages yet</p>
            <p className="text-sm mt-2">Create your first page to get started</p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Create First Page
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
