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
 * Svelte Adapter
 * Svelte store for Hansen Auth (Better Auth style)
 */

// Svelte types are optional - only needed when using Svelte
// @ts-ignore - Svelte is optional dependency
import { writable, derived, get } from 'svelte/store'
// @ts-ignore - Svelte is optional dependency
import { onMount } from 'svelte'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: boolean
}

interface AuthStore {
  user: User | null
  loading: boolean
}

/**
 * Create auth store
 */
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthStore>({
    user: null,
    loading: true,
  })

  const checkSession = async () => {
    try {
      const response = await fetch('/api/modules/user-management/auth/session', {
        credentials: 'include',
      })

      const data = await response.json()

      if (data.valid && data.user) {
        update((state: any) => ({ ...state, user: data.user, loading: false }))
      } else {
        update((state: any) => ({ ...state, user: null, loading: false }))
      }
    } catch (error) {
      console.error('Session check error:', error)
      update((state: any) => ({ ...state, user: null, loading: false }))
    }
  }

  const signIn = async (email: string, password: string, rememberMe = false) => {
    update((state: any) => ({ ...state, loading: true }))
    
    try {
      const response = await fetch('/api/modules/user-management/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        update((state: any) => ({ ...state, user: data.user, loading: false }))
        return { success: true }
      }

      update((state: any) => ({ ...state, loading: false }))
      return { success: false, error: data.error || 'Sign in failed' }
    } catch (error: any) {
      update((state: any) => ({ ...state, loading: false }))
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    update((state: any) => ({ ...state, loading: true }))
    
    try {
      const response = await fetch('/api/modules/user-management/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        update((state: any) => ({ ...state, user: data.user, loading: false }))
        return { success: true }
      }

      update((state: any) => ({ ...state, loading: false }))
      return { success: false, error: data.error || 'Sign up failed' }
    } catch (error: any) {
      update((state: any) => ({ ...state, loading: false }))
      return { success: false, error: 'An error occurred during sign up' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/modules/user-management/auth/signout', {
        method: 'POST',
        credentials: 'include',
      })
      update((state: any) => ({ ...state, user: null }))
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Auto-check session on initialization
  if (typeof window !== 'undefined') {
    checkSession()
  }

  return {
    subscribe,
    signIn,
    signUp,
    signOut,
    checkSession,
  }
}

/**
 * Auth store instance
 */
export const authStore = createAuthStore()

/**
 * Derived stores
 */
export const user = derived(authStore, ($authStore: any) => $authStore.user)
export const loading = derived(authStore, ($authStore: any) => $authStore.loading)
export const isAuthenticated = derived(authStore, ($authStore: any) => $authStore.user !== null)

/**
 * useAuth hook for Svelte (similar to Better Auth)
 */
export function useAuth() {
  return {
    user,
    loading,
    isAuthenticated,
    signIn: authStore.signIn,
    signUp: authStore.signUp,
    signOut: authStore.signOut,
  }
}

