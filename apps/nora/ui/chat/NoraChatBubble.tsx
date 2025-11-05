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
 * Nora Chat Bubble
 * Floating chat bubble component - Nora's entry point on any page
 * Can be positioned bottom-right or bottom-left
 * Can be reused across all pages via admin configuration
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot,
  Mic,
  Loader2
} from 'lucide-react'
import MagicVisualization from '../components/MagicVisualization'
import NoraAvatar from '../components/NoraAvatar'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  pageContext?: string
  suggestions?: string[]
}

export interface NoraChatBubbleProps {
  position?: 'bottom-right' | 'bottom-left'
  enabled?: boolean
  pageContext?: string
  moduleContext?: string[]
  userId?: string
  onClose?: () => void
  defaultOpen?: boolean // Override default open state (for landing pages, etc.)
}

export default function NoraChatBubble({
  position = 'bottom-right',
  enabled = true,
  pageContext = '/',
  moduleContext = [],
  userId,
  onClose,
  defaultOpen = false // Default: show floating button, not open chat
}: NoraChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen) // Start closed by default, show floating button

  // Sync with defaultOpen prop changes
  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

  // Listen for custom event to open chat
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleOpenChat = () => {
      setIsOpen(true)
    }
    
    window.addEventListener('openNoraChat', handleOpenChat)
    return () => window.removeEventListener('openNoraChat', handleOpenChat)
  }, [])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hei! Jeg er Nora, AI-kjerneintelligensen for Hansen Global. 💠

Jeg kan hjelpe deg med spørsmål om:
• Cato Hansen og Hansen Global-universet
• Alle moduler (Hansen Security, CRM 2.0, MindMap 2.0, osv.)
• Systemarkitektur og implementering
• Automatisering og systemhandlinger
• Alt annet relatert til Hansen Global

