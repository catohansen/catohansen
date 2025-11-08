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
 * Auth Engine
 * Modern authentication engine inspired by Better Auth
 * Framework-agnostic core that can be used with any framework
 */

import { prisma } from '@/lib/db/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { policyEngine } from '@/modules/security2/core/PolicyEngine'
import { OAuthProvider, type OAuthProviderConfig } from './OAuthProvider'
import { PluginManager, type AuthPlugin } from './Plugin'
import crypto from 'crypto'

export interface AuthConfig {
  emailAndPassword?: {
    enabled: boolean
  }
  socialAuth?: {
    providers: ('google' | 'github' | 'discord' | 'twitter')[]
  }
  twoFactor?: {
    enabled: boolean
  }
  organization?: {
    enabled: boolean
  }
  session?: {
    maxAge?: number // in days
    defaultAge?: number // in days
  }
}

export interface SignInInput {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpInput {
  email: string
  password: string
  name?: string
  tenantId?: string
}

export interface AuthResult {
  success: boolean
  user?: {
    id: string
    email: string
    name: string | null
    role: string
    emailVerified: boolean
  }
  session?: {
    token: string
    expiresAt: Date
  }
  error?: string
}

export interface AuthSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

/**
 * Auth Engine
 * Modern, framework-agnostic authentication engine
 */
export class AuthEngine {
  private config: AuthConfig
  private oauthProvider: OAuthProvider | null = null
  private pluginManager: PluginManager

  constructor(config: AuthConfig = {}) {
    this.config = {
      emailAndPassword: { enabled: true },
      session: {
        maxAge: 30, // 30 days max
        defaultAge: 7, // 7 days default
      },
      ...config,
    }
    this.pluginManager = new PluginManager()
    this.pluginManager.setAuth(this)

    // Initialize OAuth provider if social auth is enabled
    if (config.socialAuth?.providers && config.socialAuth.providers.length > 0) {
      // OAuth config should be passed separately
      // this.oauthProvider = new OAuthProvider(oauthConfig)
    }
  }

  /**
   * Set OAuth provider configuration
   */
  setOAuthConfig(oauthConfig: OAuthProviderConfig): void {
    this.oauthProvider = new OAuthProvider(oauthConfig)
  }

  /**
   * Register a plugin
   */
  use(plugin: AuthPlugin): void {
    this.pluginManager.register(plugin)
  }

  /**
   * Get plugin manager
   */
  getPluginManager(): PluginManager {
    return this.pluginManager
  }

  /**
   * Get OAuth authorization URL
   */
  async getOAuthUrl(provider: 'google' | 'github' | 'discord' | 'twitter'): Promise<string> {
    if (!this.oauthProvider) {
      throw new Error('OAuth provider is not configured')
    }
    return this.oauthProvider.getAuthorizationUrl(provider)
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(
    provider: 'google' | 'github' | 'discord' | 'twitter',
    code: string,
    state: string,
    context?: {
      ip?: string
      userAgent?: string
    }
  ): Promise<AuthResult> {
    if (!this.oauthProvider) {
      return {
        success: false,
        error: 'OAuth provider is not configured',
      }
    }
    return this.oauthProvider.handleCallback(provider, code, state, context)
  }

  /**
   * Sign in with email and password
   */
  async signIn(input: SignInInput, context?: {
    ip?: string
    userAgent?: string
  }): Promise<AuthResult> {
    if (!this.config.emailAndPassword?.enabled) {
      return {
        success: false,
        error: 'Email and password authentication is not enabled',
      }
    }

    try {
      // Execute beforeSignIn hooks
      let processedInput = await this.pluginManager.executeHook('beforeSignIn', input)
      
      const email = processedInput.email.toLowerCase().trim()

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
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
        },
      })

      if (!user) {
        await this.auditLogin('unknown', [], 'DENY', 'User not found', context)
        return {
          success: false,
          error: 'Invalid email or password',
        }
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        await this.auditLogin(user.id, [user.role], 'DENY', 'Account is locked', context)
        return {
          success: false,
          error: 'Account is locked. Please contact administrator.',
        }
      }

