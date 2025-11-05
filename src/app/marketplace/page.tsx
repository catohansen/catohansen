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
 * Hansen Marketplace Landing Page
 * Showcase and sell Hansen Global modules
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Package,
  Shield,
  Brain,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Github,
  Code2,
  Star
} from 'lucide-react'

interface Product {
  id: string
  name: string
  displayName: string
  description: string
  icon: any
  color: string
  price: string
  features: string[]
  demo: string
  docs: string
  status: 'active' | 'beta' | 'coming_soon'
  badge?: string
}

export default function MarketplacePage() {
  const [products] = useState<Product[]>([
    {
      id: 'hansen-security',
      name: 'hansen-security',
      displayName: 'Hansen Security 2.0',
      description: 'Policy-based authorization system med RBAC/ABAC, audit logging, og compliance-ready features. Norges første Policy Engine.',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      price: 'NOK 1,999/mnd',
      features: [
        'Fine-grained access control (RBAC/ABAC)',
        'Policy-as-code (YAML policies)',
        'Audit logging for SOC2/ISO27001',
        'Real-time metrics og observability',
        'SDK for enkel integrasjon',
        'Komplett dokumentasjon'
      ],
      demo: '/hansen-security/demo',
      docs: '/hansen-security/docs',
      status: 'active',
      badge: 'Flaggskip'
    },
    {
      id: 'nora',
      name: 'nora',
      displayName: 'Nora AI',
      description: 'Intelligent AI-assistent - mer avansert enn Siri, Alexa og Google Assistant. Multi-modal intelligence, emotion engine, og memory system.',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      price: 'NOK 2,999/mnd',
      features: [
        'Multi-modal intelligence (text, voice, context)',
        'RAG (Retrieval-Augmented Generation)',
        'Memory engine med semantisk søk',
        'Emotion engine for empati',
        'Agent routing (coach, dev, marketer)',
        'Voice support (Whisper + ElevenLabs)'
      ],
      demo: '/nora',
      docs: '/nora/docs',
      status: 'active',
      badge: 'Ny'
    },
    {
      id: 'client-management',
      name: 'client-management',
      displayName: 'Hansen CRM 2.0',
      description: 'Avansert client management system med AI-insights, lead scoring, pipeline management, og automation.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      price: 'NOK 1,499/mnd',
      features: [
        'Lead management med AI-scoring',
        'Pipeline & deal tracking',
        'Task management',
        'Email automation',
        'Communication 360°-view',
        'AI-powered insights og recommendations'
      ],
      demo: '/hansen-crm',
      docs: '/hansen-crm/docs',
      status: 'active',
      badge: 'Populær'
    }
  ])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-6">
            🚀 Hansen Global Marketplace
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Produksjonsklare Moduler
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Enterprise-grade moduler bygget av Cato Hansen. Hver modul er standalone, 
            fullt dokumentert, og klar for integrasjon i ditt prosjekt.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="#products"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              Se Alle Moduler
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/admin/login"
              className="px-8 py-4 glass rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Admin Panel
            </Link>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tilgjengelige Moduler
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const Icon = product.icon
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass rounded-3xl overflow-hidden hover:shadow-2xl transition-all group"
                >
                  {/* Header */}
                  <div className={`h-32 bg-gradient-to-br ${product.color} flex items-center justify-center relative`}>
                    <Icon className="w-16 h-16 text-white/80" />
                    {product.badge && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-slate-900">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{product.displayName}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <div className="text-3xl font-extrabold text-purple-600">
                        {product.price}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        eller gratis demo
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {product.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                      {product.features.length > 4 && (
                        <li className="text-sm text-purple-600 font-medium">
                          +{product.features.length - 4} flere features
                        </li>
                      )}
                    </ul>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link
                        href={product.demo}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Try Live Demo
                      </Link>
                      
                      <div className="flex gap-2">
                        <Link
                          href={product.docs}
                          className="flex-1 px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Code2 className="w-4 h-4" />
                          Docs
                        </Link>
                        <button
                          onClick={() => alert('Kontakt: cato@catohansen.no for kjøp')}
                          className="flex-1 px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Package className="w-4 h-4" />
                          Kjøp
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Klar til å Integrere?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Alle moduler kommer med komplett dokumentasjon, SDK, og support
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="mailto:cato@catohansen.no"
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:shadow-xl transition-all"
            >
              Kontakt for Pris & Demo
            </Link>
            <Link
              href="/"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              Tilbake til Hovedsiden
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-600">
          <p>© 2025 Cato Hansen. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/" className="text-purple-600 hover:underline">catohansen.no</Link>
            {' • '}
            <Link href="mailto:cato@catohansen.no" className="text-purple-600 hover:underline">cato@catohansen.no</Link>
            {' • '}
            <span>Built in Drøbak, Norway 🇳🇴</span>
          </p>
        </div>
      </footer>
    </main>
  )
}

