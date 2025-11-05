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
 * Nora Admin Dashboard v3.0
 * 
 * Complete admin panel for managing Nora modules, security, and monitoring
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Shield,
  Settings,
  BarChart3,
  Activity,
  Database as Memory,
  Heart,
  Mic,
  Zap,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import MetricsPanel from './MetricsPanel'
import MemoryStats from './MemoryStats'
import EmotionFeed from './EmotionFeed'

export interface ModuleToggle {
  id: string
  name: string
  enabled: boolean
  description: string
  icon: React.ReactNode
}

export default function NoraDashboardHome() {
  const [modules, setModules] = useState<ModuleToggle[]>([
    {
      id: 'memory',
      name: 'Memory Engine',
      enabled: true,
      description: 'Langtidshukommelse med semantisk søk',
      icon: <Memory className="w-6 h-6" />
    },
    {
      id: 'emotion',
      name: 'Emotion Engine',
      enabled: true,
      description: 'Følelsesintelligent AI med tonejustering',
      icon: <Heart className="w-6 h-6" />
    },
    {
      id: 'voice',
      name: 'Voice Engine',
      enabled: true,
      description: 'Stemmeinput og -output med Whisper + ElevenLabs',
      icon: <Mic className="w-6 h-6" />
    },
    {
      id: 'automation',
      name: 'Automation Engine',
      enabled: false,
      description: 'Automatiser oppgaver på tvers av systemer',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'security',
      name: 'Security Engine',
      enabled: true,
      description: 'Integrert med Hansen Security RBAC/ABAC',
      icon: <Shield className="w-6 h-6" />
    }
  ])

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<{
    system: string
    version: string
    health: string
    active_persona: string
    heartbeat: string
  } | null>(null)

  useEffect(() => {
    // Load Nora status
    fetch('/api/nora/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load Nora status:', err)
        setLoading(false)
      })
  }, [])

  const toggleModule = async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return

    // Update local state
    setModules(modules.map(m =>
      m.id === moduleId ? { ...m, enabled: !m.enabled } : m
    ))

    // Save to backend
    try {
      await fetch('/api/admin/nora/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: {
            [moduleId]: !module.enabled
          }
        })
      })
    } catch (error) {
      console.error('Failed to update module:', error)
      // Revert on error
      setModules(modules.map(m =>
        m.id === moduleId ? { ...m, enabled: module.enabled } : m
      ))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E16] to-[#171721] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Nora Admin Dashboard
          </motion.h1>
          <p className="text-gray-400">
            Manage Nora modules, security, and monitoring
          </p>
          {status && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.health === 'healthy' ? 'bg-[#00FFC2]' : 'bg-red-500'} animate-pulse`} />
                <span className="text-gray-400">
                  {status.system} v{status.version} • {status.active_persona}
                </span>
              </div>
              <span className="text-gray-500">
                Last heartbeat: {new Date(status.heartbeat).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Module Toggles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#171721] border border-[#24243A] rounded-xl p-6 hover:border-[#7A5FFF]/60 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-[#00FFC2]">
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{module.name}</h3>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`flex-shrink-0 transition-all ${
                    module.enabled ? 'text-[#00FFC2]' : 'text-gray-500'
                  }`}
                >
                  {module.enabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metrics & Stats */}
        <div className="grid lg:grid-cols-2 gap-6">
          <MetricsPanel />
          <MemoryStats />
          <div className="lg:col-span-2">
            <EmotionFeed />
          </div>
        </div>
      </div>
    </div>
  )
}

