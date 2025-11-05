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
 * AI & Automation Dashboard
 * Manage AI agents and automation rules
 */

'use client'

import { Bot, Settings, FileText, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AIPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI & Automation</h1>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/ai/agents"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <Bot className="w-12 h-12 text-blue-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">AI Agents</h3>
          <p className="text-sm text-gray-600">Manage AI agents and automation</p>
        </Link>

        <Link
          href="/admin/ai/automation"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <Settings className="w-12 h-12 text-purple-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Automation Rules</h3>
          <p className="text-sm text-gray-600">Create and manage automation rules</p>
        </Link>

        <Link
          href="/admin/ai/content"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <FileText className="w-12 h-12 text-green-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Content AI</h3>
          <p className="text-sm text-gray-600">AI-powered content generation</p>
        </Link>

        <Link
          href="/admin/ai/clients"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <Users className="w-12 h-12 text-orange-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Client AI</h3>
          <p className="text-sm text-gray-600">AI insights for clients</p>
        </Link>
      </div>

      {/* Info */}
      <div className="glass rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-2">About AI & Automation</h3>
            <p className="text-sm text-purple-700">
              Automate workflows, generate content, and get AI-powered insights. 
              All AI features are built using modern AI models and can be customized to your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
