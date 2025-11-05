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
 * Media Library
 * Upload and manage media files
 */

'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Upload, Search, Folder } from 'lucide-react'

interface MediaItem {
  id: string
  url: string
  alt: string | null
  width: number | null
  height: number | null
  size: number | null
  mimeType: string | null
  createdAt: Date
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/content/media', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setMedia(data.data.media || [])
        }
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-purple-600" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* Media Grid */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Media ({media.length})</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading media...</div>
        ) : media.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                <div className="aspect-square bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  {item.mimeType?.startsWith('image/') ? (
                    <img 
                      src={item.url} 
                      alt={item.alt || 'Media file'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <Folder className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.alt || 'Untitled'}</p>
                  {item.size && (
                    <p className="text-xs text-gray-500 mt-1">
                      {(item.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No media files yet</p>
            <p className="text-sm mt-2">Upload your first image or file</p>
          </div>
        )}
      </div>
    </div>
  )
}
