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
 * Pengeplan 2.0 Interactive Features
 * Clickable, expandable feature cards with smooth animations
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import { 
  Brain, Shield, Users, TrendingUp, DollarSign, Lock, 
  CheckCircle2, Sparkles, ArrowRight, Zap, ChevronDown,
  FileText, Settings, Database, Globe
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Agents',
    shortDesc: 'Multi-agent orchestration med autonom task scheduling og RAG',
    longDesc: 'Intelligente AI-agenter som hjelper med økonomiske beslutninger, automatiserer oppgaver, og gir personlige råd basert på din økonomiske situasjon. Bygget med state-of-the-art RAG (Retrieval-Augmented Generation) teknologi.',
    color: 'from-purple-500 to-pink-500',
    tags: ['Multi-Agent', 'RAG', 'Autonomous'],
    details: [
      'Multi-agent orchestration for komplekse oppgaver',
      'RAG-basert kontekstuell forståelse',
      'Autonom task scheduling og prioritet',
      'Personlige økonomiske råd'
    ]
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    shortDesc: 'Cerbos, RBAC/ABAC, GDPR compliance og zero-trust',
    longDesc: 'Bank-nivå sikkerhet for din økonomiske data. Bygget med Cerbos policy engine, granular RBAC/ABAC, full GDPR compliance, og zero-trust arkitektur. Alle data er kryptert både i transit og at rest.',
    color: 'from-red-500 to-orange-500',
    tags: ['Cerbos', 'RBAC/ABAC', 'GDPR'],
    details: [
      'Cerbos policy engine for fin-grained access control',
      'Role-Based og Attribute-Based Access Control',
      'Full GDPR compliance med audit logging',
      'Zero-trust arkitektur med kryptering'
    ]
  },
  {
    icon: Users,
    title: 'Verge-system',
    shortDesc: 'Ungdomsbeskyttelse med verge-støtte og consent management',
    longDesc: 'Sikker økonomisk opplæring for ungdom med verge-støtte. Verger kan overvåke, støtte og guide ungdoms økonomiske beslutninger med full transparens og kontroll.',
    color: 'from-blue-500 to-cyan-500',
    tags: ['Ungdom', 'Verge', 'Consent'],
    details: [
      'Ungdomsbeskyttelse med verge-oversikt',
      'Consent management for økonomiske handlinger',
      'Transparent økonomisk opplæring',
      'Sikker guide for første steg'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Finance Monitoring',
    shortDesc: 'Real-time finansovervåking og predictive analytics',
    longDesc: 'Følg økonomien din i sanntid med AI-drevne insights. Predictive analytics hjelper deg med å forutsi utgifter, planlegge budsjetter, og oppdage unormale mønstre.',
    color: 'from-green-500 to-emerald-500',
    tags: ['Real-time', 'Predictive', 'Analytics'],
    details: [
      'Real-time finansovervåking med alerts',
      'Predictive analytics for utgiftsplanlegging',
      'Automatisk budsjettanbefaling',
      'Anomali-deteksjon for sikkerhet'
    ]
  },
  {
    icon: Lock,
    title: 'Compliance',
    shortDesc: 'Norsk AI-veileder, EU AI Act, GDPR - Full compliance',
    longDesc: 'Produksjonsklar med all nødvendig compliance. Følger Norsk AI-veileder, EU AI Act, og GDPR til punkt og prikke. Regelmessige auditorier og transparent dokumentasjon.',
    color: 'from-indigo-500 to-purple-500',
    tags: ['AI Act', 'GDPR', 'Audit'],
    details: [
      'Full Norsk AI-veileder compliance',
      'EU AI Act compliant med dokumentasjon',
      'GDPR med full audit trail',
      'Regelmessige sikkerhetsauditer'
    ]
  },
  {
    icon: DollarSign,
    title: '100+ Admin Sider',
    shortDesc: 'Komplett admin panel med alle funksjoner',
    longDesc: 'Enterprise-grade admin panel med alle verktøy du trenger. Fra brukeradministrasjon til finansovervåking, AI-agenter til compliance - alt på ett sted.',
    color: 'from-yellow-500 to-amber-500',
    tags: ['Admin', 'Enterprise', 'Complete'],
    details: [
      '100+ spesialiserte admin sider',
      'Intuitive brukergrensesnitt',
      'Comprehensive reporting og analytics',
      'Role-based dashboards'
    ]
  },
]

export default function PengeplanInteractiveFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  const toggleFeature = (index: number) => {
    setSelectedFeature(selectedFeature === index ? null : index)
  }

  return (
    <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">Interaktive Features</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
          Klikk på kortene for å utforske hva som gjør Pengeplan 2.0 unikt
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-sm text-purple-700">
          <Sparkles className="w-4 h-4" />
          <span>Klikk for å lære mer om hver feature</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => {
          const Icon = feature.icon
          const isSelected = selectedFeature === i
          
          return (
            <motion.div
              key={i}
              onClick={() => toggleFeature(i)}
              whileHover={!isSelected ? { y: -5, scale: 1.02 } : {}}
              className={`glass rounded-3xl p-6 cursor-pointer transition-all relative overflow-hidden ${
                isSelected ? 'ring-4 ring-purple-500 scale-105 shadow-2xl' : 'hover:shadow-xl'
              }`}
            >
              {/* Background gradient on hover */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 rounded-3xl`}
                animate={isSelected ? { opacity: 0.1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 transition-transform`}
                  animate={isSelected ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                
                {/* Short description */}
                <p className="text-slate-600 mb-4 leading-relaxed">{feature.shortDesc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Expandable content */}
                <AnimatePresence>
                  {isSelected && (
                    <div className="overflow-hidden">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mt-4 border border-purple-200">
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed font-medium">
                          {feature.longDesc}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-gray-900 mb-2">Key Features:</div>
                          {feature.details.map((detail, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700">{detail}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-purple-600 font-semibold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Production Ready</span>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>

                {/* CTA indicator */}
                {!isSelected && (
                  <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm mt-4">
                    <span>Klikk for å lære mer</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                )}

                {isSelected && (
                  <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm mt-4">
                    <ChevronDown className="w-4 h-4 rotate-180" />
                    <span>Klikk for å lukke</span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary CTA */}
      <div className="text-center mt-12">
        <p className="text-lg text-gray-600 mb-6">
          Dette er bare et lite utvalg av funksjonene i Pengeplan 2.0
        </p>
        <motion.a
          href="#spleis-cta"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
        >
          <Zap className="w-5 h-5" />
          Støtt utviklingen av Pengeplan 2.0
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
    </div>
  )
}

