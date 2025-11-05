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
 * Module Landing Page
 * 
 * Dynamisk landingsside for hver modul basert på modules.json
 * 
 * URL: /modules/[id]
 * 
 * Features:
 * - Logo, forklaring og demo-video
 * - Funksjonsliste
 * - "Start Demo"-knapp
 * - Integrert testversjon (f.eks. <NoraChatBubble />)
 * - Informasjon om hvem som kan bruke modulen
 * - Teknisk dokumentasjon (for partnere eller API-bruk)
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Shield,
  Brain,
  CreditCard,
  Zap,
  Briefcase,
  FileText,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Star,
  Rocket,
  Sparkles,
  Lock,
  Users,
  Settings,
  Activity,
} from 'lucide-react'
import modulesData from '@/data/modules.json'
import ParticleBackground from '@/components/shared/ParticleBackground'
import dynamic from 'next/dynamic'

// Icon mapping
const iconMap: Record<string, any> = {
  Shield,
  Brain,
  CreditCard,
  Zap,
  Briefcase,
  FileText,
  Lock,
  Users,
}

// Dynamisk import av modul-spesifikke komponenter
const NoraChatBubble = dynamic(() => import('@/modules/nora/ui/chat/NoraChatBubble'), {
  ssr: false,
})

interface Module {
  id: string
  name: string
  displayName: string
  version: string
  description: string
  author: string
  license: string
  category: string
  status: string
  link: string
  adminLink?: string
  apiLink?: string
  image?: string
  icon?: string
  color?: string
  badge?: string
  features?: string[]
  pricing?: {
    type: string
    plans?: Array<{
      name: string
      price: number | string
      currency?: string
      period?: string
      features?: string[]
    }>
  }
}

