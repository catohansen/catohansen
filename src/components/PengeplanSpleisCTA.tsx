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
 * Pengeplan 2.0 Spleis CTA Component
 * Advanced call-to-action with funding breakdown and compelling messaging
 */

'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Heart, TrendingUp, Zap, ArrowRight, Users, DollarSign, 
  Server, Rocket, CheckCircle2, Shield, Brain, Sparkles 
} from 'lucide-react'

interface FundingGoal {
  icon: any
  goal: number
  raised: number
  label: string
  description: string
  color: string
}

export default function PengeplanSpleisCTA() {
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch funding breakdown from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pengeplan/spleis')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data?.fundingBreakdown) {
            setData(result.data.fundingBreakdown)
          }
        }
      } catch (err) {
        console.error('Error fetching funding data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // TODO: Replace with actual Spleis URL when campaign is created
  const SPLEIS_URL = process.env.NEXT_PUBLIC_SPLEIS_URL || 'https://www.spleis.no/projects/pengeplan-2.0'

  const fundingGoals: FundingGoal[] = data ? [
    {
      icon: Server,
      goal: data.server?.goal || 50000,
      raised: data.server?.raised || 7500,
      label: 'Server & Infrastruktur',
      description: 'Skalérbar hosting, database, CDN og backup-systemer',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      goal: data.aiServices?.goal || 30000,
      raised: data.aiServices?.raised || 2400,
      label: 'AI-tjenester & API',
      description: 'OpenAI, Hugging Face, og andre AI API-kostnader',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Rocket,
      goal: data.development?.goal || 20000,
      raised: data.development?.raised || 5750,
      label: 'Utvikling & Features',
      description: 'Feature-utvikling, testing og QA',
      color: 'from-green-500 to-emerald-500'
    },
  ] : [
    {
      icon: Server,
      goal: 50000,
      raised: 7500,
      label: 'Server & Infrastruktur',
      description: 'Skalérbar hosting, database, CDN og backup-systemer',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      goal: 30000,
      raised: 2400,
      label: 'AI-tjenester & API',
      description: 'OpenAI, Hugging Face, og andre AI API-kostnader',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Rocket,
      goal: 20000,
      raised: 5750,
      label: 'Utvikling & Features',
      description: 'Feature-utvikling, testing og QA',
      color: 'from-green-500 to-emerald-500'
    },
  ]

  return (
    <section id="spleis-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass rounded-3xl p-8 md:p-12 border-4 border-purple-500 shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 shadow-2xl">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-12 h-12 text-white" />
              </motion.div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="gradient-text">Støtt Pengeplan 2.0</span>
            </h2>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
              Jeg jobber <span className="font-bold text-purple-600">alene</span> og bruker kun private penger.
            </p>
            
            <p className="text-lg text-slate-700 max-w-3xl mx-auto font-medium">
              Din støtte hjelper meg å <span className="font-bold">bygge videre</span>, <span className="font-bold">skalere</span>, og 
              {' '}<span className="font-bold">levere</span> til alle som trenger det.
            </p>
          </div>

          {/* Funding Goals */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {fundingGoals.map((goal, i) => {
              const Icon = goal.icon
              const progress = (goal.raised / goal.goal) * 100

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-gray-900 mb-1">{goal.label}</div>
                      <div className="text-xs text-gray-500">{goal.description}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-2xl font-extrabold text-gray-900">
                        {goal.raised.toLocaleString('no-NO')} NOK
                      </div>
                      <div className="text-sm text-gray-500">
                        av {goal.goal.toLocaleString('no-NO')} NOK
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(progress, 100)}%` }}
                        className={`h-full bg-gradient-to-r ${goal.color} rounded-full relative overflow-hidden transition-all duration-1000`}
                      >
                        <motion.div
                          animate={{
                            backgroundPosition: ['0%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          style={{
                            backgroundSize: '200% 100%',
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {progress.toFixed(1)}% finansiert
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Main CTA */}
          <div className="text-center">
            <motion.a
              href={SPLEIS_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transition-all mb-4"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-6 h-6" />
              </motion.div>
              <span>Støtt via Spleis</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.a>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Trygt betalt via Vipps, kort eller faktura</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>BankID-verifisert</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Transparent bruk av midler</span>
              </div>
            </div>
          </div>

          {/* Why Support Section */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Hvorfor støtte Pengeplan 2.0?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  title: 'For alle familier',
                  description: 'Hjelp familier med å lære økonomi sammen',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: Shield,
                  title: 'Sikkerhet først',
                  description: 'Enterprise-grade sikkerhet for din økonomiske data',
                  color: 'from-red-500 to-orange-500'
                },
                {
                  icon: Brain,
                  title: 'AI-innovasjon',
                  description: 'Norges første enterprise AI økonomiplattform',
                  color: 'from-purple-500 to-pink-500'
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center glass rounded-2xl p-6"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

