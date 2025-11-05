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

import { Brain, Code2, Palette, Server, Shield, Zap, Database, Globe, CheckCircle2, Package, Rocket } from 'lucide-react';

const expertise = [
  {
    icon: Brain,
    title: 'AI & LLM Ekspertise',
    description: 'Multi-agent systemer, RAG-arkitektur, prompt engineering, og AI governance',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Code2,
    title: 'Systemarkitektur',
    description: 'Skalerbare backend-systemer, mikrotjenester, og cloud-infrastruktur',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Webdesign & UX',
    description: 'Moderne UI/UX design, design systems, og frontend-utvikling',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Server,
    title: 'Backend Utvikling',
    description: 'Robuste API-er, database-design, og systemintegrasjoner',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Sikkerhet & Compliance',
    description: 'GDPR, AI Act, RBAC, sikkerhetsarkitektur, og compliance',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimalisering, caching-strategier, og høy ytelse',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: Database,
    title: 'Dataplattformer',
    description: 'Data pipelines, analytics, og business intelligence',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Globe,
    title: 'Entreprenørskap',
    description: 'Produktutvikling, strategi, og vekst fra idé til produksjon',
    color: 'from-teal-500 to-green-500',
  },
];

export default function ExpertiseSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">Kompetanse</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Fra AI-innovasjon til produksjonsklare moduler – jeg bygger løsninger som kan selges som separate produkter
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">9+ Produksjonsklare Moduler</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">NPM Ready</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
            <Rocket className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Enterprise Grade</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {expertise.map((item, i) => (
          <div
            key={i}
            className="glass rounded-3xl p-6 cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
              <item.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

