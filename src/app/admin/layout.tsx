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
 * Admin Layout
 * Main layout for admin panel with sidebar and top menu
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopMenu from '@/components/admin/AdminTopMenu'
import CommandPalette from '@/components/admin/CommandPalette'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
        setMobileMenuOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // CRITICAL SECURITY: Skip auth check for login and forgot-password pages
    if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
      setLoading(false)
      setIsAuthenticated(false) // Don't set authenticated for login page
      return
    }

    // Check authentication on client side
    const checkAuth = async () => {
      // DEVELOPMENT MODE: Check if security is disabled
      try {
        const settingsResponse = await fetch('/api/modules/hansen-security/settings', {
          credentials: 'include'
        })
        if (settingsResponse.ok) {
          const { settings } = await settingsResponse.json()
          if (!settings.securityEnabled && process.env.NODE_ENV === 'development') {
            console.log('🔓 Development mode: Skipping authentication check')
            setIsAuthenticated(true)
            setLoading(false)
            return
          }
        }
      } catch (error) {
        // If settings check fails, continue with normal auth
        console.warn('Failed to check security settings, continuing with normal auth:', error)
      }

      // Quick check: if no token in localStorage, redirect immediately
      const token = localStorage.getItem('admin-token')
      
      if (!token) {
        // No token at all - redirect immediately without API call
        console.log('No token found - redirecting to login')
        setLoading(false)
        router.push('/admin/login?redirect=' + encodeURIComponent(pathname))
        return
      }

      // Set timeout to prevent hanging (short timeout since we have token)
      const timeoutId = setTimeout(() => {
        console.error('Auth check timeout - redirecting to login')
        localStorage.removeItem('admin-token')
        setLoading(false)
        router.push('/admin/login?redirect=' + encodeURIComponent(pathname))
      }, 3000) // 3 second timeout

      try {
        // Verify token with API (uses cookies automatically, localStorage token as backup)
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include', // Include cookies
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: AbortSignal.timeout(2500), // 2.5 second timeout
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          // Invalid token - clear localStorage and redirect to login immediately
          localStorage.removeItem('admin-token')
          console.log('Invalid authentication - redirecting to login')
          setLoading(false)
          router.push('/admin/login?redirect=' + encodeURIComponent(pathname))
          return
        }

        // Authentication successful
        const data = await response.json()
        if (data.success && data.authenticated) {
          setIsAuthenticated(true)
          setLoading(false)
        } else {
          // Not authenticated
          localStorage.removeItem('admin-token')
          setLoading(false)
          router.push('/admin/login?redirect=' + encodeURIComponent(pathname))
        }
      } catch (error: any) {
        clearTimeout(timeoutId)
        console.error('Auth check error:', error)
        
        // Error verifying - clear token and redirect to login immediately
        localStorage.removeItem('admin-token')
        setLoading(false)
        router.push('/admin/login?redirect=' + encodeURIComponent(pathname))
      }
    }

    checkAuth()
  }, [pathname, router])

  // CRITICAL SECURITY: Skip layout for login and forgot-password pages - return plain children
  if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
    return <>{children}</>
  }

  // Show loading state while checking auth (with timeout fallback)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
          <p className="text-xs text-gray-500 mt-2">
            If this takes too long,{' '}
            <a href="/admin/login" className="text-purple-600 hover:underline">
              go to login page
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Not authenticated and not loading - redirect should already be happening
  // Show brief message while redirect occurs (with fallback link)
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Redirecting to login...</p>
          <p className="text-sm text-gray-500">
            <a href="/admin/login" className="text-purple-600 hover:underline font-semibold">
              Click here if redirect doesn't work
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Authenticated - show admin layout
  return (
    <>
      <CommandPalette />
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -bottom-8 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        </div>

        {/* Sidebar - Responsive: hidden on mobile, overlay on tablet */}
        <div className={`
          relative z-10
          lg:block
          ${mobileMenuOpen ? 'block' : 'hidden'}
          ${mobileMenuOpen ? 'fixed inset-0 lg:relative' : ''}
        `}>
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-[-1] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          <div className={`
            h-screen bg-white border-r border-gray-200
            ${mobileMenuOpen ? 'w-64' : 'w-64 lg:w-64'}
            ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
            transition-all duration-300
          `}>
            <AdminSidebar 
              isCollapsed={sidebarCollapsed}
              onCollapseChange={setSidebarCollapsed}
              onMobileClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {/* Top menu - ONLY shown when authenticated */}
          <AdminTopMenu 
            sidebarCollapsed={sidebarCollapsed}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 pt-20 sm:pt-24">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
