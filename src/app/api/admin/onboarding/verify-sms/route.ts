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
 * Onboarding - Verify SMS Code
 * Verifies SMS code for onboarding
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSMSCode, deleteSMSCode, verifySMSCode } from '@/lib/sms/codeStorage'

const schema = z.object({
  phone: z.string(),
  smsCode: z.string().length(6),
  email: z.string().email(),
})

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

    const { phone, smsCode, email } = parsed.data

    // Verify code
    if (!verifySMSCode(phone, smsCode)) {
      const stored = getSMSCode(phone)
      if (!stored) {
        return NextResponse.json(
          { success: false, error: 'SMS-kode ikke funnet. Send ny kode.' },
          { status: 400 }
        )
      }
      // Code is expired or invalid
      deleteSMSCode(phone)
      return NextResponse.json(
        { success: false, error: 'Ugyldig eller utløpt SMS-kode' },
        { status: 400 }
      )
    }

    // Code verified - delete from storage
    deleteSMSCode(phone)

    return NextResponse.json({
      success: true,
      message: 'SMS verified successfully',
    })
  } catch (error: any) {
    console.error('Verify SMS error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify SMS' },
      { status: 500 }
    )
  }
}

