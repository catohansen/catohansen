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
 * Onboarding - Send SMS Verification Code
 * Sends SMS verification code for onboarding
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { storeSMSCode } from '@/lib/sms/codeStorage'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
})

async function sendSMS(phone: string, message: string): Promise<boolean> {
  // TODO: Integrate with actual SMS provider (Twilio, etc.)
  // For now, log to console in development
  console.log(`[SMS] To: ${phone}, Message: ${message}`)
  
  // In production, use Twilio:
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  // await client.messages.create({ body: message, to: phone, from: process.env.TWILIO_PHONE_NUMBER })
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      )
    }

    const { name, email, phone } = parsed.data

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store code (expires in 10 minutes)
    storeSMSCode(phone, code)

    // Send SMS
    const message = `Hei ${name}! Din verifiseringskode er: ${code}. Gyldig i 10 minutter.`
    await sendSMS(phone, message)

    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
    })
  } catch (error: any) {
    console.error('Send SMS error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}

