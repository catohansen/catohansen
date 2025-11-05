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
 * Seed Owner User Script
 * Creates/updates owner account with proper credentials
 * Run: npx tsx src/scripts/seed-owner.ts
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth/password'

const prisma = new PrismaClient()

async function seedOwner() {
  try {
    console.log('🌱 Seeding owner account...')

    const ownerEmail = 'cato@catohansen.no'
    const ownerPassword = 'Kilma2386!!'
    const ownerName = 'Cato Hansen'

    // Hash password
    const passwordHash = await hashPassword(ownerPassword)
    console.log('✅ Password hashed')

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

      console.log('✅ Owner account updated')
      console.log(`   Email: ${updated.email}`)
      console.log(`   Role: ${updated.role}`)
      console.log(`   Status: ${updated.status}`)
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

      console.log('✅ Owner account created')
      console.log(`   ID: ${created.id}`)
      console.log(`   Email: ${created.email}`)
      console.log(`   Role: ${created.role}`)
      console.log(`   Status: ${created.status}`)
    }

    console.log('')
    console.log('🎉 Owner account seeded successfully!')
    console.log(`   Login with: ${ownerEmail}`)
    console.log(`   Password: ${ownerPassword}`)

  } catch (error) {
    console.error('❌ Error seeding owner:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedOwner()







