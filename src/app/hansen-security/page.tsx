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
 * Hansen Security Landing Page
 * Product page for our own authorization system
 */

'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Zap, Code, Globe, ArrowRight, CheckCircle, Github, Package, Server, HardDrive, Activity, Eye, TrendingUp, Award, AlertTriangle, FileText, Key, Network, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AdminDemoModal from '@/components/hansen-security/AdminDemoModal'
import HansenSecurityPricingCalculator from '@/components/hansen-security/PricingCalculator'

export default function HansenSecurityPage() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      <AdminDemoModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-8 shadow-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Hansen Security
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Enterprise-grade fine-grained authorization system. Zero-trust architecture with policy-based access control, RBAC, ABAC, and battle-tested security.
              <span className="block mt-2 text-lg text-gray-400">
                Built by Cato Hansen Agency - Production-ready authorization engine
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#get-started"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2 shadow-xl"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/hansen-security/docs"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>Documentation</span>
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Code className="h-5 w-5" />
                <span>View Features</span>
              </Link>
              
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>View Admin Demo</span>
              </button>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Hansen Security?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade authorization built for modern applications. Battle-tested security with zero-trust architecture.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: 'Policy-Based Authorization',
                description: 'Define access control policies as code. Version-controlled, declarative, and auditable. Simple YAML/JSON policies.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Lock,
                title: 'RBAC & ABAC Support',
                description: 'Full support for Role-Based and Attribute-Based Access Control. Hierarchical roles, dynamic permissions, and context-aware policies.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Zap,
                title: 'Zero-Latency Evaluation',
                description: 'Built for performance. Evaluate permissions in <1ms. Cached policies, compiled conditions, and optimized decision trees.',
                color: 'from-pink-500 to-pink-600'
              },
              {
                icon: Eye,
                title: 'Complete Audit Trail',
                description: 'Immutable audit logs for every authorization decision. Who, what, when, why. Full compliance and security visibility.',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Network,
                title: 'Zero-Trust Architecture',
                description: 'Never trust, always verify. Every request is evaluated independently. No implicit permissions or inherited trust.',
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: Server,
                title: 'Enterprise-Ready',
                description: 'Horizontal scaling, high availability, distributed policies. Built for production workloads and enterprise scale.',
                color: 'from-cyan-500 to-cyan-600'
              },
              {
                icon: Code,
                title: 'Developer Experience',
                description: 'Simple API, TypeScript-first, comprehensive SDKs. 5-minute setup. Developer-friendly error messages and debugging.',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                icon: Globe,
                title: 'Framework-Agnostic',
                description: 'Works with Next.js, Express, FastAPI, Django, and more. SDKs for Node.js, Python, Go, Rust. Universal compatibility.',
                color: 'from-indigo-500 to-indigo-600'
              },
              {
                icon: HardDrive,
                title: 'Policy Versioning',
                description: 'Version your policies like code. Rollback, A/B testing, gradual rollout. Hot-reload without downtime.',
                color: 'from-red-500 to-red-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Hack Prevention Section */}
      <section id="security" className="py-20 relative z-10 bg-gradient-to-r from-red-900/20 via-orange-900/20 to-yellow-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full mb-6">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">World-Class Security</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built to Prevent Attacks</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hansen Security protects against common authorization vulnerabilities and attack vectors. Enterprise-grade security by design.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: AlertTriangle,
                title: 'Prevents Privilege Escalation',
                description: 'Deny-by-default ensures no accidental permission grants. Explicit allow lists only. Role hierarchies prevent privilege escalation attacks.',
                attack: 'Attack: User modifies role to gain admin access',
                defense: 'Defense: All role changes are audited and verified. Deny-by-default prevents escalation.',
                color: 'from-red-500 to-red-600'
              },
              {
                icon: Lock,
                title: 'Stops Broken Access Control',
                description: 'Every request is evaluated independently. No cached permissions. Context-aware policies check resource ownership.',
                attack: 'Attack: Direct object reference bypass (IDOR)',
                defense: 'Defense: Resource-level checks verify ownership. Attributes validate resource access.',
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: Eye,
                title: 'Detects Unauthorized Access',
                description: 'Complete audit trail logs every access attempt. Anomaly detection identifies suspicious patterns. Real-time alerts for violations.',
                attack: 'Attack: Brute-force permission probing',
                defense: 'Defense: Rate limiting, anomaly detection, and audit logs detect and prevent probing.',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                icon: Network,
                title: 'Zero-Trust Every Request',
                description: 'No implicit trust between services or users. Every API call is verified. No inherited permissions. Always verify, never trust.',
                attack: 'Attack: Token reuse or session hijacking',
                defense: 'Defense: Principal verification on every request. No token reuse. Session validation.',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Key,
                title: 'Policy Injection Protection',
                description: 'Policies are compiled and validated. No dynamic policy execution from user input. Secure policy storage and versioning.',
                attack: 'Attack: Policy injection or manipulation',
                defense: 'Defense: Compiled policies, input validation, and version control prevent injection.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Shield,
                title: 'Defense in Depth',
                description: 'Multiple layers of security. Policy checks, audit logging, anomaly detection, rate limiting, and monitoring. Comprehensive protection.',
                attack: 'Attack: Multi-vector coordinated attack',
                defense: 'Defense: Defense in depth with multiple security layers. One breach doesn\'t compromise the system.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((security, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${security.color} rounded-lg mb-4`}>
                  <security.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{security.title}</h3>
                <p className="text-gray-400 mb-4">{security.description}</p>
                <div className="bg-red-950/50 border border-red-900/50 rounded-lg p-4 mb-3">
                  <p className="text-sm font-semibold text-red-400 mb-1">⚠️ Attack Vector:</p>
                  <p className="text-sm text-red-300">{security.attack}</p>
                </div>
                <div className="bg-green-950/50 border border-green-900/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-400 mb-1">🛡️ Defense:</p>
                  <p className="text-sm text-green-300">{security.defense}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative z-10 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Pricing</h2>
            <p className="text-xl text-gray-400">Choose the plan that fits your needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '0',
                period: 'forever',
                features: [
                  'Basic RBAC',
                  'Up to 100 policies',
                  'Community support',
                  'MIT License'
                ],
                highlighted: false
              },
              {
                name: 'Starter',
                price: '499',
                period: 'month',
                currency: 'NOK',
                features: [
                  'Full RBAC',
                  'ABAC support',
                  'Up to 1,000 policies',
                  'Email support',
                  'Priority updates'
                ],
                highlighted: true
              },
              {
                name: 'Professional',
                price: '1,999',
                period: 'month',
                currency: 'NOK',
                features: [
                  'Full RBAC & ABAC',
                  'Unlimited policies',
                  'Audit logging',
                  'Priority support',
                  'Custom integrations',
                  'SLA guarantee'
                ],
                highlighted: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 backdrop-blur-sm border rounded-xl p-8 ${
                  plan.highlighted
                    ? 'border-purple-500 border-2 bg-gradient-to-br from-purple-900/20 to-blue-900/20'
                    : 'border-white/10'
                }`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {plan.price === '0' ? 'Free' : `${plan.currency || 'NOK'} ${plan.price}`}
                    </span>
                    {plan.price !== '0' && (
                      <span className="text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#get-started"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section id="pricing-calculator" className="py-20 relative z-10 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Pris- & Tidskalkulator</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Beregn pris og estimert tid for Hansen Security og andre moduler. Inkluderer open source deler.
            </p>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
            <HansenSecurityPricingCalculator />
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Started Today</h2>
            <p className="text-xl text-gray-400 mb-8">
              Start using Hansen Security in your application. Installation takes minutes.
            </p>
            
            <div className="bg-slate-800 rounded-lg p-6 text-left mb-8">
              <pre className="text-green-400 overflow-x-auto">
                <code>{`npm install @hansen-security/sdk

# Or use our API
import { hansenSecurity } from '@hansen-security/sdk'

const result = await hansenSecurity.check(
  principal,
  resource,
  'write'
)`}</code>
              </pre>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>Contact Sales</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/hansen-hub"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <Code className="h-5 w-5" />
                <span>View All Modules</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section - Why Better */}
      <section id="comparison" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Hansen Security?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built by system architects, for system architects. Enterprise-grade security with developer experience in mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Performance',
                metric: '<1ms',
                description: 'Authorization evaluation in under 1 millisecond. Cached policies, compiled conditions, optimized decision trees.',
                icon: Zap,
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                title: 'Security',
                metric: 'Zero-Trust',
                description: 'Never trust, always verify. Every request evaluated independently. Defense in depth with multiple security layers.',
                icon: Shield,
                color: 'from-red-500 to-red-600'
              },
              {
                title: 'Observability',
                metric: '100%',
                description: 'Complete audit trail for every decision. Real-time metrics, anomaly detection, and comprehensive logging.',
                icon: Activity,
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Developer Experience',
                metric: '5 min',
                description: 'Get started in 5 minutes. Simple API, TypeScript-first, comprehensive documentation. Developer-friendly error messages.',
                icon: Code,
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'Scalability',
                metric: 'Unlimited',
                description: 'Horizontal scaling, distributed policies, high availability. Built for enterprise scale and production workloads.',
                icon: TrendingUp,
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: 'Compliance',
                metric: 'ISO 27001',
                description: 'Compliance-ready with ISO 27001 policies. GDPR-compliant audit logs. SOC 2 Type II ready architecture.',
                icon: Award,
                color: 'from-orange-500 to-orange-600'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl mb-4 mx-auto`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.metric}
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
                <p className="text-gray-400 text-sm">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full mb-6">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Built by Elite System Architects</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built by Cato Hansen Agency
            </h2>
            <p className="text-xl text-gray-300 mb-4">
              We use Hansen Security in our own production systems. Trusted, battle-tested, and ready for your application.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Elite system architects from Drøbak, Norge. Enterprise-grade security, production-ready code, zero compromises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-xl"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/admin/hansen-security"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                <Eye className="h-5 w-5" />
                <span>View Admin Panel</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}




