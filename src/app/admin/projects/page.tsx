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
 * Projects Dashboard
 * Manage all projects
 */

'use client'

import { useState, useEffect } from 'react'
import { FolderKanban, Plus, Search, Calendar, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    onHold: 0
  })

  const fetchProjects = async () => {
    try {
      const url = searchQuery
        ? `/api/admin/projects?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/projects'

      const response = await fetch(url, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setProjects(data.data.projects || [])
          if (data.data.stats) {
            setStats({
              total: data.data.stats.total || 0,
              active: data.data.stats.active || 0,
              completed: data.data.stats.completed || 0,
              onHold: data.data.stats.onHold || 0
            })
          }
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FolderKanban className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <Calendar className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">On Hold</p>
              <p className="text-3xl font-bold text-orange-600">{stats.onHold}</p>
            </div>
            <Users className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Projects</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/admin/projects/${project.id}`}>
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      {project.summary && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.summary}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          project.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
                        {project.client && (
                          <span className="text-xs text-gray-500">
                            • {project.client.company || project.client.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {project.coverImage && (
                      <div className="ml-4 w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No projects yet</p>
            <p className="text-sm mt-2">Create your first project to get started</p>
            <Link
              href="/admin/projects/new"
              className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
