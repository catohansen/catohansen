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
 * Seed Owner User API Route
 * Creates/updates owner account with proper credentials
 * SECURE: Only accessible in development or with special secret
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'

async function seedOwnerHandler(request: NextRequest) {
  try {
    // Security: Only allow in development or with secret
    const secret = request.headers.get('x-seed-secret')
    const allowedSecret = process.env.SEED_SECRET || 'dev-secret-change-in-production'

    if (process.env.NODE_ENV === 'production' && secret !== allowedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const prisma = await getPrismaClient()

    // Owner credentials
    const ownerEmail = 'cato@catohansen.no'
    const ownerPassword = 'Kilma2386!!'
    const ownerName = 'Cato Hansen'
    
    // Hash password
    const passwordHash = await hashPassword(ownerPassword)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail }
    })

    if (existingUser) {
      // Update existing user
      const updated = await prisma.user.update({
        where: { email: ownerEmail },
        data: {
          name: ownerName,
          passwordHash,
          role: 'OWNER',
          status: 'ACTIVE',
          emailVerified: true,
          emailVerifiedAt: new Date(),
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Owner account updated',
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          role: updated.role
        }
      })
    } else {
      // Create new owner user
      const created = await prisma.user.create({
        data: {
          email: ownerEmail,
          name: ownerName,
          passwordHash,
          role: 'OWNER',
          status: 'ACTIVE',
          emailVerified: true,
          emailVerifiedAt: new Date(),
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Owner account created',
        user: {
          id: created.id,
          email: created.email,
          name: created.name,
          role: created.role
        }
      })
    }
  } catch (error: any) {
    console.error('Seed owner error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = seedOwnerHandler







