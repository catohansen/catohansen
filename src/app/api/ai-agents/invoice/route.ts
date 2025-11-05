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
 * InvoiceAgent API Route
 * Invoice generation and payment automation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceAgent } from '@/modules/ai-agents/core/InvoiceAgent'
import { withLogging } from '@/lib/observability/withLogging'

export const POST = withLogging(async (req: NextRequest) => {
  try {
    const { action, data } = await req.json()

    if (!action || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing action or data' },
        { status: 400 }
      )
    }

    const agent = getInvoiceAgent()

    switch (action) {
      case 'generate-invoice':
        const invoice = await agent.generateInvoice(data.project)
        return NextResponse.json({ success: true, result: invoice })

      case 'payment-reminder':
        const reminder = await agent.generatePaymentReminder(data.invoice)
        return NextResponse.json({ success: true, result: reminder })

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('InvoiceAgent API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

