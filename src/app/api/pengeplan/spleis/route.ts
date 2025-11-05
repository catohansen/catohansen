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
 * Spleis API Route
 * Fetches Pengeplan 2.0 campaign data from Spleis
 * 
 * TODO: When Spleis campaign is created, update with real API endpoint
 * For now, returns mock data with realistic structure
 */

import { NextRequest, NextResponse } from 'next/server'
import { withLogging } from '@/lib/observability/withLogging'

// In-memory cache (in production, use Redis via cacheManager)
const cache = new Map<string, { data: any; expires: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute

async function getSpleisData(request: NextRequest) {
  try {
    // Check cache first
    const cacheKey = 'spleis-pengeplan-2.0'
    const cached = cache.get(cacheKey)
    
    if (cached && cached.expires > Date.now()) {
      const response = NextResponse.json({
        success: true,
        data: cached.data,
        cached: true
      })
      response.headers.set('x-cache-hit', 'true')
      return response
    }

    // Use Spleis provider (replaces mock data)
    const { spleis } = await import('@/lib/spleis')
    
    // Try to get campaign from provider
    let campaignData = null
    try {
      const campaign = await spleis.getCampaign('pengeplan-2.0')
      if (campaign) {
        campaignData = {
          campaignId: campaign.id,
          title: campaign.title,
          raised: campaign.raisedNok,
          goal: campaign.goalNok,
          currency: campaign.currency || 'NOK',
          supporters: campaign.supporters || 0,
          daysLeft: campaign.daysLeft,
          progress: campaign.progress || (campaign.raisedNok / campaign.goalNok) * 100,
          recentDonations: campaign.recentDonations || [],
          fundingBreakdown: campaign.fundingBreakdown,
          stats: campaign.stats,
          url: campaign.url || process.env.SPLEIS_URL || 'https://www.spleis.no/projects/pengeplan-2.0',
          verified: campaign.verified || false,
          lastUpdated: campaign.updatedAt
        }
      }
    } catch (error) {
      console.error('Error fetching campaign from provider:', error)
    }

    // Fallback to empty data if provider returns nothing (instead of mock data)
    // This ensures we don't show fake data
    if (!campaignData) {
      campaignData = {
        campaignId: 'pengeplan-2.0',
        title: 'Pengeplan 2.0 - Enterprise AI økonomiplattform',
        raised: 0,
        goal: 100000,
        currency: 'NOK',
        supporters: 0,
        daysLeft: 0,
        progress: 0,
        recentDonations: [],
        fundingBreakdown: {},
        stats: {
          averageDonation: 0,
          largestDonation: 0,
          donationsToday: 0,
          donationsThisWeek: 0,
        },
        url: process.env.SPLEIS_URL || 'https://www.spleis.no/projects/pengeplan-2.0',
        verified: false,
        lastUpdated: new Date().toISOString()
      }
    }

    // Cache the result
    cache.set(cacheKey, {
      data: campaignData,
      expires: Date.now() + CACHE_TTL
    })

    const response = NextResponse.json({
      success: true,
      data: campaignData,
      cached: false
    })
    response.headers.set('x-cache-hit', 'false')
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
    
    return response
  } catch (error: any) {
    console.error('Spleis API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch Spleis data',
        data: null
      },
      { status: 500 }
    )
  }
}

// Export GET handler with logging
export const GET = withLogging(getSpleisData)

