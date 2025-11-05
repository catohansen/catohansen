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
 * Marketplace Products API
 * Public API for listing available modules/products
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProductManager } from '@/modules/marketplace/core/ProductManager'
import { withLogging } from '@/lib/observability/withLogging'

export const GET = withLogging(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined
    const status = searchParams.get('status') || undefined
    
    const productManager = getProductManager()
    const products = await productManager.listProducts({
      category,
      status
    })

    return NextResponse.json({
      success: true,
      products,
      total: products.length
    })
  } catch (error: any) {
    console.error('Marketplace API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

