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
 * AI-Powered Knowledge Base Search
 * Uses RAG (Retrieval-Augmented Generation) for intelligent search
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Sparkles,
  FileText,
  Code2,
  BookOpen,
  ExternalLink,
  Loader2,
  Lightbulb,
  Star,
  TrendingUp,
  Package
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  content: string
  type: 'article' | 'code' | 'guide' | 'module'
  module?: string
  relevance: number
  url: string
  highlights?: string[]
}

export default function KnowledgeBaseSearch({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearching(true)
    setResults([])
    setAiSuggestion(null)

    try {
      // Fetch from API
      const response = await fetch(`/api/knowledge-base/search?q=${encodeURIComponent(query)}&limit=10`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()

      if (data.success && data.results) {
        // Map API results to component format
        const mappedResults: SearchResult[] = data.results.map((result: any) => ({
          id: result.id,
          title: result.title,
          content: result.content,
          type: result.type as 'article' | 'code' | 'guide' | 'module',
          module: result.module,
          relevance: result.relevance,
          url: result.url || `/admin/knowledge-base/documents?id=${result.docId}`,
          highlights: result.highlights || []
        }))

        setResults(mappedResults)
        
        // Generate AI suggestion based on results
        if (mappedResults.length > 0) {
          const topResult = mappedResults[0]
          setAiSuggestion(`Basert på søket ditt, anbefaler vi å se på "${topResult.title}". ${mappedResults.length} relevante resultater funnet.`)
        } else {
          setAiSuggestion('Ingen resultater funnet. Prøv å reformulere spørsmålet eller søk med andre ord.')
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      setAiSuggestion('Kunne ikke utføre søk. Prøv igjen senere.')
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      // Use setTimeout to ensure query state is updated
      const timer = setTimeout(() => {
        handleSearch()
      }, 100)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  const getIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText
      case 'code': return Code2
      case 'guide': return BookOpen
      case 'module': return Package
      default: return FileText
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'article': return 'from-blue-500 to-cyan-500'
      case 'code': return 'from-green-500 to-emerald-500'
      case 'guide': return 'from-purple-500 to-pink-500'
      case 'module': return 'from-orange-500 to-red-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder="Spør AI-assistenten om systemet... (trykk Enter eller klikk søk)"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {searching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Søker...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                AI Search
              </>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>AI-powered search med RAG. Forstår naturlig språk og gir relevante resultater.</span>
        </div>
      </div>

      {/* AI Suggestion */}
      {aiSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 bg-blue-50 border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">AI Anbefaling</h3>
              <p className="text-sm text-blue-800">{aiSuggestion}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {results.length} resultater
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              Sortert etter relevans
            </div>
          </div>

          {results.map((result, i) => {
            const Icon = getIcon(result.type)
            const color = getColor(result.type)
            
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {result.content}
                        </p>
                      </div>
                      {result.relevance > 0.9 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex-shrink-0">
                          <Star className="w-3 h-3 fill-yellow-600" />
                          Top Match
                        </div>
                      )}
                    </div>
                    
                    {result.highlights && result.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.highlights.map((highlight, j) => (
                          <span
                            key={j}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">{result.type}</span>
                        {result.module && (
                          <>
                            <span>•</span>
                            <span>{result.module}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{(result.relevance * 100).toFixed(0)}% relevans</span>
                      </div>
                      <a
                        href={result.url}
                        className="flex items-center gap-2 text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        Les mer
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* No Results */}
      {!searching && results.length === 0 && query && (
        <div className="glass rounded-xl p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen resultater</h3>
          <p className="text-gray-600 mb-4">
            Prøv å reformulere spørsmålet eller bruk AI-assistenten for hjelp.
          </p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Spør AI-assistenten
          </button>
        </div>
      )}

      {/* Empty State */}
      {!query && !searching && (
        <div className="glass rounded-xl p-12 text-center">
          <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Search</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Søk i hele knowledge base med naturlig språk. AI-assistenten forstår kontekst og gir relevante resultater basert på RAG (Retrieval-Augmented Generation).
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              'Hvordan bruker jeg Hansen Security?',
              'Vis meg eksempler på RBAC',
              'Hvordan deployer jeg til domene.shop?'
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(example)
                  handleSearch()
                }}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

