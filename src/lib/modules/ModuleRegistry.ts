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
 * Module Registry
 * Central registry for all modules in the Cato Hansen Agency system
 */

export interface ModuleMeta {
  id: string
  name: string
  version: string
  standalone: boolean
  publishable: boolean
  license: 'MIT' | 'Proprietary'
  path: string
  api?: {
    endpoints: string[]
    sdk?: string
  }
  pricing?: {
    type: 'product' | 'open-source'
    plans?: string[]
  }
}

export const modules: ModuleMeta[] = [
  {
    id: 'hansen-security',
    name: 'Hansen Security',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/security2',
    api: {
      endpoints: ['/api/modules/hansen-security/check', '/api/modules/hansen-security/policies'],
      sdk: '@hansen-security/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional', 'Enterprise']
    }
  },
  {
    id: 'user-management',
    name: 'User Management',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/user-management',
    api: {
      endpoints: ['/api/modules/user-management/auth', '/api/modules/user-management/users'],
      sdk: '@hansen-user-management/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional']
    }
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/ai-agents',
    api: {
      endpoints: ['/api/modules/ai-agents/orchestrate', '/api/modules/ai-agents/run'],
      sdk: '@hansen-ai-agents/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional', 'Enterprise']
    }
  },
  {
    id: 'content-management',
    name: 'Content Management',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/content-management',
    api: {
      endpoints: ['/api/modules/content-management/content', '/api/modules/content-management/media'],
      sdk: '@hansen-cms/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional']
    }
  },
  {
    id: 'client-management',
    name: 'Client Management',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/client-management',
    api: {
      endpoints: ['/api/modules/client-management/clients', '/api/modules/client-management/leads'],
      sdk: '@hansen-crm/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional']
    }
  },
  {
    id: 'project-management',
    name: 'Project Management',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/project-management',
    api: {
      endpoints: ['/api/modules/project-management/projects', '/api/modules/project-management/tasks'],
      sdk: '@hansen-projects/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional']
    }
  },
  {
    id: 'billing-system',
    name: 'Billing System',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/billing-system',
    api: {
      endpoints: ['/api/modules/billing-system/invoices', '/api/modules/billing-system/payments'],
      sdk: '@hansen-billing/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional', 'Enterprise']
    }
  },
  {
    id: 'analytics',
    name: 'Analytics',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'Proprietary',
    path: '@/modules/analytics',
    api: {
      endpoints: ['/api/modules/analytics/metrics', '/api/modules/analytics/reports'],
      sdk: '@hansen-analytics/sdk'
    },
    pricing: {
      type: 'product',
      plans: ['Free', 'Starter', 'Professional', 'Enterprise']
    }
  },
  {
    id: 'shared',
    name: 'Shared Utilities',
    version: '1.0.0',
    standalone: true,
    publishable: true,
    license: 'MIT',
    path: '@/modules/shared',
    api: {
      endpoints: [],
      sdk: '@hansen-shared/utils'
    },
    pricing: {
      type: 'open-source',
      plans: []
    }
  }
]

/**
 * Get module by ID
 */
export function getModule(id: string): ModuleMeta | undefined {
  return modules.find(m => m.id === id)
}

/**
 * Get all sellable modules
 */
export function getSellableModules(): ModuleMeta[] {
  return modules.filter(m => m.pricing?.type === 'product')
}

/**
 * Get all open-source modules
 */
export function getOpenSourceModules(): ModuleMeta[] {
  return modules.filter(m => m.pricing?.type === 'open-source')
}

