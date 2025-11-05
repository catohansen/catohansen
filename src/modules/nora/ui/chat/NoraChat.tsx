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
 * Nora Chat Component
 * Main chat interface for interacting with Nora
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  Loader2,
  Mic,
  MicOff,
  Sparkles,
  Brain
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function NoraChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hei! Jeg er Nora, AI-kjerneintelligensen for Hansen Global. 💠

Jeg kan hjelpe deg med:
• Spørsmål om systemet og moduler
• Veiledning gjennom implementeringer
• Forklaring av arkitektur og designvalg
• Automatisering og systemhandlinger
• Alt annet relatert til Hansen Global-universet

Hva vil du vite?`,
      timestamp: new Date(),
      suggestions: [
        'Hva er du, Nora?',
        'Fortell meg om Hansen Security',
        'Hvordan fungerer du?',
        'Hva kan du hjelpe meg med?'
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [listening, setListening] = useState(false)
  const [hasVoicePermission, setHasVoicePermission] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check voice permission on mount
  useEffect(() => {
    checkVoicePermission()
  }, [])

  const checkVoicePermission = async () => {
    try {
      const response = await fetch('/api/nora/permissions?action=check-permission', {
        method: 'GET',
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setHasVoicePermission(data.hasPermission || false)
      }
    } catch (error) {
      console.error('Voice permission check error:', error)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const question = input
    setInput('')
    setSending(true)

    try {
      const response = await fetch('/api/nora/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          pageContext: '/nora',
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          suggestions: data.suggestions || []
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Beklager, jeg opplevde en feil. Prøv igjen eller formuler spørsmålet annerledes.',
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

  const startListening = async () => {
    if (!hasVoicePermission) {
      // Request permission
      const response = await fetch('/api/nora/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-permission',
          userId: 'anonymous', // TODO: Get actual user ID
          permissionType: 'listen'
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.granted) {
          setHasVoicePermission(true)
        } else {
          alert('Du må godkjenne mikrofon-tilgang for å bruke stemme.')
          return
        }
      }
    }

    // Use browser Speech Recognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Stemmegjenkjenning støttes ikke i denne nettleseren.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'no-NO'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setListening(false)
      recognition.stop()
      setTimeout(() => handleSend(), 100)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setListening(false)
      alert('Stemmegjenkjenning feilet. Prøv igjen.')
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setListening(false)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
      {/* Messages */}
      <div className="h-[500px] overflow-y-auto p-4 space-y-4 mb-4 bg-slate-900/50 rounded-lg">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white/10 border border-white/20 text-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestion(suggestion)}
                        className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-medium transition-colors border border-purple-500/30"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
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
            placeholder="Spør Nora hva som helst..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 pr-24"
            disabled={sending}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={listening ? stopListening : startListening}
              className={`p-2 rounded-lg transition-colors ${
                listening
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
              disabled={sending}
            >
              {listening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <Sparkles className="text-gray-400 w-4 h-4" />
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Send</span>
        </button>
      </div>

      <p className="mt-3 text-xs text-gray-400 flex items-center gap-1 justify-center">
        <Brain className="w-3 h-3" />
        Nora forstår hele Hansen Global-universet og gir deg relevante svar
      </p>
    </div>
  )
}

