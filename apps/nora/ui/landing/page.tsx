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
 * Nora Landing Page v1.0
 * Official marketing page for Nora - The Mind Behind Hansen Global
 * Production-ready prototype with Live Demo
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  Mic,
  Zap,
  Brain,
  Shield,
  Database,
  Code2,
  Network,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot
} from 'lucide-react'
import Link from 'next/link'
import NoraChatBubble from '../chat/NoraChatBubble'
import ParticleBackground from '../components/ParticleBackground'
import NoraAvatar from '../components/NoraAvatar'

export default function NoraLandingPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <main className="bg-[#0E0E16] text-white min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#7A5FFF]/10 via-[#00FFC2]/10 to-[#C6A0FF]/10 animate-pulse pointer-events-none" style={{ zIndex: 1 }}></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,95,255,0.2),transparent_50%)] pointer-events-none" style={{ zIndex: 1 }}></div>

      {/* Hero Section */}
      <section className="w-full text-center py-32 px-6 relative overflow-hidden" style={{ zIndex: 2 }}>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Nora Avatar - 3D animated with glow rings */}
          <NoraAvatar />
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Meet Nora
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mt-6 max-w-3xl mx-auto mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            The Mind Behind Hansen Global
          </motion.p>
          
          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Your adaptive AI system architect, voice assistant, and knowledge core. 
            Built with LangGraph, RAG, and OpenAI GPT-5.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] text-white rounded-2xl text-lg font-semibold hover:from-[#6A4FFF] hover:to-[#00E0B2] transition-all shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Try Live Demo
            </button>
            
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-[#7A5FFF] text-[#7A5FFF] rounded-2xl text-lg font-semibold hover:bg-[#7A5FFF]/10 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Learn More
            </Link>
          </motion.div>

          {/* Nora Avatar Animation - Enhanced */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -20, 0]
            }}
            transition={{ 
              delay: 1, 
              duration: 1,
              y: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            className="flex justify-center mt-12"
          >
            <div className="relative w-48 h-48 md:w-64 md:h-64 cursor-pointer group">
              {/* Glow rings */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-[#7A5FFF] via-[#00FFC2] to-[#C6A0FF] rounded-full blur-3xl opacity-50"
              ></motion.div>
              <motion.div
                animate={{
                  scale: [1.1, 1.3, 1.1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute inset-0 bg-gradient-to-r from-[#C6A0FF] via-[#7A5FFF] to-[#00FFC2] rounded-full blur-3xl opacity-30"
              ></motion.div>
              
              {/* Main avatar */}
              <div className="relative w-full h-full bg-gradient-to-br from-[#7A5FFF] via-[#00FFC2] to-[#C6A0FF] rounded-full flex items-center justify-center border-4 border-white/20 backdrop-blur-sm group-hover:border-[#00FFC2]/50 transition-all duration-300 shadow-2xl shadow-purple-500/50">
                <motion.div
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Brain className="w-24 h-24 md:w-32 md:h-32 text-white drop-shadow-2xl" />
                </motion.div>
              </div>
              
              {/* Floating particles around avatar */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, Math.cos(i * 60) * 80],
                    y: [0, Math.sin(i * 60) * 80],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#00FFC2] rounded-full blur-sm"
                  style={{ transform: 'translate(-50%, -50%)' }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full max-w-6xl py-24 px-6 grid md:grid-cols-3 gap-8 relative"
        style={{ zIndex: 2 }}
      >
        {[
          {
            icon: Zap,
            title: 'Adaptive Intelligence',
            desc: 'Nora adapts to every project — Pengeplan, Resilient13, or Hansen Hub.',
            color: 'from-[#00FFC2] to-[#7A5FFF]'
          },
          {
            icon: Mic,
            title: 'Voice Interaction',
            desc: 'Talk to Nora in real time with Whisper + ElevenLabs integration.',
            color: 'from-[#7A5FFF] to-[#C6A0FF]'
          },
          {
            icon: MessageCircle,
            title: 'Knowledge & Reasoning',
            desc: 'Powered by RAG + LangGraph, Nora understands your systems deeply.',
            color: 'from-[#C6A0FF] to-[#00FFC2]'
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="bg-[#171721] border border-[#24243A] rounded-2xl p-8 hover:border-[#7A5FFF]/60 transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7A5FFF]/10 to-[#00FFC2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${f.color} rounded-lg mb-4`}>
              <f.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-[#00FFC2] transition-colors">{f.title}</h3>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Integrations Section */}
      <section className="w-full max-w-6xl py-24 px-6 text-center relative" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] rounded-full mb-6">
            <Network className="w-5 h-5" />
            <span className="font-semibold">Powering Hansen Global</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#7A5FFF] to-[#00FFC2] bg-clip-text text-transparent">
            Powering the Hansen Global Ecosystem
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Nora integrates seamlessly with all Hansen Global modules and projects
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Pengeplan 2.0', desc: 'Financial planning and automation', icon: Database, color: 'from-blue-500 to-cyan-500' },
            { name: 'Resilient13', desc: 'Resilience and security platform', icon: Shield, color: 'from-red-500 to-orange-500' },
            { name: 'Hansen Hub', desc: 'Central module marketplace', icon: Network, color: 'from-purple-500 to-pink-500' }
          ].map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#171721] border border-[#2A2A3C] hover:border-[#7A5FFF]/50 transition-all rounded-2xl p-8"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${proj.color} rounded-lg mb-4`}>
                <proj.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">{proj.name}</h3>
              <p className="text-gray-400">{proj.desc}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#7A5FFF]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Powered by Nora</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="w-full max-w-4xl text-center py-24 px-6 relative" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#C6A0FF] to-[#7A5FFF] bg-clip-text text-transparent">
            About Nora
          </h2>
          <p className="text-gray-400 leading-relaxed text-lg mb-6">
            Nora is more than an AI — she&apos;s the architect of your digital world.
            Built with LangGraph, Supabase, and OpenAI GPT-5, she connects
            knowledge, automation, and emotion.
          </p>
          <p className="text-gray-300 text-base">
            Created by <strong className="text-[#7A5FFF]">Cato Hansen</strong> as part of
            the Hansen Global ecosystem.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 text-center text-gray-500 border-t border-[#1E1E2D] mt-auto relative" style={{ zIndex: 2 }}>
        <p>© 2025 Cato Hansen — Hansen Global Solutions</p>
        <p className="mt-2 text-sm">Powered by Nora™ | v1.0</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/" className="text-[#7A5FFF] hover:text-[#00FFC2] transition-colors">
            Home
          </Link>
          <Link href="/admin/nora" className="text-[#7A5FFF] hover:text-[#00FFC2] transition-colors">
            Admin
          </Link>
        </div>
      </footer>

      {/* Live Demo Chat Bubble */}
      {showDemo && (
        <NoraChatBubble
          position="bottom-right"
          enabled={true}
          pageContext="/nora"
        />
      )}
    </main>
  )
}

