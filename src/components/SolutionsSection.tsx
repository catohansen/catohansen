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
import {
  Shield,
  Users,
  Brain,
  FileText,
  Briefcase,
  FolderKanban,
  CreditCard,
  BarChart3,
  Zap,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Package,
  Lock,
  DollarSign,
  Network
} from 'lucide-react';

const solutions = [
  {
    icon: Shield,
    title: 'Hansen Security',
    description: 'Enterprise authorization med Policy Engine, RBAC/ABAC, compliance (SOC2, ISO27001, GDPR) og multi-tenant support.',
    status: 'Production Ready',
    features: ['Policy-as-Code', 'Audit Logging', 'Compliance Mapping', 'Multi-tenant'],
    color: 'from-red-500 to-orange-500',
    link: '/hansen-security',
    badge: 'Featured',
    category: 'Security & Compliance'
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Avansert RBAC med hierarkiske roller, granulære permissions, grupper og multi-tenant. Production-ready authentication.',
    status: 'Production Ready',
    features: ['Advanced RBAC', 'Role Hierarchy', '2FA Support', 'Multi-tenant'],
    color: 'from-blue-500 to-cyan-500',
    link: '/demo-admin',
    category: 'Security'
  },
  {
    icon: Brain,
    title: 'AI Agents',
    description: 'Multi-agent orchestration med autonom task scheduling, RAG, AI governance og observability. Enterprise AI automation.',
    status: 'In Development',
    features: ['Multi-Agent System', 'RAG', 'Autonomous Scheduling', 'AI Governance'],
    color: 'from-purple-500 to-pink-500',
    link: '/admin/ai',
    category: 'AI & Automation'
  },
  {
    icon: FileText,
    title: 'Content Management',
    description: 'Moderne headless CMS med media library, SEO tools, visual editor og multi-language support. Enterprise-ready platform.',
    status: 'In Development',
    features: ['Headless CMS', 'SEO Tools', 'Visual Editor', 'Multi-language'],
    color: 'from-green-500 to-emerald-500',
    link: '/admin/content',
    category: 'Content'
  },
  {
    icon: Briefcase,
    title: 'CRM 2.0',
    description: 'Avansert client management system med AI-powered insights, automation rules, integrasjoner og pipeline tracking. Production-ready CRM.',
    status: 'Production Ready',
    features: ['AI Insights', 'Automation Rules', 'Pipeline Tracking', 'Integrations'],
    color: 'from-indigo-500 to-purple-500',
    link: '/hansen-crm',
    badge: 'Featured',
    category: 'Business'
  },
  {
    icon: FolderKanban,
    title: 'Project Management',
    description: 'Project tracking med tasks, milestones, time tracking og team collaboration. Enterprise project management.',
    status: 'In Development',
    features: ['Task Management', 'Milestones', 'Time Tracking', 'Analytics'],
    color: 'from-yellow-500 to-amber-500',
    link: '/admin/projects',
    category: 'Business'
  },
  {
    icon: CreditCard,
    title: 'Billing System',
    description: 'Stripe integration med invoicing, payment processing, subscriptions og revenue analytics. Complete billing solution.',
    status: 'In Development',
    features: ['Stripe Integration', 'Invoicing', 'Subscriptions', 'Analytics'],
    color: 'from-pink-500 to-rose-500',
    link: '/admin/billing',
    category: 'Business'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Real-time analytics med dashboards, custom reports, business intelligence og observability. Complete analytics platform.',
    status: 'In Development',
    features: ['Real-time Analytics', 'Dashboards', 'Custom Reports', 'BI'],
    color: 'from-teal-500 to-cyan-500',
    link: '/admin/analytics',
    category: 'Analytics'
  },
  {
    icon: DollarSign,
    title: 'Pengeplan 2.0',
    description: 'Norges første enterprise-grade AI økonomiplattform med ungdomsbeskyttelse. Kombinerer brukerens kontroll, vergens støtte og AI-intelligens.',
    status: 'Production Ready',
    features: ['AI Agents', 'Verge-system', 'Enterprise Security', 'GDPR Compliance'],
    color: 'from-purple-500 to-pink-500',
    link: '/pengeplan-2.0',
    badge: 'Featured',
    category: 'AI & Finance'
  },
  {
    icon: Network,
    title: 'MindMap 2.0',
    description: 'MindMap 2.0 - AI-drevet mindmapping med Copilot, multi-input (PDF/bilde/audio/video), sanntidssamarbeid og enterprise-eksport. Laget av Cato Hansen.',
    status: 'Coming Soon',
    features: ['AI Copilot', 'Multi-Input', 'Collaboration', 'Export (PNG/PDF/SVG/MD)'],
    color: 'from-indigo-500 to-purple-500',
    link: '/hansen-mindmap-2.0',
    badge: 'New',
    category: 'Productivity'
  },
];

export default function SolutionsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-purple-600 mb-4">
          <Package className="w-4 h-4" />
          Enterprise Solutions
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
          <span className="gradient-text">Modulære Produkter</span>
        </h2>
        <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto">
          Hver modul er standalone, produksjonsklar og kan selges separat. Bygget for scale og enterprise.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {solutions.map((solution, i) => {
          const Icon = solution.icon
          return (
            <div
              key={i}
              className="glass rounded-3xl p-6 group hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold">{solution.title}</h3>
                {solution.badge && (
                  <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                    {solution.badge}
                  </span>
                )}
              </div>
              
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{solution.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {solution.features.slice(0, 2).map((feature, j) => (
                  <span
                    key={j}
                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
                {solution.features.length > 2 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    +{solution.features.length - 2} mer
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  solution.status === 'Production Ready'
                    ? 'bg-green-100 text-green-700'
                    : solution.status === 'Coming Soon'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {solution.status}
                </span>
                <a
                  href={solution.link}
                  className="flex items-center gap-2 text-purple-600 font-semibold text-sm hover:gap-3 transition-all"
                >
                  Utforsk <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <a
          href="/hansen-hub"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Rocket className="w-5 h-5" />
          Se Alle Moduler i Hansen Hub
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}



