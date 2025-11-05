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
 * Demo Admin - Public Module Showcase
 * Read-only view of all modules and features
 * NO access to real admin functionality
 * NO links to real admin panel
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Code2,
  Package,
  Shield,
  Lock,
  Users,
  Brain,
  FileText,
  Briefcase,
  FolderKanban,
  CreditCard,
  BarChart3,
  Github,
  ExternalLink,
  Star,
  GitFork,
  CheckCircle2,
  AlertCircle,
  Tag,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  Network,
  Activity,
  Rocket,
  Play,
  Monitor,
  Zap,
  Settings,
  TrendingUp,
  Eye,
  X,
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Module {
  id: string
  name: string
  displayName: string
  version: string
  description?: string
  githubUrl?: string
  npmPackage?: string
  category?: string
  status?: string
  githubStats?: {
    stars: number
    forks: number
    openIssues: number
  }
  npmStats?: {
    downloads: number
    version: string
  }
}

const iconMap: Record<string, any> = {
  'hansen-security': Shield,
  'hansen-auth': Lock,
  'user-management': Users,
  'ai-agents': Brain,
  'content-management': FileText,
  'client-management': Briefcase,
  'project-management': FolderKanban,
  'billing-system': CreditCard,
  analytics: BarChart3,
  'module-management': Package,
}

const colorMap: Record<string, string> = {
  Security: 'from-red-500 to-orange-500',
  'AI & Automation': 'from-purple-500 to-pink-500',
  Content: 'from-green-500 to-emerald-500',
  Business: 'from-indigo-500 to-purple-500',
  Analytics: 'from-teal-500 to-cyan-500',
  Other: 'from-gray-500 to-gray-600',
}

