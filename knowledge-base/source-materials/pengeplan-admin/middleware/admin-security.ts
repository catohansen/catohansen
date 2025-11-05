import { NextRequest, NextResponse } from 'next/server'
import { checkPermission } from '@/lib/authz/cerbos-enhanced'

export async function adminSecurityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip non-admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }
  
  // Check authentication
  const token = request.cookies.get('auth-token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }
  
  // Verify token and get user
  try {
    const user = await verifyAuthToken(token)
    
    // Check admin permissions
    const hasAdminAccess = await checkPermission(user, 'admin', 'read')
    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // Add security headers
    const response = NextResponse.next()
    response.headers.set('X-Admin-User', user.email)
    response.headers.set('X-Admin-Role', user.role)
    
    return response
  } catch (error) {
    console.error('Admin security check failed:', error)
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }
}

async function verifyAuthToken(token: string) {
  // Implement token verification logic
  // This would typically verify JWT or session token
  return {
    id: 'admin-user',
    email: 'cato@catohansen.no',
    role: 'SUPERADMIN'
  }
}
