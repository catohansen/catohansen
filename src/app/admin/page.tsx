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
 * Admin Dashboard
 * Main dashboard with KPIs, quick actions, and recent activity
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FolderKanban, 
  DollarSign, 
  TrendingUp, 
  Plus,
  FileText,
  Briefcase,
  Activity,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import AdminKPICard from '@/components/admin/AdminKPICard'
import Link from 'next/link'

interface DashboardStats {
  totalClients: number
  activeProjects: number
  revenue: number
  pendingInvoices: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeProjects: 0,
    revenue: 0,
    pendingInvoices: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats({
            totalClients: data.data.totalClients || 0,
            activeProjects: data.data.activeProjects || 0,
            revenue: data.data.revenue || 0,
            pendingInvoices: data.data.pendingInvoices || 0
          })
        } else {
          // Fallback to 0 if API returns error
          setStats({
            totalClients: 0,
            activeProjects: 0,
            revenue: 0,
            pendingInvoices: 0
          })
        }
      } else {
        // Fallback to 0 if API fails
        setStats({
          totalClients: 0,
          activeProjects: 0,
          revenue: 0,
          pendingInvoices: 0
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Fallback to 0 on error
      setStats({
        totalClients: 0,
        activeProjects: 0,
        revenue: 0,
        pendingInvoices: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Add Client',
      icon: Users,
      href: '/admin/clients',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Create Project',
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'New Invoice',
      icon: FileText,
      href: '/admin/billing',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Add Portfolio Item',
      icon: Briefcase,
      href: '/admin/portfolio',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Activity className="w-8 h-8 text-purple-600" />
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/clients">
          <AdminKPICard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
            color="from-blue-500 to-cyan-500"
          />
        </Link>
        <Link href="/admin/projects">
          <AdminKPICard
            title="Active Projects"
            value={stats.activeProjects}
            icon={FolderKanban}
            color="from-purple-500 to-pink-500"
          />
        </Link>
        <Link href="/admin/billing">
          <AdminKPICard
            title="Revenue"
            value={`NOK ${stats.revenue.toLocaleString()}`}
            icon={DollarSign}
            color="from-green-500 to-emerald-500"
          />
        </Link>
        <Link href="/admin/billing">
          <AdminKPICard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={FileText}
            color="from-orange-500 to-red-500"
          />
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="relative">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">Security System</span>
              </div>
              <span className="text-sm text-orange-600 font-medium">Development Mode (AV)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Hansen Security</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">User Management</span>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <span className="text-sm text-yellow-600 font-medium">Setup Required</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">No recent activity yet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="glass rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Welcome to Admin Panel!</h3>
            <p className="text-gray-600 mb-4">
              You&apos;re logged in as <strong>OWNER</strong> with full system access. 
              Start by exploring the modules in the sidebar or create your first client/project.
            </p>
            <div className="flex gap-3">
              <Link
                href="/admin/profile"
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Profile
              </Link>
              <Link
                href="/admin/hansen-security"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Hansen Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
