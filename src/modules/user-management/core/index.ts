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
 * User Management Core
 * Framework-agnostic core exports
 * Inspired by Better Auth architecture
 */

export { AuthEngine, createAuth, auth } from './AuthEngine'
export type {
  AuthConfig,
  SignInInput,
  SignUpInput,
  AuthResult,
  AuthSession,
} from './AuthEngine'

export { OAuthProvider, createOAuthProvider } from './OAuthProvider'
export type {
  OAuthProviderName,
  OAuthConfig,
  OAuthProviderConfig,
  OAuthUserInfo,
} from './OAuthProvider'

export { PluginManager, createPluginManager } from './Plugin'
export type { AuthPlugin } from './Plugin'

export { userManager, UserManager } from './UserManager'
export type { UserData, CreateUserInput, UpdateUserInput } from './UserManager'

export { roleManager, RoleManager } from './RoleManager'
export { permissionManager, PermissionManager } from './PermissionManager'
export { rbacEngine, RBACEngine } from './RBACEngine'

// Re-export from other modules if needed
export { policyEngine } from '@/modules/security2/core/PolicyEngine'

// Re-export adapters
export { useAuth, AuthProvider } from '../adapters/react'
export { useAuth as useAuthVue } from '../adapters/vue'
export { useAuth as useAuthSvelte, authStore, user, loading, isAuthenticated } from '../adapters/svelte'

