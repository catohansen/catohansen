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

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import {
  Shield,
  Users,
  Brain,
  FileText,
  Briefcase,
  FolderKanban,
  CreditCard,
  BarChart3,
  Package,
  Zap,
  Rocket,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Lock,
  Star,
  Key,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ParticlesBackground from '@/components/ParticlesBackground'
import FloatingElements from '@/components/FloatingElements'
import StatsSection from '@/components/StatsSection'
import ExpertiseShowcase from '@/components/ExpertiseShowcase'

// Icon mapping
const iconMap: Record<string, any> = {
  Shield,
  Lock,
  Users,
  Brain,
  FileText,
  Briefcase,
  FolderKanban,
  CreditCard,
  BarChart3,
  Package,
}

interface Module {
  id: string
  name: string
  description: string
  icon: string | any // Allow LucideIcon or string
  color: string
  status: string
  features: string[]
  link: string
  category: string
  badge?: string
  version?: string
  githubUrl?: string
  npmPackage?: string
}

// Fallback modules if API fails
const fallbackModules = [
  {
    id: 'security2',
    name: 'Security 2.0',
    description: 'Neste generasjons policy- og sikkerhetsmotor for Hansen Global Platform. Enterprise-grade authorization system med RBAC, ABAC og compliance support.',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    status: 'Production Ready',
    features: ['Policy Engine', 'RBAC/ABAC', 'Audit Logging', 'Compliance (SOC2, ISO27001, GDPR)', 'Multi-tenant'],
    link: '/modules/security2',
    category: 'Security',
    badge: 'Featured'
  },
  {
    id: 'hansen-auth',
    name: 'Hansen Auth',
    description: 'Modern authentication framework for TypeScript. Enterprise-grade security with Better Auth-inspired API. Framework-agnostic core with React, Vue, and Svelte adapters.',
    icon: Lock,
    color: 'from-blue-500 to-purple-500',
    status: 'Production Ready',
    features: ['Email/Password Auth', 'OAuth (Google, GitHub, Discord, Twitter)', '2FA Support', 'Session Management', 'Plugin System', 'Framework Agnostic', 'Pre-built Components', 'React/Vue/Svelte Adapters'],
    link: '/hansen-auth',
    category: 'Security',
    badge: 'Featured'
  },
  {
    id: 'user-management',
    name: 'User Management',
    description: 'Advanced RBAC system with hierarchical roles, granular permissions, groups, and multi-tenant support. Production-ready authentication.',
    icon: Users,
    color: 'from-cyan-500 to-blue-500',
    status: 'Production Ready',
    features: ['Advanced RBAC', 'Role Hierarchy', 'Permission Management', 'Multi-tenant', '2FA Support'],
    link: '/demo-admin',
    category: 'Security'
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    description: 'Multi-agent orchestration system with autonomous task scheduling, RAG, and AI governance. Production-ready AI automation.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    status: 'In Development',
    features: ['Multi-Agent Orchestration', 'RAG', 'Autonomous Scheduling', 'AI Governance', 'Observability'],
    link: '/admin/ai',
    category: 'AI & Automation'
  },
  {
    id: 'content-management',
    name: 'Content Management',
    description: 'Modern CMS with headless architecture, media library, SEO tools, and visual editor. Enterprise-ready content platform.',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    status: 'In Development',
    features: ['Headless CMS', 'Media Library', 'SEO Tools', 'Visual Editor', 'Multi-language'],
    link: '/admin/content',
    category: 'Content'
  },
  {
    id: 'client-management',
    name: 'Hansen CRM 2.0',
    description: 'Verdens beste CRM-system med AI-drevne innsikter, salgsautomatisering og enterprise-grad sikkerhet. Modulær løsning som kan selges som standalone produkt.',
    icon: Briefcase,
    color: 'from-indigo-500 to-purple-500',
    status: 'Production Ready',
    features: ['Kontaktstyring', 'AI Lead Scoring v2', 'Sales Pipeline', 'Communication Logger', 'AI Insights', 'Predictive Analytics'],
    link: '/hansen-crm',
    category: 'Business',
    badge: 'New'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Project tracking with tasks, milestones, time tracking, and team collaboration. Enterprise project management.',
    icon: FolderKanban,
    color: 'from-yellow-500 to-amber-500',
    status: 'In Development',
    features: ['Task Management', 'Milestones', 'Time Tracking', 'Team Collaboration', 'Analytics'],
    link: '/admin/projects',
    category: 'Business'
  },
  {
    id: 'billing-system',
    name: 'Billing System',
    description: 'Stripe integration with invoicing, payment processing, subscriptions, and revenue analytics. Complete billing solution.',
    icon: CreditCard,
    color: 'from-pink-500 to-rose-500',
    status: 'In Development',
    features: ['Stripe Integration', 'Invoicing', 'Subscriptions', 'Payment Processing', 'Revenue Analytics'],
    link: '/admin/billing',
    category: 'Business'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Real-time analytics with dashboards, reporting, and insights. Complete observability and business intelligence.',
    icon: BarChart3,
    color: 'from-teal-500 to-cyan-500',
    status: 'In Development',
    features: ['Real-time Analytics', 'Dashboards', 'Custom Reports', 'Business Intelligence', 'Observability'],
    link: '/admin/analytics',
    category: 'Analytics'
  },
  {
    id: 'hansen-mindmap-2.0',
    name: 'MindMap 2.0',
    description: 'MindMap 2.0 - AI-drevet mindmapping med Copilot, multi-input (PDF/bilde/audio/video), sanntidssamarbeid og enterprise-eksport. Laget av Cato Hansen.',
    icon: Package,
    color: 'from-indigo-500 to-purple-500',
    status: 'Coming Soon',
    features: ['AI Copilot', 'Multi-Input', 'Collaboration', 'Export (PNG/PDF/SVG/MD)', 'Version History', 'Templates'],
    link: '/hansen-mindmap-2.0',
    category: 'Productivity',
    badge: 'New'
  },
]

const categories = ['All', 'Security', 'AI & Automation', 'Content', 'Business', 'Analytics', 'Productivity']

export default function HansenHubPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const filteredModules =
    selectedCategory === 'All'
      ? modules
      : modules.filter((m) => m.category === selectedCategory)

  const fetchModules = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from public API first
      try {
        const response = await fetch('/api/modules/public', {
          cache: 'no-store', // Always fresh
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.modules) {
            setModules(data.modules)
            setLoading(false)
            return
          }
        }
      } catch (apiError) {
        console.warn('API fetch failed, using modules.json fallback:', apiError)
      }

      // Fallback to modules.json
      try {
        const modulesJson = await import('@/data/modules.json')
        if (modulesJson.default && Array.isArray(modulesJson.default)) {
          setModules(modulesJson.default as Module[])
        } else if (Array.isArray(modulesJson)) {
          setModules(modulesJson as Module[])
        } else {
          throw new Error('Invalid modules.json format')
        }
      } catch (jsonError) {
        console.error('Failed to load modules.json:', jsonError)
        // Final fallback to hardcoded modules (with icon conversion)
        setModules(fallbackModules.map(m => ({ ...m, icon: typeof m.icon === 'string' ? m.icon : m.icon.name || 'Package' })) as Module[])
      }
    } catch (err: any) {
      console.error('Failed to fetch modules:', err)
      setError(err.message || 'Failed to load modules')
      // Final fallback to hardcoded modules (with icon conversion)
      setModules(fallbackModules.map(m => ({ ...m, icon: typeof m.icon === 'string' ? m.icon : m.icon.name || 'Package' })) as Module[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchModules()
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <FloatingElements />
      <Navigation />
      
      <section className="relative min-h-screen pt-20 pb-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-purple-600 mb-6">
              <Sparkles className="w-4 h-4" />
              Hansen Hub - Alle Moduler
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
              <span className="gradient-text">Enterprise Solutions</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-700 max-w-3xl mx-auto mb-8">
              Modulære, salgbare produkter bygget for produksjon. Hver modul er standalone, skalérbar og klar for enterprise.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Production Ready</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">NPM Ready</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">Enterprise Grade</span>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'glass text-slate-700 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="text-gray-400">Loading modules...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchModules}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Modules Grid */}
          {!loading && !error && (
            <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredModules.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No modules found</p>
                </div>
              ) : (
                filteredModules.map((mod, i) => {
                  const Icon = iconMap[mod.icon] || Package
                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="glass rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
                    >
                      <div className={`h-48 bg-gradient-to-br ${mod.color} flex items-center justify-center relative overflow-hidden`}>
                        <Icon className="w-24 h-24 text-white/20" />
                        <div className="absolute inset-0 bg-black/10" />
                        {mod.badge && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                            {mod.badge}
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              mod.status === 'Production Ready'
                                ? 'bg-green-500 text-white'
                                : mod.status === 'Coming Soon'
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {mod.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
                              {mod.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">{mod.name}</h3>
                            <p className="text-slate-600 leading-relaxed">{mod.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {(mod.features && mod.features.length > 0) ? (
                            mod.features.map((feature: string, j: number) => (
                              <span
                                key={j}
                                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                              >
                                {feature}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">Ingen funksjoner listet</span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <motion.a
                            href={mod.link}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            Utforsk Modul <ExternalLink className="w-4 h-4" />
                          </motion.a>
                          {(mod.id === 'hansen-security' || mod.id === 'security2') && (
                            <motion.button
                              className="px-4 py-3 glass rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                            >
                              <Lock className="w-4 h-4" />
                              SDK
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="glass rounded-3xl p-12 max-w-3xl mx-auto">
              <Rocket className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Klar for Enterprise?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Alle moduler er produksjonsklare, skalérbare og kan selges separat. Kontakt meg for enterprise-lisensiering eller custom implementasjoner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/#contact"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Book Konsultasjon
                </motion.a>
                <motion.a
                  href="/demo-admin"
                  className="px-8 py-4 glass rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Se Demo Admin
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding relative z-10">
        <StatsSection />
      </section>

      {/* Expertise Showcase Section */}
      <section className="section-padding relative z-10">
        <ExpertiseShowcase />
      </section>

      <Footer />
    </main>
  )
}

