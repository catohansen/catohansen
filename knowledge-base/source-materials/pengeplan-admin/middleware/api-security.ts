import { NextRequest, NextResponse } from 'next/server';

export function apiSecurityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip security checks for public endpoints
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot',
    '/api/auth/reset',
    '/api/health',
    '/api/security/summary',
    '/api/security/health',
    '/api/security/metrics',
    '/api/security/events',
    '/api/security/ip-threats',
    '/api/security/ai-analysis',
    '/api/security/behavioral-analysis',
    '/api/security/threat-intelligence',
    '/api/security/ai-metrics',
    '/api/security/emergency-status',
    '/api/security/emergency-action',
    '/api/security/forensics/snapshot',
    '/api/security/database/status',
    '/api/honeypot/sensitive-data'
  ];
  
  // Check if this is a public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    pathname.startsWith(endpoint)
  );
  
  if (isPublicEndpoint) {
    return NextResponse.next();
  }
  
  // Check for admin endpoints
  if (pathname.startsWith('/api/admin/')) {
    // Require authentication for admin endpoints
    const authHeader = request.headers.get('authorization');
    const userEmail = request.headers.get('x-user-email');
    
    if (!authHeader && !userEmail) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized: Authentication required for admin endpoints',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }
  }
  
  // Check for user endpoints
  if (pathname.startsWith('/api/user/') || pathname.startsWith('/api/bills/') || 
      pathname.startsWith('/api/budgets/') || pathname.startsWith('/api/debts/') ||
      pathname.startsWith('/api/savings/')) {
    // Require authentication for user endpoints
    const authHeader = request.headers.get('authorization');
    const sessionToken = request.cookies.get('pengeplan_session')?.value;
    
    if (!authHeader && !sessionToken) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized: Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}
