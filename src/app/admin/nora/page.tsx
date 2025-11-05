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
 * Nora Admin Configuration Page
 * Configure Nora settings, enabled services, pages, and chat bubbles
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Brain,
  Settings,
  Globe,
  MessageCircle,
  Zap,
  Shield,
  Save,
  CheckCircle,
  XCircle,
  Activity,
  Mic,
  Eye,
  EyeOff
} from 'lucide-react'
import { motion } from 'framer-motion'

interface NoraConfig {
  enabled: boolean
  api: {
    provider: 'openai' | 'google'
    googleApiKey: string
    googleModel: string
    openaiApiKey: string
    openaiModel: string
  }
  services: {
    chat: boolean
    voice: boolean
    automation: boolean
    logging: boolean
    systemCreation: boolean
  }
  pages: {
    landing: boolean
    admin: boolean
    modules: boolean
    knowledgeBase: boolean
    all: boolean
  }
  chatBubbles: {
    landing: boolean
    admin: boolean
    modules: boolean
    knowledgeBase: boolean
    crm: boolean
    security: boolean
    mindmap: boolean
    position: 'bottom-right' | 'bottom-left'
  }
  integrations: {
    hansenSecurity: boolean
    userManagement: boolean
    clientManagement: boolean
    aiAgents: boolean
    contentManagement: boolean
    projectManagement: boolean
    billingSystem: boolean
    analytics: boolean
  }
  personality: {
    tone: string
    language: string
    responseStyle: string
  }
}

