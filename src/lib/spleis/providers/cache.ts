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
 * Spleis Cache Provider
 * Reads campaign data from database cache (replaces mock data)
 */

import { SpleisProvider } from '../provider'
import { Campaign } from '../types'
import { getPrismaClient } from '@/lib/db/prisma'

export class CacheProvider implements SpleisProvider {
  async listCampaigns(): Promise<Campaign[]> {
    try {
      // For now, return empty array - can be extended with SpleisCampaign model later
      // This replaces the mock data pattern
      const prisma = await getPrismaClient()
      
      // If SpleisCampaign model exists, use it:
      // const rows = await prisma.spleisCampaign.findMany({ orderBy: { updatedAt: 'desc' } })
      // return rows.map(this.mapToCampaign)
      
      // For now, return empty array (no campaigns cached yet)
      return []
    } catch (error) {
      console.error('Error listing campaigns from cache:', error)
      return []
    }
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    try {
      // For now, return null - can be extended with SpleisCampaign model later
      const prisma = await getPrismaClient()
      
      // If SpleisCampaign model exists:
      // const row = await prisma.spleisCampaign.findUnique({ where: { id } })
      // return row ? this.mapToCampaign(row) : null
      
      return null
    } catch (error) {
      console.error('Error getting campaign from cache:', error)
      return null
    }
  }

  async refreshCampaign(id: string): Promise<Campaign | null> {
    // For cache provider, refresh just returns current cached data
    return this.getCampaign(id)
  }

  // Helper to map database row to Campaign type
  private mapToCampaign(row: any): Campaign {
    return {
      id: row.id,
      title: row.title,
      status: row.status as Campaign['status'],
      goalNok: Number(row.goalNok || 0),
      raisedNok: Number(row.raisedNok || 0),
      currency: row.currency || 'NOK',
      supporters: row.supporters || 0,
      daysLeft: row.daysLeft || undefined,
      progress: row.progress || 0,
      updatedAt: row.updatedAt.toISOString(),
      url: row.url || undefined,
      verified: row.verified || false
    }
  }
}



