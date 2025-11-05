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
 * Spleis Provider Factory
 * Returns the active Spleis provider based on environment
 */

import { SpleisProvider } from './provider'
import { CacheProvider } from './providers/cache'
// import { LiveProvider } from './providers/live' // TODO: Implement when Spleis API is ready

// Use cache provider for now (replaces mock data)
// Switch to LiveProvider when Spleis API integration is ready
export const spleis: SpleisProvider = new CacheProvider()

// Export types for use in API routes
export type { Campaign, CampaignStatus } from './types'
export type { SpleisProvider } from './provider'



