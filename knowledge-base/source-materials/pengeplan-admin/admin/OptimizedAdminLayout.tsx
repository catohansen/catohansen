/**
 * Optimized Admin Layout - Optimalisert layout med lazy loading
 * 
 * Dette er en optimalisert versjon av admin layout som bruker
 * lazy loading og caching for bedre ytelse.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

'use client'

import { Suspense, lazy } from 'react'
import { usePathname } from 'next/navigation'
import { 
  Award, 
  Home, 
  Globe, 
  Activity, 
  Users, 
  Bot, 
  Shield, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Database, 
  Wrench, 
  Mail, 
  Flag, 
  Calculator, 
  FileText, 
  Key, 
  Lock, 
  Heart, 
  TestTube, 
  Zap, 
  Server, 
  Rocket, 
  ChevronDown, 
  ChevronRight, 
  Crown, 
  Eye, 
  Brain, 
  LockKeyhole, 
  Presentation, 
  Cpu, 
  DollarSign, 
  Archive, 
  HardDrive, 
  CheckCircle
} from 'lucide-react'

// Lazy load tunge komponenter
const AdminNavigation = lazy(() => import('@/components/admin/AdminNavigation'))
const AdminCard = lazy(() => import('@/components/admin/AdminCard'))
const AdminKPICard = lazy(() => import('@/components/admin/AdminKPICard'))

interface MenuItem {
  title: string
  href: string
  icon: any
  children?: MenuItem[]
  badge?: string
  apiEndpoint?: string
  description?: string
}

const menuItems: MenuItem[] = [
  {
    title: 'Admin Dashboard',
    href: '/admin',
    icon: Award,
    apiEndpoint: '/api/admin/dashboard',
    description: 'Hovedoversikt over systemstatus og nøkkeltall'
  },
  {
    title: 'Finance Integrity & Observability',
    href: '/admin/finance-monitor',
    icon: Eye,
    badge: 'Ny!',
    description: 'Sanntids overvåking av alle økonomiske prosesser',
    children: [
      { title: 'Finance Monitor', href: '/admin/finance-monitor', icon: BarChart3, apiEndpoint: '/api/admin/finance-monitor', description: 'Detaljert overvåking av finansielle transaksjoner og beregninger' },
      { title: 'Data Flow Visualizer', href: '/admin/dataflow', icon: Activity, apiEndpoint: '/api/admin/dataflow', description: 'Interaktive diagrammer for dataflyt mellom moduler' },
      { title: 'Real-Time Alerts', href: '/admin/alerts', icon: Zap, apiEndpoint: '/api/admin/alerts', description: 'Sanntidsvarsler om kritiske hendelser og avvik' },
      { title: 'Mock Data Scanner', href: '/admin/mock-data-scanner', icon: TestTube, apiEndpoint: '/api/admin/mock-data-scanner', description: 'Automatisk deteksjon og fjerning av testdata' },
      { title: 'Reconciliation Engine', href: '/admin/reconciliation', icon: CheckCircle, apiEndpoint: '/api/admin/reconciliation', description: 'Automatisk validering av regnskapstall' },
    ]
  },
  {
    title: 'Brukere & Tilgang',
    href: '/admin/users',
    icon: Users,
    description: 'Administrer brukere, roller og tilganger',
    children: [
      { title: 'Brukeradministrasjon', href: '/admin/users', icon: Users, apiEndpoint: '/api/admin/users', description: 'Oversikt og administrasjon av alle brukere' },
      { title: 'Roller & Tillatelser', href: '/admin/roles', icon: LockKeyhole, apiEndpoint: '/api/admin/roles', description: 'Definer og administrer brukerroller og tilgangsnivåer' },
      { title: 'Vergeadministrasjon', href: '/admin/verge', icon: Shield, apiEndpoint: '/api/admin/verge', description: 'Administrer verger og deres tilknyttede brukere' }
    ]
  },
  {
    title: 'Smart & Automatisering',
    href: '/admin/ai',
    icon: Bot,
    badge: 'AI',
    description: 'AI-drevet automatisering og smarte systemer',
    children: [
      { title: 'Smart Control Center', href: '/admin/ai', icon: Cpu, apiEndpoint: '/api/admin/ai', description: 'Sentrert kontroll for alle AI-systemer' },
      { title: 'Smart Governance', href: '/admin/ai', icon: Shield, apiEndpoint: '/api/admin/ai', description: 'Styring og overvåking av AI-etikk' },
      { title: 'Smart Instructions', href: '/admin/ai-instructions', icon: FileText, apiEndpoint: '/api/admin/ai-instructions', description: 'Administrer AI-instruksjoner og prompts' },
      { title: 'Smart Configuration', href: '/admin/ai-config', icon: Settings, apiEndpoint: '/api/admin/ai-config', description: 'Konfigurer AI-parametere og innstillinger' },
      { title: 'Hugging Face', href: '/admin/huggingface', icon: Brain, apiEndpoint: '/api/admin/huggingface', description: 'Integrasjon med Hugging Face modeller' },
      { title: 'Smart System Self-Check', href: '/admin/ai', icon: TestTube, apiEndpoint: '/api/admin/ai', description: 'Automatisk system-sjekk og diagnostikk' },
      { title: 'Smart Repair Tasks', href: '/admin/ai-repair-tasks', icon: Wrench, apiEndpoint: '/api/admin/ai-repair-tasks', description: 'Automatiske reparasjonsoppgaver' },
      { title: 'Smart Action Log', href: '/admin/ai-action-log', icon: FileText, apiEndpoint: '/api/admin/ai-action-log', description: 'Logg over alle AI-handlinger' },
      { title: 'Smart System Cards', href: '/admin/ai/system-cards', icon: Eye, apiEndpoint: '/api/admin/ai/system-cards', description: 'Visuell oversikt over AI-systemer' }
    ]
  },
  {
    title: 'Sikkerhet & Compliance',
    href: '/admin/security',
    icon: Shield,
    description: 'Sikkerhet, compliance og GDPR',
    children: [
      { title: 'Sikkerhet', href: '/admin/security', icon: Shield, apiEndpoint: '/api/admin/security', description: 'Sikkerhetsstatus og trusselanalyse' },
      { title: 'RBAC Matrix', href: '/admin/rbac', icon: LockKeyhole, apiEndpoint: '/api/admin/rbac', description: 'Role-Based Access Control matrise' },
      { title: 'Cerbos Policy', href: '/admin/cerbos', icon: Key, apiEndpoint: '/api/admin/cerbos', description: 'Cerbos policy administrasjon' },
      { title: 'GDPR Compliance', href: '/admin/gdpr', icon: Lock, apiEndpoint: '/api/admin/gdpr', description: 'GDPR compliance og datavern' }
    ]
  },
  {
    title: 'Analytics & Telemetri',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Analytics, telemetri og ytelsesdata',
    children: [
      { title: 'Analytics', href: '/admin/analytics', icon: BarChart3, apiEndpoint: '/api/admin/analytics', description: 'Detaljert analytics og brukerstatistikk' },
      { title: 'Performance', href: '/admin/performance', icon: Zap, apiEndpoint: '/api/admin/performance', description: 'Systemytelse og optimalisering' },
      { title: 'Mindmap', href: '/admin/mindmap', icon: Brain, apiEndpoint: '/api/admin/mindmap', description: 'Interaktiv system-mindmap' },
      { title: 'Cross-Platform', href: '/admin/cross-platform', icon: Globe, apiEndpoint: '/api/admin/cross-platform', description: 'Cross-platform analytics og data' },
      { title: 'Real-time Monitoring', href: '/admin/real-time', icon: Activity, apiEndpoint: '/api/admin/real-time', description: 'Sanntids overvåking av systemet' }
    ]
  },
  {
    title: 'Økonomi & Fakturering',
    href: '/admin/billing',
    icon: CreditCard,
    description: 'Økonomi, fakturering og betalinger',
    children: [
      { title: 'Fakturering', href: '/admin/billing', icon: CreditCard, apiEndpoint: '/api/admin/billing', description: 'Fakturering og betalingshåndtering' },
      { title: 'Abonnementer', href: '/admin/subscriptions', icon: DollarSign, apiEndpoint: '/api/admin/subscriptions', description: 'Abonnementsadministrasjon' },
      { title: 'Prisberegner', href: '/admin/pricing-calculator', icon: Calculator, apiEndpoint: '/api/admin/pricing-calculator', description: 'Prisberegning og planer' }
    ]
  },
  {
    title: 'DevOps & QA',
    href: '/admin/devops',
    icon: Server,
    description: 'DevOps, QA og systemadministrasjon',
    children: [
      { title: 'System Status', href: '/admin/system-status', icon: Server, apiEndpoint: '/api/admin/system-status', description: 'Systemstatus og helse' },
      { title: 'Database', href: '/admin/database', icon: Database, apiEndpoint: '/api/admin/database', description: 'Database administrasjon og optimalisering' },
      { title: 'Logging System', href: '/admin/logging-system', icon: FileText, apiEndpoint: '/api/admin/logging-system', description: 'Logging og feilsøking' },
      { title: 'Error Tracking', href: '/admin/error-tracking', icon: TestTube, apiEndpoint: '/api/admin/error-tracking', description: 'Feilsporing og debugging' },
      { title: 'Agents Orchestration', href: '/admin/agents/orchestration', icon: Rocket, apiEndpoint: '/api/admin/agents/orchestration', description: 'Agent-orchestrering og koordinering' }
    ]
  },
  {
    title: 'Content & Kommunikasjon',
    href: '/admin/content',
    icon: Presentation,
    description: 'Innhold, kommunikasjon og markedsføring',
    children: [
      { title: 'Email System', href: '/admin/email', icon: Mail, apiEndpoint: '/api/admin/email', description: 'Email-system og kommunikasjon' },
      { title: 'Content Management', href: '/admin/content', icon: Presentation, apiEndpoint: '/api/admin/content', description: 'Innholdsadministrasjon' },
      { title: 'Help System', href: '/admin/help', icon: Heart, apiEndpoint: '/api/admin/help', description: 'Hjelpesystem og dokumentasjon' }
    ]
  }
]

// Loading component for lazy loaded components
function AdminLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Laster admin-komponenter...</span>
    </div>
  )
}

// Optimized Admin Navigation Component
function OptimizedAdminNavigation() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen p-4 shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Crown className="h-8 w-8 text-yellow-400 mr-2" />
        <h2 className="text-2xl font-bold">Pengeplan Admin</h2>
      </div>
      
      <Suspense fallback={<AdminLoadingFallback />}>
        <AdminNavigation />
      </Suspense>
    </aside>
  )
}

// Main Optimized Admin Layout
export default function OptimizedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Optimized Admin Navigation */}
      <Suspense fallback={<AdminLoadingFallback />}>
        <OptimizedAdminNavigation />
      </Suspense>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <Suspense fallback={<AdminLoadingFallback />}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}

// Export optimized components
export { AdminCard, AdminKPICard, OptimizedAdminNavigation }