export default function DemoAdminPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [showAdminDemo, setShowAdminDemo] = useState(false)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/modules/public', {
        cache: 'no-store',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.modules) {
          setModules(data.modules)
        } else {
          throw new Error('Invalid response format')
        }
      } else {
        throw new Error('Failed to fetch modules')
      }
    } catch (err: any) {
      console.error('Failed to fetch modules:', err)
      setError(err.message || 'Failed to load modules')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Production Ready':
      case 'PRODUCTION':
        return 'text-green-500 bg-green-500/10'
      case 'In Development':
      case 'IN_DEVELOPMENT':
        return 'text-blue-500 bg-blue-500/10'
      case 'Deprecated':
        return 'text-gray-500 bg-gray-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Production Ready':
      case 'PRODUCTION':
        return <CheckCircle2 className="w-4 h-4" />
      case 'In Development':
      case 'IN_DEVELOPMENT':
        return <Activity className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20 bg-gray-950">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-slate-300">Loading demo admin...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/30 to-gray-950" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-navigation">
        <Navigation />
      </div>

      <div className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-sm font-semibold text-slate-800 border border-slate-300/50 shadow-md mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Demo Admin - Module Showcase
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6">
              <span className="gradient-text">Module Dashboard</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Read-only overview of all modules and their features. This is a
              demo version with no access to admin functionality.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
                <span className="text-sm font-semibold text-blue-400">
                  🔒 Read-Only Mode
                </span>
              </div>
              <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full">
                <span className="text-sm font-semibold text-purple-400">
                  🎯 {modules.length} Modules
                </span>
              </div>
              <button
                onClick={() => setShowAdminDemo(true)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Try Admin Demo
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center mb-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchModules}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = iconMap[module.id] || Package
              const color =
                colorMap[module.category || ''] ||
                colorMap['Other'] ||
                'from-gray-500 to-gray-600'
              const status =
                module.status === 'Production Ready'
                  ? 'Production Ready'
                  : 'In Development'

              return (
                <div
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className="glass rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer border border-pink-500/30 hover:border-purple-500/50 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm"
                >
                  {/* Header */}
                  <div
                    className={`h-32 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}
                  >
                    <Icon className="w-16 h-16 text-white/20" />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(status)}`}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </span>
                        {module.category && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
                            {module.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1 truncate text-white">
                          {module.displayName || module.name}
                        </h3>
                        <p className="text-sm text-slate-300 line-clamp-2">
                          {module.description || 'No description available'}
                        </p>
                      </div>
                    </div>

                    {/* Version */}
                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
                      <Tag className="w-3 h-3" />
                      <span>v{module.version}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs mb-4">
                      {module.githubStats && (
                        <div className="flex items-center gap-1 text-slate-300">
                          <Github className="w-3 h-3" />
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span>{module.githubStats.stars || 0}</span>
                        </div>
                      )}
                      {module.npmStats && (
                        <div className="flex items-center gap-1 text-slate-300">
                          <Package className="w-3 h-3" />
                          <Download className="w-3 h-3" />
                          <span>
                            {module.npmStats.downloads
                              ? `${(module.npmStats.downloads / 1000).toFixed(1)}k`
                              : '0'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex gap-2 pt-4 border-t border-pink-500/30">
                      {module.githubUrl && (
                        <a
                          href={module.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2 font-medium border border-pink-500/30"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {module.npmPackage && (
                        <a
                          href={`https://www.npmjs.com/package/${module.npmPackage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2 font-medium border border-pink-500/30"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Package className="w-4 h-4" />
                          NPM
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Module Detail Modal */}
          {selectedModule && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-modal-backdrop flex items-center justify-center p-4"
              onClick={() => setSelectedModule(null)}
            >
              <div
                className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-pink-500/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                        colorMap[selectedModule.category || ''] ||
                        colorMap['Other']
                      } flex items-center justify-center`}
                    >
                      {(iconMap[selectedModule.id] || Package)({
                        className: 'w-8 h-8 text-white',
                      })}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {selectedModule.displayName || selectedModule.name}
                      </h2>
                      <p className="text-slate-300 mt-1">
                        {selectedModule.category || 'Other'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="text-slate-400 hover:text-white transition-colors text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Description</h3>
                    <p className="text-slate-300">
                      {selectedModule.description ||
                        'No description available'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-slate-400">Version</span>
                      <p className="text-white font-semibold">
                        v{selectedModule.version}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">Status</span>
                      <p className="text-white font-semibold">
                        {selectedModule.status || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {selectedModule.githubStats && (
                    <div>
                      <h3 className="font-semibold mb-3 text-white">GitHub Statistics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg p-4 border border-pink-500/30">
                          <div className="flex items-center gap-2 text-slate-300 mb-1">
                            <Star className="w-4 h-4" />
                            <span className="text-sm">Stars</span>
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {selectedModule.githubStats.stars || 0}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg p-4 border border-pink-500/30">
                          <div className="flex items-center gap-2 text-slate-300 mb-1">
                            <GitFork className="w-4 h-4" />
                            <span className="text-sm">Forks</span>
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {selectedModule.githubStats.forks || 0}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg p-4 border border-pink-500/30">
                          <div className="flex items-center gap-2 text-slate-300 mb-1">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Issues</span>
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {selectedModule.githubStats.openIssues || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-pink-500/30">
                    {selectedModule.githubUrl && (
                      <a
                        href={selectedModule.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium border border-pink-500/30"
                      >
                        <Github className="w-5 h-5" />
                        View on GitHub
                      </a>
                    )}
                    {selectedModule.npmPackage && (
                      <a
                        href={`https://www.npmjs.com/package/${selectedModule.npmPackage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium border border-pink-500/30"
                      >
                        <Package className="w-5 h-5" />
                        View on NPM
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Value Proposition Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="gradient-text">Why Choose Our Modules?</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Enterprise-grade solutions that save time, reduce costs, and scale with your business
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Time Savings */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Save 80% Development Time</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Skip months of development. Our modules are production-ready, tested, and documented. 
                  Integrate in minutes, not months.
                </p>
              </div>

              {/* Cost Effective */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30 hover:border-green-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Reduce Costs by 60%</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Why build from scratch? Use proven solutions, pay for what you need, scale as you grow. 
                  Enterprise features at startup prices.
                </p>
              </div>

              {/* Enterprise Ready */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Enterprise-Grade Security</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Built-in compliance (GDPR, AI Act), audit logging, RBAC/ABAC. Security-first architecture 
                  from day one.
                </p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl p-8 border border-pink-500/30 backdrop-blur-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-7 h-7 text-purple-400" />
                    Perfect For
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">SaaS Startups</span>
                        <p className="text-slate-300 text-sm">Get to market faster with production-ready modules</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">Enterprise Teams</span>
                        <p className="text-slate-300 text-sm">Scale securely with enterprise-grade solutions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">Agencies</span>
                        <p className="text-slate-300 text-sm">Deliver faster with reusable, proven modules</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">Developers</span>
                        <p className="text-slate-300 text-sm">Focus on features, not infrastructure</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Package className="w-7 h-7 text-purple-400" />
                    What You Get
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">Full Source Code</span>
                        <p className="text-slate-300 text-sm">Complete ownership and customization</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">API Documentation</span>
                        <p className="text-slate-300 text-sm">REST APIs, TypeScript SDKs, examples</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">Support & Updates</span>
                        <p className="text-slate-300 text-sm">Regular updates, bug fixes, security patches</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-semibold">NPM Packages</span>
                        <p className="text-slate-300 text-sm">Install via npm, use immediately</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-pink-500/30 text-center">
                <p className="text-slate-300 mb-6 text-lg">
                  Ready to accelerate your development? Let's discuss how our modules can help your project.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setShowAdminDemo(true)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Monitor className="w-5 h-5" />
                    Explore Admin Features
                  </button>
                  <a
                    href="#contact"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Request Custom Demo
                  </a>
                  <a
                    href="/hansen-hub"
                    className="px-8 py-4 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/40 hover:to-purple-500/40 text-white rounded-xl font-bold transition-all border border-pink-500/30 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View All Modules
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Demo Preview Modal */}
      {showAdminDemo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-modal flex items-center justify-center p-4"
          onClick={() => setShowAdminDemo(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-pink-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Admin Panel Preview</h2>
                    <p className="text-slate-400">Interactive demo of enterprise features</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAdminDemo(false)}
                className="text-slate-400 hover:text-white transition-colors text-2xl font-bold p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Demo Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Dashboard Preview */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Real-time Dashboard</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Live KPI monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Revenue analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    User activity tracking
                  </li>
                </ul>
              </div>

              {/* Security & Compliance */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30 hover:border-red-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Security & Compliance</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Policy Engine (RBAC/ABAC)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Audit logging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    GDPR & AI Act compliance
                  </li>
                </ul>
              </div>

              {/* Module Management */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Module Management</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Auto-sync with GitHub
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Version control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    NPM publishing
                  </li>
                </ul>
              </div>

              {/* AI & Automation */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">AI & Automation</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Multi-agent systems
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    RAG architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Automated workflows
                  </li>
                </ul>
              </div>

              {/* Client Management */}
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30 hover:border-indigo-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Client Management</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    CRM integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Sales pipeline
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Communication logs
                  </li>
                </ul>
              </div>

              {/* Analytics & Reporting */}
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl p-6 border border-teal-500/30 hover:border-teal-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Analytics & Reporting</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Real-time metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Custom dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Export reports
                  </li>
                </ul>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-2xl p-8 border border-pink-500/30 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Enterprise-Ready Modules</h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    Hver modul er produksjonsklar, standalone og kan selges separat. Bygget for scale, 
                    enterprise-grad sikkerhet og full dokumentasjon. Perfekt for teams som trenger 
                    profesjonelle løsninger uten å bygge alt selv.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">Production Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">NPM Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">Full Documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">Enterprise Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">Customizable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">API-First Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => setShowAdminDemo(false)}
              >
                <Settings className="w-5 h-5" />
                Request Full Access
              </a>
              <a
                href="/hansen-hub"
                className="px-8 py-4 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/40 hover:to-purple-500/40 text-white rounded-xl font-bold transition-all border border-pink-500/30 flex items-center justify-center gap-2"
                onClick={() => setShowAdminDemo(false)}
              >
                <Eye className="w-5 h-5" />
                Explore Modules
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}


