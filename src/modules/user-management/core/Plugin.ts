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
 * Plugin System
 * Extensible plugin architecture for Hansen Auth
 * Inspired by Better Auth plugin system
 */

import type { AuthEngine } from './AuthEngine'
import type { SignInInput, SignUpInput, AuthResult } from './AuthEngine'

export interface AuthPlugin {
  name: string
  version: string
  description?: string
  
  /**
   * Initialize plugin
   */
  init?: (auth: AuthEngine) => void | Promise<void>

  /**
   * Hooks that can intercept auth flow
   */
  hooks?: {
    beforeSignIn?: (input: SignInInput) => Promise<SignInInput> | SignInInput
    afterSignIn?: (result: AuthResult) => Promise<void> | void
    beforeSignUp?: (input: SignUpInput) => Promise<SignUpInput> | SignUpInput
    afterSignUp?: (result: AuthResult) => Promise<void> | void
    beforeSignOut?: (sessionToken: string) => Promise<string> | string
    afterSignOut?: () => Promise<void> | void
  }

  /**
   * Custom API routes
   */
  routes?: Array<{
    path: string
    handler: (req: any, res: any) => Promise<any> | any
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  }>
}

/**
 * Plugin Manager
 * Manages plugin registration and execution
 */
export class PluginManager {
  private plugins: Map<string, AuthPlugin> = new Map()
  private auth: AuthEngine | null = null

  /**
   * Register a plugin
   */
  register(plugin: AuthPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered. Overwriting.`)
    }

    this.plugins.set(plugin.name, plugin)

    // Initialize plugin if auth engine is set
    if (this.auth && plugin.init) {
      plugin.init(this.auth)
    }
  }

  /**
   * Unregister a plugin
   */
  unregister(name: string): void {
    this.plugins.delete(name)
  }

  /**
   * Set auth engine (called by AuthEngine)
   */
  setAuth(auth: AuthEngine): void {
    this.auth = auth

    // Initialize all registered plugins
    for (const plugin of Array.from(this.plugins.values())) {
      if (plugin.init) {
        plugin.init(auth)
      }
    }
  }

  /**
   * Execute hook across all plugins
   */
  async executeHook<T extends keyof NonNullable<AuthPlugin['hooks']>>(
    hook: T,
    ...args: any[]
  ): Promise<any> {
    let result = args[0] as any

    for (const plugin of Array.from(this.plugins.values())) {
      if (plugin.hooks && plugin.hooks[hook]) {
        const hookFn = plugin.hooks[hook] as (...args: any[]) => any
        result = await hookFn(result)
      }
    }

    return result
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): AuthPlugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): AuthPlugin | undefined {
    return this.plugins.get(name)
  }

  /**
   * Check if plugin is registered
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name)
  }
}

/**
 * Create plugin manager instance
 */
export function createPluginManager() {
  return new PluginManager()
}

