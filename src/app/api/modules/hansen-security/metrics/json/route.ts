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
 * Metrics JSON API Route
 * Return metrics as JSON
 */

import { NextResponse } from 'next/server'
import { metricsCollector } from '@/modules/security2/core/MetricsCollector'

export async function GET() {
  try {
    const metrics = metricsCollector.getMetrics()
    
    return NextResponse.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    console.error('Metrics JSON API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





