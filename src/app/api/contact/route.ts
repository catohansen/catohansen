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
 * Contact Form API Route
 * Handles contact form submissions
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
// import { prisma } from '@/lib/db/prisma'
import { audit } from '@/lib/audit/audit'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  message: z.string().min(10).max(5000),
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

    const { name, email, message } = parsed.data

    // Store contact form submission
    // TODO: In production, send email notification
    // TODO: Store in database ContactForm table
    
    // For now, log to console and audit log
    console.log('Contact form submission:', { name, email, message })
    
    // Audit log
    await audit(request, {
      action: 'contact_form_submission',
      resource: 'contact',
      meta: {
        name,
        email,
        messageLength: message.length,
      },
    })

    // TODO: Send email notification
    // await sendEmail({
    //   to: 'cato@catohansen.no',
    //   subject: `Contact Form: ${name}`,
    //   body: `From: ${email}\n\n${message}`,
    // })

    return NextResponse.json({
      success: true,
      message: 'Takk for henvendelsen! Vi kommer tilbake til deg så snart som mulig.',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Kunne ikke sende melding. Prøv igjen senere.' },
      { status: 500 }
    )
  }
}

