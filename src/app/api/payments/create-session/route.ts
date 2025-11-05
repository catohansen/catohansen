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
 * Stripe Checkout Session API
 * Create checkout session for module purchases
 * 
 * PHASE 3A: Ready for Stripe integration
 * Add STRIPE_SECRET_KEY to .env to activate
 */

import { NextRequest, NextResponse } from 'next/server'
import { withLogging } from '@/lib/observability/withLogging'

export const POST = withLogging(async (req: NextRequest) => {
  try {
    const { moduleId, plan, priceId } = await req.json()

    // Validate input
    if (!moduleId || !plan) {
      return NextResponse.json(
        { success: false, error: 'Missing moduleId or plan' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Stripe not configured. Contact cato@catohansen.no for purchase.',
        contactEmail: 'cato@catohansen.no',
        moduleId,
        plan
      }, { status: 503 })
    }

    // TODO: Implement actual Stripe checkout when STRIPE_SECRET_KEY is added
    // 
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_URL}/marketplace/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_URL}/marketplace`,
    //   metadata: { moduleId, plan }
    // })
    // 
    // return NextResponse.json({ success: true, sessionId: session.id })

    return NextResponse.json({
      success: false,
      message: 'Stripe integration ready - add STRIPE_SECRET_KEY to activate',
      contactEmail: 'cato@catohansen.no'
    })
  } catch (error: any) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
})

