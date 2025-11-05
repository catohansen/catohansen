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
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client exists
 * Prevents connection pool exhaustion in development
 * 
 * REQUIRES DATABASE_URL environment variable
 * 
 * Usage:
 *   import { prisma } from '@/lib/db/prisma'
 *   const user = await prisma.user.findUnique(...)
 * 
 * Or for async compatibility:
 *   import { getPrismaClient } from '@/lib/db/prisma'
 *   const prisma = await getPrismaClient()
 *   const user = await prisma.user.findUnique(...)
 */

// Import PrismaClient - use standard import now that it's fixed
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Please configure your database connection.\n' +
      'See docs/guides/SETUP_REAL_DATABASE.md for setup instructions.\n' +
      '\n' +
      'Quick setup:\n' +
      '  1. Set DATABASE_URL in .env file (get from Neon/Supabase)\n' +
      '  2. Run: npx prisma generate\n' +
      '  3. Run: npm run db:push\n' +
      '  4. Run: npm run seed:owner\n'
    )
  }

  // Return existing instance or create new one
  return (
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  )
}

// Store Prisma instance globally to prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = createPrismaClient()
}

// Export singleton instance (sync)
export const prisma = createPrismaClient()

// Export function for async compatibility (backwards compatible)
export async function getPrismaClient(): Promise<PrismaClient> {
  return prisma
}

// Export function for explicit initialization (optional)
export function getPrismaClientInstance(): PrismaClient {
  return prisma
}

// Export type for TypeScript
export type { PrismaClient }

export default prisma
