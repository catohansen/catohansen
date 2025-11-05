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
 * Security Settings Manager
 * Manages security configuration settings for Hansen Security
 * 
 * Features:
 * - Remember Me / Stay Logged In toggle
 * - Session duration settings
 * - Security feature toggles
 * - Policy settings
 */

import { prisma } from '@/lib/db/prisma'

export interface SecuritySettings {
  // Authentication settings
  rememberMeEnabled: boolean
  defaultSessionDurationDays: number
  maxSessionDurationDays: number
  
  // Security features
  requireMFA: boolean
  requireStrongPasswords: boolean
  enableAccountLockout: boolean
  maxFailedAttempts: number
  lockoutDurationMinutes: number
  
  // Audit settings
  enableAuditLogging: boolean
  auditRetentionDays: number
  
  // Policy settings
  denyByDefault: boolean
  enablePolicyVersioning: boolean
  
  // Last updated
  updatedAt: Date
  updatedBy: string
}

const DEFAULT_SETTINGS: SecuritySettings = {
  rememberMeEnabled: true,
  defaultSessionDurationDays: 7,
  maxSessionDurationDays: 30,
  requireMFA: false,
  requireStrongPasswords: true,
  enableAccountLockout: true,
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 30,
  enableAuditLogging: true,
  auditRetentionDays: 90,
  denyByDefault: true,
  enablePolicyVersioning: true,
  updatedAt: new Date(),
  updatedBy: 'system'
}

/**
 * Security Settings Manager
 * Handles loading, updating, and caching of security settings
 */
export class SecuritySettingsManager {
  private static cache: SecuritySettings | null = null
  private static cacheExpiry: number = 0
  private static CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Get current security settings
   * Uses cache for performance
   */
  static async getSettings(): Promise<SecuritySettings> {
    // Check cache first
    if (this.cache && Date.now() < this.cacheExpiry) {
      return this.cache
    }

    try {
      // Try to load from database (if we have a settings table)
      // For now, return defaults
      const settings = DEFAULT_SETTINGS
      
      // Update cache
      this.cache = settings
      this.cacheExpiry = Date.now() + this.CACHE_TTL
      
      return settings
    } catch (error) {
      console.error('Failed to load security settings:', error)
      // Return defaults on error
      return DEFAULT_SETTINGS
    }
  }

  /**
   * Update security settings
   */
  static async updateSettings(
    updates: Partial<SecuritySettings>,
    updatedBy: string
  ): Promise<SecuritySettings> {
    const currentSettings = await this.getSettings()
    
    const newSettings: SecuritySettings = {
      ...currentSettings,
      ...updates,
      updatedAt: new Date(),
      updatedBy
    }
    
    // TODO: Save to database when we add settings table
    // For now, update cache
    this.cache = newSettings
    this.cacheExpiry = Date.now() + this.CACHE_TTL
    
    return newSettings
  }

  /**
   * Check if Remember Me is enabled
   */
  static async isRememberMeEnabled(): Promise<boolean> {
    const settings = await this.getSettings()
    return settings.rememberMeEnabled
  }

  /**
   * Get default session duration
   */
  static async getDefaultSessionDuration(): Promise<number> {
    const settings = await this.getSettings()
    return settings.defaultSessionDurationDays
  }

  /**
   * Get max session duration (for Remember Me)
   */
  static async getMaxSessionDuration(): Promise<number> {
    const settings = await this.getSettings()
    return settings.maxSessionDurationDays
  }

  /**
   * Clear cache (useful for testing or after updates)
   */
  static clearCache(): void {
    this.cache = null
    this.cacheExpiry = 0
  }
}

export const securitySettings = SecuritySettingsManager





