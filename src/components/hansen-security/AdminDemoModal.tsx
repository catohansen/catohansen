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
 * Hansen Security Admin Demo Modal
 * Clean admin dashboard preview - DEMO ONLY - Not connected to real system
 * Marketing/showcase of our security system
 * Popup/iframe style presentation
 */

'use client'

import { useState, useEffect } from 'react'
import { X, Shield, Activity, TrendingUp, CheckCircle2, Settings, FileText, Eye, Lock, Network, Key, AlertTriangle, Database, Zap, Users, BarChart3, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminDemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminDemoModal({ isOpen, onClose }: AdminDemoModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'audit' | 'metrics' | 'security'>('overview')

  // Demo data - NOT connected to real system
  const demoStats = {
    totalPolicies: 45,
    totalChecks: 12450,
    successRate: 99.8,
    auditLogs: 8923,
    avgResponseTime: '<1ms',
    p95Latency: '2ms',
    cacheHitRate: '98.5%',
    activeUsers: 234
  }

  const demoPolicies = [
    { id: 1, name: 'Agency Content Policy', status: 'Active', rules: 12, lastUpdated: '2 hours ago' },
    { id: 2, name: 'Client Management Policy', status: 'Active', rules: 8, lastUpdated: '1 day ago' },
    { id: 3, name: 'Project Access Policy', status: 'Active', rules: 15, lastUpdated: '3 days ago' },
    { id: 4, name: 'Billing Security Policy', status: 'Active', rules: 6, lastUpdated: '1 week ago' }
  ]

  const demoAuditLogs = [
    { id: 1, action: 'Policy Check', user: 'user-123', resource: 'content:post-456', result: 'ALLOW', time: '2 min ago', ip: '192.168.1.1' },
    { id: 2, action: 'Role Assignment', user: 'admin', resource: 'user-789', result: 'ALLOW', time: '15 min ago', ip: '192.168.1.1' },
    { id: 3, action: 'Policy Check', user: 'user-456', resource: 'project:proj-123', result: 'DENY', time: '1 hour ago', ip: '10.0.0.1' },
    { id: 4, action: 'Access Request', user: 'user-789', resource: 'billing:invoice-001', result: 'ALLOW', time: '2 hours ago', ip: '192.168.1.2' }
  ]

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Zero-Trust Architecture',
      description: 'Never trust, always verify. Every request is evaluated independently.',
      status: 'Active',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Lock,
      title: 'Policy-Based Authorization',
      description: 'Define access control policies as code. Version-controlled and auditable.',
      status: 'Active',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Network,
      title: 'RBAC & ABAC Support',
      description: 'Full support for Role-Based and Attribute-Based Access Control.',
      status: 'Active',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Eye,
      title: 'Complete Audit Trail',
      description: 'Immutable audit logs for every authorization decision.',
      status: 'Active',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: AlertTriangle,
      title: 'Anomaly Detection',
      description: 'Real-time detection of suspicious patterns and unauthorized access attempts.',
      status: 'Active',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Authorization evaluation in under 1 millisecond. Cached policies, optimized decision trees.',
      status: 'Active',
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-modal-backdrop"
          />

          {/* Modal - Iframe-style Demo Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 xl:inset-16 z-modal overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Hansen Security Admin - DEMO</h2>
                  <p className="text-sm text-purple-100">Enterprise Authorization System Preview</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Demo Badge */}
            <div className="absolute top-16 right-4 z-modal">
              <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-xs font-semibold">
                DEMO MODE
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10 bg-slate-900/50">
              <div className="flex gap-1 p-2 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'policies', label: 'Policies', icon: FileText },
                  { id: 'audit', label: 'Audit Logs', icon: Eye },
                  { id: 'metrics', label: 'Metrics', icon: TrendingUp },
                  { id: 'security', label: 'Security Features', icon: Shield }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white/10 text-white font-semibold border-b-2 border-purple-500'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area - Iframe-style */}
            <div className="h-[calc(100%-120px)] overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        label: 'Total Policies',
                        value: demoStats.totalPolicies,
                        icon: Shield,
                        color: 'text-purple-400',
                        bgColor: 'bg-purple-500/10 border-purple-500/20'
                      },
                      {
                        label: 'Total Checks',
                        value: demoStats.totalChecks.toLocaleString(),
                        icon: Activity,
                        color: 'text-blue-400',
                        bgColor: 'bg-blue-500/10 border-blue-500/20'
                      },
                      {
                        label: 'Success Rate',
                        value: `${demoStats.successRate}%`,
                        icon: CheckCircle2,
                        color: 'text-green-400',
                        bgColor: 'bg-green-500/10 border-green-500/20'
                      },
                      {
                        label: 'Audit Logs',
                        value: demoStats.auditLogs.toLocaleString(),
                        icon: Eye,
                        color: 'text-orange-400',
                        bgColor: 'bg-orange-500/10 border-orange-500/20'
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${stat.bgColor} border rounded-xl p-6`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Manage Policies', icon: FileText, color: 'text-purple-400' },
                        { label: 'View Audit Logs', icon: Eye, color: 'text-blue-400' },
                        { label: 'Security Settings', icon: Settings, color: 'text-green-400' }
                      ].map((action, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all"
                        >
                          <action.icon className={`w-6 h-6 ${action.color} mb-2`} />
                          <p className="font-medium text-white">{action.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="max-w-7xl mx-auto space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Active Policies</h2>
                    <div className="space-y-3">
                      {demoPolicies.map((policy) => (
                        <div
                          key={policy.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all"
                        >
                          <div>
                            <p className="font-medium text-white">{policy.name}</p>
                            <p className="text-sm text-gray-400">{policy.rules} rules • Updated {policy.lastUpdated}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                            {policy.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="max-w-7xl mx-auto space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Recent Audit Logs</h2>
                    <div className="space-y-3">
                      {demoAuditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-white">{log.action}</p>
                            <p className="text-sm text-gray-400">{log.user} → {log.resource}</p>
                            <p className="text-xs text-gray-500 mt-1">IP: {log.ip}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              log.result === 'ALLOW' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {log.result}
                            </span>
                            <span className="text-sm text-gray-400">{log.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="max-w-7xl mx-auto space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Performance Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Avg Response Time', value: demoStats.avgResponseTime, trend: '+0.2ms', icon: Zap },
                        { label: 'P95 Latency', value: demoStats.p95Latency, trend: '-0.5ms', icon: Clock },
                        { label: 'Cache Hit Rate', value: demoStats.cacheHitRate, trend: '+2.1%', icon: Database }
                      ].map((metric, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <metric.icon className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-400">{metric.label}</p>
                          </div>
                          <p className="text-2xl font-bold text-white">{metric.value}</p>
                          <p className="text-sm text-green-400 mt-1">↗ {metric.trend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="max-w-7xl mx-auto space-y-4">
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-white">
                      <Shield className="w-6 h-6 text-purple-400" />
                      World-Class Security Features
                    </h2>
                    <p className="text-gray-400">
                      Hansen Security provides enterprise-grade security with multiple layers of protection
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {securityFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                      >
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium border border-green-500/30">
                            {feature.status}
                          </span>
                        </div>
                        <p className="text-gray-400">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

