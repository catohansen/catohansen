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
 * Sign Out API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/modules/user-management/core/AuthEngine'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (token) {
      await auth.signOut(token)
    }

    const response = NextResponse.json({ success: true })
    
    // Clear cookie
    response.cookies.delete('auth-token')

    return response
  } catch (error: any) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during sign out' },
      { status: 500 }
    )
  }
}





