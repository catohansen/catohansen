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
 * Modules Service
 * Central service for managing and retrieving module information
 * 
 * Performance: In-memory cache with TTL for fast response times
 */

import modulesData from '@/data/modules.json'

export interface Module {
  id: string
  name: string
  displayName?: string
  version?: string
  description?: string
  author?: string
  license?: string
  category?: string
  status?: string
  active?: boolean
  link?: string
  adminLink?: string
  apiLink?: string
  icon?: string
  color?: string
  badge?: string
  features?: string[]
  pricing?: any
  [key: string]: any // Allow additional properties
}

// In-memory cache for modules (1 minute TTL)
let modulesCache: Module[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60000 // 1 minute in milliseconds

/**
 * Get all modules
 * 
 * Performance: Uses in-memory cache with 1 minute TTL
 * Future: Can be upgraded to Redis for distributed caching
 */
export async function getModules(): Promise<Module[]> {
  try {
    const now = Date.now()
    
    // Return cached modules if still valid
    if (modulesCache && (now - cacheTimestamp) < CACHE_TTL) {
      return modulesCache
    }
    
    // Load modules from JSON file
    const modules = modulesData as Module[]
    
    // Update cache
    modulesCache = modules
    cacheTimestamp = now
    
    return modules
  } catch (error) {
    const { logger } = await import('@/lib/logger')
    logger.error('Failed to load modules', {}, error as Error)
    return []
  }
}

/**
 * Clear modules cache
 * Call this when modules.json is updated
 */
export function clearModulesCache(): void {
  modulesCache = null
  cacheTimestamp = 0
}

/**
 * Get module by ID
 */
export async function getModuleById(id: string): Promise<Module | null> {
  try {
    const modules = await getModules()
    return modules.find(m => m.id === id) || null
  } catch (error) {
    const { logger } = await import('@/lib/logger')
    logger.error(`Failed to get module ${id}`, { moduleId: id }, error as Error)
    return null
  }
}

/**
 * Get active modules only
 */
export async function getActiveModules(): Promise<Module[]> {
  try {
    const modules = await getModules()
    return modules.filter(m => m.active !== false)
  } catch (error) {
    const { logger } = await import('@/lib/logger')
    logger.error('Failed to get active modules', {}, error as Error)
    return []
  }
}

/**
 * Toggle module active status
 */
export async function toggleModule(id: string, active: boolean): Promise<Module[]> {
  try {
    const modules = await getModules()
    const moduleIndex = modules.findIndex(m => m.id === id)
    
    if (moduleIndex === -1) {
      throw new Error(`Module ${id} not found`)
    }

    const updated = modules.map((m, index) => 
      index === moduleIndex ? { ...m, active } : m
    )

    // Note: In production, this should update a database
    // For now, we'll just return the updated modules
    // The actual file write should be done via admin API
    const { logger } = await import('@/lib/logger')
    logger.info(`Module ${id} ${active ? 'activated' : 'deactivated'}`)
    
    return updated
  } catch (error) {
    const { logger } = await import('@/lib/logger')
    logger.error(`Failed to toggle module ${id}`, { moduleId: id, active }, error as Error)
    throw error
  }
}

/**
 * Update module metadata
 */
export async function updateModule(id: string, updates: Partial<Module>): Promise<Module[]> {
  try {
    const modules = await getModules()
    const moduleIndex = modules.findIndex(m => m.id === id)
    
    if (moduleIndex === -1) {
      throw new Error(`Module ${id} not found`)
    }

    const updated = modules.map((m, index) => 
      index === moduleIndex ? { ...m, ...updates } : m
    )

    // Note: In production, this should update a database
    // For now, we'll just return the updated modules
    // The actual file write should be done via admin API
    const { logger } = await import('@/lib/logger')
    logger.info(`Module ${id} updated`, { moduleId: id, updates })
    
    return updated
  } catch (error) {
    const { logger } = await import('@/lib/logger')
    logger.error(`Failed to update module ${id}`, { moduleId: id, updates }, error as Error)
    throw error
  }
}
