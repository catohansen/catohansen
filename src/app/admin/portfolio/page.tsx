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
 * Portfolio Dashboard
 * Manage portfolio items and showcase work
 */

'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Plus, Search, Image as ImageIcon, Eye, Edit, Trash2, Crown } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true)
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [portfolioStats, setPortfolioStats] = useState({
    totalItems: 0,
    featured: 0,
    published: 0,
    caseStudies: 0
  })

  const fetchPortfolio = async () => {
    try {
      const url = searchQuery
        ? `/api/admin/portfolio?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/portfolio'

      const response = await fetch(url, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setPortfolioItems(data.data.items || [])
          if (data.data.stats) {
            setPortfolioStats({
              totalItems: data.data.stats.totalItems || 0,
              featured: data.data.stats.featured || 0,
              published: data.data.stats.published || 0,
              caseStudies: data.data.stats.caseStudies || 0
            })
          }
        }
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{portfolioStats.totalItems}</p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Featured</p>
              <p className="text-3xl font-bold text-gray-900">{portfolioStats.featured}</p>
            </div>
            <Crown className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Case Studies</p>
              <p className="text-3xl font-bold text-gray-900">{portfolioStats.caseStudies}</p>
            </div>
            <ImageIcon className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Published</p>
              <p className="text-3xl font-bold text-green-600">{portfolioStats.published}</p>
            </div>
            <Eye className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search portfolio items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Portfolio Items</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading portfolio...</div>
        ) : portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                <Link href={`/admin/portfolio/${item.id}`}>
                <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  {item.coverImage ? (
                    <img 
                      src={item.coverImage} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  )}
                  {item.tags?.includes('featured') && (
                    <div className="absolute top-2 right-2">
                      <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.summary && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.summary}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      item.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                    {item.client && (
                      <span className="text-xs text-gray-500">
                        • {item.client.company || item.client.name}
                      </span>
                    )}
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No portfolio items yet</p>
            <p className="text-sm mt-2">Add your first portfolio item to showcase your work</p>
          </div>
        )}
      </div>
    </div>
  )
}
