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
 * AI Assistant for Knowledge Base
 * Chat-based AI assistant that understands the system using RAG
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  Lightbulb,
  Code2,
  BookOpen,
  X
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hei! Jeg er Nora, AI-kjerneintelligensen for Hansen Global. 💠

Jeg kan hjelpe deg med:
• Spørsmål om systemet, moduler, API, deployment
• Kunnskapsbase og dokumentasjon
• Systemarkitektur og designvalg
• Alt annet relatert til Hansen Global-universet

Hva vil du vite?`,
      timestamp: new Date(),
      suggestions: [
        'Hvordan bruker jeg Hansen Security?',
        'Vis meg eksempler på RBAC',
        'Hvordan deployer jeg til domene.shop?',
        'Forklar systemarkitekturen'
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      // Simulate AI response (replace with actual RAG implementation)
      await new Promise(resolve => setTimeout(resolve, 2000))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Basert på spørsmålet ditt om "${input}", her er informasjonen du trenger:

**Kort svar:**
Systemet bruker [modulnavn] for [funksjon]. 

**Detaljer:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Eksempel:**
\`\`\`typescript
// Kode eksempel her
\`\`\`

**Relatert dokumentasjon:**
- [Link til guide]
- [Link til API docs]

Har du flere spørsmål?`,
        timestamp: new Date(),
        suggestions: [
          'Vis meg mer eksempler',
          'Hvordan gjør jeg X?',
          'Forklar Y i detalj'
        ]
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Beklager, jeg opplevde en feil. Prøv igjen eller reformuler spørsmålet.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <div className="flex flex-col h-[800px] glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Assistant</h2>
            <p className="text-sm text-white/80">Spør om systemet - jeg forstår alt!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-3xl ${message.role === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`
                    rounded-2xl p-4
                    ${message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                    }
                  `}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold mt-2 first:mt-0">{line.replace(/\*\*/g, '')}</p>
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>
                      }
                      if (line.startsWith('```')) {
                        return null // Handle code blocks separately
                      }
                      return <p key={i} className="mb-2 last:mb-0">{line}</p>
                    })}
                  </div>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(suggestion)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Spør om systemet..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
              disabled={sending}
            />
            <Lightbulb className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          AI-assistenten bruker RAG for å gi nøyaktige svar basert på hele knowledge base
        </p>
      </div>
    </div>
  )
}





