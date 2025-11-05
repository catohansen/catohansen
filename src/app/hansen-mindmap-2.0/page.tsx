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
 * MindMap 2.0 Landing Page
 * Created by Cato Hansen - Coming Soon - March 2026
 */

'use client'

import { motion } from 'framer-motion'
import { Network, Brain, Zap, Users, FileText, Download, Sparkles, CheckCircle2, Rocket, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function HansenMindmapPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 pb-32 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-purple-600 mb-6">
              <Sparkles className="w-4 h-4" />
              Coming Soon - Mars 2026
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
              <span className="gradient-text">MindMap 2.0</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-700 max-w-3xl mx-auto mb-8">
              AI-drevet mindmapping med Copilot, multi-input og enterprise-eksport.
              <span className="block mt-4 text-lg text-slate-600">
                Fra idé til visualisert kunnskap på minutter.
                <span className="block mt-2 text-base text-slate-500 italic">
                  Laget av Cato Hansen
                </span>
              </span>
            </p>
            
            {/* Coming Soon Badge */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">Mars 2026</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Enterprise Ready</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 justify-center"
              >
                <Rocket className="w-5 h-5" />
                Varsle meg når klar
              </motion.a>
              <motion.a
                href="/hansen-hub"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-3 justify-center"
              >
                Se andre moduler
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding relative z-10 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="gradient-text">Fremtidens Mindmapping</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Enterprise-grade produktivitetsløsning for visualisering av ideer, planlegging og kollaborasjon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI Copilot',
                description: 'Chat-basert AI-assistent for å utvide, organisere og forbedre mindmaps automatisk.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: FileText,
                title: 'Multi-Input',
                description: 'Importer fra URL, PDF, bilde, audio eller video → auto-generer mindmap.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'Sanntidssamarbeid med flere brukere, multi-cursor og kommentarer.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Download,
                title: 'Export',
                description: 'Eksporter til PNG, PDF, SVG, Markdown, CSV eller interaktiv HTML.',
                color: 'from-orange-500 to-red-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="gradient-text">Prisplan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Fra gratis til enterprise – velg planen som passer deg.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Free', price: '0', features: ['3 kart', '50 AI-credits/mnd', 'PNG/PDF eksport'] },
              { name: 'Personal', price: '69', features: ['Ubegrenset kart', '1000 AI-credits/mnd', 'SVG/Markdown'] },
              { name: 'Pro', price: '129', features: ['Multi-Input', 'Versjonshistorikk', '3000 AI-credits/mnd'] },
              { name: 'Business', price: '149', badge: 'Pr bruker', features: ['RBAC', 'SSO', 'Compliance eksport'] }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold gradient-text">{plan.price} kr</span>
                    {plan.badge && <span className="text-sm text-slate-500">/{plan.badge}</span>}
                  </div>
                  <span className="text-sm text-slate-500">/måned</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Klar for MindMap 2.0?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Varsle oss på e-post så gir vi beskjed når løsningen er klar for produksjon i mars 2026. Laget av Cato Hansen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Kontakt meg
            </motion.a>
            <motion.a
              href="/hansen-hub"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              Se alle moduler
            </motion.a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}


