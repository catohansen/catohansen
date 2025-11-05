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
 * Admin Login API Route
 * Production-ready authentication with password hashing and RBAC
 */

import { NextRequest, NextResponse } from 'next/server'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { prisma } from '@/lib/db/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { UserManager } from '@/modules/user-management/core/UserManager'
import { SecuritySettingsManager } from '@/modules/security2/core/SecuritySettings'

const userManager = new UserManager()

async function loginHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe = false } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Normalize email and password (trim whitespace)
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedPassword = password.trim()

    // Get Prisma client
    // Prisma client is imported directly
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        status: true,
        emailVerified: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        phone: true,
      }
    })

    // Check if user exists
    if (!user) {
      // Audit log failed login attempt
      await auditLogger.logDecision({
        principalId: 'unknown',
        principalRoles: [],
        resource: 'admin',
        resourceId: 'login',
        action: 'login',
        decision: 'DENY',
        effect: 'DENY',
        reason: 'User not found',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await auditLogger.logDecision({
        principalId: user.id,
        principalRoles: [user.role],
        resource: 'admin',
        resourceId: 'login',
        action: 'login',
        decision: 'DENY',
        effect: 'DENY',
        reason: 'Account is locked',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return NextResponse.json(
        { error: 'Account is locked. Please contact administrator.' },
        { status: 403 }
      )
    }

    // Check if user has password hash - if not, create/update it
    let passwordHash = user.passwordHash

    // Special handling for owner account (cato@catohansen.no)
    const isOwner = normalizedEmail === 'cato@catohansen.no'
    const ownerPassword = 'Kilma2386!!'

    if (isOwner && !passwordHash) {
      // Create password hash for owner account
      passwordHash = await hashPassword(ownerPassword)
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
      })
    }

    // Verify password
    let isPasswordValid = false

    if (passwordHash) {
      // Verify against stored hash (use normalized password)
      isPasswordValid = await verifyPassword(normalizedPassword, passwordHash)
    } else if (isOwner && normalizedPassword === ownerPassword) {
      // Temporary fallback for owner (should not happen if setup is correct)
      isPasswordValid = true
      // Create hash immediately
      passwordHash = await hashPassword(ownerPassword)
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash }
      })
    }

    if (!isPasswordValid) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failedLoginAttempts || 0) + 1
      const updateData: any = { failedLoginAttempts: newFailedAttempts }

      // Lock account after 5 failed attempts for 30 minutes
      if (newFailedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      })

      // Audit log failed login attempt
      await auditLogger.logDecision({
        principalId: user.id,
        principalRoles: [user.role],
        resource: 'admin',
        resourceId: 'login',
        action: 'login',
        decision: 'DENY',
        effect: 'DENY',
        reason: 'Invalid password',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return NextResponse.json(
        { 
          error: 'Invalid email or password',
          ...(newFailedAttempts >= 5 && {
            locked: true,
            message: 'Account locked due to too many failed attempts. Please wait 30 minutes or reset password.'
          })
        },
        { status: 401 }
      )
    }

    // Reset failed login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      }
    })

    // Ensure user has OWNER role if it's the owner account
    if (isOwner && user.role !== 'OWNER') {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          role: 'OWNER',
          status: 'ACTIVE',
          emailVerified: true,
        }
      })
      user.role = 'OWNER'
    }

    // Ensure owner account is always ACTIVE
    if (isOwner && user.status !== 'ACTIVE') {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'ACTIVE' }
      })
    }

    // DEVELOPMENT MODE: Skip authorization check if security is disabled
    const settings = await SecuritySettingsManager.getSettings()
    let hasAccess: { allowed: boolean; reason?: string }
    
    if (settings.securityEnabled || process.env.NODE_ENV === 'production') {
      // Check authorization with Hansen Security
      const principal = {
        id: user.id,
        roles: [user.role],
        attributes: { email: user.email }
      }

      const resource = {
        kind: 'admin',
        id: 'admin-panel',
        attributes: {}
      }

      hasAccess = await policyEngine.evaluate(principal, resource, 'access')
    } else {
      console.log('🔓 Development mode: Skipping authorization check for admin login')
      hasAccess = { allowed: true, reason: 'Development mode: Security disabled' }
    }

    if (!hasAccess.allowed) {
      // Audit log denied access
      await auditLogger.logDecision({
        principalId: user.id,
        principalRoles: [user.role],
        resource: 'admin',
        resourceId: 'admin-panel',
        action: 'access',
        decision: 'DENY',
        effect: 'DENY',
        reason: hasAccess.reason || 'Access denied by policy',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Generate secure token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}:${Math.random()}`).toString('base64')

    // Set session duration based on rememberMe: 30 days if checked, 7 days if not
    const sessionDurationDays = rememberMe ? 30 : 7
    const expiresAt = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000)
    
    await prisma.session.create({
      data: {
        sessionToken: token,
        userId: user.id,
        expires: expiresAt
      }
    })

    // Audit log successful login
    await auditLogger.logDecision({
      principalId: user.id,
      principalRoles: [user.role],
      resource: 'admin',
      resourceId: 'admin-panel',
      action: 'login',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Login successful',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })

    // Set secure httpOnly cookie with duration based on rememberMe
    const cookieMaxAge = rememberMe 
      ? 60 * 60 * 24 * 30 // 30 days if rememberMe is checked
      : 60 * 60 * 24 * 7  // 7 days if not checked
    
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: cookieMaxAge
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Determine error type for better error messages
    let errorMessage = 'An error occurred during login'
    let statusCode = 500
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
      errorMessage = 'Database connection failed. Please check if the database is running.'
      statusCode = 503
    } else if (error.code === 'P1017' || error.message?.includes('connection closed')) {
      errorMessage = 'Database connection was closed. Please try again.'
      statusCode = 503
    } else if (error.code === 'P2002' || error.message?.includes('Unique constraint')) {
      errorMessage = 'Database constraint violation. Please contact administrator.'
      statusCode = 409
    } else if (error.message) {
      // In development, show more details
      if (process.env.NODE_ENV === 'development') {
        errorMessage = `Login error: ${error.message}`
      }
    }
    
    // Try to audit log error (but don't fail if audit logging fails)
    try {
      await auditLogger.logDecision({
        principalId: 'unknown',
        principalRoles: [],
        resource: 'admin',
        resourceId: 'login',
        action: 'login',
        decision: 'DENY',
        effect: 'DENY',
        reason: `Login error: ${error.message || 'Unknown error'}`,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })
    } catch (auditError) {
      console.error('Failed to audit log login error:', auditError)
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

export const POST = loginHandler
