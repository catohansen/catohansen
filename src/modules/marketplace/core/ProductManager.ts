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
 * Product Manager
 * Manages module products, pricing, and availability in marketplace
 */

import { prisma } from '@/lib/db/prisma'

export interface Product {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  version: string
  author: string
  license: 'PROPRIETARY' | 'MIT' | 'OPEN_SOURCE'
  pricing: {
    free?: boolean
    starter?: number
    professional?: number
    enterprise?: number | 'custom'
  }
  features: string[]
  demo?: string
  docs?: string
  github?: string
  npm?: string
  status: 'active' | 'beta' | 'coming_soon' | 'deprecated'
}

export class ProductManager {
  /**
   * List all available products in marketplace
   */
  async listProducts(filters?: {
    category?: string
    license?: string
    status?: string
  }): Promise<Product[]> {
    try {
      const where: any = {}
      
      if (filters?.category) {
        where.category = filters.category
      }
      
      if (filters?.status) {
        where.status = filters.status
      } else {
        // Default: only show active and beta
        where.status = { in: ['ACTIVE', 'BETA'] }
      }

      const modules = await prisma.module.findMany({
        where,
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
          category: true,
          version: true,
          license: true,
          status: true,
          githubRepo: true,
          githubUrl: true,
          npmPackage: true,
          publishable: true
        },
        orderBy: [
          { publishable: 'desc' }, // Publishable modules first
          { displayName: 'asc' }
        ]
      })

      // Map to Product format with hardcoded pricing and features
      const products: Product[] = modules.map(module => {
        // Hardcoded pricing per module (will move to database later)
        const pricingMap: Record<string, any> = {
          'hansen-security': { starter: 999, professional: 1999, enterprise: 'custom' },
          'nora': { starter: 1499, professional: 2999, enterprise: 'custom' },
          'client-management': { starter: 499, professional: 1499, enterprise: 'custom' }
        }
        
        // Hardcoded features per module
        const featuresMap: Record<string, string[]> = {
          'hansen-security': ['Fine-grained access control', 'Policy-as-code', 'Audit logging'],
          'nora': ['Multi-modal AI', 'RAG', 'Memory engine', 'Voice support'],
          'client-management': ['Lead management', 'Pipeline tracking', 'AI insights']
        }
        
        return {
          id: module.id,
          name: module.name,
          displayName: module.displayName,
          description: module.description || '',
          category: module.category || 'general',
          version: module.version,
          author: 'Cato Hansen',
          license: module.license as 'PROPRIETARY' | 'MIT' | 'OPEN_SOURCE',
          pricing: pricingMap[module.name] || { free: true },
          features: featuresMap[module.name] || [],
          demo: `/${module.name}`,
          docs: `/${module.name}/docs`,
          github: module.githubUrl || module.githubRepo || undefined,
          npm: module.npmPackage || undefined,
          status: (module.status || 'active').toLowerCase() as 'active' | 'beta' | 'coming_soon' | 'deprecated'
        }
      })

      return products
    } catch (error: any) {
      console.error('Failed to list products:', error)
      throw new Error(`Failed to list products: ${error.message}`)
    }
  }

  /**
   * Get single product by ID or name
   */
  async getProduct(identifier: string): Promise<Product | null> {
    try {
      const module = await prisma.module.findFirst({
        where: {
          OR: [
            { id: identifier },
            { name: identifier }
          ]
        },
        include: {
          dependencies: {
            include: {
              dependsOn: {
                select: {
                  id: true,
                  name: true,
                  displayName: true,
                  version: true
                }
              }
            }
          },
          releases: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      })

      if (!module) {
        return null
      }

      // Hardcoded pricing and features (same as listProducts)
      const pricingMap: Record<string, any> = {
        'hansen-security': { starter: 999, professional: 1999, enterprise: 'custom' },
        'nora': { starter: 1499, professional: 2999, enterprise: 'custom' },
        'client-management': { starter: 499, professional: 1499, enterprise: 'custom' }
      }
      
      const featuresMap: Record<string, string[]> = {
        'hansen-security': ['Fine-grained access control', 'Policy-as-code', 'Audit logging', 'Real-time metrics'],
        'nora': ['Multi-modal AI', 'RAG', 'Memory engine', 'Voice support', 'Emotion engine'],
        'client-management': ['Lead management', 'Pipeline tracking', 'AI insights', 'Automation']
      }

      return {
        id: module.id,
        name: module.name,
        displayName: module.displayName,
        description: module.description || '',
        category: module.category || 'general',
        version: module.version,
        author: 'Cato Hansen',
        license: module.license as 'PROPRIETARY' | 'MIT' | 'OPEN_SOURCE',
        pricing: pricingMap[module.name] || { free: true },
        features: featuresMap[module.name] || [],
        demo: `/${module.name}`,
        docs: `/${module.name}/docs`,
        github: module.githubUrl || module.githubRepo || undefined,
        npm: module.npmPackage || undefined,
        status: (module.status || 'active').toLowerCase() as 'active' | 'beta' | 'coming_soon' | 'deprecated'
      }
    } catch (error: any) {
      console.error('Failed to get product:', error)
      return null
    }
  }

  /**
   * Get featured products (for homepage)
   */
  async getFeaturedProducts(limit: number = 3): Promise<Product[]> {
    const allProducts = await this.listProducts({ status: 'active' })
    
    // Prioritize: Hansen Security, Nora, CRM
    const featured = ['hansen-security', 'nora', 'client-management']
    
    return allProducts
      .filter(p => featured.includes(p.name))
      .slice(0, limit)
  }
}

// Singleton instance
let productManager: ProductManager | null = null

export function getProductManager(): ProductManager {
  if (!productManager) {
    productManager = new ProductManager()
  }
  return productManager
}

