'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, FileText, Users, Settings, Shield, Bot } from 'lucide-react'
// Utility function for class names
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

interface SearchResult {
  id: string
  title: string
  description: string
  href: string
  type: 'page' | 'user' | 'setting' | 'document'
  icon: React.ComponentType<any>
  category: string
}

const searchData: SearchResult[] = [
  // Admin Pages
  { id: 'dashboard', title: 'Dashboard', description: 'Admin dashboard overview', href: '/admin', type: 'page', icon: FileText, category: 'Navigation' },
  { id: 'users', title: 'Brukere', description: 'Brukeradministrasjon og tilganger', href: '/admin/users', type: 'page', icon: Users, category: 'Navigation' },
  { id: 'cerbos', title: 'Cerbos Authorization', description: 'Autorisasjonssystem og policies', href: '/admin/cerbos', type: 'page', icon: Shield, category: 'Navigation' },
  { id: 'ai-pilot', title: 'AI Pilot Dashboard', description: 'AI-agenter og pilot program', href: '/admin/ai-pilot', type: 'page', icon: Bot, category: 'Navigation' },
  { id: 'security', title: 'Sikkerhet & GDPR', description: 'Sikkerhetsinnstillinger og GDPR', href: '/admin/security', type: 'page', icon: Shield, category: 'Navigation' },
  { id: 'analytics', title: 'Analytics & Telemetri', description: 'Systemanalyser og metrics', href: '/admin/analytics', type: 'page', icon: FileText, category: 'Navigation' },
  
  // Settings
  { id: 'user-settings', title: 'Brukerinnstillinger', description: 'Endre passord og profil', href: '/admin/profile', type: 'setting', icon: Settings, category: 'Innstillinger' },
  { id: 'system-settings', title: 'Systeminnstillinger', description: 'Globale systeminnstillinger', href: '/admin/settings', type: 'setting', icon: Settings, category: 'Innstillinger' },
  { id: 'security-settings', title: 'Sikkerhetsinnstillinger', description: 'Sikkerhet og autentisering', href: '/admin/security', type: 'setting', icon: Shield, category: 'Innstillinger' },
  
  // Documents
  { id: 'knowledge-base', title: 'Kunnskapsbase', description: 'Prosjektdokumentasjon og guider', href: '/admin/knowledge-base', type: 'document', icon: FileText, category: 'Dokumentasjon' },
  { id: 'cerbos-guide', title: 'Cerbos Production Guide', description: 'Deployment og konfigurasjon', href: '/admin/knowledge-base?doc=cerbos', type: 'document', icon: FileText, category: 'Dokumentasjon' },
  { id: 'ai-compliance', title: 'AI Act Compliance', description: 'AI Act compliance dokumentasjon', href: '/admin/knowledge-base?doc=ai-act', type: 'document', icon: FileText, category: 'Dokumentasjon' },
]

interface AdminSearchProps {
  className?: string
}

export function AdminSearch({ className }: AdminSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Search functionality
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchTerm = query.toLowerCase()
    const filtered = searchData.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    )

    setResults(filtered)
    setIsOpen(filtered.length > 0)
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setQuery('')
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    window.location.href = result.href
    setIsOpen(false)
    setQuery('')
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'page': return FileText
      case 'user': return Users
      case 'setting': return Settings
      case 'document': return FileText
      default: return FileText
    }
  }

  return (
    <div className={cn('relative', className)} ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Søk i admin..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">
              {results.length} resultater for "{query}"
            </div>
            
            {results.map((result, index) => {
              const Icon = result.icon
              const isSelected = index === selectedIndex
              
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    'w-full text-left p-3 rounded-md transition-colors',
                    'hover:bg-gray-50 focus:outline-none focus:bg-gray-50',
                    isSelected && 'bg-blue-50 border-l-2 border-blue-500'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {result.category}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <div className="text-sm">Ingen resultater funnet for "{query}"</div>
            <div className="text-xs mt-1">Prøv et annet søkeord</div>
          </div>
        </div>
      )}
    </div>
  )
}


















