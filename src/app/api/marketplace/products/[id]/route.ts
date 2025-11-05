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
 * Single Product API
 * Get detailed information about a specific product
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProductManager } from '@/modules/marketplace/core/ProductManager'
import { withLogging } from '@/lib/observability/withLogging'

export const GET = withLogging(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const productManager = getProductManager()
    const product = await productManager.getProduct(params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error: any) {
    console.error('Product API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

