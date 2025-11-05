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
 * Spleis Types
 * Type definitions for Spleis campaign data
 */

export type CampaignStatus = 'active' | 'ended' | 'paused'

export interface Campaign {
  id: string
  title: string
  status: CampaignStatus
  goalNok: number
  raisedNok: number
  currency?: string
  supporters?: number
  daysLeft?: number
  progress?: number
  updatedAt: string
  url?: string
  verified?: boolean
  recentDonations?: Array<{
    name: string
    amount: number
    time: string
  }>
  fundingBreakdown?: Record<string, {
    goal: number
    raised: number
    progress: number
  }>
  stats?: {
    averageDonation: number
    largestDonation: number
    donationsToday: number
    donationsThisWeek: number
  }
}



