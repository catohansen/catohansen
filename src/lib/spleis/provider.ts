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
 * Spleis Provider Interface
 * Abstraction for Spleis data sources (cache, live API, etc.)
 */

import { Campaign } from './types'

export interface SpleisProvider {
  /**
   * List all campaigns
   */
  listCampaigns(): Promise<Campaign[]>

  /**
   * Get a specific campaign by ID
   */
  getCampaign(id: string): Promise<Campaign | null>

  /**
   * Refresh campaign data
   */
  refreshCampaign(id: string): Promise<Campaign | null>
}



