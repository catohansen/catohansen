/**
 * Simple Admin Middleware - Enkel løsning uten komplekse dependencies
 * 
 * Dette er en forenklet middleware som fungerer uten å avhenge av
 * komplekse session management systemer.
 * 
 * @author Pengeplan 2.0 Team
 * @version 2.0.0
 */

import { NextRequest, NextResponse } from 'next/server'

export function simpleAdminMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  
  // Skip non-admin routes and admin-login page
  if (!pathname.startsWith('/admin') || pathname === '/admin-login') {
    return NextResponse.next()
  }

  // Sjekk om det er en gyldig session cookie
  const sessionCookie = request.cookies.get('pengeplan_session')
  if (sessionCookie && sessionCookie.value) {
    const response = NextResponse.next()
    return response
  }

  // Ingen gyldig session - redirect til login
  return NextResponse.redirect(new URL('/admin-login', request.url))
}
