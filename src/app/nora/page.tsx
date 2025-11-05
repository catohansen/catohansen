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
 * Nora Marketing Landing Page v4.0 - REVOLUSJONERENDE
 * 
 * Komplett markedsføringsside med live demo, feature cards, integration showcase
 * og dark/light mode toggle
 * 
 * URL: /nora
 * 
 * Mye mer avansert enn Siri, Alexa, Google Assistant!
 * Programmert av Cato Hansen
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, ArrowRight, Activity, Sun, Moon } from 'lucide-react'
import ParticleBackground from '@/components/shared/ParticleBackground'
import NoraAvatar from '@/modules/nora/ui/components/NoraAvatar'

type Theme = 'dark' | 'light'

export default function NoraLandingPage() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('dark')

  // Load theme from localStorage (only on client)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('nora-theme') as Theme | null
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setTheme(savedTheme)
      }
    }
  }, [])

  // Save theme to localStorage (only on client)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nora-theme', theme)
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme)
      }
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Theme colors
  const colors = {
    dark: {
      bg: '#0E0E16',
      surface: '#171721',
      surfaceLight: '#141420',
      border: '#24243A',
      text: '#FFFFFF',
      textSecondary: '#9CA3AF',
      textMuted: '#6B7280',
      primary: '#7A5FFF',
      secondary: '#C6A0FF',
      accent: '#00FFC2',
    },
    light: {
      bg: '#FFFFFF',
      surface: '#F8F9FA',
      surfaceLight: '#F1F3F5',
      border: '#E5E7EB',
      text: '#1F2937',
      textSecondary: '#4B5563',
      textMuted: '#6B7280',
      primary: '#7A5FFF',
      secondary: '#C6A0FF',
      accent: '#00FFC2',
    }
  }

  const currentColors = colors[theme]
  const isDark = theme === 'dark'

  // Error boundary for client-side errors
  if (error) {
    return (
      <main className={`min-h-screen ${isDark ? 'bg-[#0E0E16]' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'} flex items-center justify-center p-8`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>Kritisk feil</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>{error}</p>
          <button
            onClick={() => {
              setError(null)
              if (typeof window !== 'undefined') {
                window.location.reload()
              }
            }}
            className="px-6 py-3 bg-[#7A5FFF] text-white rounded-lg hover:bg-[#00FFC2] transition-colors"
          >
            Prøv igjen
          </button>
        </div>
      </main>
    )
  }

  return (
    <main 
      className={`relative min-h-screen overflow-x-hidden font-inter transition-colors duration-500 ${
        isDark 
          ? 'bg-[#0E0E16] text-white' 
          : 'bg-white text-gray-900'
      }`}
      style={{ backgroundColor: currentColors.bg, color: currentColors.text }}
    >
      {/* Theme Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-theme-toggle p-3 rounded-full shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#171721] border border-[#7A5FFF]/50 text-[#00FFC2] hover:bg-[#24243A]'
            : 'bg-white border border-[#7A5FFF]/30 text-[#7A5FFF] hover:bg-gray-50 shadow-lg'
        }`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.button>

      {/* Particle Background - Only show in dark mode */}
      {isDark && <ParticleBackground enhanced={true} particleCount={100} />}

      {/* Light mode gradient background */}
      {!isDark && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 opacity-50 pointer-events-none" />
      )}

      {/* Hero Section */}
      <section className="relative z-0 flex flex-col items-center justify-center pt-32 pb-24 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          {/* Avatar */}
          <div className="mb-10">
            <NoraAvatar />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#7A5FFF] via-[#C6A0FF] to-[#00FFC2] bg-clip-text text-transparent">
            Nora
            <br />
            The Living Mind Behind
          </h1>

          <p className={`max-w-xl mb-6 text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Intelligent, emosjonell og levende AI-assistent bygget for ekte samarbeid.
          </p>

          <p className={`max-w-2xl mb-10 text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Revolutionary AI that's more advanced than Siri, Alexa, and Google Assistant.
            <br />
            Created in Drøbak, Norway — by System Architect Cato Hansen.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setOpen(true)
              // Trigger chat bubble to open by updating state
              if (typeof window !== 'undefined') {
                const event = new CustomEvent('openNoraChat')
                window.dispatchEvent(event)
              }
            }}
            className="group rounded-full px-8 py-4 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white font-semibold shadow-lg shadow-[#7A5FFF]/50 hover:shadow-[#00FFC2]/50 transition-all duration-300 flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Try Live Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-0 grid gap-10 md:grid-cols-2 lg:grid-cols-3 px-8 pb-32">
        {[
          {
            title: 'Memory Engine',
            desc: 'Langtidshukommelse med Supabase + Embeddings – Nora husker alt som betyr noe.',
            icon: '💾'
          },
          {
            title: 'Emotion Engine',
            desc: 'Analyserer språk og tone for å reagere med ekte følelser og empati.',
            icon: '💞'
          },
          {
            title: 'Voice Engine',
            desc: 'Whisper + ElevenLabs for naturlig stemmeinn og ut med varme og følelse.',
            icon: '🎙'
          },
          {
            title: 'System Orchestrator',
            desc: 'Koordinerer alle motorer og prosesser i sanntid med intelligent task scheduling.',
            icon: '⚙️'
          },
          {
            title: 'Security & Auth',
            desc: 'Integrert RBAC/ABAC, 2FA og AES-kryptering for trygg databehandling.',
            icon: '🔐'
          },
          {
            title: 'Automation Engine',
            desc: 'Utfører planlagte handlinger, varsler og oppgaver automatisk på tvers av systemer.',
            icon: '🤖'
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className={`p-6 rounded-2xl backdrop-blur border transition-all duration-300 hover:shadow-lg ${
              isDark
                ? 'bg-[#141420]/60 border-[#7A5FFF]/30 hover:border-[#00FFC2]/50 shadow-md hover:shadow-[#00FFC2]/20'
                : 'bg-white/80 border-[#7A5FFF]/20 hover:border-[#00FFC2]/40 shadow-md hover:shadow-[#7A5FFF]/20'
            }`}
            style={{ backgroundColor: isDark ? currentColors.surfaceLight + '99' : currentColors.bg + 'CC' }}
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#00FFC2]' : 'text-[#7A5FFF]'}`}>
              {f.title}
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Integrations Section */}
      <section className="relative z-0 px-8 pb-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-[#7A5FFF] via-[#C6A0FF] to-[#00FFC2] bg-clip-text text-transparent"
        >
          Works Seamlessly With
        </motion.h2>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {['Pengeplan 2.0', 'Resilient13', 'Hansen Security', 'Hansen Auth', 'Hansen Hub'].map((p, i) => (
            <motion.span
              key={p}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 cursor-default ${
                isDark
                  ? 'border-[#C6A0FF]/40 bg-[#141420]/40 text-gray-200 hover:border-[#00FFC2]/60 hover:bg-[#00FFC2]/10'
                  : 'border-[#7A5FFF]/30 bg-white/60 text-gray-700 hover:border-[#00FFC2]/50 hover:bg-[#00FFC2]/10'
              }`}
            >
              {p}
            </motion.span>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-0 px-8 pb-24 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent">
            Created by Cato Hansen
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            System Architect from Drøbak, Norway
          </p>
          <p className={`max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-700'}`}>
            Nora is the result of years of system architecture expertise, AI innovation,
            and a deep understanding of how humans and machines can work together.
            She's not just an AI assistant — she's the living mind behind the entire
            Hansen Global ecosystem.
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-0 px-8 pb-24 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl p-12 border ${
            isDark
              ? 'bg-gradient-to-r from-[#7A5FFF]/20 to-[#00FFC2]/20 border-[#7A5FFF]/40'
              : 'bg-gradient-to-r from-[#7A5FFF]/10 to-[#00FFC2]/10 border-[#7A5FFF]/30'
          }`}
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ready to Integrate Nora?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start with a free demo or book an integration call
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-[#7A5FFF]/50 hover:shadow-[#00FFC2]/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Try Free Demo
            </motion.button>
            <Link
              href="/admin/nora/dashboard"
              className={`border-2 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isDark
                  ? 'border-[#7A5FFF] text-[#7A5FFF] hover:bg-[#7A5FFF] hover:text-white'
                  : 'border-[#7A5FFF] text-[#7A5FFF] hover:bg-[#7A5FFF] hover:text-white'
              }`}
            >
              <Activity className="w-5 h-5" />
              Admin Dashboard
            </Link>
            <Link
              href="/contact"
              className={`border-2 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                isDark
                  ? 'border-[#7A5FFF] text-[#7A5FFF] hover:bg-[#7A5FFF] hover:text-white'
                  : 'border-[#7A5FFF] text-[#7A5FFF] hover:bg-[#7A5FFF] hover:text-white'
              }`}
            >
              Book Integration Call
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`relative z-0 border-t py-8 text-center text-sm px-6 ${
        isDark 
          ? 'border-[#7A5FFF]/30 text-gray-400' 
          : 'border-gray-200 text-gray-600'
      }`}>
        <p className="mb-2">
          © 2025 Cato Hansen. All rights reserved.
        </p>
        <p className={`text-xs mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Proprietary — Unauthorized use prohibited
        </p>
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span>Built in Drøbak</span>
          <span className="text-[#00FFC2]">💠</span>
          <span>by System Architect Cato Hansen</span>
          {' • '}
          <Link
            href="https://www.catohansen.no"
            className="text-[#00FFC2] hover:text-[#7A5FFF] hover:underline transition-colors"
          >
            www.catohansen.no
          </Link>
          {' • '}
          <Link
            href="mailto:cato@catohansen.no"
            className="text-[#00FFC2] hover:text-[#7A5FFF] hover:underline transition-colors"
          >
            cato@catohansen.no
          </Link>
        </p>
      </footer>

             {/* Nora Chat Bubble is now in RootLayout - always available */}
           </main>
         )
       }