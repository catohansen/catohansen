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
 * Session Management Tests
 * Tests for session expiry and automatic renewal
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { auth } from '@/modules/user-management/core/AuthEngine'
import { prisma } from '@/lib/db/prisma'

describe('Session Management', () => {
  let testUserId: string
  let testSessionToken: string

  beforeAll(async () => {
    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test-session@example.com',
        name: 'Test User',
        passwordHash: 'hashed-password',
        role: 'EDITOR',
        status: 'ACTIVE',
      },
    })
    testUserId = testUser.id
  })

  afterAll(async () => {
    // Cleanup
    await prisma.session.deleteMany({
      where: { userId: testUserId },
    })
    await prisma.user.delete({
      where: { id: testUserId },
    })
  })

  describe('Session Expiry', () => {
    it('should create a session with correct expiry date', async () => {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const session = await prisma.session.create({
        data: {
          sessionToken: 'test-token-1',
          userId: testUserId,
          expires: expiresAt,
        },
      })

      expect(session.expires).toBeInstanceOf(Date)
      expect(session.expires.getTime()).toBeGreaterThan(Date.now())
      expect(session.expires.getTime()).toBeLessThanOrEqual(expiresAt.getTime())

      testSessionToken = session.sessionToken
    })

    it('should reject expired sessions', async () => {
      // Create expired session
      const expiredSession = await prisma.session.create({
        data: {
          sessionToken: 'expired-token',
          userId: testUserId,
          expires: new Date(Date.now() - 1000), // Expired 1 second ago
        },
      })

      const result = await auth.verifySession(expiredSession.sessionToken)

      expect(result.valid).toBe(false)
    })

    it('should verify valid sessions', async () => {
      const result = await auth.verifySession(testSessionToken, { autoRenew: false })

      expect(result.valid).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user?.id).toBe(testUserId)
      expect(result.session).toBeDefined()
    })
  })

  describe('Automatic Session Renewal', () => {
    it('should auto-renew session when threshold is reached', async () => {
      // Create session that expires soon (within renewal threshold)
      const soonExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day (less than 25% of 7 days)
      
      const session = await prisma.session.create({
        data: {
          sessionToken: 'renew-test-token',
          userId: testUserId,
          expires: soonExpires,
        },
      })

      const result = await auth.verifySession(session.sessionToken, {
        autoRenew: true,
        renewalThreshold: 25, // Renew when 25% of lifetime remains
      })

      expect(result.valid).toBe(true)
      expect(result.renewed).toBe(true)
      expect(result.session?.expiresAt.getTime()).toBeGreaterThan(soonExpires.getTime())

      // Verify session was updated in database
      const updatedSession = await prisma.session.findUnique({
        where: { sessionToken: session.sessionToken },
      })

      expect(updatedSession?.expires.getTime()).toBeGreaterThan(soonExpires.getTime())
    })

    it('should not auto-renew session when threshold is not reached', async () => {
      // Create session with plenty of time remaining
      const farExpires = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days (more than 25% of 7 days)
      
      const session = await prisma.session.create({
        data: {
          sessionToken: 'no-renew-test-token',
          userId: testUserId,
          expires: farExpires,
        },
      })

      const result = await auth.verifySession(session.sessionToken, {
        autoRenew: true,
        renewalThreshold: 25,
      })

      expect(result.valid).toBe(true)
      expect(result.renewed).toBe(false)
      expect(result.session?.expiresAt.getTime()).toBe(farExpires.getTime())
    })

    it('should respect autoRenew: false option', async () => {
      const soonExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      
      const session = await prisma.session.create({
        data: {
          sessionToken: 'no-auto-renew-token',
          userId: testUserId,
          expires: soonExpires,
        },
      })

      const result = await auth.verifySession(session.sessionToken, {
        autoRenew: false,
      })

      expect(result.valid).toBe(true)
      expect(result.renewed).toBe(false)
    })
  })

  describe('Manual Session Renewal', () => {
    it('should manually renew a session', async () => {
      const originalExpires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
      
      const session = await prisma.session.create({
        data: {
          sessionToken: 'manual-renew-token',
          userId: testUserId,
          expires: originalExpires,
        },
      })

      const result = await auth.renewSession(session.sessionToken, false)

      expect(result.success).toBe(true)
      expect(result.session).toBeDefined()
      expect(result.session?.expiresAt.getTime()).toBeGreaterThan(originalExpires.getTime())

      // Verify session was updated
      const updatedSession = await prisma.session.findUnique({
        where: { sessionToken: session.sessionToken },
      })

      expect(updatedSession?.expires.getTime()).toBeGreaterThan(originalExpires.getTime())
    })

    it('should fail to renew expired session', async () => {
      const expiredSession = await prisma.session.create({
        data: {
          sessionToken: 'expired-renew-token',
          userId: testUserId,
          expires: new Date(Date.now() - 1000),
        },
      })

      const result = await auth.renewSession(expiredSession.sessionToken)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Session expired')
    })

    it('should respect rememberMe flag for renewal duration', async () => {
      const originalExpires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      
      const session = await prisma.session.create({
        data: {
          sessionToken: 'remember-me-renew-token',
          userId: testUserId,
          expires: originalExpires,
        },
      })

      // Renew with rememberMe = true (should extend to 30 days)
      const result = await auth.renewSession(session.sessionToken, true)

      expect(result.success).toBe(true)
      expect(result.session).toBeDefined()
      
      const expectedExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      const tolerance = 60 * 1000 // 1 minute tolerance
      expect(Math.abs(result.session!.expiresAt.getTime() - expectedExpires.getTime())).toBeLessThan(tolerance)
    })
  })
})


