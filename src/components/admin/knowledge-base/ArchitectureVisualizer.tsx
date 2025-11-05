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
 * Architecture Visualizer
 * Interactive visualization of system architecture, modules, and relationships
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Network,
  Package,
  Database,
  Shield,
  Users,
  Brain,
  FileText,
  Briefcase,
  CreditCard,
  BarChart3,
  GitBranch,
  Layers,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'

const modules = [
  {
    id: 'hansen-security',
    name: 'Hansen Security',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    connections: ['user-management', 'all-modules'],
    description: 'Authorization & Policy Engine'
  },
  {
    id: 'user-management',
    name: 'User Management',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    connections: ['hansen-security', 'all-modules'],
    description: 'RBAC & Authentication'
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    connections: ['content-management', 'client-management'],
    description: 'Multi-Agent Orchestration'
  },
  {
    id: 'content-management',
    name: 'Content Management',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    connections: ['ai-agents'],
    description: 'Headless CMS'
  },
  {
    id: 'client-management',
    name: 'Client Management',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
    connections: ['ai-agents', 'project-management'],
    description: 'CRM System'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    icon: GitBranch,
    color: 'from-yellow-500 to-amber-500',
    connections: ['client-management', 'billing-system'],
    description: 'Project Tracking'
  },
  {
    id: 'billing-system',
    name: 'Billing System',
    icon: CreditCard,
    color: 'from-pink-500 to-rose-500',
    connections: ['project-management', 'analytics'],
    description: 'Stripe Integration'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart3,
    color: 'from-teal-500 to-cyan-500',
    connections: ['billing-system', 'all-modules'],
    description: 'Business Intelligence'
  }
]

export default function ArchitectureVisualizer() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')
  const [showConnections, setShowConnections] = useState(true)

  const selectedModuleData = modules.find(m => m.id === selectedModule)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">System Architecture</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'overview'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Detailed
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowConnections(!showConnections)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {showConnections ? 'Hide' : 'Show'} Connections
        </button>
      </div>

      {/* Architecture Visualization */}
      <div className="relative">
        <div className="glass rounded-2xl p-12 min-h-[600px] relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {modules.map((module, i) => {
              const Icon = module.icon
              const isSelected = selectedModule === module.id
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedModule(isSelected ? null : module.id)}
                  className={`
                    relative cursor-pointer group
                    ${isSelected ? 'z-20' : ''}
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      glass rounded-2xl p-6 text-center transition-all
                      ${isSelected
                        ? 'ring-4 ring-purple-500 shadow-2xl scale-110'
                        : 'hover:shadow-xl'
                      }
                    `}
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    
                    {showConnections && module.connections.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          {module.connections.length} connection{module.connections.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* Connection Lines (simplified visualization) */}
          {showConnections && viewMode === 'detailed' && (
            <svg className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.3 }}>
              {modules.flatMap(module => 
                module.connections.map(connId => {
                  const target = modules.find(m => m.id === connId)
                  if (!target || connId === 'all-modules') return null
                  
                  const sourceIndex = modules.findIndex(m => m.id === module.id)
                  const targetIndex = modules.findIndex(m => m.id === target.id)
                  
                  // Calculate positions (simplified grid layout)
                  const sourceX = ((sourceIndex % 3) + 0.5) * (100 / 3)
                  const sourceY = ((Math.floor(sourceIndex / 3)) + 0.5) * (100 / 3)
                  const targetX = ((targetIndex % 3) + 0.5) * (100 / 3)
                  const targetY = ((Math.floor(targetIndex / 3)) + 0.5) * (100 / 3)
                  
                  return (
                    <line
                      key={`${module.id}-${connId}`}
                      x1={`${sourceX}%`}
                      y1={`${sourceY}%`}
                      x2={`${targetX}%`}
                      y2={`${targetY}%`}
                      stroke="rgba(147, 51, 234, 0.3)"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })
              )}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="rgba(147, 51, 234, 0.3)" />
                </marker>
              </defs>
            </svg>
          )}
        </div>
      </div>

      {/* Selected Module Details */}
      {selectedModuleData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedModuleData.color} flex items-center justify-center flex-shrink-0`}>
              <selectedModuleData.icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedModuleData.name}</h3>
              <p className="text-gray-600 mb-4">{selectedModuleData.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Connections</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModuleData.connections.map((connId) => {
                      const conn = modules.find(m => m.id === connId)
                      if (!conn) return null
                      return (
                        <span
                          key={connId}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                        >
                          {conn.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    View Documentation
                  </button>
                  <button className="px-4 py-2 glass rounded-lg font-semibold hover:shadow-lg transition-all">
                    View API
                  </button>
                  <button className="px-4 py-2 glass rounded-lg font-semibold hover:shadow-lg transition-all">
                    View Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Architecture Layers */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: 'Frontend', color: 'from-blue-500 to-cyan-500', icon: Layers },
          { name: 'API Layer', color: 'from-purple-500 to-pink-500', icon: Zap },
          { name: 'Database', color: 'from-green-500 to-emerald-500', icon: Database }
        ].map((layer, i) => {
          const Icon = layer.icon
          return (
            <div key={i} className="glass rounded-xl p-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${layer.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{layer.name}</h4>
              <p className="text-sm text-gray-600">
                {layer.name === 'Frontend' && 'Next.js 14, React, Tailwind'}
                {layer.name === 'API Layer' && 'REST API, Next.js Routes'}
                {layer.name === 'Database' && 'PostgreSQL, Prisma ORM'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}







