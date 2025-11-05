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

import { ExternalLink, Github, Sparkles, Shield, Search, Zap, DollarSign } from 'lucide-react';

const projects = [
  {
    title: 'Hansen Security',
    description: 'Fine-grained authorization system. Policy-based access control with RBAC and ABAC support. Enterprise-grade security module.',
    tech: ['Policy Engine', 'RBAC/ABAC', 'TypeScript', 'SDK'],
    icon: Shield,
    color: 'from-pink-500 to-rose-500',
    link: '/hansen-security',
  },
  {
    title: 'AI Control Center',
    description: 'Self-check, reparasjonstasks, kostsporing og eval-dashboards for AI-systemer',
    tech: ['React', 'AI Governance', 'Observability'],
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    link: '/demo-admin',
  },
  {
    title: 'Global Search + Voice',
    description: 'FTS, synonymer, ferskhet, Whisper-drevet stemmesøk og dokumentindeks',
    tech: ['Elasticsearch', 'Whisper API', 'RAG'],
    icon: Search,
    color: 'from-green-500 to-emerald-500',
    link: '/demo-admin',
  },
  {
    title: 'Pengeplan 2.0',
    description: 'Norges første enterprise-grade AI økonomiplattform med ungdomsbeskyttelse og verge-system. Production-ready med 100+ admin sider.',
    tech: ['AI/LLM', 'Enterprise Security', 'GDPR', 'TypeScript'],
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500',
    link: '/pengeplan-2.0',
  },
  {
    title: 'Portfolio Website',
    description: 'Moderne portfolio nettside med AI-drevet administrasjon og enterprise sikkerhet',
    tech: ['Next.js', 'TypeScript', 'Hansen Security', 'Tailwind CSS'],
    icon: Sparkles,
    color: 'from-blue-500 to-purple-500',
    link: '/',
  },
];

export default function PortfolioSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="gradient-text">Portefølje</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Utvalgte prosjekter som viser bredden av min ekspertise
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <div
            key={i}
            className="glass rounded-3xl overflow-hidden group"
          >
            <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
              <project.icon className="w-24 h-24 text-white/20" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, j) => (
                  <span
                    key={j}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={project.link}
                  className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                >
                  Se Prosjekt <ExternalLink className="w-4 h-4" />
                </a>
                {project.link !== '#' && (
                  <a
                    href={`https://github.com/catohansen${project.link === '/' ? '' : project.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

