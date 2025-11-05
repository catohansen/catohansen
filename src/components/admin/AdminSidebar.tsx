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
 * Admin Sidebar Navigation
 * Agency-focused navigation with all admin functions
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FileText,
  Users,
  User,
  FolderKanban,
  Briefcase,
  CreditCard,
  BarChart3,
  Bot,
  Settings,
  Shield,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  X,
  Crown,
  Palette,
  Image,
  Search,
  DollarSign,
  TrendingUp,
  Activity,
  Rocket,
  Brain,
  BookOpen,
  Sparkles,
  Network,
  Code2,
  Layers,
  Globe
} from 'lucide-react'

interface MenuItem {
  title: string
  href: string
  icon: any
  badge?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
    badge: 'Hovedside'
  },
  {
    title: 'Site Management',
    href: '/admin/site-management',
    icon: Globe,
    badge: '🎯',
    children: [
      { title: 'All Sites', href: '/admin/site-management', icon: Globe },
      { title: 'Landing Pages', href: '/admin/site-management?type=landing', icon: Home },
      { title: 'Module Pages', href: '/admin/site-management?type=module', icon: Layers },
      { title: 'Project Pages', href: '/admin/site-management?type=project', icon: FolderKanban },
      { title: 'Site Settings', href: '/admin/site-management/settings', icon: Settings }
    ]
  },
  {
    title: 'Content Management',
    href: '/admin/content',
    icon: FileText,
    children: [
      { title: 'Pages', href: '/admin/content/pages', icon: FileText },
      { title: 'Sections', href: '/admin/content/sections', icon: Palette },
      { title: 'Media Library', href: '/admin/content/media', icon: Image },
      { title: 'SEO Manager', href: '/admin/content/seo', icon: Search }
    ]
  },
  {
    title: 'Clients',
    href: '/admin/clients',
    icon: Users,
    children: [
      { title: 'All Clients', href: '/admin/clients', icon: Users },
      { title: 'Add Client', href: '/admin/clients/new', icon: Users },
      { title: 'Pipeline', href: '/admin/clients/pipeline', icon: TrendingUp },
      { title: 'Leads', href: '/admin/clients/leads', icon: Users }
    ]
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderKanban,
    children: [
      { title: 'All Projects', href: '/admin/projects', icon: FolderKanban },
      { title: 'Add Project', href: '/admin/projects/new', icon: FolderKanban },
      { title: 'Project Templates', href: '/admin/projects/templates', icon: FolderKanban }
    ]
  },
  {
    title: 'Portfolio',
    href: '/admin/portfolio',
    icon: Briefcase,
    children: [
      { title: 'Portfolio Items', href: '/admin/portfolio', icon: Briefcase },
      { title: 'Case Studies', href: '/admin/portfolio/cases', icon: Briefcase },
      { title: 'Featured Projects', href: '/admin/portfolio/featured', icon: Crown }
    ]
  },
  {
    title: 'Pricing & Billing',
    href: '/admin/billing',
    icon: CreditCard,
    children: [
      { title: 'Invoices', href: '/admin/billing/invoices', icon: CreditCard },
      { title: 'Payments', href: '/admin/billing/payments', icon: DollarSign },
      { title: 'Revenue Reports', href: '/admin/billing/reports', icon: TrendingUp },
      { title: 'Pricing Calculator', href: '/admin/billing/pricing', icon: CreditCard }
    ]
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      { title: 'Website Analytics', href: '/admin/analytics/website', icon: BarChart3 },
      { title: 'Client Analytics', href: '/admin/analytics/clients', icon: Users },
      { title: 'Revenue Analytics', href: '/admin/analytics/revenue', icon: TrendingUp }
    ]
  },
    {
      title: 'AI & Automation',
      href: '/admin/ai',
      icon: Bot,
      badge: 'AI',
      children: [
        { title: 'Nora Dashboard', href: '/admin/nora/dashboard', icon: Sparkles, badge: '💠' },
        { title: 'Nora Configuration', href: '/admin/nora', icon: Brain, badge: '💠' },
        { title: 'AI Agents', href: '/admin/ai/agents', icon: Bot },
        { title: 'Automation Rules', href: '/admin/ai/automation', icon: Settings },
        { title: 'Content AI', href: '/admin/ai/content', icon: FileText },
        { title: 'Client AI', href: '/admin/ai/clients', icon: Users }
      ]
    },
  {
    title: 'Security 2.0',
    href: '/admin/hansen-security',
    icon: Shield,
    badge: '🔒',
    children: [
      { title: 'Dashboard', href: '/admin/hansen-security', icon: Activity },
      { title: 'Audit Logs', href: '/admin/hansen-security/audit', icon: FileText },
      { title: 'Policies', href: '/admin/hansen-security/policies', icon: Shield },
      { title: 'Metrics', href: '/admin/hansen-security/metrics', icon: TrendingUp }
    ]
  },
  {
    title: 'Knowledge Base',
    href: '/admin/knowledge-base',
    icon: Brain,
    badge: 'AI',
    children: [
      { title: 'Overview', href: '/admin/knowledge-base', icon: BookOpen },
      { title: 'Search', href: '/admin/knowledge-base?tab=search', icon: Search },
      { title: 'AI Assistant', href: '/admin/knowledge-base?tab=assistant', icon: Sparkles },
      { title: 'Documents', href: '/admin/knowledge-base?tab=documents', icon: FileText },
      { title: 'Code Browser', href: '/admin/knowledge-base?tab=code', icon: Code2 },
      { title: 'Architecture', href: '/admin/knowledge-base?tab=architecture', icon: Network },
      { title: 'System Insights', href: '/admin/knowledge-base?tab=insights', icon: Brain }
    ]
  },
  {
    title: 'Modules',
    href: '/admin/modules',
    icon: Code2,
    badge: '📦',
    children: [
      { title: 'Overview', href: '/admin/modules', icon: Code2 },
      { title: 'New Module', href: '/admin/modules/onboarding', icon: Sparkles },
      { title: 'Dependency Graph', href: '/admin/modules/graph', icon: Network },
      { title: 'Sync History', href: '/admin/modules/sync', icon: Activity },
      { title: 'Releases', href: '/admin/modules/releases', icon: Rocket }
    ]
  },
  {
    title: 'Observability',
    href: '/admin/observability',
    icon: Activity,
    badge: '📊',
    children: [
      { title: 'Dashboard', href: '/admin/observability', icon: Activity },
      { title: 'Metrics', href: '/admin/observability', icon: BarChart3 },
      { title: 'Error Tracking', href: '/admin/observability', icon: AlertCircle }
    ]
  },
  {
    title: 'Deploy',
    href: '/admin/deploy',
    icon: Rocket,
    badge: '🚀',
    children: [
      { title: 'Deploy to Production', href: '/admin/deploy', icon: Rocket },
      { title: 'Deployment History', href: '/admin/deploy/history', icon: FileText }
    ]
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    children: [
      { title: 'General Settings', href: '/admin/settings', icon: Settings },
      { title: 'My Profile', href: '/admin/profile', icon: User },
      { title: 'Users & Roles', href: '/admin/settings/users', icon: Users },
      { title: 'Hansen Security Policies', href: '/admin/settings/policies', icon: Shield },
      { title: 'Integrations', href: '/admin/settings/integrations', icon: Settings }
    ]
  }
]

