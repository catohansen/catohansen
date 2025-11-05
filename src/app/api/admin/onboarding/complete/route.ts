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
 * Onboarding - Complete Registration
 * Completes onboarding and creates user account
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(8),
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

    const { name, email, phone, password } = parsed.data

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'E-postadresse er allerede registrert' },
        { status: 400 }
      )
    }

    // Create user
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        phone,
        passwordHash,
        role: 'EDITOR',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    })

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const token = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await prisma.session.create({
      data: {
        sessionToken: token,
        userId: user.id,
        expires: expiresAt,
      },
    })

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user,
      message: 'Konto opprettet!',
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Onboarding complete error:', error)
    return NextResponse.json(
      { success: false, error: 'Kunne ikke opprette konto' },
      { status: 500 }
    )
  }
}

