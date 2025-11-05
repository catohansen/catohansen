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
 * Advanced CRM Dashboard
 * World-class CRM dashboard with KPI cards, charts, and widgets
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  TrendingUp, 
  DollarSign,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  Target,
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react'

interface CRMStats {
  clients: {
    total: number
    active: number
    leads: number
    churned: number
    growth: number
  }
  pipelines: {
    total: number
    value: number
    weighted: number
    winRate: number
    forecast: number
  }
  leads: {
    total: number
    new: number
    qualified: number
    converted: number
    conversionRate: number
  }
  emails: {
    sent: number
    opened: number
    clicked: number
    openRate: number
    clickRate: number
  }
  tasks: {
    total: number
    completed: number
    overdue: number
    pending: number
  }
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<CRMStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [clientsRes, pipelinesRes, leadsRes, emailsRes, tasksRes] = await Promise.all([
        fetch('/api/modules/client-management/clients/stats', { credentials: 'include' }),
        fetch('/api/modules/client-management/pipelines/forecast', { credentials: 'include' }),
        fetch('/api/modules/client-management/leads/stats', { credentials: 'include' }),
        fetch('/api/modules/client-management/emails/stats', { credentials: 'include' }),
        fetch('/api/modules/client-management/tasks/stats', { credentials: 'include' })
      ])

      const clients = await clientsRes.json()
      const pipelines = await pipelinesRes.json()
      const leads = await leadsRes.json()
      const emails = await emailsRes.json()
      const tasks = await tasksRes.json()

      setStats({
        clients: clients.data || { total: 0, active: 0, leads: 0, churned: 0, growth: 0 },
        pipelines: pipelines.data || { total: 0, value: 0, weighted: 0, winRate: 0, forecast: 0 },
        leads: leads.data || { total: 0, new: 0, qualified: 0, converted: 0, conversionRate: 0 },
        emails: emails.data || { sent: 0, opened: 0, clicked: 0, openRate: 0, clickRate: 0 },
        tasks: tasks.data || { total: 0, completed: 0, overdue: 0, pending: 0 }
      })
    } catch (error) {
      console.error('Error fetching CRM stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-400">Error loading dashboard</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">CRM Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          title="Total Clients"
          value={stats.clients.total}
          change={stats.clients.growth}
          subtitle={`${stats.clients.active} active`}
          color="blue"
        />
        <KPICard
          icon={DollarSign}
          title="Pipeline Value"
          value={`NOK ${stats.pipelines.value.toLocaleString()}`}
          change={stats.pipelines.winRate}
          subtitle={`${stats.pipelines.total} deals`}
          color="green"
        />
        <KPICard
          icon={Target}
          title="Conversion Rate"
          value={`${stats.leads.conversionRate.toFixed(1)}%`}
          change={stats.leads.converted}
          subtitle={`${stats.leads.converted} converted`}
          color="purple"
        />
        <KPICard
          icon={Mail}
          title="Email Open Rate"
          value={`${stats.emails.openRate.toFixed(1)}%`}
          change={stats.emails.opened}
          subtitle={`${stats.emails.sent} sent`}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetCard title="Pipeline Overview">
          <div className="space-y-4">
            <StatRow label="Total Value" value={`NOK ${stats.pipelines.value.toLocaleString()}`} />
            <StatRow label="Weighted Value" value={`NOK ${stats.pipelines.weighted.toLocaleString()}`} />
            <StatRow label="Win Rate" value={`${stats.pipelines.winRate.toFixed(1)}%`} />
            <StatRow label="Forecast" value={`NOK ${stats.pipelines.forecast.toLocaleString()}`} />
          </div>
        </WidgetCard>

        <WidgetCard title="Lead Status">
          <div className="space-y-4">
            <StatRow label="Total Leads" value={stats.leads.total} />
            <StatRow label="New Leads" value={stats.leads.new} />
            <StatRow label="Qualified" value={stats.leads.qualified} />
            <StatRow label="Converted" value={stats.leads.converted} />
          </div>
        </WidgetCard>
      </div>

      {/* Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WidgetCard title="Email Performance">
          <div className="space-y-4">
            <StatRow label="Sent" value={stats.emails.sent} />
            <StatRow label="Opened" value={stats.emails.opened} />
            <StatRow label="Clicked" value={stats.emails.clicked} />
            <StatRow label="Open Rate" value={`${stats.emails.openRate.toFixed(1)}%`} />
            <StatRow label="Click Rate" value={`${stats.emails.clickRate.toFixed(1)}%`} />
          </div>
        </WidgetCard>

        <WidgetCard title="Task Status">
          <div className="space-y-4">
            <StatRow label="Total Tasks" value={stats.tasks.total} />
            <StatRow label="Completed" value={stats.tasks.completed} />
            <StatRow label="Overdue" value={stats.tasks.overdue} />
            <StatRow 
              label="Completion Rate" 
              value={stats.tasks.total > 0 ? `${((stats.tasks.completed / stats.tasks.total) * 100).toFixed(1)}%` : '0%'} 
            />
          </div>
        </WidgetCard>

        <WidgetCard title="Client Health">
          <div className="space-y-4">
            <StatRow label="Active Clients" value={stats.clients.active} />
            <StatRow label="New Leads" value={stats.clients.leads} />
            <StatRow label="Churned" value={stats.clients.churned} />
            <StatRow 
              label="Growth" 
              value={stats.clients.growth > 0 ? `+${stats.clients.growth}%` : `${stats.clients.growth}%`} 
            />
          </div>
        </WidgetCard>
      </div>
    </div>
  )
}

interface KPICardProps {
  icon: any
  title: string
  value: string | number
  change?: number
  subtitle?: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function KPICard({ icon: Icon, title, value, change, subtitle, color }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    green: 'bg-green-500/20 border-green-500/50 text-green-400',
    purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <div className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-sm text-slate-400">{title}</div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
    </div>
  )
}

interface WidgetCardProps {
  title: string
  children: React.ReactNode
}

function WidgetCard({ title, children }: WidgetCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}

interface StatRowProps {
  label: string
  value: string | number
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}

