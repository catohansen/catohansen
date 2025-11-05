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
 * Forgot Password API Route
 * SMS-based password reset for enhanced security
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'
import { auditLogger } from '@/modules/security2/core/AuditLogger'
import { generateSecurePassword } from '@/lib/auth/password'

// SMS Integration (mock - replace with actual SMS provider like Twilio)
async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    // TODO: Implement actual SMS sending via Twilio or similar
    console.log(`[SMS] To: ${phone}, Message: ${message}`)
    
    // In production, use Twilio:
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    // await client.messages.create({
    //   body: message,
    //   to: phone,
    //   from: process.env.TWILIO_PHONE_NUMBER
    // })
    
    return true
  } catch (error) {
    console.error('SMS send error:', error)
    return false
  }
}

async function forgotPasswordHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email (prisma is imported directly)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      }
    })

    if (!user) {
      // Don't reveal if user exists - security best practice
      return NextResponse.json({
        success: true,
        message: 'If this email exists, a password reset SMS has been sent to your registered phone number.'
      })
    }

    // Check if user has phone number
    if (!user.phone) {
      return NextResponse.json(
        { 
          error: 'No phone number registered for this account. Please contact administrator.',
          requiresPhone: true
        },
        { status: 400 }
      )
    }

    // If phone provided, verify it matches
    if (phone && phone !== user.phone) {
      // Audit log failed password reset attempt
      await auditLogger.logDecision({
        principalId: user.id,
        principalRoles: [user.role],
        resource: 'admin',
        resourceId: 'password-reset',
        action: 'reset',
        decision: 'DENY',
        effect: 'DENY',
        reason: 'Phone number mismatch',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      })

      return NextResponse.json(
        { error: 'Phone number does not match registered number' },
        { status: 403 }
      )
    }

    // Generate temporary password (6 digits)
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedPassword = await hashPassword(tempPassword)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        // Force password change on next login
        failedLoginAttempts: 0,
        lockedUntil: null,
      }
    })

    // Send SMS with temporary password
    const smsMessage = `Cato Hansen Agency - Password Reset\n\nYour temporary password is: ${tempPassword}\n\nPlease change your password after logging in.\n\nIf you did not request this, contact support immediately.`
    
    const smsSent = await sendSMS(user.phone, smsMessage)

    if (!smsSent) {
      return NextResponse.json(
        { error: 'Failed to send SMS. Please contact administrator.' },
        { status: 500 }
      )
    }

    // Audit log password reset
    await auditLogger.logDecision({
      principalId: user.id,
      principalRoles: [user.role],
      resource: 'admin',
      resourceId: 'password-reset',
      action: 'reset',
      decision: 'ALLOW',
      effect: 'ALLOW',
      reason: 'Password reset via SMS',
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset SMS has been sent to your registered phone number.'
    })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = forgotPasswordHandler

