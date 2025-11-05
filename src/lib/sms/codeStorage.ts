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
 * SMS Code Storage
 * Temporary storage for SMS verification codes
 * In production, use Redis or database
 */

interface SMSCode {
  code: string
  phone: string
  expiresAt: number
  createdAt: number
}

// Temporary in-memory storage (use Redis in production)
const smsCodes = new Map<string, SMSCode>()

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = Date.now()
  const phonesToDelete: string[] = []
  smsCodes.forEach((code, phone) => {
    if (now > code.expiresAt) {
      phonesToDelete.push(phone)
    }
  })
  phonesToDelete.forEach(phone => smsCodes.delete(phone))
}, 5 * 60 * 1000)

export function storeSMSCode(phone: string, code: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
  smsCodes.set(phone, {
    code,
    phone,
    expiresAt,
    createdAt: Date.now(),
  })
}

export function getSMSCode(phone: string): SMSCode | undefined {
  return smsCodes.get(phone)
}

export function deleteSMSCode(phone: string): void {
  smsCodes.delete(phone)
}

export function verifySMSCode(phone: string, code: string): boolean {
  const stored = smsCodes.get(phone)
  if (!stored) return false
  if (Date.now() > stored.expiresAt) {
    smsCodes.delete(phone)
    return false
  }
  return stored.code === code
}