export default function ModuleLandingPage() {
  const params = useParams()
  const moduleId = params.id as string
  const [module, setModule] = useState<Module | null>(null)
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    const foundModule = modulesData.find((m: Module) => m.id === moduleId)
    setModule(foundModule || null)
  }, [moduleId])

  if (!module) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0E0E16] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Modul ikke funnet</h1>
          <p className="text-gray-400 mb-6">Modulen du leter etter eksisterer ikke.</p>
          <Link
            href="/hansen-hub"
            className="px-6 py-3 bg-[#7A5FFF] text-white rounded-lg hover:bg-[#00FFC2] transition-colors"
          >
            Gå til Hansen Hub
          </Link>
        </div>
      </main>
    )
  }

  const IconComponent = module.icon ? iconMap[module.icon] : Sparkles
  const gradientColors = module.color || 'from-purple-500 to-pink-500'
  const isComingSoon = module.status === 'Coming Soon'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0E0E16] text-white">
      {/* Particle Background */}
      <ParticleBackground enhanced={true} particleCount={100} />

      {/* Hero Section */}
      <section className="relative z-content pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Badge */}
            {module.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A5FFF]/20 border border-[#7A5FFF]/50 mb-6">
                {module.badge === 'Featured' && <Star className="w-4 h-4 text-yellow-400" />}
                {module.badge === 'Revolutionary' && <Rocket className="w-4 h-4 text-[#00FFC2]" />}
                {module.badge?.includes('Coming Soon') && <Sparkles className="w-4 h-4 text-[#7A5FFF]" />}
                <span className="text-sm font-medium">{module.badge}</span>
              </div>
            )}

            {/* Icon/Logo */}
            <div className="flex justify-center mb-6">
              {module.image ? (
                <Image
                  src={module.image}
                  alt={module.displayName}
                  width={120}
                  height={120}
                  className="rounded-2xl"
                />
              ) : IconComponent && (
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-r ${gradientColors} flex items-center justify-center shadow-2xl`}>
                  <IconComponent className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#7A5FFF] via-[#C6A0FF] to-[#00FFC2] bg-clip-text text-transparent">
              {module.displayName}
            </h1>

            {/* Description */}
            <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-8 leading-relaxed">
              {module.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-10">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Versjon:</span>
                <span>{module.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Kategori:</span>
                <span>{module.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <span className={`px-2 py-1 rounded ${
                  module.status === 'Production Ready' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {module.status}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {!isComingSoon && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDemo(!showDemo)}
                  className="px-8 py-4 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white font-semibold rounded-lg shadow-lg shadow-[#7A5FFF]/50 hover:shadow-[#00FFC2]/50 transition-all duration-300 flex items-center gap-2"
                >
                  {showDemo ? 'Skjul Demo' : 'Start Demo'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
              
              {module.adminLink && (
                <Link
                  href={module.adminLink}
                  className="px-8 py-4 border-2 border-[#7A5FFF] text-[#7A5FFF] hover:bg-[#7A5FFF] hover:text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}

              {module.apiLink && (
                <Link
                  href={module.apiLink}
                  target="_blank"
                  className="px-8 py-4 border-2 border-[#00FFC2] text-[#00FFC2] hover:bg-[#00FFC2] hover:text-[#0E0E16] rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <Activity className="w-5 h-5" />
                  API Docs
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      {module.features && module.features.length > 0 && (
        <section className="relative z-content py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent">
              Funksjoner
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {module.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-2xl border border-[#7A5FFF]/50 hover:border-[#00FFC2]/70 transition-all duration-300"
                  style={{
                    background: '#1A1A28',
                    backgroundColor: '#1A1A28',
                    boxShadow: '0 20px 60px rgba(122, 95, 255, 0.3), 0 0 40px rgba(0, 255, 194, 0.2), inset 0 0 0 1px rgba(122, 95, 255, 0.1)'
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 text-[#00FFC2] mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Demo Section */}
      {!isComingSoon && showDemo && (
        <section className="relative z-content py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent">
              Test {module.displayName} i sanntid
            </h2>
            <div className="border-t border-[#24243A] pt-8">
              {/* Modul-spesifikke demoer */}
              {module.id === 'nora' && (
                <NoraChatBubble
                  position="bottom-right"
                  pageContext={`/modules/${module.id}`}
                  defaultOpen={false}
                />
              )}
              {/* Legg til flere modul-spesifikke demoer her */}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {module.pricing && module.pricing.plans && module.pricing.plans.length > 0 && (
        <section className="relative z-content py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent">
              Priser
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {module.pricing.plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-2xl border border-[#7A5FFF]/50 hover:border-[#00FFC2]/70 transition-all duration-300"
                  style={{
                    background: '#1A1A28',
                    backgroundColor: '#1A1A28',
                    boxShadow: '0 20px 60px rgba(122, 95, 255, 0.3), 0 0 40px rgba(0, 255, 194, 0.2), inset 0 0 0 1px rgba(122, 95, 255, 0.1)'
                  }}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-[#00FFC2]">
                      {typeof plan.price === 'number' ? `${plan.price} ${plan.currency || 'NOK'}` : plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400 text-sm"> / {plan.period}</span>
                    )}
                  </div>
                  {plan.features && (
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-[#00FFC2]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-content border-t border-[#7A5FFF]/30 py-8 text-center text-gray-400 text-sm px-6">
        <p className="mb-2">
          © 2025 Cato Hansen. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mb-2">
          Proprietary — Unauthorized use prohibited
        </p>
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span>Built in Drøbak</span>
          <span className="text-[#00FFC2]">💠</span>
          <span>by System Architect Cato Hansen</span>
          {' • '}
          <Link
            href="/hansen-hub"
            className="text-[#00FFC2] hover:text-[#7A5FFF] hover:underline transition-colors"
          >
            Hansen Hub
          </Link>
          {' • '}
          <Link
            href="/"
            className="text-[#00FFC2] hover:text-[#7A5FFF] hover:underline transition-colors"
          >
            www.catohansen.no
          </Link>
        </p>
      </footer>
    </main>
  )
}

