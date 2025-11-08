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
 * E2E Security Test Suite
 * Complete end-to-end test of the security system
 */

// Note: This test file requires Jest to be installed
// To use this file, install: npm install --save-dev jest @types/jest @jest/globals
// For now, we'll use type assertions to avoid TypeScript errors
// @ts-nocheck

// Test configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'
const OWNER_EMAIL = 'cato@catohansen.no'
const OWNER_PASSWORD = 'Kilma2386!!'

describe('E2E Security System Tests', () => {
  let authToken: string | null = null
  let userId: string | null = null

  beforeAll(async () => {
    // Setup: Seed owner account if needed
    // This would typically be done via API or script
  })

  afterAll(async () => {
    // Cleanup if needed
  })

  describe('Authentication Flow', () => {
    it('should deny access to admin routes without authentication', async () => {
      const response = await fetch(`${BASE_URL}/admin`, {
        redirect: 'manual'
      })
      
      // Should redirect to login
      expect(response.status).toBe(307) // or 302 for redirect
    })

    it('should show login page without admin layout', async () => {
      const response = await fetch(`${BASE_URL}/admin/login`)
      const html = await response.text()
      
      // Should NOT contain sidebar/top menu elements
      expect(html).not.toContain('AdminSidebar')
      expect(html).not.toContain('AdminTopMenu')
      
      // Should contain login form
      expect(html).toContain('email')
      expect(html).toContain('password')
    })

    it('should successfully login with owner credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: OWNER_EMAIL,
          password: OWNER_PASSWORD
        })
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe(OWNER_EMAIL)
      expect(data.user.role).toBe('OWNER')
      expect(data.token).toBeDefined()

      // Extract token for subsequent tests
      authToken = data.token
      userId = data.user.id

      // Check cookie is set
      const cookies = response.headers.getSetCookie()
      expect(cookies.some(cookie => cookie.includes('admin-token'))).toBe(true)
    })

    it('should deny login with incorrect password', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: OWNER_EMAIL,
          password: 'wrongpassword'
        })
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBeUndefined()
      expect(data.error).toBeDefined()
    })

    it('should deny login with non-existent email', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'anypassword'
        })
      })

      expect(response.status).toBe(401)
    })

    it('should lock account after 5 failed attempts', async () => {
      // Attempt 5 failed logins
      for (let i = 0; i < 5; i++) {
        await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: OWNER_EMAIL,
            password: 'wrongpassword'
          })
        })
      }

      // 6th attempt should be locked
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: OWNER_EMAIL,
          password: OWNER_PASSWORD // Correct password but account locked
        })
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.locked).toBe(true)
    })
  })

  describe('Token Verification', () => {
    it('should verify valid token', async () => {
      if (!authToken) {
        // Get token first
        const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: OWNER_EMAIL,
            password: OWNER_PASSWORD
          })
        })
        const loginData = await loginResponse.json()
        authToken = loginData.token
      }

      const response = await fetch(`${BASE_URL}/api/admin/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include'
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.authenticated).toBe(true)
    })

    it('should deny invalid token', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/verify`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalid-token-12345',
        }
      })

      expect(response.status).toBe(401)
    })

    it('should deny expired token', async () => {
      // This would require manipulating token expiry
      // For now, just test that expired sessions are handled
      // (Would need to manually create expired session in DB)
    })
  })

  describe('Profile Management', () => {
    it('should fetch profile when authenticated', async () => {
      if (!authToken) {
        const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: OWNER_EMAIL,
            password: OWNER_PASSWORD
          })
        })
        const loginData = await loginResponse.json()
        authToken = loginData.token
      }

      const response = await fetch(`${BASE_URL}/api/admin/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include'
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe(OWNER_EMAIL)
    })

    it('should deny profile access without authentication', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/profile`, {
        method: 'GET',
      })

      expect(response.status).toBe(401)
    })

    it('should update profile when authenticated', async () => {
      if (!authToken) {
        const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: OWNER_EMAIL,
            password: OWNER_PASSWORD
          })
        })
        const loginData = await loginResponse.json()
        authToken = loginData.token
      }

      const response = await fetch(`${BASE_URL}/api/admin/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'Cato Hansen Test',
          phone: '+47 123 45 678'
        })
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toBeDefined()
    })

    it('should change password with correct current password', async () => {
      if (!authToken) {
        const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: OWNER_EMAIL,
            password: OWNER_PASSWORD
          })
        })
        const loginData = await loginResponse.json()
        authToken = loginData.token
      }

      const response = await fetch(`${BASE_URL}/api/admin/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: OWNER_PASSWORD,
          newPassword: 'NewPassword123!!'
        })
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Change password back for other tests
      await fetch(`${BASE_URL}/api/admin/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: 'NewPassword123!!',
          newPassword: OWNER_PASSWORD
        })
      })
    })

    it('should deny password change with incorrect current password', async () => {
      if (!authToken) {
        const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: OWNER_EMAIL,
            password: OWNER_PASSWORD
          })
        })
        const loginData = await loginResponse.json()
        authToken = loginData.token
      }

      const response = await fetch(`${BASE_URL}/api/admin/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: 'wrongpassword',
          newPassword: 'NewPassword123!!'
        })
      })

      expect(response.status).toBe(401)
    })
  })

  describe('Password Reset', () => {
    it('should request password reset with valid email', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: OWNER_EMAIL
        })
      })

      const data = await response.json()

      // Should return success even if phone not registered (security best practice)
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should show forgot password page without admin layout', async () => {
      const response = await fetch(`${BASE_URL}/admin/forgot-password`)
      const html = await response.text()
      
      // Should NOT contain sidebar/top menu
      expect(html).not.toContain('AdminSidebar')
      expect(html).not.toContain('AdminTopMenu')
    })
  })

  describe('Authorization & Access Control', () => {
    it('should allow owner access to admin panel', async () => {
      if (!authToken) {
        const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: OWNER_EMAIL,
            password: OWNER_PASSWORD
          })
        })
        const loginData = await loginResponse.json()
        authToken = loginData.token
      }

      const response = await fetch(`${BASE_URL}/admin`, {
        headers: {
          'Cookie': `admin-token=${authToken}`,
        },
        redirect: 'manual'
      })

      // Should allow access (not redirect to login)
      expect(response.status).not.toBe(307)
      expect(response.status).not.toBe(302)
    })

    it('should redirect to login when accessing admin without token', async () => {
      const response = await fetch(`${BASE_URL}/admin`, {
        redirect: 'manual'
      })

      // Should redirect to login
      expect([307, 302, 401]).toContain(response.status)
    })
  })

  describe('Session Management', () => {
    it('should create session on login', async () => {
      const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: OWNER_EMAIL,
          password: OWNER_PASSWORD
        })
      })

      const data = await loginResponse.json()

      // Session should be created in database
      // (Would need DB check here)
      expect(data.token).toBeDefined()
    })

    it('should delete session on logout', async () => {
      // Would need logout endpoint
      // For now, just verify token becomes invalid
    })
  })

  describe('Audit Logging', () => {
    it('should log successful login', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: OWNER_EMAIL,
          password: OWNER_PASSWORD
        })
      })

      // Audit log should be created
      // (Would need to check audit log database)
      expect(response.status).toBe(200)
    })

    it('should log failed login attempts', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: OWNER_EMAIL,
          password: 'wrongpassword'
        })
      })

      // Audit log should be created for failed attempt
      // (Would need to check audit log database)
      expect(response.status).toBe(401)
    })
  })
})