      // Verify password
      if (!user.passwordHash) {
        await this.auditLogin(user.id, [user.role], 'DENY', 'No password set', context)
        return {
          success: false,
          error: 'Invalid email or password',
        }
      }

      const isValid = await verifyPassword(input.password, user.passwordHash)

      if (!isValid) {
        // Increment failed attempts
        const newAttempts = (user.failedLoginAttempts || 0) + 1
        const updateData: any = { failedLoginAttempts: newAttempts }

        if (newAttempts >= 5) {
          updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        })

        await this.auditLogin(user.id, [user.role], 'DENY', 'Invalid password', context)

        return {
          success: false,
          error: 'Invalid email or password',
        }
      }

      // Check authorization
      const hasAccess = await policyEngine.evaluate(
        { id: user.id, roles: [user.role] },
        { kind: 'admin', id: 'admin-panel' },
        'access'
      )

      if (!hasAccess.allowed) {
        await this.auditLogin(user.id, [user.role], 'DENY', hasAccess.reason || 'Access denied', context)
        return {
          success: false,
          error: 'Access denied',
        }
      }

      // Reset failed attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: new Date(),
          lastLoginIp: context?.ip || 'unknown',
        },
      })

      // Create session
      const sessionDurationDays = input.rememberMe
        ? this.config.session?.maxAge || 30
        : this.config.session?.defaultAge || 7

      const expiresAt = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000)
      const token = this.generateSessionToken()

      await prisma.session.create({
        data: {
          sessionToken: token,
          userId: user.id,
          expires: expiresAt,
        },
      })

      await this.auditLogin(user.id, [user.role], 'ALLOW', 'Login successful', context)

      const result: AuthResult = {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        session: {
          token,
          expiresAt,
        },
      }

      // Execute afterSignIn hooks
      await this.pluginManager.executeHook('afterSignIn', result)

      return result
    } catch (error: any) {
      console.error('AuthEngine.signIn error:', error)
      return {
        success: false,
        error: 'An error occurred during sign in',
      }
    }
  }

  /**
   * Sign up new user
   */
  async signUp(input: SignUpInput, context?: {
    ip?: string
    userAgent?: string
  }): Promise<AuthResult> {
    if (!this.config.emailAndPassword?.enabled) {
      return {
        success: false,
        error: 'Email and password authentication is not enabled',
      }
    }

    try {
      const email = input.email.toLowerCase().trim()

      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email },
      })

      if (existing) {
        return {
          success: false,
          error: 'User already exists',
        }
      }

      // Create user
      const passwordHash = await hashPassword(input.password)
      const user = await prisma.user.create({
        data: {
          email,
          name: input.name,
          passwordHash,
          role: 'EDITOR',
          status: 'PENDING_VERIFICATION',
          tenantId: input.tenantId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
        },
      })

      // Create session
      const sessionDurationDays = this.config.session?.defaultAge || 7
      const expiresAt = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000)
      const token = this.generateSessionToken()

      await prisma.session.create({
        data: {
          sessionToken: token,
          userId: user.id,
          expires: expiresAt,
        },
      })

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        session: {
          token,
          expiresAt,
        },
      }
    } catch (error: any) {
      console.error('AuthEngine.signUp error:', error)
      return {
        success: false,
        error: 'An error occurred during sign up',
      }
    }
  }

  /**
   * Sign out (delete session)
   */
  async signOut(sessionToken: string): Promise<{ success: boolean }> {
    try {
      await prisma.session.deleteMany({
        where: { sessionToken },
      })

      return { success: true }
    } catch (error) {
      console.error('AuthEngine.signOut error:', error)
      return { success: false }
    }
  }

  /**
   * Verify session with automatic renewal
   * Automatically renews session if it's within renewal threshold (default: 25% of lifetime remaining)
   */
  async verifySession(
    sessionToken: string,
    options?: {
      autoRenew?: boolean
      renewalThreshold?: number // Percentage of session lifetime remaining before renewal (default: 25%)
    }
  ): Promise<{
    valid: boolean
    session?: AuthSession
    user?: {
      id: string
      email: string
      name: string | null
      role: string
    }
    renewed?: boolean
  }> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
            },
          },
        },
      })

      if (!session || session.expires < new Date()) {
        return { valid: false }
      }

      // Check if user is still active
      if (session.user.status !== 'ACTIVE') {
        return { valid: false }
      }

      // Calculate session lifetime and time remaining
      const now = new Date()
      const sessionLifetime = session.expires.getTime() - session.createdAt.getTime()
      const timeRemaining = session.expires.getTime() - now.getTime()
      const renewalThreshold = options?.renewalThreshold ?? 25 // Default: renew when 25% of lifetime remains
      const shouldRenew = options?.autoRenew !== false && 
                         timeRemaining > 0 && 
                         (timeRemaining / sessionLifetime) * 100 < renewalThreshold

      let renewed = false

      // Auto-renew session if needed
      if (shouldRenew) {
        const sessionDurationDays = this.config.session?.defaultAge || 7
        const newExpiresAt = new Date(now.getTime() + sessionDurationDays * 24 * 60 * 60 * 1000)

        await prisma.session.update({
          where: { sessionToken },
          data: { expires: newExpiresAt },
        })

        renewed = true
      }

      return {
        valid: true,
        session: {
          id: session.id,
          userId: session.userId,
          token: session.sessionToken,
          expiresAt: shouldRenew ? new Date(now.getTime() + (this.config.session?.defaultAge || 7) * 24 * 60 * 60 * 1000) : session.expires,
          createdAt: session.createdAt,
        },
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
        },
        renewed,
      }
    } catch (error) {
      console.error('AuthEngine.verifySession error:', error)
      return { valid: false }
    }
  }

  /**
   * Renew session manually
   */
  async renewSession(sessionToken: string, rememberMe?: boolean): Promise<{
    success: boolean
    session?: AuthSession
    error?: string
  }> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
          user: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      })

      if (!session) {
        return { success: false, error: 'Session not found' }
      }

      if (session.expires < new Date()) {
        return { success: false, error: 'Session expired' }
      }

      if (session.user.status !== 'ACTIVE') {
        return { success: false, error: 'User is not active' }
      }

      // Calculate new expiry based on rememberMe flag
      const sessionDurationDays = rememberMe
        ? this.config.session?.maxAge || 30
        : this.config.session?.defaultAge || 7

      const newExpiresAt = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000)

      const updatedSession = await prisma.session.update({
        where: { sessionToken },
        data: { expires: newExpiresAt },
      })

      return {
        success: true,
        session: {
          id: updatedSession.id,
          userId: updatedSession.userId,
          token: updatedSession.sessionToken,
          expiresAt: updatedSession.expires,
          createdAt: updatedSession.createdAt,
        },
      }
    } catch (error) {
      console.error('AuthEngine.renewSession error:', error)
      return { success: false, error: 'Failed to renew session' }
    }
  }

  /**
   * Generate secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Audit log login attempt
   */
  private async auditLogin(
    userId: string,
    roles: string[],
    decision: 'ALLOW' | 'DENY',
    reason: string,
    context?: {
      ip?: string
      userAgent?: string
    }
  ) {
    try {
      await auditLogger.logDecision({
        principalId: userId,
        principalRoles: roles,
        resource: 'admin',
        resourceId: 'login',
        action: 'login',
        decision,
        effect: decision,
        reason,
        ip: context?.ip,
        userAgent: context?.userAgent,
      })
    } catch (error) {
      console.error('Failed to audit log:', error)
    }
  }
}

/**
 * Create auth instance (Better Auth style)
 */
export function createAuth(config: AuthConfig = {}) {
  return new AuthEngine(config)
}

/**
 * Default auth instance
 */
export const auth = new AuthEngine()

