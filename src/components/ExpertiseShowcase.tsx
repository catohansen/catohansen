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

'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Brain,
  Code,
  Database,
  Shield,
  Zap,
  Network,
  Rocket,
  Award,
  CheckCircle2,
  ArrowRight,
  Package,
  Lock,
  Users,
  FileText
} from 'lucide-react';
import Link from 'next/link';

const expertiseAreas = [
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Eliteekspertise innen LLM, RAG, multi-agent systems og enterprise AI automation.',
    color: 'from-purple-500 to-pink-500',
    modules: ['AI Agents', 'Pengeplan 2.0']
  },
  {
    icon: Code,
    title: 'Systemarkitektur',
    description: 'Enterprise-grade arkitektur med mikrotjenester, event-driven design og skalerbar infrastruktur.',
    color: 'from-blue-500 to-cyan-500',
    modules: ['Modular Architecture', 'Hansen Hub']
  },
  {
    icon: Database,
    title: 'Data Engineering',
    description: 'Data pipelines, real-time processing, analytics og business intelligence.',
    color: 'from-green-500 to-emerald-500',
    modules: ['Analytics Module', 'Data Platform']
  },
  {
    icon: Shield,
    title: 'Sikkerhet & Compliance',
    description: 'Enterprise security, RBAC/ABAC, compliance (GDPR, SOC2, ISO27001) og audit logging.',
    color: 'from-red-500 to-orange-500',
    modules: ['Hansen Security', 'User Management']
  },
  {
    icon: Zap,
    title: 'Performance & Scalability',
    description: 'High-performance systemer, caching, edge computing og optimalisering for scale.',
    color: 'from-yellow-500 to-amber-500',
    modules: ['Smart Caching', 'Edge Services']
  },
  {
    icon: Network,
    title: 'Cloud & DevOps',
    description: 'Multi-cloud architecture, CI/CD, infrastructure-as-code og zero-downtime deployments.',
    color: 'from-indigo-500 to-purple-500',
    modules: ['Deployment System', 'Module Sync']
  }
];

const featuredModules = [
  {
    icon: Shield,
    title: 'Hansen Security',
    description: 'Enterprise authorization med Policy Engine',
    link: '/hansen-security',
    color: 'from-red-500 to-orange-500',
    badge: 'Featured'
  },
  {
    icon: Lock,
    title: 'Hansen Auth',
    description: 'Modern authentication framework',
    link: '/hansen-auth',
    color: 'from-blue-500 to-cyan-500',
    badge: 'New'
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Advanced RBAC med hierarkiske roller',
    link: '/demo-admin',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Package,
    title: 'Hansen Hub',
    description: 'Alle moduler på ett sted',
    link: '/hansen-hub',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function ExpertiseShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-purple-600 mb-4">
          <Award className="w-4 h-4" />
          Elite Ekspertise
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">IT, Data & AI Ekspertise</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Enterprise-grade løsninger innen AI, systemarkitektur, data engineering og sikkerhet.
          <span className="block mt-2 text-lg text-slate-500">
            Alle moduler er produksjonsklare, modulariserte og kan selges separat.
          </span>
        </p>
      </div>

      {/* Expertise Areas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {expertiseAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{area.title}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{area.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {area.modules.map((module, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Modules */}
      <div className="mt-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-2">Produksjonsklare Moduler</h3>
          <p className="text-lg text-slate-600">
            Hver modul er standalone, dokumentert og klar for produksjon
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <motion.a
                key={index}
                href={module.link}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: (expertiseAreas.length + index) * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-bold text-slate-900">{module.title}</h4>
                  {module.badge && (
                    <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                      {module.badge}
                    </span>
                  )}
                </div>
                
                <p className="text-slate-600 text-sm mb-4">{module.description}</p>
                
                <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Utforsk</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/hansen-hub"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Rocket className="w-5 h-5" />
            Se Alle Moduler i Hansen Hub
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}




