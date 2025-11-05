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
 * Mindmaps Overview Page
 * Admin dashboard for MindMap 2.0
 * Created by Cato Hansen - Coming Soon - March 2026
 */

'use client'

import { useState } from 'react'
import { Network, Brain, Zap, Users, FileText, Clock, CheckCircle2, Rocket, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function MindmapsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Network className="w-8 h-8 text-purple-600" />
          MindMap 2.0
        </h1>
        <p className="text-gray-600">
          MindMap 2.0 - AI-drevet mindmapping med Copilot, multi-input og enterprise-eksport. Laget av Cato Hansen.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="glass rounded-xl p-8 mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Coming Soon - Mars 2026</h2>
            <p className="text-gray-600">
              MindMap 2.0 er under utvikling og vil være klar for produksjon i mars 2026. Laget av Cato Hansen.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/hansen-mindmap-2.0"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Rocket className="w-5 h-5" />
            Se Landing Page
          </Link>
          <Link
            href="/admin/modules/hansen-mindmap-2.0"
            className="px-6 py-3 glass rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            Module Details
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Network, label: 'Total Maps', value: '0', color: 'from-purple-500 to-pink-500' },
          { icon: Users, label: 'Active Users', value: '0', color: 'from-blue-500 to-cyan-500' },
          { icon: Brain, label: 'AI Credits Used', value: '0', color: 'from-green-500 to-emerald-500' },
          { icon: FileText, label: 'Templates Created', value: '0', color: 'from-orange-500 to-red-500' }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="glass rounded-xl p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Features Preview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold mb-2">AI Copilot</h3>
          <p className="text-sm text-gray-600">Chat-basert AI-assistent for å utvide og forbedre mindmaps.</p>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold mb-2">Multi-Input</h3>
          <p className="text-sm text-gray-600">Importer fra URL, PDF, bilde, audio eller video.</p>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold mb-2">Collaboration</h3>
          <p className="text-sm text-gray-600">Sanntidssamarbeid med flere brukere.</p>
        </div>
        <div className="glass rounded-xl p-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold mb-2">Export</h3>
          <p className="text-sm text-gray-600">Eksporter til PNG, PDF, SVG, Markdown, CSV eller HTML.</p>
        </div>
      </div>

      {/* Roadmap */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Roadmap
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold">Q1 2026 - Core Editor</div>
              <div className="text-sm text-gray-600">AI Quick-Map, Basic Export</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold">Q2 2026 - Multi-Input & Collaboration</div>
              <div className="text-sm text-gray-600">Templates, Real-time Sync</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold text-gray-500">Q3 2026 - Version History & Integrations</div>
              <div className="text-sm text-gray-500">Mobile Apps, Advanced Features</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


