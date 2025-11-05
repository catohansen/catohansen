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
 * Hansen Auth Landing Page
 * Modern authentication framework - Better Auth inspired
 */

'use client'

import { motion } from 'framer-motion'
import { 
  Lock, Users, Zap, Code, Globe, ArrowRight, CheckCircle, 
  Github, Package, Shield, Key, Mail, Smartphone, Plug,
  Rocket, Sparkles, Star, ChevronRight, Play
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function HansenAuthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-2xl">
              <Lock className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hansen Auth
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Modern authentication framework for TypeScript
            </p>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Enterprise-grade security meets developer-friendly simplicity.
              <span className="block mt-2 text-sm text-gray-500">
                Inspired by Better Auth • Built by Cato Hansen Agency
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="#get-started"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2 shadow-xl"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="#features"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Code className="h-5 w-5" />
                <span>View Features</span>
              </Link>
              
              <Link
                href="/demo-admin"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Live Demo</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-blue-400">5 min</div>
                <div className="text-sm text-gray-400">Setup Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-gray-400">TypeScript</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">∞</div>
                <div className="text-sm text-gray-400">Extensible</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive authentication out of the box, extendable with plugins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mail,
                title: 'Email & Password',
                description: 'Secure email and password authentication with bcrypt hashing',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Globe,
                title: 'Social Sign-on',
                description: 'OAuth support for Google, GitHub, Discord, Twitter, and more',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Smartphone,
                title: 'Two-Factor Auth',
                description: 'TOTP-based 2FA support for enhanced security',
                color: 'from-pink-500 to-pink-600'
              },
              {
                icon: Users,
                title: 'Session Management',
                description: 'Flexible session management with remember-me support',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Shield,
                title: 'Account Security',
                description: 'Account locking, failed login tracking, and audit logging',
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: Key,
                title: 'Advanced RBAC',
                description: 'Hierarchical roles, granular permissions, and multi-tenant support',
                color: 'from-cyan-500 to-cyan-600'
              },
              {
                icon: Code,
                title: 'Framework Agnostic',
                description: 'Works with React, Vue, Svelte, Next.js, and any framework',
                color: 'from-indigo-500 to-indigo-600'
              },
              {
                icon: Plug,
                title: 'Plugin System',
                description: 'Extensible plugin ecosystem for custom functionality',
                color: 'from-red-500 to-red-600'
              },
              {
                icon: Zap,
                title: 'TypeScript First',
                description: 'Full type safety with automatically generated types',
                color: 'from-yellow-500 to-yellow-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="get-started" className="py-20 relative z-10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">5-Minute Setup</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started with Hansen Auth in minutes, not hours
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-400">Installation</span>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{`npm install @catohansen/hansen-auth`}</code>
              </pre>
            </div>

            <div className="mt-8 bg-slate-900 rounded-xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-gray-400">Configuration</span>
              </div>
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{`import { createAuth } from '@catohansen/hansen-auth'

export const auth = createAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialAuth: {
    providers: ['google', 'github'],
  },
  session: {
    maxAge: 30, // 30 days
    defaultAge: 7, // 7 days
  },
})`}</code>
              </pre>
            </div>

            <div className="mt-8 bg-slate-900 rounded-xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-5 w-5 text-pink-400" />
                <span className="text-sm text-gray-400">Usage</span>
              </div>
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{`// Sign in
const result = await auth.signIn({
  email: 'user@example.com',
  password: 'secure-password',
  rememberMe: true,
})

// Use pre-built components
import { SignInForm } from '@catohansen/hansen-auth/react'

<SignInForm
  socialProviders={['google', 'github']}
  onSuccess={(user) => console.log('Signed in:', user)}
/>`}</code>
              </pre>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/hansen-hub"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <span>View All Modules</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Security Showcase Section */}
      <section id="security" className="py-20 relative z-10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built with security best practices and compliance in mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Shield,
                title: 'Encryption',
                description: 'End-to-end encryption for all data transmission',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Key,
                title: 'Key Management',
                description: 'Secure key generation and rotation',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Lock,
                title: 'Access Control',
                description: 'Multi-factor authentication and RBAC',
                color: 'from-pink-500 to-pink-600'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl mb-4 mx-auto`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'SOC 2 Compliance',
              'GDPR Ready',
              'ISO 27001',
              '2FA Support',
              'Audit Logging',
              'Rate Limiting',
              'CSRF Protection',
              'XSS Prevention'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-all"
              >
                <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-2" />
                <span className="text-sm text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Hansen Auth?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Best of Better Auth, enhanced with enterprise features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-400" />
                Our Advantages
              </h3>
              <ul className="space-y-4">
                {[
                  'Advanced RBAC with hierarchical roles',
                  'Policy Engine integration (Hansen Security)',
                  'Complete audit logging',
                  'Multi-tenant support',
                  'Enterprise compliance (SOC2, ISO27001, GDPR)',
                  'Modular architecture (extract & sell separately)',
                  'Pre-built components for React, Vue, Svelte',
                  'Plugin system for extensibility'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Rocket className="h-6 w-6 text-blue-400" />
                Better Auth Features
              </h3>
              <ul className="space-y-4">
                {[
                  'Framework-agnostic core',
                  'Simple API (signIn, signUp, signOut)',
                  'Pre-built UI components',
                  'TypeScript-first',
                  'Social sign-on (OAuth)',
                  '2FA support',
                  'Session management',
                  'Plugin ecosystem'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join developers building secure, scalable authentication with Hansen Auth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#get-started"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 shadow-xl"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/hansen-hub"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <Package className="h-5 w-5" />
                <span>View All Modules</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}


