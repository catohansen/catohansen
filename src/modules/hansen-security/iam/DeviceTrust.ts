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
 * Device Trust
 * Device posture and trust management
 * 
 * Features:
 * - Device fingerprinting
 * - Trusted device management
 * - Device compliance checking
 * - Device posture assessment
 */

export interface DeviceInfo {
  deviceId: string
  fingerprint: string
  userAgent: string
  ipAddress?: string
  trusted: boolean
  compliance: {
    encrypted: boolean
    passwordProtected: boolean
    mfaEnabled: boolean
    updated: boolean
  }
  lastSeen: Date
  createdAt: Date
}

export interface DevicePosture {
  trusted: boolean
  compliant: boolean
  encrypted: boolean
  riskScore: number // 0-100
  issues: string[]
}

export class DeviceTrust {
  private devices: Map<string, DeviceInfo> = new Map()
  private trustedDevices: Map<string, Set<string>> = new Map() // userId -> deviceIds

  /**
   * Register or update device
   */
  registerDevice(
    userId: string,
    deviceInfo: Omit<DeviceInfo, 'lastSeen' | 'createdAt'>
  ): DeviceInfo {
    const existing = this.devices.get(deviceInfo.deviceId)
    
    const device: DeviceInfo = existing || {
      ...deviceInfo,
      lastSeen: new Date(),
      createdAt: new Date()
    }

    device.lastSeen = new Date()

    this.devices.set(deviceInfo.deviceId, device)

    return device
  }

  /**
   * Mark device as trusted
   */
  markAsTrusted(userId: string, deviceId: string): void {
    if (!this.trustedDevices.has(userId)) {
      this.trustedDevices.set(userId, new Set())
    }
    
    this.trustedDevices.get(userId)!.add(deviceId)

    // Update device trust status
    const device = this.devices.get(deviceId)
    if (device) {
      device.trusted = true
      this.devices.set(deviceId, device)
    }
  }

  /**
   * Revoke device trust
   */
  revokeTrust(userId: string, deviceId: string): void {
    this.trustedDevices.get(userId)?.delete(deviceId)

    const device = this.devices.get(deviceId)
    if (device) {
      device.trusted = false
      this.devices.set(deviceId, device)
    }
  }

  /**
   * Check if device is trusted
   */
  isTrusted(userId: string, deviceId: string): boolean {
    return this.trustedDevices.get(userId)?.has(deviceId) || false
  }

  /**
   * Get device posture
   */
  getDevicePosture(deviceId: string): DevicePosture | null {
    const device = this.devices.get(deviceId)
    if (!device) {
      return null
    }

    const issues: string[] = []
    let riskScore = 0

    if (!device.compliance.encrypted) {
      issues.push('Device not encrypted')
      riskScore += 30
    }

    if (!device.compliance.passwordProtected) {
      issues.push('Device not password protected')
      riskScore += 20
    }

    if (!device.compliance.mfaEnabled) {
      issues.push('MFA not enabled')
      riskScore += 15
    }

    if (!device.compliance.updated) {
      issues.push('Device not up to date')
      riskScore += 25
    }

    if (!device.trusted) {
      issues.push('Device not trusted')
      riskScore += 10
    }

    return {
      trusted: device.trusted,
      compliant: issues.length === 0,
      encrypted: device.compliance.encrypted,
      riskScore: Math.min(riskScore, 100),
      issues
    }
  }

  /**
   * Get trusted devices for user
   */
  getTrustedDevices(userId: string): DeviceInfo[] {
    const deviceIds = this.trustedDevices.get(userId)
    if (!deviceIds) {
      return []
    }

    const devices: DeviceInfo[] = []
    for (const deviceId of Array.from(deviceIds)) {
      const device = this.devices.get(deviceId)
      if (device) {
        devices.push(device)
      }
    }

    return devices
  }

  /**
   * Generate device fingerprint
   */
  generateFingerprint(userAgent: string, ipAddress?: string): string {
    // Simple fingerprinting (in production, use more sophisticated method)
    const data = `${userAgent}:${ipAddress || 'unknown'}`
    // In production, use crypto.createHash
    return Buffer.from(data).toString('base64').substring(0, 32)
  }

  /**
   * Check device compliance
   */
  checkCompliance(deviceInfo: Partial<DeviceInfo>): {
    compliant: boolean
    issues: string[]
  } {
    const issues: string[] = []

    if (deviceInfo.compliance) {
      if (!deviceInfo.compliance.encrypted) {
        issues.push('Device encryption required')
      }
      if (!deviceInfo.compliance.passwordProtected) {
        issues.push('Device password protection required')
      }
      if (!deviceInfo.compliance.updated) {
        issues.push('Device software updates required')
      }
    }

    return {
      compliant: issues.length === 0,
      issues
    }
  }
}

// Default device trust instance
export const deviceTrust = new DeviceTrust()

