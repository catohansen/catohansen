/**
 * Enhanced Admin Navigation - Komplett meny med alle backend funksjoner
 * 
 * Dette er en oppgradert admin navigasjon som viser alle tilgjengelige
 * sider og backend funksjoner i en organisert struktur.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronDown, 
  ChevronRight,
  Home,
  Users,
  Shield,
  BarChart3,
  Bot,
  Settings,
  Database,
  Activity,
  CreditCard,
  FileText,
  Key,
  Lock,
  Eye,
  Zap,
  Server,
  Crown,
  Globe,
  Calculator,
  DollarSign,
  TestTube,
  Wrench,
  Mail,
  Flag,
  Building2,
  Network,
  BookOpen,
  Award,
  Brain,
  LockKeyhole,
  Presentation,
  Cpu,
  Archive,
  HardDrive,
  AlertTriangle,
  Send,
  Heart,
  Rocket,
  CheckCircle
} from 'lucide-react'

interface MenuItem {
  title: string
  href: string
  icon: any
  badge?: string
  children?: MenuItem[]
  description?: string
  apiEndpoint?: string
}

const adminMenuItems: MenuItem[] = [
  {
    title: 'Admin Dashboard',
    href: '/admin',
    icon: Home,
    description: 'Hoveddashboard med live metrics',
    apiEndpoint: '/api/admin/dashboard'
  },
  {
    title: 'Super Admin',
    href: '/admin/super',
    icon: Crown,
    description: 'Super admin kontrollpanel',
    apiEndpoint: '/api/admin/system/stats'
  },
  {
    title: 'Brukere & Tilgang',
    href: '/admin/users',
    icon: Users,
    description: 'Brukeradministrasjon og roller',
    apiEndpoint: '/api/admin/users',
    children: [
      {
        title: 'Alle Brukere',
        href: '/admin/users',
        icon: Users,
        apiEndpoint: '/api/admin/users'
      },
      {
        title: 'Roller & Tillatelser',
        href: '/admin/roles',
        icon: LockKeyhole,
        apiEndpoint: '/api/admin/roles'
      },
      {
        title: 'Vergeadministrasjon',
        href: '/admin/verge',
        icon: Shield,
        apiEndpoint: '/api/admin/verge'
      }
    ]
  },
  {
    title: 'Finance Integrity & Observability',
    href: '/admin/finance-monitor',
    icon: BarChart3,
    description: 'Sanntids overvåking av økonomiske prosesser',
    badge: 'Ny!',
    children: [
      {
        title: 'Finance Monitor',
        href: '/admin/finance-monitor',
        icon: BarChart3,
        apiEndpoint: '/api/admin/finance-monitor'
      },
      {
        title: 'Data Flow Visualizer',
        href: '/admin/dataflow',
        icon: Activity,
        apiEndpoint: '/api/admin/dataflow'
      },
      {
        title: 'Real-Time Alerts',
        href: '/admin/alerts',
        icon: AlertTriangle,
        apiEndpoint: '/api/admin/alerts'
      },
      {
        title: 'Mock Data Scanner',
        href: '/admin/mock-data-scanner',
        icon: Shield,
        apiEndpoint: '/api/admin/mock-data-scanner'
      },
      {
        title: 'Reconciliation Engine',
        href: '/admin/reconciliation',
        icon: CheckCircle,
        apiEndpoint: '/api/admin/reconciliation'
      }
    ]
  },
  {
    title: 'AI & Automatisering',
    href: '/admin/ai',
    icon: Bot,
    description: 'AI-kontroll og automatisering',
    badge: 'AI',
    children: [
      {
        title: 'AI Control Center',
        href: '/admin/ai',
        icon: Cpu,
        apiEndpoint: '/api/admin/ai/status'
      },
      {
        title: 'AI Governance',
        href: '/admin/ai/governance',
        icon: Shield,
        apiEndpoint: '/api/admin/ai/governance'
      },
      {
        title: 'AI Actions',
        href: '/admin/ai/actions',
        icon: Zap,
        apiEndpoint: '/api/admin/ai/actions'
      },
      {
        title: 'AI Chat',
        href: '/admin/ai-chat',
        icon: Bot,
        apiEndpoint: '/api/admin/ai-chat'
      },
    ]
  },
  {
    title: 'Sikkerhet & Compliance',
    href: '/admin/security',
    icon: Shield,
    description: 'Sikkerhet og compliance',
    children: [
      {
        title: 'Sikkerhetsoversikt',
        href: '/admin/security',
        icon: LockKeyhole,
        apiEndpoint: '/api/admin/security'
      },
      {
        title: 'GDPR Dashboard',
        href: '/admin/gdpr',
        icon: FileText,
        apiEndpoint: '/api/admin/gdpr'
      },
      {
        title: 'Audit Trail',
        href: '/admin/audit',
        icon: Activity,
        apiEndpoint: '/api/admin/audit'
      },
      {
        title: 'Cerbos Policies',
        href: '/admin/cerbos',
        icon: Lock,
        apiEndpoint: '/api/admin/cerbos'
      }
    ]
  },
  {
    title: 'Analytics & Telemetri',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Analytics og systemtelemetri',
    children: [
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
        apiEndpoint: '/api/admin/analytics'
      },
      {
        title: 'Advanced Analytics',
        href: '/admin/advanced-analytics',
        icon: BarChart3,
        apiEndpoint: '/api/admin/advanced-analytics'
      },
      {
        title: 'Cross-Platform Analytics',
        href: '/admin/cross-platform',
        icon: Globe,
        apiEndpoint: '/api/admin/cross-platform'
      },
      {
        title: 'Churn Analysis',
        href: '/admin/churn',
        icon: Users,
        apiEndpoint: '/api/admin/churn'
      },
      {
        title: 'Nudging Analytics',
        href: '/admin/nudging',
        icon: Heart,
        apiEndpoint: '/api/admin/nudging'
      }
    ]
  },
  {
    title: 'Økonomi & Fakturering',
    href: '/admin/billing',
    icon: CreditCard,
    description: 'Økonomi og fakturering',
    children: [
      {
        title: 'Fakturaoversikt',
        href: '/admin/billing',
        icon: CreditCard,
        apiEndpoint: '/api/admin/billing'
      },
      {
        title: 'Kontantstrøm',
        href: '/admin/kontantstrøm',
        icon: DollarSign,
        apiEndpoint: '/api/admin/kontantstrøm'
      },
      {
        title: 'Prisingskalkulator',
        href: '/admin/pricing-calculator',
        icon: Calculator,
        apiEndpoint: '/api/admin/pricing-calculator'
      }
    ]
  },
  {
    title: 'Drift & DevOps',
    href: '/admin/ops',
    icon: Server,
    description: 'Drift og DevOps',
    children: [
      {
        title: 'System Status',
        href: '/admin/system-status',
        icon: Activity,
        apiEndpoint: '/api/admin/system-status'
      },
      {
        title: 'Real-time Monitoring',
        href: '/admin/real-time',
        icon: Activity,
        apiEndpoint: '/api/admin/real-time'
      },
      {
        title: 'Storage Monitoring',
        href: '/admin/storage-monitoring',
        icon: HardDrive,
        apiEndpoint: '/api/admin/storage-monitoring'
      },
      {
        title: 'Backup Overview',
        href: '/admin/backup-overview',
        icon: Archive,
        apiEndpoint: '/api/admin/backup-overview'
      }
    ]
  },
  {
    title: 'QA & Testing',
    href: '/admin/testing-center',
    icon: TestTube,
    description: 'Kvalitetssikring og testing',
    children: [
      {
        title: 'Testing Center',
        href: '/admin/testing-center',
        icon: TestTube,
        apiEndpoint: '/api/admin/testing-center'
      },
      {
        title: 'Review Checklist',
        href: '/admin/review-checklist',
        icon: FileText,
        apiEndpoint: '/api/admin/review-checklist'
      }
    ]
  },
  {
    title: 'Innhold & Kommunikasjon',
    href: '/admin/content',
    icon: FileText,
    description: 'Innhold og kommunikasjon',
    children: [
      {
        title: 'Content Management',
        href: '/admin/content',
        icon: FileText,
        apiEndpoint: '/api/admin/content'
      },
      {
        title: 'Email Templates',
        href: '/admin/email-templates',
        icon: Mail,
        apiEndpoint: '/api/admin/email-templates'
      },
      {
        title: 'Waitlist Management',
        href: '/admin/waitlist',
        icon: Users,
        apiEndpoint: '/api/admin/waitlist'
      }
    ]
  },
  {
    title: 'Owner Panel',
    href: '/admin/owner',
    icon: Crown,
    description: 'Eierkontrollpanel',
    children: [
      {
        title: 'Owner Dashboard',
        href: '/admin/owner',
        icon: Crown,
        apiEndpoint: '/api/admin/owner'
      },
      {
        title: 'Emergency Access',
        href: '/admin/owner/emergency',
        icon: AlertTriangle,
        apiEndpoint: '/api/admin/owner/emergency'
      },
      {
        title: 'System Control',
        href: '/admin/owner/system',
        icon: Server,
        apiEndpoint: '/api/admin/owner/system'
      }
    ]
  }
]

interface AdminNavigationProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function AdminNavigation({ isCollapsed = false, onToggle }: AdminNavigationProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

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

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const active = isActive(item.href)

    return (
      <div key={item.title}>
        <Link
          href={item.href}
          className={`
            flex items-center justify-between px-3 py-2 rounded-lg transition-colors
            ${active 
              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
              : 'text-gray-700 hover:bg-gray-100'
            }
            ${level > 0 ? 'ml-4 text-sm' : ''}
          `}
          onClick={() => hasChildren && toggleExpanded(item.title)}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`h-4 w-4 ${active ? 'text-purple-600' : 'text-gray-500'}`} />
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Link>
        
        {item.description && (
          <p className="text-xs text-gray-500 ml-7 mt-1 mb-2">
            {item.description}
          </p>
        )}
        
        {item.apiEndpoint && (
          <p className="text-xs text-gray-400 ml-7 mb-2 font-mono">
            API: {item.apiEndpoint}
          </p>
        )}

        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white border-r border-gray-200 ${isCollapsed ? 'w-16' : 'w-80'} transition-all duration-300`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Crown className="h-6 w-6 text-purple-600" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">Pengeplan 2.0</h1>
              <p className="text-sm text-gray-500">Admin System</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 overflow-y-auto max-h-screen">
        {adminMenuItems.map(item => renderMenuItem(item))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>🔒 Sikker autentisering</p>
          <p>⚡ Hurtig caching</p>
          <p>🛡️ Super admin bypass</p>
          <p>📊 Live monitoring</p>
        </div>
      </div>
    </div>
  )
}