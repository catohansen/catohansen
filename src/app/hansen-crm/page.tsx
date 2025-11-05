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
 * Hansen CRM 2.0 Landing Page
 * Enterprise-grade CRM system with AI-powered insights
 */

'use client'

import { motion } from 'framer-motion'
import { Briefcase, Users, TrendingUp, BarChart3, Zap, Target, Brain, CheckCircle, ArrowRight, Code, Eye, FileText, Shield, Sparkles, Globe, Mail, Phone, Calendar, Database, Network } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function HansenCRMPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300">Enterprise CRM System</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Hansen CRM 2.0
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Verdens beste CRM-system med AI-drevne innsikter, salgsautomatisering og enterprise-grad sikkerhet. Modulær løsning som kan selges som standalone produkt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/hansen-crm/demo"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>View Demo</span>
              </Link>
              
              <Link
                href="/hansen-crm/docs"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <Code className="h-5 w-5" />
                <span>Documentation</span>
              </Link>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Alt du trenger for å administrere kunder, leads og salgsprosesser
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Kontaktstyring',
                description: 'Full oversikt over alle kontakter med 360° customer view. Integrerte kommunikasjonslogger og aktivitetshistorikk.',
                color: 'from-indigo-500 to-indigo-600'
              },
              {
                icon: Target,
                title: 'Lead Management',
                description: 'AI-drevet lead scoring v2 med 9-faktor analyse. Automatisk konvertering av leads til kunder.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: TrendingUp,
                title: 'Sales Pipeline',
                description: 'Kanban-brett med drag & drop. Salgsprognoser og deal value tracking. Flerstadium pipeline-håndtering.',
                color: 'from-pink-500 to-pink-600'
              },
              {
                icon: Brain,
                title: 'AI Insights',
                description: 'AI-drevne innsikter og anbefalinger. Predictive analytics for salgsprognoser og kundeatferd.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Mail,
                title: 'Communication Logger',
                description: 'Automatisk logging av alle kommunikasjoner. Sentimentanalyse og 360° customer view.',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Avansert rapporteringsengine med custom dashboards. Business intelligence og observability.',
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: Zap,
                title: 'Automation Engine',
                description: 'Vår egen automation engine med regel-baserte workflows. Automatisk oppfølging og task management.',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                icon: FileText,
                title: 'Document Management',
                description: 'Sentralisert dokumenthåndtering med versjonskontroll. Automatisk dokumentgenerering.',
                color: 'from-cyan-500 to-cyan-600'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Integrert med Hansen Security. RBAC/PBAC, audit logging og compliance support.',
                color: 'from-red-500 to-red-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Section */}
      <section id="ai-powered" className="py-20 relative z-10 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">AI-Powered</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Intelligent CRM System</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              AI-drevne innsikter som hjelper deg ta bedre beslutninger
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'AI Lead Scoring v2',
                description: 'Avansert 9-faktor lead scoring system. Automatisk prioritering basert på historiske data og predictive analytics.',
                features: ['Demographic Analysis', 'Behavioral Patterns', 'Engagement Score', 'Conversion Probability']
              },
              {
                title: 'Predictive Analytics',
                description: 'Forutsi salgsprognoser og kundeatferd med AI. Anbefalinger basert på machine learning-modeller.',
                features: ['Sales Forecasting', 'Churn Prediction', 'Next Best Action', 'Revenue Optimization']
              },
              {
                title: 'Sentiment Analysis',
                description: 'Automatisk analyse av kundekommunikasjon. Identifiser sentiment og ta proaktive tiltak.',
                features: ['Email Sentiment', 'Communication Tracking', 'Sentiment Trends', 'Alert System']
              },
              {
                title: 'Intelligent Automation',
                description: 'Automatiser repetetive oppgaver med AI. Smart task management og workflow automation.',
                features: ['Auto Follow-ups', 'Task Prioritization', 'Workflow Automation', 'Smart Notifications']
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-2xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <div className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integrations" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Integrer med Hansen-moduler og eksterne tjenester
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, name: 'Hansen Security', color: 'from-red-500 to-red-600' },
              { icon: Users, name: 'User Management', color: 'from-blue-500 to-blue-600' },
              { icon: Mail, name: 'Email Systems', color: 'from-green-500 to-green-600' },
              { icon: Calendar, name: 'Calendar Sync', color: 'from-purple-500 to-purple-600' },
              { icon: Database, name: 'Data Warehouses', color: 'from-orange-500 to-orange-600' },
              { icon: Network, name: 'API Integrations', color: 'from-cyan-500 to-cyan-600' },
              { icon: BarChart3, name: 'Analytics Tools', color: 'from-yellow-500 to-yellow-600' },
              { icon: Globe, name: 'Third-party Apps', color: 'from-pink-500 to-pink-600' }
            ].map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-indigo-500/50 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${integration.color} rounded-lg mb-4`}>
                  <integration.icon className="h-8 w-8 text-white" />
                </div>
                <p className="font-semibold text-white">{integration.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative z-10 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Velg den planen som passer for deg
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free',
                price: '0',
                period: 'måned',
                features: ['Up to 100 clients', 'Basic lead management', 'Pipeline tracking'],
                color: 'from-gray-500 to-gray-600'
              },
              {
                name: 'Starter',
                price: '499',
                period: 'måned',
                features: ['Up to 1,000 clients', 'AI lead scoring', 'Advanced pipeline', 'Communication logs', 'Email support'],
                color: 'from-indigo-500 to-indigo-600',
                popular: true
              },
              {
                name: 'Professional',
                price: '1,999',
                period: 'måned',
                features: ['Unlimited clients', 'AI-powered insights', 'Sales forecasting', 'Advanced analytics', 'Priority support', 'Custom integrations'],
                color: 'from-purple-500 to-purple-600'
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: ['Everything in Professional', 'Multi-tenant support', 'White-label option', 'Dedicated support', 'Custom development', 'SLA guarantee'],
                color: 'from-pink-500 to-pink-600'
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 backdrop-blur-sm border rounded-xl p-6 ${
                  plan.popular
                    ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105'
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg mb-4`}>
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-400 ml-2">NOK/{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
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
              Start using Hansen CRM 2.0 in your application. Installation takes minutes.
            </p>
            
            <div className="bg-slate-800 rounded-lg p-6 text-left mb-8">
              <pre className="text-green-400 overflow-x-auto">
                <code>{`npm install @hansen-crm/sdk

# Or use our API
import { hansenCRM } from '@hansen-crm/sdk'

const client = await hansenCRM.clients.create({
  name: 'Example Client',
  email: 'client@example.com'
})`}</code>
              </pre>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
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

      <Footer />
    </main>
  )
}



