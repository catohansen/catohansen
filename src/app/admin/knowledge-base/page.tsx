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
 * Knowledge Base
 * AI-powered knowledge base with search, documents, and code browser
 */

'use client'

import { useState } from 'react'
import { Brain, Search, Sparkles, FileText, Code2, Network, BookOpen } from 'lucide-react'

type TabType = 'overview' | 'search' | 'assistant' | 'documents' | 'code' | 'architecture' | 'insights'

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BookOpen },
    { id: 'search' as TabType, label: 'Search', icon: Search },
    { id: 'assistant' as TabType, label: 'AI Assistant', icon: Sparkles },
    { id: 'documents' as TabType, label: 'Documents', icon: FileText },
    { id: 'code' as TabType, label: 'Code Browser', icon: Code2 },
    { id: 'architecture' as TabType, label: 'Architecture', icon: Network },
    { id: 'insights' as TabType, label: 'System Insights', icon: Brain }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Search className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Search</h3>
                  <p className="text-sm text-gray-600">Search through all documentation and code</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
                  <p className="text-sm text-gray-600">Get AI-powered answers to your questions</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <FileText className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                  <p className="text-sm text-gray-600">Browse all documentation files</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Search functionality coming soon</p>
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">AI Assistant coming soon</p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Document viewer coming soon</p>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="text-center py-12 text-gray-500">
              <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Code browser coming soon</p>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="text-center py-12 text-gray-500">
              <Network className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Architecture viewer coming soon</p>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="text-center py-12 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">System insights coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
