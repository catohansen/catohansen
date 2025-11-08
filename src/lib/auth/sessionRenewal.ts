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
 * Client-side Session Renewal Utility
 * Automatically renews sessions before they expire
 */

export interface SessionRenewalConfig {
  /**
   * Interval to check session expiry (in milliseconds)
   * Default: 5 minutes
   */
  checkInterval?: number

  /**
   * Percentage of session lifetime remaining before renewal
   * Default: 25% (renew when 25% of lifetime remains)
   */
  renewalThreshold?: number

  /**
   * Whether to automatically renew sessions
   * Default: true
   */
  enabled?: boolean
}

export class SessionRenewalManager {
  private intervalId: NodeJS.Timeout | null = null
  private config: Required<SessionRenewalConfig>

  constructor(config: SessionRenewalConfig = {}) {
    this.config = {
      checkInterval: config.checkInterval ?? 5 * 60 * 1000, // 5 minutes
      renewalThreshold: config.renewalThreshold ?? 25,
      enabled: config.enabled !== false,
    }
  }

  /**
   * Start automatic session renewal
   */
  start(): void {
    if (!this.config.enabled) {
      return
    }

    // Check immediately
    this.checkAndRenew()

    // Then check at intervals
    this.intervalId = setInterval(() => {
      this.checkAndRenew()
    }, this.config.checkInterval)
  }

  /**
   * Stop automatic session renewal
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Check session and renew if needed
   */
  async checkAndRenew(): Promise<boolean> {
    try {
      const response = await fetch('/api/modules/user-management/auth/session?autoRenew=true', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      if (data.valid && data.renewed) {
        console.log('Session automatically renewed')
        return true
      }

      return data.valid
    } catch (error) {
      console.error('Session renewal check failed:', error)
      return false
    }
  }

  /**
   * Manually renew session
   */
  async renew(rememberMe?: boolean): Promise<boolean> {
    try {
      const response = await fetch('/api/modules/user-management/auth/session/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rememberMe }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      return data.success === true
    } catch (error) {
      console.error('Manual session renewal failed:', error)
      return false
    }
  }
}

/**
 * Create a session renewal manager instance
 */
export function createSessionRenewalManager(config?: SessionRenewalConfig): SessionRenewalManager {
  return new SessionRenewalManager(config)
}

/**
 * Default session renewal manager instance
 */
export const sessionRenewal = createSessionRenewalManager()


