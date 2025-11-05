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
 * Pengeplan 2.0 Hero Section
 * Advanced hero with animated counters and interactive CTAs
 */

'use client'

import { motion, useAnimation } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Sparkles, Users, Shield, Brain, Zap, 
  ArrowDown, Heart, CheckCircle2
} from 'lucide-react'

interface PengeplanHeroProps {
  supporterCount?: number
  initialSupporterCount?: number
}

export default function PengeplanHero({ 
  supporterCount: externalCount,
  initialSupporterCount = 0 
}: PengeplanHeroProps) {
  const [supporterCount, setSupporterCount] = useState(initialSupporterCount)
  const [isCounting, setIsCounting] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    if (isCounting) {
      return
    }

    setIsCounting(true)
    const target = externalCount || 47
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = initialSupporterCount

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setSupporterCount(target)
        clearInterval(timer)
        controls.start({ scale: [1, 1.1, 1], transition: { duration: 0.3 } })
      } else {
        setSupporterCount(Math.floor(current))
      }
    }, duration / steps)

    return () => {
      clearInterval(timer)
    }
  }, [externalCount, initialSupporterCount, isCounting, controls])

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-sm font-bold text-purple-600 mb-6 shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Heart className="w-4 h-4 text-red-500" />
          </motion.div>
          <span className="font-bold">
            <span>
              {supporterCount}+
            </span>
            {' '}støttende givere allerede!
          </span>
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </div>

        {/* Main Headline */}
        <div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
            <motion.span
              className="gradient-text"
              animate={{
                backgroundPosition: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundSize: '200% auto',
              }}
            >
              Pengeplan 2.0
            </motion.span>
          </h1>

          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Norges første enterprise-grade
          </p>

          <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text mb-6">
            AI økonomiplattform
          </p>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Kombinerer{' '}
            <motion.span
              className="font-bold text-purple-600"
              whileHover={{ scale: 1.1 }}
            >
              brukerens kontroll
            </motion.span>
            ,{' '}
            <motion.span
              className="font-bold text-blue-600"
              whileHover={{ scale: 1.1 }}
            >
              vergens støtte
            </motion.span>
            ,{' '}
            <motion.span
              className="font-bold text-pink-600"
              whileHover={{ scale: 1.1 }}
            >
              AI-intelligens
            </motion.span>
            {' '}og{' '}
            <motion.span
              className="font-bold text-green-600"
              whileHover={{ scale: 1.1 }}
            >
              admin governance
            </motion.span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {[
            { icon: Shield, label: 'Enterprise Security', value: '100%', color: 'from-red-500 to-orange-500' },
            { icon: Brain, label: 'AI Agents', value: 'Active', color: 'from-purple-500 to-pink-500' },
            { icon: Users, label: 'Families', value: 'Ready', color: 'from-blue-500 to-cyan-500' },
            { icon: CheckCircle2, label: 'Compliance', value: '✅', color: 'from-green-500 to-emerald-500' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                className="glass rounded-2xl p-4 hover:shadow-2xl transition-all cursor-pointer group"
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <motion.a
            href="#spleis-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center gap-3 group"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-5 h-5" />
            </motion.div>
            <span>Støtt Pengeplan 2.0</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
          </motion.a>

          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass rounded-full font-bold text-lg hover:bg-white/80 transition-all flex items-center gap-3"
          >
            Utforsk Features
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-50">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-purple-600" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
