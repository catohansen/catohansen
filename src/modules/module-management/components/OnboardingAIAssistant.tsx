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
 * Onboarding AI Assistant
 * Context-aware AI assistant for module onboarding wizard
 * 
 * Features:
 * - Answers questions about onboarding steps
 * - Explains concepts (semantic versioning, webhooks, etc.)
 * - Provides suggestions based on current step
 * - Helps with troubleshooting
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  X,
  Minimize2,
  Maximize2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface OnboardingAIAssistantProps {
  currentStep: number
  moduleInfo?: Record<string, any>
  onSuggestionClick?: (suggestion: string) => void
  minimized?: boolean
  onMinimizeChange?: (minimized: boolean) => void
}

export default function OnboardingAIAssistant({
  currentStep,
  moduleInfo,
  onSuggestionClick,
  minimized = false,
  onMinimizeChange,
}: OnboardingAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getInitialMessage(currentStep),
      timestamp: new Date(),
      suggestions: getStepSuggestions(currentStep),
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [internalMinimized, setInternalMinimized] = useState(minimized)

  const isMinimized = minimized || internalMinimized

  useEffect(() => {
    // Update initial message when step changes
    if (messages.length === 1 || messages[0].role === 'assistant') {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: getInitialMessage(currentStep),
          timestamp: new Date(),
          suggestions: getStepSuggestions(currentStep),
        },
      ])
    }
  }, [currentStep])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const response = await fetch('/api/modules/onboarding/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: input,
          currentStep,
          moduleInfo,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || getDefaultResponse(input, currentStep),
        timestamp: new Date(),
        suggestions: data.suggestions || getStepSuggestions(currentStep),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Beklager, jeg opplevde en feil. Prøv igjen eller reformuler spørsmålet.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => handleSend(), 100)
    onSuggestionClick?.(suggestion)
  }

  const toggleMinimize = () => {
    const newMinimized = !isMinimized
    setInternalMinimized(newMinimized)
    onMinimizeChange?.(newMinimized)
  }

  if (isMinimized) {
    return (
      <button
        onClick={toggleMinimize}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-modal"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900 rounded-xl border border-gray-800 shadow-2xl flex flex-col z-modal">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-gray-400">Module Onboarding Hjelp</p>
          </div>
        </div>
        <button
          onClick={toggleMinimize}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestion(suggestion)}
                      className="block w-full text-left text-xs px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Spør om noe..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function getInitialMessage(step: number): string {
  const messages: Record<number, string> = {
    1: 'Hei! Jeg kan hjelpe deg med å registrere en ny modul. La oss starte med å oppdage modulen din. Skriv inn modulnavnet, og jeg vil automatisk fylle ut informasjon fra MODULE_INFO.json hvis den finnes.',
    2: 'Nå skal vi fylle ut modulens informasjon. Jeg kan hjelpe deg med:\n\n• Semantic versioning (hva betyr 1.0.0?)\n• Modulbeskrivelse\n• Kategorisering\n\nHva vil du vite mer om?',
    3: 'Tid for GitHub-integrasjon! Jeg kan forklare:\n\n• Hvordan webhooks fungerer\n• Sync-strategier (subtree vs submodule)\n• Branch-seleksjon\n• Automatisk oppsett\n\nHva lurer du på?',
    4: 'Siste gjennomgang! Jeg kan hjelpe deg med:\n\n• Gjennomgang av all informasjon\n• Konflikt-analyse\n• Publishing-opsjoner\n• Neste steg etter registrering\n\nHar du spørsmål før du fullfører?',
  }

  return (
    messages[step] ||
    'Hei! Jeg er her for å hjelpe deg med modulregistrering. Hva kan jeg hjelpe deg med?'
  )
}

function getStepSuggestions(step: number): string[] {
  const suggestions: Record<number, string[]> = {
    1: [
      'Hva er MODULE_INFO.json?',
      'Hvorfor må jeg oppgi modulnavn?',
      'Kan jeg endre navnet senere?',
    ],
    2: [
      'Hva er semantic versioning?',
      'Hvorfor må jeg ha en beskrivelse?',
      'Hva betyr kategorien?',
    ],
    3: [
      'Hva er en webhook?',
      'Hva er forskjellen mellom subtree og submodule?',
      'Hvilken branch skal jeg bruke?',
    ],
    4: [
      'Hva skjer etter registrering?',
      'Kan jeg publisere til NPM?',
      'Hvordan setter jeg opp CI/CD?',
    ],
  }

  return suggestions[step] || []
}

function getDefaultResponse(
  input: string,
  currentStep: number
): string {
  // Fallback response if AI API is not available
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes('semantic') || lowerInput.includes('version')) {
    return `Semantic versioning følger formatet MAJOR.MINOR.PATCH (f.eks. 1.0.0):

• **MAJOR** (1.x.x): Breaking changes - bryter kompatibilitet
• **MINOR** (x.1.x): Nye features - bakoverkompatibel
• **PATCH** (x.x.1): Bug fixes - bakoverkompatibel

Eksempel:
- 1.0.0 → 1.0.1 (bug fix)
- 1.0.0 → 1.1.0 (ny feature)
- 1.0.0 → 2.0.0 (breaking change)

Start alltid med 1.0.0 for en ny modul.`
  }

  if (lowerInput.includes('webhook')) {
    return `En webhook er en automatisk notifikasjon fra GitHub til ditt system når noe skjer i repository:

• **Push**: Når kode pushes til repository
• **Release**: Når en ny release lages
• **Pull Request**: Når en PR åpnes/lukkes

Når du setter opp webhook, vil systemet automatisk:
1. Motta varsler om endringer
2. Synkronisere moduler automatisk
3. Oppdatere versjoner
4. Kjøre tester

Dette gjør utviklingsprosessen mye mer automatisert!`
  }

  if (lowerInput.includes('subtree') || lowerInput.includes('submodule')) {
    return `**Git Subtree vs Submodule:**

**Subtree** (anbefalt):
• Enklere å arbeide med
• Alt er en del av hovedrepoet
• Bedre for moduler du skal selge

**Submodule**:
• Mer kompleks
• Peker til eksterne repositories
• Bedre for store eksterne avhengigheter

For moduler i ditt system, anbefaler jeg **Subtree** for enklere arbeidsflyt.`
  }

  return `Jeg forstår at du spør om "${input}". Basert på steg ${currentStep} i onboarding-prosessen, her er informasjon som kan hjelpe deg. Vil du at jeg skal forklare mer om et spesifikt tema?`
}



