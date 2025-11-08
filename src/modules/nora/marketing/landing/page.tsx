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
 * Nora Marketing Landing Page v3.0 - REVOLUSJONERENDE
 * 
 * Komplett markedsføringsside med live demo, feature cards, og integration showcase
 * 
 * URL: /nora
 * 
 * Mye mer avansert enn Siri, Alexa, Google Assistant!
 * Programmert av Cato Hansen
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react'
import NoraChatBubble from '../../ui/chat/NoraChatBubble'
import ParticleBackground from '../../ui/components/ParticleBackground'
import NoraAvatar from '../../ui/components/NoraAvatar'

export default function NoraLandingPage() {
  const [open, setOpen] = useState(false)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0E0E16] text-white font-inter">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-24 text-center px-6">
        <div className="flex flex-col items-center">
                {/* Avatar - Stor, prominent ikon (som på bilde) */}
                <div className="mb-0 -mb-4">
                  <NoraAvatar size={384} className="-mb-4" />
                </div>

          {/* Main Name - "Nora" - Stor, fet, lilla tekst (som på bilde) */}
          <h1 className="text-7xl md:text-9xl font-bold mb-6 text-[#7A5FFF] -mt-2">
            Nora
          </h1>

          {/* Tagline - "The Living Mind Behind" - Purple to Teal/Mint gradient, 2 linjer (som på bilde) */}
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-[#7A5FFF] via-[#C6A0FF] to-[#00FFC2] bg-clip-text text-transparent">
            The Living Mind
            <br />
            Behind
          </h2>

          {/* Norwegian Description (som på bilde) */}
          <p className="max-w-xl text-gray-300 mb-6 text-lg md:text-xl">
            Intelligent, emosjonell og levende AI-assistent bygget for ekte samarbeid.
          </p>

          {/* English Description/Credit (som på bilde) */}
          <p className="max-w-2xl text-gray-400 mb-10 text-sm md:text-base">
            Revolutionary AI that&apos;s more advanced than Siri, Alexa, and Google Assistant.
            <br />
            Created in Drøbak, Norway — by System Architect Cato Hansen.
          </p>

          {/* CTA Button - "Try Live Demo →" (som på bilde) */}
          <button
            onClick={() => setOpen(!open)}
            className="group rounded-lg px-8 py-4 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white font-semibold shadow-lg shadow-[#7A5FFF]/50 hover:shadow-[#00FFC2]/50 hover:scale-105 active:scale-97 transition-all duration-300 flex items-center gap-2"
          >
            {open ? 'Close Demo' : 'Try Live Demo'}
            {!open && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </section>

      {/* Nora Chat Bubble - Always rendered, shows floating button when closed */}
      <NoraChatBubble
        position="bottom-right"
        pageContext="/nora"
        defaultOpen={false}
      />

      {/* Features Section */}
      <section className="relative z-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3 px-8 pb-32 max-w-[70%] mx-auto">
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
          <div
            key={i}
            className="p-6 rounded-2xl border border-[#7A5FFF]/50 hover:border-[#00FFC2]/70 transition-all duration-300"
            style={{
              background: '#1A1A28',
              backgroundColor: '#1A1A28',
              boxShadow: '0 20px 60px rgba(122, 95, 255, 0.3), 0 0 40px rgba(0, 255, 194, 0.2), inset 0 0 0 1px rgba(122, 95, 255, 0.1)'
            }}
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-[#00FFC2]">{f.title}</h3>
            <p className="text-gray-200 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Integrations Section */}
      <section className="relative z-10 px-8 pb-32 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-[#7A5FFF] via-[#C6A0FF] to-[#00FFC2] bg-clip-text text-transparent">
          Works Seamlessly With
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {['Pengeplan 2.0', 'Resilient13', 'Hansen Security', 'Hansen Auth', 'Hansen Hub'].map((p, i) => (
            <span
              key={p}
              className="px-5 py-2 rounded-full border border-[#C6A0FF]/50 text-sm text-gray-200 hover:border-[#00FFC2]/70 transition-all duration-300 cursor-default"
              style={{
                background: '#1A1A28',
                backgroundColor: '#1A1A28',
                boxShadow: '0 4px 20px rgba(122, 95, 255, 0.15)'
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 px-8 pb-24 text-center max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent">
            Created by Cato Hansen
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            System Architect from Drøbak, Norway
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Nora is the result of years of system architecture expertise, AI innovation,
            and a deep understanding of how humans and machines can work together.
            She&apos;s not just an AI assistant — she&apos;s the living mind behind the entire
            Hansen Global ecosystem.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 pb-24 text-center max-w-4xl mx-auto">
        <div 
          className="border border-[#7A5FFF]/50 rounded-3xl p-12"
          style={{
            background: '#1A1A28',
            backgroundColor: '#1A1A28',
            boxShadow: '0 20px 60px rgba(122, 95, 255, 0.3), 0 0 40px rgba(0, 255, 194, 0.2), inset 0 0 0 1px rgba(122, 95, 255, 0.1)'
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Integrate Nora?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Start with a free demo or book an integration call
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-[#7A5FFF]/50 hover:shadow-[#00FFC2]/50 hover:scale-105 active:scale-97 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Try Free Demo
            </button>
            <Link
              href="/contact"
              className="border-2 border-[#7A5FFF] text-[#7A5FFF] hover:bg-[#7A5FFF] hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              Book Integration Call
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#7A5FFF]/30 py-8 text-center text-gray-400 text-sm px-6">
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
    </main>
  )
}
