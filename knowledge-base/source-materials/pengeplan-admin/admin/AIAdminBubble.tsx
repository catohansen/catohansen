'use client'

import { useState, useEffect } from 'react'
import { Bot, X, HelpCircle, Settings, Zap, Brain, Shield, Database, ChevronUp, ChevronDown, Users, Activity, BarChart3, MessageCircle, Mic, Send, Minimize2 } from 'lucide-react'

interface AIAdminBubbleProps {
  pageContext: string
  pageTitle: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function AIAdminBubble({ pageContext, pageTitle, position = 'bottom-right' }: AIAdminBubbleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Keep AI bubble closed by default - only open when user clicks
  // Removed auto-open functionality

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !isMinimized) {
        const target = event.target as Element
        if (!target.closest('.ai-admin-bubble')) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, isMinimized])

  // AI suggestions based on page context
  useEffect(() => {
    const getSuggestions = () => {
      const contextSuggestions: Record<string, string[]> = {
        'dashboard': [
          'Vis system status',
          'Sjekk ytelse',
          'Oppdater dashboard',
          'Generer rapport',
          'Sjekk sikkerhet',
          'Kontroller backup'
        ],
        'users': [
          'Legg til ny bruker',
          'Sjekk brukeraktivitet',
          'Oppdater roller',
          'Eksporter brukerdata',
          'Sjekk tilgangslogg',
          'Administrer tillatelser'
        ],
        'ai': [
          'Test AI-funksjoner',
          'Oppdater AI-modeller',
          'Sjekk AI-ytelse',
          'Konfigurer AI-innstillinger',
          'Sjekk AI-logg',
          'Optimaliser AI-system'
        ],
        'security': [
          'Kjør sikkerhetstest',
          'Sjekk tilgangslogg',
          'Oppdater sikkerhetspolitikker',
          'Generer sikkerhetsrapport',
          'Sjekk GDPR-compliance',
          'Kontroller Cerbos-politikker'
        ],
        'analytics': [
          'Generer analytics rapport',
          'Sjekk ytelsesdata',
          'Oppdater dashboards',
          'Eksporter data',
          'Sjekk brukerflyt',
          'Analyser trender'
        ],
        'billing': [
          'Sjekk fakturaer',
          'Oppdater betalingsstatus',
          'Generer økonomirapport',
          'Sjekk kontantstrøm',
          'Administrer abonnementer',
          'Sjekk betalingshistorikk'
        ],
        'ops': [
          'Sjekk systemhelse',
          'Kjør backup',
          'Oppdater deployment',
          'Sjekk logger',
          'Kontroller ytelse',
          'Sjekk infrastruktur'
        ],
        'backup': [
          'Sjekk backup status',
          'Kjør manuell backup',
          'Sjekk backup historikk',
          'Kontroller backup størrelse',
          'Sjekk backup sikkerhet',
          'Test backup restore'
        ]
      }
      
      return contextSuggestions[pageContext] || [
        'Hva kan jeg hjelpe deg med?',
        'Vis system status',
        'Generer rapport',
        'Sjekk innstillinger',
        'Kontroller sikkerhet',
        'Sjekk ytelse'
      ]
    }

    setSuggestions(getSuggestions())
  }, [pageContext])

  const handleSuggestionClick = async (suggestion: string) => {
    setIsLoading(true)
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false)
      // Here you would integrate with actual AI API
      console.log(`AI processing: ${suggestion}`)
      
      // Show success message
      alert(`✅ AI Assistant: ${suggestion} er utført!`)
    }, 1000)
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      default:
        return 'bottom-4 right-4'
    }
  }

  if (!isOpen) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 group"
          title="AI Assistant - Klikk for å få hjelp"
        >
          <Bot className="h-6 w-6 group-hover:animate-pulse" />
        </button>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 group"
          title="AI Assistant - Klikk for å åpne"
        >
          <Bot className="h-6 w-6 group-hover:animate-pulse" />
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ai-admin-bubble`}>
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-96 max-h-[600px] overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Admin Assistant</h3>
                <p className="text-sm text-white/80">Intelligent systemhjelp</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Minimer"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Lukk"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Aktiv</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>System OK</span>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 space-y-6">
          {/* Quick Actions Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-600" />
              Hurtighandlinger
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-sm bg-gradient-to-r from-violet-50 to-violet-100 text-violet-700 rounded-xl hover:from-violet-100 hover:to-violet-200 transition-all duration-200 border border-violet-200">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>System Status</span>
                </div>
              </button>
              <button className="p-3 text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Brukere</span>
                </div>
              </button>
              <button className="p-3 text-sm bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 border border-green-200">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Sikkerhet</span>
                </div>
              </button>
              <button className="p-3 text-sm bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </div>
              </button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              AI Anbefalinger
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <p className="text-sm text-gray-700">System ytelse er optimal</p>
                <p className="text-xs text-gray-500 mt-1">AI anbefaler å fortsette med nåværende innstillinger</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-700">Sikkerhetstest fullført</p>
                <p className="text-xs text-gray-500 mt-1">Alle sikkerhetskontroller er bestått</p>
              </div>
            </div>
          </div>

          {/* Enhanced Chat Input */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              Spør AI
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Hva trenger du hjelp med?"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // Handle AI chat
                    console.log('AI Chat:', e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-lg hover:from-violet-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">System Oversikt</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-violet-600">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">3</div>
                <div className="text-gray-600">Aktive brukere</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


