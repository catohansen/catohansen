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
 * Email Tracking API Route
 * POST /api/modules/client-management/emails/[id]/track
 */

import { NextRequest, NextResponse } from 'next/server'
import { EmailSystem } from '@/modules/client-management/core/EmailSystem'
import { withLogging } from '@/lib/observability/withLogging'

const emailSystem = new EmailSystem()

async function trackEmail(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') // 'open', 'click'

    if (action === 'open') {
      await emailSystem.trackEmailOpen(params.id)
    } else if (action === 'click') {
      const link = searchParams.get('link') || undefined
      await emailSystem.trackEmailClick(params.id, link)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Return 1x1 transparent pixel for email tracking
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )

    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error: any) {
    console.error('Track email error:', error)
    // Still return pixel even on error to avoid breaking email clients
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )
    return new NextResponse(pixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache'
      }
    })
  }
}

export const GET = withLogging(trackEmail)