export default function NoraAdminPage() {
  const [config, setConfig] = useState<NoraConfig>({
    enabled: true,
    api: {
      provider: 'google',
      googleApiKey: 'AIzaSyAaWnqF0fH_x3mOo-S5XhifO1SobW0KKvE',
      googleModel: 'models/gemini-2.0-flash',
      openaiApiKey: '',
      openaiModel: 'gpt-4o-mini'
    },
    services: {
      chat: true,
      voice: true,
      automation: true,
      logging: true,
      systemCreation: true
    },
    pages: {
      landing: true,
      admin: true,
      modules: true,
      knowledgeBase: true,
      all: true
    },
    chatBubbles: {
      landing: true,
      admin: true,
      modules: true,
      knowledgeBase: true,
      crm: true,
      security: true,
      mindmap: true,
      position: 'bottom-right'
    },
    integrations: {
      hansenSecurity: true,
      userManagement: true,
      clientManagement: true,
      aiAgents: true,
      contentManagement: true,
      projectManagement: true,
      billingSystem: true,
      analytics: true
    },
    personality: {
      tone: 'calm, wise, friendly, analytical, sharp',
      language: 'Norwegian Bokmål',
      responseStyle: 'helpful, detailed, context-aware'
    }
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showApiKeys, setShowApiKeys] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/nora/config')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.config) {
          setConfig(data.config)
        }
      }
    } catch (error) {
      console.error('Failed to load Nora config:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch('/api/admin/nora/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        throw new Error('Failed to save config')
      }
    } catch (error) {
      console.error('Failed to save Nora config:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleService = (service: keyof typeof config.services) => {
    setConfig(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }))
  }

  const togglePage = (page: keyof typeof config.pages) => {
    setConfig(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: !prev.pages[page]
      }
    }))
  }

  const toggleChatBubble = (bubble: keyof typeof config.chatBubbles) => {
    setConfig(prev => ({
      ...prev,
      chatBubbles: {
        ...prev.chatBubbles,
        [bubble]: !prev.chatBubbles[bubble]
      }
    }))
  }

  const toggleIntegration = (integration: keyof typeof config.integrations) => {
    setConfig(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [integration]: !prev.integrations[integration]
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nora Konfigurasjon</h1>
            <p className="text-gray-600">Administrer Nora - The Mind Behind Hansen Global</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              config.enabled
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            {config.enabled ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Nora er aktiv</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span>Nora er deaktivert</span>
              </>
            )}
          </button>

          <button
            onClick={saveConfig}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 ${
              saved ? 'bg-green-600' : ''
            }`}
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Lagret!</span>
              </>
            ) : saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Lagrer...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Lagre endringer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          API Konfigurasjon
        </h2>
        <p className="text-gray-600 mb-4">Konfigurer AI-provider og API-nøkler for Nora</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
            <select
              value={config.api.provider}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                api: { ...prev.api, provider: e.target.value as 'openai' | 'google' }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="google">Google AI Studio (Gemini)</option>
              <option value="openai">OpenAI (GPT)</option>
            </select>
          </div>

          {config.api.provider === 'google' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google AI API Key</label>
                <div className="relative">
                  <input
                    type={showApiKeys ? 'text' : 'password'}
                    value={config.api.googleApiKey}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      api: { ...prev.api, googleApiKey: e.target.value }
                    }))}
                    placeholder="AIzaSy..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKeys(!showApiKeys)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">API-nøkkel fra Google AI Studio</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google AI Model</label>
                <select
                  value={config.api.googleModel}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    api: { ...prev.api, googleModel: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="models/gemini-1.5-flash">Gemini 1.5 Flash (rask)</option>
                  <option value="models/gemini-1.5-pro">Gemini 1.5 Pro (avansert)</option>
                  <option value="models/gemini-pro">Gemini Pro</option>
                </select>
              </div>
            </>
          )}

          {config.api.provider === 'openai' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                <div className="relative">
                  <input
                    type={showApiKeys ? 'text' : 'password'}
                    value={config.api.openaiApiKey}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      api: { ...prev.api, openaiApiKey: e.target.value }
                    }))}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKeys(!showApiKeys)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">API-nøkkel fra OpenAI</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI Model</label>
                <select
                  value={config.api.openaiModel}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    api: { ...prev.api, openaiModel: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            </>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Viktig:</strong> API-nøkler lagres kryptert i databasen. Når du endrer provider eller nøkler, 
              vil Nora automatisk bruke de nye innstillingene.
            </p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Tjenester
        </h2>
        <p className="text-gray-600 mb-4">Aktiver/deaktiver Nora&apos;s tjenester</p>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(config.services).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-gray-600">
                  {key === 'chat' && 'Chat med brukere'}
                  {key === 'voice' && 'Stemmeinput/output'}
                  {key === 'automation' && 'Automatisering og handlinger'}
                  {key === 'logging' && 'Loggfører for hendelser'}
                  {key === 'systemCreation' && 'Opprettelse av systemer'}
                </p>
              </div>
              <button
                onClick={() => toggleService(key as keyof typeof config.services)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pages */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Sider
        </h2>
        <p className="text-gray-600 mb-4">Hvor skal Nora være tilgjengelig?</p>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(config.pages).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-gray-600">
                  {key === 'landing' && 'Hovedside'}
                  {key === 'admin' && 'Admin panel'}
                  {key === 'modules' && 'Modul-sider'}
                  {key === 'knowledgeBase' && 'Kunnskapsbase'}
                  {key === 'all' && 'Alle sider'}
                </p>
              </div>
              <button
                onClick={() => togglePage(key as keyof typeof config.pages)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Bubbles */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-pink-600" />
          Chat Bobler
        </h2>
        <p className="text-gray-600 mb-4">Hvor skal Nora chat-boblen vises?</p>
        
        {/* Position Setting */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">Posisjon på skjerm</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="chatPosition"
                value="bottom-right"
                checked={config.chatBubbles.position === 'bottom-right'}
                onChange={() => setConfig(prev => ({
                  ...prev,
                  chatBubbles: { ...prev.chatBubbles, position: 'bottom-right' }
                }))}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-900 group-hover:text-purple-600">Nederst høyre</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="chatPosition"
                value="bottom-left"
                checked={config.chatBubbles.position === 'bottom-left'}
                onChange={() => setConfig(prev => ({
                  ...prev,
                  chatBubbles: { ...prev.chatBubbles, position: 'bottom-left' }
                }))}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-900 group-hover:text-purple-600">Nederst venstre</span>
            </label>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Chat-boblen vil vises på valgt side når den er aktivert nedenfor
          </p>
        </div>

        {/* Page Toggles */}
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(config.chatBubbles).filter(([key]) => key !== 'position').map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-gray-600">
                  {key === 'landing' && 'Hovedside'}
                  {key === 'admin' && 'Admin panel'}
                  {key === 'modules' && 'Modul-sider'}
                  {key === 'knowledgeBase' && 'Kunnskapsbase'}
                  {key === 'crm' && 'CRM 2.0'}
                  {key === 'security' && 'Hansen Security'}
                  {key === 'mindmap' && 'MindMap 2.0'}
                </p>
              </div>
              <button
                onClick={() => toggleChatBubble(key as keyof typeof config.chatBubbles)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-pink-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Integrasjoner
        </h2>
        <p className="text-gray-600 mb-4">Hvilke moduler skal Nora ha tilgang til?</p>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(config.integrations).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-900">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-gray-600">
                  {key === 'hansenSecurity' && 'Hansen Security'}
                  {key === 'userManagement' && 'User Management'}
                  {key === 'clientManagement' && 'Client Management'}
                  {key === 'aiAgents' && 'AI Agents'}
                  {key === 'contentManagement' && 'Content Management'}
                  {key === 'projectManagement' && 'Project Management'}
                  {key === 'billingSystem' && 'Billing System'}
                  {key === 'analytics' && 'Analytics'}
                </p>
              </div>
              <button
                onClick={() => toggleIntegration(key as keyof typeof config.integrations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Personality */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Personlighet
        </h2>
        <p className="text-gray-600 mb-4">Nora&apos;s personlighet og kommunikasjonsstil</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <input
              type="text"
              value={config.personality.tone}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                personality: { ...prev.personality, tone: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Språk</label>
            <input
              type="text"
              value={config.personality.language}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                personality: { ...prev.personality, language: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Respons-stil</label>
            <input
              type="text"
              value={config.personality.responseStyle}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                personality: { ...prev.personality, responseStyle: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <Activity className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Om Nora</h3>
            <p className="text-gray-700 text-sm">
              Nora er den eneste AI-assistenten i hele Hansen Global-universet. Uansett hvor i systemet brukeren befinner seg, 
              er det alltid Nora som hjelper. Hun forstår hele økosystemet og kan hjelpe med alt — fra spørsmål om moduler 
              til systemautomatisering.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

