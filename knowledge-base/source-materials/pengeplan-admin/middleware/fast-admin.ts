/**
 * Fast Admin Middleware - Optimalisert autentisering for admin
 * 
 * Dette middleware erstatter den trege Cerbos-sjekkingen med en hurtig,
 * cache-basert løsning som fungerer selv når Cerbos PDP er utilgjengelig.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/auth/session-manager'
import { audit } from '@/lib/audit'

export async function fastAdminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip non-admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  try {
    // Hurtig session-sjekk med caching
    const sessionData = await sessionManager.getSessionFromRequest(request)
    
    if (!sessionData) {
      // Ingen session - redirect til login
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }

    // Sjekk admin tilgang
    if (!sessionManager.hasAdminAccess(sessionData)) {
      // Ikke admin - redirect til unauthorized
      await audit({
        userId: sessionData.userId,
        action: 'admin.access.denied',
        entity: 'AdminAccess',
        entityId: sessionData.userId,
        meta: {
          pathname,
          userRole: sessionData.role,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
      
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Super admin bypass - ingen Cerbos-sjekking
    if (sessionManager.isSuperAdmin(sessionData)) {
      const response = NextResponse.next()
      response.headers.set('X-SuperAdmin', 'true')
      response.headers.set('X-Bypass-Authz', 'true')
      response.headers.set('X-Admin-User', sessionData.email)
      response.headers.set('X-Admin-Role', sessionData.role)
      
      // Oppdater session med request info
      await sessionManager.updateSessionWithRequest(sessionData.id, request)
      
      return response
    }

    // Vanlig admin - legg til headers
    const response = NextResponse.next()
    response.headers.set('X-Admin-User', sessionData.email)
    response.headers.set('X-Admin-Role', sessionData.role)
    
    // Oppdater session med request info
    await sessionManager.updateSessionWithRequest(sessionData.id, request)
    
    return response

  } catch (error) {
    console.error('Fast admin middleware error:', error)
    
    // Logg feil
    await audit({
      userId: 'unknown',
      action: 'admin.middleware.error',
      entity: 'AdminMiddleware',
      entityId: 'error',
      meta: {
        error: error.message,
        pathname,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    
    // Redirect til login ved feil
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }
}

/**
 * Super Admin Bypass Middleware - REMOVED
 * 
 * This middleware has been removed as part of the security cleanup.
 * All authentication now goes through proper session management.
 */

/**
 * API Security Middleware - Hurtig sjekk for API routes
 */
export async function fastApiSecurityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Kun for API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  try {
    // Hurtig session-sjekk
    const sessionData = await sessionManager.getSessionFromRequest(request)
    
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      )
    }

    // Legg til session data i headers for API handlers
    const response = NextResponse.next()
    response.headers.set('X-User-Id', sessionData.userId)
    response.headers.set('X-User-Role', sessionData.role)
    response.headers.set('X-User-Email', sessionData.email)
    
    if (sessionManager.isSuperAdmin(sessionData)) {
      response.headers.set('X-SuperAdmin', 'true')
      response.headers.set('X-Bypass-Authz', 'true')
    }
    
    return response

  } catch (error) {
    console.error('Fast API security middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Combined Middleware - Kombinerer alle middleware
 */
export async function combinedSecurityMiddleware(request: NextRequest): Promise<NextResponse> {
  try {
    // Fast admin middleware for admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const adminResponse = await fastAdminMiddleware(request)
      return adminResponse || NextResponse.next()
    }

    // API security for API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
      const apiResponse = await fastApiSecurityMiddleware(request)
      return apiResponse || NextResponse.next()
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Combined security middleware error:', error)
    return NextResponse.next()
  }
}
