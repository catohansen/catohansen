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
 * Pengeplan 2.0 Why Section
 * Compelling reasons to support the project
 */

'use client'

import { motion } from 'framer-motion'

import { 
  Users, Shield, Brain, TrendingUp, Heart, CheckCircle2,
  Lock, Globe, Sparkles, ArrowRight
} from 'lucide-react'

const reasons = [
  {
    icon: Users,
    title: 'For alle familier',
    description: 'Hjelp familier med å lære økonomi sammen på en sikker og pedagogisk måte',
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Sikker økonomisk opplæring for barn og ungdom',
      'Familiære budsjett- og sparemål',
      'Transparent økonomisk kommunikasjon'
    ]
  },
  {
    icon: Shield,
    title: 'Bank-nivå sikkerhet',
    description: 'Enterprise-grade sikkerhet med full GDPR compliance og zero-trust arkitektur',
    color: 'from-red-500 to-orange-500',
    details: [
      'Cerbos policy engine for access control',
      'Full GDPR compliance med audit logging',
      'Zero-trust arkitektur med kryptering'
    ]
  },
  {
    icon: Brain,
    title: 'AI-innovasjon',
    description: 'Norges første enterprise AI økonomiplattform med multi-agent orchestration',
    color: 'from-purple-500 to-pink-500',
    details: [
      'Multi-agent orchestration',
      'RAG-basert kontekstuell forståelse',
      'Autonom task scheduling'
    ]
  },
  {
    icon: Lock,
    title: 'Ungdomsbeskyttelse',
    description: 'Verge-system med consent management og transparent opplæring',
    color: 'from-green-500 to-emerald-500',
    details: [
      'Verge-oversikt og støtte',
      'Consent management',
      'Sikker første steg'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Real-time insights',
    description: 'Predictive analytics og anomali-deteksjon for smartere økonomiske beslutninger',
    color: 'from-yellow-500 to-amber-500',
    details: [
      'Real-time finansovervåking',
      'Predictive analytics',
      'Automatisk anomali-deteksjon'
    ]
  },
  {
    icon: Globe,
    title: 'Enterprise-ready',
    description: 'Production-ready med full compliance (Norsk AI-veileder, EU AI Act, GDPR)',
    color: 'from-indigo-500 to-purple-500',
    details: [
      'Norsk AI-veileder compliant',
      'EU AI Act dokumentasjon',
      'Regelmessige auditorier'
    ]
  },
]

export default function PengeplanWhySection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">Hvorfor Pengeplan 2.0?</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          En plattform som kombinerer brukervennlighet med enterprise-grade teknologi
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((reason, i) => {
          const Icon = reason.icon
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass rounded-3xl p-6 hover:shadow-2xl transition-all cursor-pointer group"
            >
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl font-bold mb-3">{reason.title}</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{reason.description}</p>

              <div className="space-y-2">
                {reason.details.map((detail, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6"
        >
          <Heart className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-gray-900">
            Støtt utviklingen av Pengeplan 2.0
          </span>
        </motion.div>
        
        <motion.a
          href="#spleis-cta"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Se hvordan du kan støtte
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
    </div>
  )
}

