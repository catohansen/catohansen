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
 * Nora Hansen Security Integration
 * Connector for Hansen Security RBAC/ABAC system
 */

import { hansenSecurity } from '@/modules/security2/sdk'
import type { Principal, Resource } from '@/modules/security2/sdk'

/**
 * Check if user has permission to use Nora
 */
export async function checkNoraPermission(
  userId: string,
  userRole: string,
  action: 'chat' | 'memory' | 'voice' | 'automation' | 'admin'
): Promise<boolean> {
  try {
    const principal: Principal = {
      id: userId,
      roles: [userRole],
      attributes: { userId }
    }

    const resource: Resource = {
      kind: 'nora',
      id: 'nora-module',
      attributes: {
        module: 'nora',
        action
      }
    }

    const result = await hansenSecurity.check(principal, resource, action)
    return result.allowed
  } catch (error: any) {
    console.error('❌ Nora permission check failed:', error)
    return false
  }
}

/**
 * Check if user can access admin panel
 */
export async function checkAdminAccess(
  userId: string,
  userRole: string
): Promise<boolean> {
  try {
    const principal: Principal = {
      id: userId,
      roles: [userRole],
      attributes: { userId }
    }

    const resource: Resource = {
      kind: 'admin',
      id: 'nora-admin',
      attributes: {
        module: 'nora'
      }
    }

    const result = await hansenSecurity.check(principal, resource, 'access')
    return result.allowed
  } catch (error: any) {
    console.error('❌ Admin access check failed:', error)
    return false
  }
}



