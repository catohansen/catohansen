'use client'

import '../globals.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { 
  BarChart3, 
  Bot, 
  Shield, 
  Users, 
  Settings, 
  Database, 
  Wrench, 
  Mail, 
  Flag, 
  CreditCard, 
  Globe,
  Calculator, 
  FileText, 
  Key, 
  Activity, 
  Lock, 
  Heart, 
  TestTube, 
  Zap,
  Server,
  Rocket,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Home,
  AlertTriangle,
  Send,
  Building2,
  Network,
  BookOpen,
  Award,
  Eye,
  Brain,
  LockKeyhole,
  Presentation,
  Cpu,
  DollarSign,
  Crown
} from 'lucide-react'

// Utility function for class names
function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ')
}
// Removed non-existent components

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<any>
  children?: MenuItem[]
  badge?: string
}

const menuItems: MenuItem[] = [
  {
    title: 'Executive Dashboard',
    href: '/admin',
    icon: Award,
    badge: 'Hovedside'
  },
  {
    title: 'Legacy Dashboard',
    href: '/admin/legacy-dashboard',
    icon: Home
  },
  {
    title: 'Cross-Platform Analytics',
    href: '/admin/cross-platform',
    icon: Globe,
    badge: 'Ny!'
  },
  {
    title: 'Real-time Monitoring',
    href: '/admin/real-time',
    icon: Activity,
    badge: 'Ny!'
  },
  {
    title: 'Brukere & Tilgang',
    href: '/admin/users',
    icon: Users,
    children: [
      { title: 'Brukeradministrasjon', href: '/admin/users', icon: Users },
      { title: 'Roller & Tillatelser', href: '/admin/roles', icon: LockKeyhole },
      { title: 'Vergeadministrasjon', href: '/admin/verge', icon: Shield }
    ]
  },
  {
    title: 'AI & Automatisering',
    href: '/admin/ai-master-dashboard',
    icon: Bot,
    badge: 'AI',
    children: [
      { title: 'AI Master Dashboard', href: '/admin/ai-master-dashboard', icon: Brain, badge: 'MASTER' },
      { title: 'AI Optimization Center', href: '/admin/ai-optimization', icon: Zap, badge: 'Ny!' },
      { title: 'AI Autopilot Center', href: '/admin/ai-autopilot', icon: Bot, badge: 'AUTOPILOT' },
      { title: 'AI Control Center', href: '/admin/ai-control-center', icon: Cpu },
      { title: 'AI Governance', href: '/admin/ai', icon: Shield },
      { title: 'AI Instructions', href: '/admin/ai-instructions', icon: FileText },
      { title: 'AI Configuration', href: '/admin/ai-config', icon: Settings, badge: 'Ny!' },
      { title: 'Hugging Face', href: '/admin/huggingface', icon: Brain, badge: 'Ny!' },
      { title: 'AI System Self-Check', href: '/admin/ai-system-check', icon: TestTube },
      { title: 'AI Repair Tasks', href: '/admin/ai-repair-tasks', icon: Wrench },
      { title: 'AI Action Log', href: '/admin/ai-action-log', icon: FileText },
      { title: 'AI System Cards', href: '/admin/ai/system-cards', icon: Eye }
    ]
  },
  {
    title: 'Sikkerhet & Compliance',
    href: '/admin/security',
    icon: Shield,
    children: [
      { title: 'Sikkerhetsoversikt', href: '/admin/security', icon: LockKeyhole },
      { title: 'Zero Trust Security', href: '/admin/zero-trust-security', icon: Shield, badge: 'Ny!' },
      { title: 'GDPR-håndtering', href: '/admin/gdpr', icon: FileText },
      { title: 'Audit Log', href: '/admin/events', icon: Activity },
      { title: 'Cerbos Policies', href: '/admin/cerbos', icon: LockKeyhole }
    ]
  },
  {
    title: 'Owner Panel',
    href: '/admin/owner',
    icon: Crown,
    children: [
      { title: 'Owner Dashboard', href: '/admin/owner', icon: Crown },
      { title: 'Emergency Access', href: '/admin/owner/emergency', icon: AlertTriangle },
      { title: 'System Control', href: '/admin/owner/system', icon: Server },
      { title: 'Owner Settings', href: '/admin/owner/settings', icon: Settings }
    ]
  },
  {
    title: 'Analytics & Telemetri',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { title: 'Tech Snapshot', href: '/admin/system/snapshot', icon: Activity, badge: 'INVESTOR' },
      { title: 'A/B Testing', href: '/admin/ab-testing', icon: TestTube, badge: 'NEW' },
      { title: 'Mobile Monitoring', href: '/admin/mobile-monitoring', icon: Smartphone, badge: 'NEW' },
      { title: 'Ytelse', href: '/admin/performance', icon: Zap, badge: 'Ny!' },
      { title: 'Systemhelse', href: '/admin/system-health', icon: Heart },
      { title: 'Observability', href: '/admin/observability', icon: Eye },
      { title: 'User Flow', href: '/admin/userflow', icon: Users },
      { title: 'Bills Analytics', href: '/admin/bills-analytics', icon: CreditCard }
    ]
  },
  {
    title: 'Økonomi & Fakturering',
    href: '/admin/billing',
    icon: CreditCard,
    children: [
      { title: 'Fakturaoversikt', href: '/admin/billing', icon: CreditCard },
      { title: 'Kontantstrøm', href: '/admin/kontantstrøm', icon: DollarSign },
      { title: 'Prisingskalkulator', href: '/admin/pricing-calculator', icon: Calculator, badge: 'Ny!' }
    ]
  },
  {
    title: 'Drift & DevOps',
    href: '/admin/ops',
    icon: Rocket,
    children: [
      { title: 'Deployment', href: '/admin/deployment', icon: Rocket },
      { title: 'Backup', href: '/admin/backup', icon: Database },
      { title: 'Systemhelse', href: '/admin/system-health', icon: Heart }
    ]
  },
  {
    title: 'QA & Testing',
    href: '/admin/testing-center',
    icon: TestTube,
    children: [
      { title: 'Testoversikt', href: '/admin/testing-center', icon: TestTube },
      { title: 'QA Dashboard', href: '/admin/qa', icon: BarChart3 },
      { title: 'Spill-modus', href: '/admin/gamification', icon: Award, badge: 'Ny!' }
    ]
  },
  {
    title: 'Innhold & Kommunikasjon',
    href: '/admin/content',
    icon: BookOpen,
    children: [
      { title: 'Kunnskapsbase', href: '/admin/kunnskapsbase', icon: BookOpen },
      { title: 'Email Management', href: '/admin/email', icon: Mail },
      { title: 'Data Management', href: '/admin/data', icon: Database }
    ]
  },
  {
    title: 'NAV Integrasjon',
    href: '/admin/nav-integration',
    icon: Building2
  },
  {
    title: 'System & Settings',
    href: '/admin/system-settings',
    icon: Settings,
    children: [
      { title: 'System Configuration', href: '/admin/system-settings', icon: Settings },
      { title: 'Translation Panel', href: '/admin/translations', icon: Globe, badge: 'Enhanced!' },
      { title: 'Language Management', href: '/admin/language-settings', icon: Flag, badge: 'New!' }
    ]
  }
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Auto-expand active menu sections
  useEffect(() => {
    const activeParent = menuItems.find(item => 
      item.children?.some(child => isActive(child.href))
    )
    if (activeParent && !expandedItems.includes(activeParent.title)) {
      setExpandedItems(prev => [...prev, activeParent.title])
    }
  }, [pathname])

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

  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-sm border-r border-white/20 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">Pengeplan Admin</h1>
              <p className="text-sm text-gray-600">Systemstyring</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.title} className="space-y-1">
            {/* Main menu item */}
            <div className="flex items-center group">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1",
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
              
              {/* Expand/collapse button for submenus */}
              {item.children && !isCollapsed && (
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "p-1.5 hover:bg-gray-200 rounded transition-colors ml-1",
                    isExpanded(item.title) ? "bg-gray-100" : ""
                  )}
                  type="button"
                  aria-label={`Toggle ${item.title} submenu`}
                >
                  {isExpanded(item.title) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
            </div>

            {/* Submenu */}
            {item.children && !isCollapsed && isExpanded(item.title) && (
              <div className="ml-7 space-y-1 border-l border-gray-200 pl-3">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive(child.href)
                        ? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    )}
                  >
                    <child.icon className="h-3 w-3 flex-shrink-0" />
                    <span className="flex-1">{child.title}</span>
                    {child.badge && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                        {child.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

function TopMenu({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [gamificationEnabled, setGamificationEnabled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 5) {
        setIsScrolled(false)
      } 
      // Hide header when scrolling down - much earlier!
      else if (currentScrollY > lastScrollY && currentScrollY > 20) {
        setIsScrolled(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    // Use window scroll for better detection
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Load gamification state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin_gamification_enabled')
    if (saved !== null) {
      setGamificationEnabled(saved === 'true')
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications || showProfile) {
        const target = event.target as Element
        if (!target.closest('.relative')) {
          setShowNotifications(false)
          setShowProfile(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications, showProfile])

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Clear any local state
        setShowProfile(false)
        setShowNotifications(false)
        
        // Redirect to admin login page
        window.location.href = '/admin-login'
      } else {
        console.error('Logout failed')
        // Still redirect to admin login page even if logout API fails
        window.location.href = '/admin-login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect to admin login page even if logout fails
      window.location.href = '/admin-login'
    }
  }

  return (
    <header className={`fixed top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4 transition-transform duration-300 ease-in-out ${
      isScrolled ? '-translate-y-full' : 'translate-y-0'
    }`} style={{
      left: sidebarCollapsed ? '64px' : '256px', // Collapsed: 64px, Expanded: 256px
      right: '0px'
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Pengeplan Admin</h1>
              <p className="text-sm text-gray-600">System Administration</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar - wired to /api/search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Søk i admin..."
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const val = e.currentTarget.value
                ;(async () => {
                  if (val.trim().length < 2) {
                    (window as any).__adminSearch = []
                    document.getElementById('admin-search-dd')?.classList.add('hidden')
                    return
                  }
                  const r = await fetch(`/api/search?q=${encodeURIComponent(val)}`)
                  const d = await r.json()
                  ;(window as any).__adminSearch = d.results || []
                  document.getElementById('admin-search-dd')?.classList.remove('hidden')
                  const list = document.getElementById('admin-search-list')
                  if (list) list.innerHTML = (d.results || []).map((x:any) => `<a class='block px-3 py-2 hover:bg-gray-50 text-sm' href='${x.url || '#'}'>${x.title}</a>`).join('')
                })()
              }}
              onFocus={() => document.getElementById('admin-search-dd')?.classList.remove('hidden')}
            />
            <button
              onClick={async () => {
                // simple voice search for admin
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                const chunks: BlobPart[] = [];
                recorder.ondataavailable = (e) => chunks.push(e.data);
                recorder.onstop = async () => {
                  const blob = new Blob(chunks, { type: 'audio/webm' });
                  const fd = new FormData(); fd.append('audio', blob, 'voice.webm');
                  const r = await fetch('/api/voice/search', { method: 'POST', body: fd });
                  const d = await r.json();
                  (window as any).__adminSearch = d.results || []
                  document.getElementById('admin-search-dd')?.classList.remove('hidden')
                  const list = document.getElementById('admin-search-list')
                  if (list) list.innerHTML = (d.results || []).map((x:any) => `<a class='block px-3 py-2 hover:bg-gray-50 text-sm' href='${x.url || '#'}'>${x.title}</a>`).join('')
                };
                recorder.start(); setTimeout(()=>recorder.stop(), 2500);
              }}
              className="absolute inset-y-0 right-7 my-auto p-1 rounded-full hover:bg-gray-100"
              title="Stemme-søk"
            >
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v1a7 7 0 11-14 0v-1M12 19v4m-4 0h8"/></svg>
            </button>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div id="admin-search-dd" className="hidden absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="p-2 text-xs text-gray-500 border-b">Søkeresultater</div>
              <div id="admin-search-list" className="max-h-80 overflow-y-auto" />
            </div>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Varsler</h3>
                  <p className="text-sm text-gray-600">Du har 3 nye varsler</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">System oppdatert</p>
                        <p className="text-sm text-gray-600">Pengeplan 2.0 er oppdatert til versjon 2.4.2</p>
                        <p className="text-xs text-gray-500 mt-1">2 minutter siden</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Sikkerhetstest fullført</p>
                        <p className="text-sm text-gray-600">Alle sikkerhetstester er bestått</p>
                        <p className="text-xs text-gray-500 mt-1">15 minutter siden</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">AI-system optimalisert</p>
                        <p className="text-sm text-gray-600">AI-ytelse forbedret med 15%</p>
                        <p className="text-xs text-gray-500 mt-1">1 time siden</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Se alle varsler
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
              <span className="text-sm font-medium">Admin</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin Bruker</p>
                      <p className="text-sm text-gray-600">admin@pengeplan.no</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <a href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Min profil
                  </a>
                  <a href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Innstillinger
                  </a>
                  <a href="/admin/security" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sikkerhet
                  </a>
                  <a href="/admin/help" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Hjelp & Support
                  </a>
                  
                  {/* Gamification Toggle */}
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Spill-modus</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={gamificationEnabled}
                        onChange={(e) => {
                          setGamificationEnabled(e.target.checked)
                          // Store in localStorage for persistence
                          localStorage.setItem('admin_gamification_enabled', e.target.checked.toString())
                          // Reload page to apply changes
                          window.location.reload()
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logg ut
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { t } = useLanguage()

    return (
    <div className="flex h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 relative">
      {/* Global Language Selector - Top Right */}
      <LanguageSelector position="top-right" />
      
      {/* Static background - Performance optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left side static bubbles */}
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-45"></div>
        
        {/* Right side static bubbles */}
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>

      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopMenu sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-auto p-6 pt-28">
          {children}
        </main>
      </div>
      
      {/* Floating Admin Tour removed */}
    </div>
  )
}