Hva vil du vite?`,
      timestamp: new Date(),
      pageContext,
      suggestions: [
        'Hva er Hansen Security?',
        'Hvordan fungerer CRM 2.0?',
        'Fortell meg om MindMap 2.0',
        'Hva kan du hjelpe meg med?'
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [magicMoment, setMagicMoment] = useState<{
    type: string
    visualization?: any
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const streamReaderRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const messageIdCounterRef = useRef(0)
  const [config, setConfig] = useState<{
    enabled: boolean
    position: 'bottom-right' | 'bottom-left'
  }>({ enabled, position }) // Start with defaults
  // Fixed box size
  const boxWidth = 420
  const boxHeight = 600

  // Load config from admin settings (non-blocking, async update)
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/admin/nora/config')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.config) {
            setConfig({
              enabled: data.config.enabled !== undefined ? data.config.enabled : enabled,
              position: data.config.chatBubbles?.position || position
            })
          }
          // If config not available, keep defaults (already set)
        }
        // If API fails, keep defaults (already set)
      } catch (error) {
        console.error('Failed to load Nora config:', error)
        // Keep defaults on error (already set)
      }
    }
    loadConfig()
  }, [enabled, position])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop voice recognition if active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          recognitionRef.current.abort()
        } catch (e) {
          // Ignore errors during cleanup
        }
        recognitionRef.current = null
      }

      // Cancel stream reader if active
      if (streamReaderRef.current) {
        try {
          streamReaderRef.current.cancel()
        } catch (e) {
          // Ignore errors during cleanup
        }
        streamReaderRef.current = null
      }

      // Restore body overflow
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending || streaming) return

    // Cancel any ongoing stream
    if (streamReaderRef.current) {
      try {
        await streamReaderRef.current.cancel()
      } catch (e) {
        // Ignore cancel errors
      }
      streamReaderRef.current = null
    }

    const question = input.trim()
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${++messageIdCounterRef.current}`,
      role: 'user',
      content: question,
      timestamp: new Date(),
      pageContext
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)
    setStreaming(true)

    // Add placeholder message for streaming
    const streamingId = `assistant-${Date.now()}-${++messageIdCounterRef.current}`
    setStreamingMessage(streamingId)
    setMessages(prev => [...prev, {
      id: streamingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      pageContext
    }])

    try {
      // Call Nora API with streaming support
      const response = await fetch('/api/nora/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain',
        },
        body: JSON.stringify({
          message: question,
          pageContext,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content
          })),
          userId,
          moduleContext
        }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        throw new Error(errorText || `HTTP ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      // Stream response - API sends plaintext chunks, not JSON
      const reader = response.body.getReader()
      streamReaderRef.current = reader
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          // Stream finished - finalize message
          setMessages(prev => prev.map(msg => 
            msg.id === streamingId 
              ? { ...msg, content: fullText || 'Ingen respons mottatt.' }
              : msg
          ))
          setStreamingMessage('')
          setStreaming(false)
          setSending(false)
          streamReaderRef.current = null
          break
        }

        // Decode chunk and append to full text
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        
        // Update message in real-time
        setMessages(prev => prev.map(msg => 
          msg.id === streamingId 
            ? { ...msg, content: fullText }
            : msg
        ))
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      
      // Cancel reader if still active
      if (streamReaderRef.current) {
        try {
          await streamReaderRef.current.cancel()
        } catch (e) {
          // Ignore cancel errors
        }
        streamReaderRef.current = null
      }

      setStreaming(false)
      setStreamingMessage('')
      
      // Remove streaming placeholder and add error
      setMessages(prev => prev.filter(msg => msg.id !== streamingId))
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}-${++messageIdCounterRef.current}`,
        role: 'assistant',
        content: error?.message?.includes('Failed to fetch') 
          ? 'Kunne ikke koble til Nora. Sjekk internettforbindelsen din og prøv igjen.'
          : 'Beklager, jeg opplevde en feil. Prøv igjen eller formuler spørsmålet annerledes.',
        timestamp: new Date(),
        pageContext
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setSending(false)
      setStreaming(false)
      // Focus input after sending
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [input, sending, streaming, messages, pageContext, userId, moduleContext])

  // Voice input handler
  const handleMic = useCallback(async () => {
    if (typeof window === 'undefined') return

    // Stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
        recognitionRef.current.abort()
      } catch (e) {
        // Ignore errors
      }
      recognitionRef.current = null
      setMicActive(false)
      return
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Stemmeinput er ikke støttet i denne nettleseren. Vennligst bruk Chrome eller Edge.')
      return
    }

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (error) {
      alert('Mikrofontilgang ble avvist. Vennligst tillat mikrofontilgang i nettleseren din.')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    
    recognition.lang = 'no-NO'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setMicActive(true)
    }

    recognition.onend = () => {
      setMicActive(false)
      recognitionRef.current = null
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setMicActive(false)
      recognitionRef.current = null
      
      if (event.error === 'no-speech') {
        // User didn't speak - this is normal, just reset
        return
      } else if (event.error === 'not-allowed') {
        alert('Mikrofontilgang ble avvist. Vennligst tillat mikrofontilgang i nettleseren din.')
      } else if (event.error === 'network') {
        alert('Nettverksfeil ved stemmegjenkjenning. Sjekk internettforbindelsen din.')
      } else {
        // Other errors - just log
        console.warn('Speech recognition error:', event.error)
      }
    }

    recognition.onresult = (event: any) => {
      if (event.results && event.results.length > 0 && event.results[0].length > 0) {
        const transcript = event.results[0][0].transcript.trim()
        if (transcript) {
          setInput(transcript)
          // Auto-send after voice input
          setTimeout(() => {
            handleSend()
          }, 100)
        }
      }
      setMicActive(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      setMicActive(false)
      recognitionRef.current = null
    }
  }, [handleSend])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    if (sending || streaming) return // Don't allow new messages while sending/streaming
    
    setInput(suggestion)
    // Focus input and scroll to it
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
    
    // Auto-send suggestion (optional - can be removed if user prefers to edit first)
    setTimeout(() => {
      if (inputRef.current?.value === suggestion) {
        handleSend()
      }
    }, 200)
  }, [sending, streaming, handleSend])

  // Use config (starts with defaults, updates from API)
  const chatPosition = config.position || position
  const isEnabled = config.enabled !== false && enabled

  // Don't render if disabled
  if (!isEnabled) {
    return null
  }

  // Always render - floating button when closed, chat when open
  return (
    <>
      {/* Floating Chat Bubble Button - Shows when chat is closed */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true)
          }}
          className={`fixed ${chatPosition === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6'} z-nora-chat w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-all group`}
          aria-label="Chat med Nora"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Bot className="w-8 h-8" />
          </motion.div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (optional - for mobile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-nora-chat-backdrop md:hidden"
            />

            {/* Chat Container - Fixed position, no drag */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: 0
              }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="fixed z-nora-chat bg-gradient-to-br from-[#0E0E16] to-[#171721] rounded-2xl shadow-2xl border-2 border-[#7A5FFF]/50 flex flex-col overflow-hidden backdrop-blur-xl"
              style={{
                width: typeof window !== 'undefined' && window.innerWidth > 768 
                  ? `${boxWidth}px` 
                  : 'calc(100% - 3rem)',
                height: `${boxHeight}px`,
                maxHeight: '85vh',
                boxShadow: '0 20px 60px rgba(122, 95, 255, 0.4), 0 0 40px rgba(0, 255, 194, 0.2)',
                ...(chatPosition === 'bottom-right' ? {
                  bottom: '24px',
                  right: '24px',
                  left: 'auto',
                  top: 'auto'
                } : {
                  bottom: '24px',
                  left: '24px',
                  right: 'auto',
                  top: 'auto'
                })
              }}
            >
              {/* Header */}
              <div 
                className="bg-gradient-to-r from-[#7A5FFF] via-[#C6A0FF] to-[#00FFC2] text-white p-4 flex items-center justify-between border-b border-[#24243A]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center overflow-visible">
                    <NoraAvatar size={56} className="!m-0" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Nora</h3>
                    <p className="text-xs text-purple-100">AI-kjerneintelligens</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsOpen(false)
                      
                      // Cleanup on close
                      if (recognitionRef.current) {
                        try {
                          recognitionRef.current.stop()
                          recognitionRef.current.abort()
                        } catch (e) {
                          // Ignore errors
                        }
                        recognitionRef.current = null
                        setMicActive(false)
                      }
                      
                      if (streamReaderRef.current) {
                        try {
                          streamReaderRef.current.cancel()
                        } catch (e) {
                          // Ignore errors
                        }
                        streamReaderRef.current = null
                      }
                      
                      if (onClose) {
                        onClose()
                      }
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Lukk chat"
                    title="Lukk chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0E0E16] to-[#171721]">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white shadow-lg shadow-purple-500/30'
                          : 'bg-[#171721] border border-[#24243A] text-gray-200 shadow-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestionClick(suggestion)}
                              disabled={sending || streaming}
                              className="block w-full text-left text-xs px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[#24243A] p-4 bg-[#171721]">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="Skriv til Nora..."
                    className="flex-1 px-4 py-2 bg-[#0E0E16] border border-[#24243A] rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#7A5FFF] focus:border-[#7A5FFF]/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={sending || streaming}
                    aria-label="Skriv melding til Nora"
                    maxLength={2000}
                  />
                  <button
                    onClick={handleMic}
                    className={`p-2 rounded-lg transition-all ${
                      micActive 
                        ? 'bg-[#00FFC2]/30 text-[#00FFC2] ring-2 ring-[#00FFC2]/50 animate-pulse' 
                        : 'hover:bg-[#24243A] text-gray-400 hover:text-[#00FFC2]'
                    }`}
                    aria-label="Mikrofon"
                    title="Snakk med Nora"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending || streaming}
                    className="p-2 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send melding"
                  >
                    {sending || streaming ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REVOLUSJONERENDE: Magic Visualization */}
      {magicMoment && magicMoment.visualization && (
        <MagicVisualization
          type={magicMoment.type as any}
          particles={magicMoment.visualization.particles}
          colors={magicMoment.visualization.colors}
          animation={magicMoment.visualization.animation}
          duration={magicMoment.visualization.duration}
          onComplete={() => setMagicMoment(null)}
        />
      )}
    </>
  )
}

