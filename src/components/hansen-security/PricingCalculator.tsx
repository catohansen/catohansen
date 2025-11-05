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
 * Hansen Security Pricing Calculator
 * Calculate pricing for Hansen Security with modules, open source parts, and estimated time
 */

'use client'

import { useState } from 'react'
import { Calculator, Shield, Package, Code, Clock, DollarSign, CheckCircle2, X, Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface ModuleOption {
  id: string
  name: string
  description: string
  basePrice: number
  estimatedTime: string // "2 weeks", "1 month", etc.
  openSource: boolean
  freeParts: string[]
  category: 'security' | 'auth' | 'crm' | 'content' | 'ai' | 'analytics' | 'billing'
}

const modules: ModuleOption[] = [
  {
    id: 'hansen-security',
    name: 'Hansen Security',
    description: 'Fine-grained authorization system',
    basePrice: 499,
    estimatedTime: '2 weeks',
    openSource: false,
    freeParts: ['Basic RBAC', 'Policy Engine Core'],
    category: 'security'
  },
  {
    id: 'hansen-auth',
    name: 'Hansen Auth',
    description: 'Modern authentication framework',
    basePrice: 499,
    estimatedTime: '2 weeks',
    openSource: false,
    freeParts: ['Basic Sign In/Up', 'Session Management'],
    category: 'auth'
  },
  {
    id: 'client-management',
    name: 'Hansen CRM',
    description: 'Enterprise CRM system',
    basePrice: 999,
    estimatedTime: '3 weeks',
    openSource: false,
    freeParts: ['Contact Management', 'Basic Pipeline'],
    category: 'crm'
  },
  {
    id: 'content-management',
    name: 'Content Management',
    description: 'CMS with SEO tools',
    basePrice: 799,
    estimatedTime: '2 weeks',
    openSource: false,
    freeParts: ['Page Editor', 'Media Library'],
    category: 'content'
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    description: 'AI automation system',
    basePrice: 1299,
    estimatedTime: '4 weeks',
    openSource: true,
    freeParts: ['Basic Agent Framework', 'Open Source Core'],
    category: 'ai'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Advanced analytics dashboard',
    basePrice: 699,
    estimatedTime: '2 weeks',
    openSource: false,
    freeParts: ['Basic Reports', 'Chart Components'],
    category: 'analytics'
  },
  {
    id: 'billing-system',
    name: 'Billing System',
    description: 'Payment & invoicing',
    basePrice: 899,
    estimatedTime: '3 weeks',
    openSource: false,
    freeParts: ['Invoice Generator', 'Basic Payment'],
    category: 'billing'
  }
]

export default function HansenSecurityPricingCalculator() {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set())
  const [licenseType, setLicenseType] = useState<'nok' | 'abn' | 'opensource'>('nok')

  const toggleModule = (moduleId: string) => {
    const newSet = new Set(selectedModules)
    if (newSet.has(moduleId)) {
      newSet.delete(moduleId)
    } else {
      newSet.add(moduleId)
    }
    setSelectedModules(newSet)
  }

  const calculateTotal = () => {
    let total = 0
    let totalTime = 0

    selectedModules.forEach((moduleId) => {
      const module = modules.find(m => m.id === moduleId)
      if (module) {
        if (licenseType === 'opensource') {
          // Open source modules are free (only if they have openSource: true)
          if (!module.openSource) {
            total += module.basePrice * 0.5 // 50% discount for open source parts
          }
        } else if (licenseType === 'abn') {
          // International companies (ABN) - same price
          total += module.basePrice
        } else {
          // NOK pricing (default)
          total += module.basePrice
        }
        
        // Parse estimated time
        const timeMatch = module.estimatedTime.match(/(\d+)\s*(week|month)/i)
        if (timeMatch) {
          const amount = parseInt(timeMatch[1])
          const unit = timeMatch[2].toLowerCase()
          totalTime += unit === 'month' ? amount * 4 : amount
        }
      }
    })

    return { total, totalTime: totalTime > 0 ? `${totalTime} weeks` : '0 weeks' }
  }

  const { total, totalTime } = calculateTotal()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: licenseType === 'abn' ? 'USD' : 'NOK',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* License Type Selector */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          License Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'nok', label: 'NOK Pricing', desc: 'Norske selskaper' },
            { id: 'abn', label: 'International (ABN)', desc: 'Utenlandske selskaper' },
            { id: 'opensource', label: 'Open Source', desc: 'Gratis deler av moduler' }
          ].map((license) => (
            <button
              key={license.id}
              onClick={() => setLicenseType(license.id as any)}
              className={`p-4 rounded-lg border transition-all text-left ${
                licenseType === license.id
                  ? 'bg-purple-500/20 border-purple-500 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/50'
              }`}
            >
              <div className="font-semibold mb-1">{license.label}</div>
              <div className="text-sm opacity-75">{license.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Module Selection */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-400" />
          Select Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedModules.has(module.id)
                  ? 'bg-purple-500/20 border-purple-500'
                  : 'bg-white/5 border-white/10 hover:border-purple-500/50'
              }`}
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{module.name}</h4>
                    {module.openSource && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30">
                        Open Source
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{module.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {licenseType === 'opensource' && module.openSource
                        ? 'Gratis'
                        : licenseType === 'opensource'
                        ? formatPrice(module.basePrice * 0.5) + ' (50% off)'
                        : formatPrice(module.basePrice)}
                    </div>
                  </div>
                  {module.freeParts.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs text-green-400 mb-1">Gratis deler:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.freeParts.map((part, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  selectedModules.has(module.id)
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-gray-500'
                }`}>
                  {selectedModules.has(module.id) && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Total Calculation */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-purple-400" />
            Total Estimate
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Total Price</p>
            <p className="text-3xl font-bold text-white">
              {licenseType === 'opensource' && selectedModules.size > 0 && modules.filter(m => selectedModules.has(m.id) && m.openSource).length === selectedModules.size
                ? 'Gratis'
                : formatPrice(total)}
            </p>
            {licenseType === 'opensource' && (
              <p className="text-xs text-green-400 mt-1">
                Open source moduler er gratis. Andregrad moduler har 50% rabatt.
              </p>
            )}
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Estimert Tid</p>
            <p className="text-3xl font-bold text-white">{totalTime}</p>
            <p className="text-xs text-gray-400 mt-1">
              Inkluderer setup, konfigurering og testing
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">Prisinformasjon:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>NOK Pricing: Standard priser for norske selskaper</li>
            <li>International (ABN): Samme priser i USD for utenlandske selskaper</li>
            <li>Open Source: Gratis for open source moduler, 50% rabatt for andre moduler</li>
            <li>Alle priser inkluderer setup, dokumentasjon og første måned support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}



