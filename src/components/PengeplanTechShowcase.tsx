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
 * Pengeplan 2.0 Tech Showcase
 * Showcase the advanced technology stack and architecture
 */

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Code2, Database, Server, Shield, Zap, Brain,
  CheckCircle2, ArrowRight, Sparkles, Cpu, Lock, Globe
} from 'lucide-react'

const techStack = [
  {
    category: 'Frontend',
    icon: Code2,
    technologies: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    color: 'from-blue-500 to-cyan-500',
    description: 'Moderne, performant frontend med optimalisert UX'
  },
  {
    category: 'Backend',
    icon: Server,
    technologies: ['Next.js API Routes', 'Prisma ORM', 'PostgreSQL', 'Node.js', 'TypeScript'],
    color: 'from-purple-500 to-pink-500',
    description: 'Skalerbar backend med type-safe API'
  },
  {
    category: 'AI & ML',
    icon: Brain,
    technologies: ['OpenAI GPT-4', 'Hugging Face', 'RAG', 'Multi-Agent', 'LLM'],
    color: 'from-green-500 to-emerald-500',
    description: 'State-of-the-art AI med RAG og multi-agent'
  },
  {
    category: 'Security',
    icon: Shield,
    technologies: ['Cerbos', 'RBAC/ABAC', 'Zero-Trust', 'GDPR', 'Audit Logging'],
    color: 'from-red-500 to-orange-500',
    description: 'Enterprise-grade sikkerhet med policy engine'
  },
  {
    category: 'Infrastructure',
    icon: Database,
    technologies: ['Vercel', 'Neon/Supabase', 'Upstash Redis', 'CDN', 'Edge Functions'],
    color: 'from-yellow-500 to-amber-500',
    description: 'Skalerbar, global infrastruktur'
  },
  {
    category: 'Compliance',
    icon: Lock,
    technologies: ['Norsk AI-veileder', 'EU AI Act', 'GDPR', 'SOC2', 'ISO27001'],
    color: 'from-indigo-500 to-purple-500',
    description: 'Full compliance med alle relevante standarder'
  },
]

export default function PengeplanTechShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">Teknologisk Excellence</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Bygget med verdens beste teknologier for ytelse, sikkerhet og skalerbarhet
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techStack.map((tech, i) => {
          const Icon = tech.icon
          const isSelected = selectedCategory === i
          
          return (
            <motion.div
              key={i}
              onClick={() => setSelectedCategory(isSelected ? null : i)}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`glass rounded-3xl p-6 cursor-pointer transition-all relative overflow-hidden ${
                isSelected ? 'ring-4 ring-purple-500 shadow-2xl' : 'hover:shadow-xl'
              }`}
            >
              {/* Background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 rounded-3xl`}
                animate={isSelected ? { opacity: 0.1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center`}
                    animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">{tech.category}</h3>
                    <p className="text-xs text-gray-500">{tech.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="overflow-hidden">
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                      {tech.technologies.map((technology, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 font-medium">{technology}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isSelected && (
                  <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm mt-4">
                    <span>Klikk for å se teknologier</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: '100+', description: 'Admin sider' },
          { label: 'Enterprise', description: 'Grade' },
          { label: 'Production', description: 'Ready' },
          { label: 'Full', description: 'Compliance' },
        ].map((stat, i) => (
          <div
            key={i}
            className="text-center glass rounded-2xl p-6"
          >
            <div className="text-3xl font-extrabold gradient-text mb-2">{stat.label}</div>
            <div className="text-sm text-gray-600">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

