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
 * Hansen Security Documentation
 * Complete documentation for Hansen Security authorization system
 * Inspired by Cerbos documentation structure
 */

import type { Metadata } from 'next'
import { Shield, Book, Code, FileText, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hansen Security Documentation | Complete Guide | Cato Hansen',
  description: 'Complete documentation for Hansen Security - Enterprise authorization system. Getting started, API reference, policies, and best practices.',
  openGraph: {
    title: 'Hansen Security Documentation',
    description: 'Complete guide to Hansen Security authorization system'
  }
}

export default function HansenSecurityDocsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Hansen Security Documentation
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete guide to implementing and using Hansen Security authorization system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Book,
              title: 'Getting Started',
              description: 'Quick start guide, installation, and basic concepts',
              href: '/hansen-security/docs/getting-started',
              color: 'from-purple-500 to-purple-600'
            },
            {
              icon: Code,
              title: 'API Reference',
              description: 'Complete API documentation and SDK references',
              href: '/hansen-security/docs/api',
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: FileText,
              title: 'Policy Guide',
              description: 'Writing and managing authorization policies',
              href: '/hansen-security/docs/policies',
              color: 'from-green-500 to-green-600'
            },
            {
              icon: Shield,
              title: 'Security Best Practices',
              description: 'Security patterns, attack prevention, and compliance',
              href: '/hansen-security/docs/security',
              color: 'from-red-500 to-red-600'
            },
            {
              icon: Globe,
              title: 'Integrations',
              description: 'Integrating Hansen Security with frameworks and services',
              href: '/hansen-security/docs/integrations',
              color: 'from-orange-500 to-orange-600'
            },
            {
              icon: Book,
              title: 'Examples',
              description: 'Code examples and real-world use cases',
              href: '/hansen-security/docs/examples',
              color: 'from-pink-500 to-pink-600'
            }
          ].map((doc, index) => (
            <Link
              key={index}
              href={doc.href}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${doc.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                <doc.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{doc.title}</h3>
              <p className="text-gray-400">{doc.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/hansen-security"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
            <span>Back to Hansen Security</span>
          </Link>
        </div>
      </div>
    </main>
  )
}