interface AdminSidebarProps {
  isCollapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
  onMobileClose?: () => void
}

export default function AdminSidebar({ 
  isCollapsed: externalCollapsed, 
  onCollapseChange,
  onMobileClose
}: AdminSidebarProps = {}) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed
  const setIsCollapsed = (collapsed: boolean) => {
    if (externalCollapsed !== undefined && onCollapseChange) {
      onCollapseChange(collapsed)
    } else {
      setInternalCollapsed(collapsed)
    }
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const isExpanded = (title: string) => expandedItems.includes(title)

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const expanded = isExpanded(item.title)
    const active = isActive(item.href)

    return (
      <div key={item.title}>
        <div
          className={`
            flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer
            ${active
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'text-gray-700 hover:bg-gray-100'
            }
            ${level > 0 ? 'ml-4 text-sm' : ''}
          `}
          onClick={() => hasChildren && toggleExpanded(item.title)}
        >
          <Link
            href={item.href}
            className="flex items-center space-x-3 flex-1"
            onClick={(e) => !hasChildren && e.stopPropagation()}
          >
            <item.icon className={`h-4 w-4 ${active ? 'text-purple-600' : 'text-gray-500'}`} />
            <span className="font-medium flex-1">{item.title}</span>
            {item.badge && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
          {hasChildren && (
            <div onClick={(e) => e.stopPropagation()}>
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </div>

        {hasChildren && expanded && (
          <div className="ml-4 space-y-1 mt-1 border-l border-gray-200 pl-3">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`
        bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Cato Hansen</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {onMobileClose && (
              <button
                onClick={onMobileClose}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-600"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>🔒 Secure authorization</p>
            <p>⚡ Fast & optimized</p>
            <p>🛡️ Enterprise-grade</p>
            <p>📊 Real-time analytics</p>
          </div>
        </div>
      )}
    </div>
  )
}

