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
 * Pengeplan 2.0 Landing Page
 * Advanced, interactive landing page for Pengeplan 2.0 campaign
 */

'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ParticlesBackground from '@/components/ParticlesBackground'
import { ArrowRight } from 'lucide-react'

// Lazy load heavy components
const PengeplanHero = dynamic(() => import('@/components/PengeplanHero'), {
  loading: () => <div className="h-screen" />,
})

const PengeplanProgress = dynamic(() => import('@/components/PengeplanProgress'), {
  loading: () => <div className="h-96" />,
})

const PengeplanWhySection = dynamic(() => import('@/components/PengeplanWhySection'), {
  loading: () => <div className="h-96" />,
})

const PengeplanInteractiveFeatures = dynamic(() => import('@/components/PengeplanInteractiveFeatures'), {
  loading: () => <div className="h-96" />,
})

const PengeplanTechShowcase = dynamic(() => import('@/components/PengeplanTechShowcase'), {
  loading: () => <div className="h-96" />,
})

const PengeplanSpleisCTA = dynamic(() => import('@/components/PengeplanSpleisCTA'), {
  loading: () => <div className="h-96" />,
})

// Metadata for SEO - will be handled by layout.tsx

export default function PengeplanPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <Navigation />
      
      {/* Hero Section */}
      <PengeplanHero />
      
      {/* Progress Section */}
      <section className="section-padding relative z-10 bg-gradient-to-b from-white to-purple-50/30">
        <PengeplanProgress />
      </section>
      
      {/* Why Section */}
      <section className="section-padding relative z-10">
        <PengeplanWhySection />
      </section>
      
      {/* Interactive Features */}
      <section className="section-padding relative z-10 bg-gradient-to-b from-purple-50/30 to-white">
        <PengeplanInteractiveFeatures />
      </section>
      
      {/* Tech Showcase */}
      <section className="section-padding relative z-10">
        <PengeplanTechShowcase />
      </section>
      
      {/* Spleis CTA */}
      <section className="section-padding relative z-10 bg-gradient-to-b from-white to-purple-50/30">
        <PengeplanSpleisCTA />
      </section>

      {/* Spleis Info Section */}
      <section className="section-padding relative z-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-8 border-2 border-purple-200">
            <h2 className="text-3xl font-extrabold mb-4 gradient-text">
              Lurer du på hva Spleis er?
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Les mer om crowdfunding og hvordan Spleis fungerer
            </p>
            <motion.a
              href="/pengeplan-2.0/spleis"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full font-bold text-lg hover:bg-white/80 transition-all"
            >
              <span>Les mer om Spleis</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

