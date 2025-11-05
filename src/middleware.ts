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
 * Next.js Middleware
 * Security headers and admin route protection
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // DEVELOPMENT: Bypass all admin protection to view pages freely
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.next()
    }
    // Skip login and forgot-password pages
    if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
      return NextResponse.next()
    }

    // Check for admin token (in production, use httpOnly cookie)
    const token = request.cookies.get('admin-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      
      // Only set redirect for valid admin routes (not from other systems)
      // List of valid admin routes for this system
      const validAdminRoutes = [
        '/admin',
        '/admin/hansen-security',
        '/admin/hansen-security/audit',
        '/admin/hansen-security/policies',
        '/admin/content',
        '/admin/clients',
        '/admin/projects',
        '/admin/portfolio',
        '/admin/billing',
        '/admin/analytics',
        '/admin/ai',
        '/admin/knowledge-base',
        '/admin/deploy',
        '/admin/profile',
        '/admin/settings'
      ]
      
      // Skip redirect for forgot-password
      if (pathname === '/admin/forgot-password') {
        return NextResponse.next()
      }
      
      // Only add redirect if it's a valid route
      if (validAdminRoutes.includes(pathname)) {
        loginUrl.searchParams.set('redirect', pathname)
      }
      
      return NextResponse.redirect(loginUrl)
    }

    // Verify token (in production, verify JWT or session)
    // For now, allow access if token exists
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Enhanced Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  )

  // Content Security Policy - TEMPORARILY DISABLED FOR DEVELOPMENT
  // CSP can block Next.js hydration scripts in development
  // TODO: Re-enable and configure properly for production
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https: wss:",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
    response.headers.set('Content-Security-Policy', csp)
  }

  // HSTS for HTTPS (production only)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

export const config = {
  matcher: [
    // Only match admin routes to avoid affecting public pages
    '/admin/:path*',
  ],
}

