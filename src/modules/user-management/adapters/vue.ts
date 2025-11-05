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
 * Vue Adapter
 * Vue 3 composable for Hansen Auth (Better Auth style)
 */

// Vue types are optional - only needed when using Vue
// @ts-ignore - Vue is optional dependency
import { ref, computed, onMounted } from 'vue'
// @ts-ignore - Vue is optional dependency
import type { Ref } from 'vue'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: boolean
}

interface UseAuthReturn {
  user: Ref<User | null>
  loading: Ref<boolean>
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isAuthenticated: Ref<boolean>
}

/**
 * Vue composable for authentication
 * Similar to Better Auth's useAuth hook
 */
export function useAuth(): UseAuthReturn {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const isAuthenticated = computed(() => user.value !== null)

  const checkSession = async () => {
    try {
      const response = await fetch('/api/modules/user-management/auth/session', {
        credentials: 'include',
      })

      const data = await response.json()

      if (data.valid && data.user) {
        user.value = data.user
      } else {
        user.value = null
      }
    } catch (error) {
      console.error('Session check error:', error)
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await fetch('/api/modules/user-management/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        user.value = data.user
        return { success: true }
      }

      return { success: false, error: data.error || 'Sign in failed' }
    } catch (error: any) {
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/modules/user-management/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        user.value = data.user
        return { success: true }
      }

      return { success: false, error: data.error || 'Sign up failed' }
    } catch (error: any) {
      return { success: false, error: 'An error occurred during sign up' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/modules/user-management/auth/signout', {
        method: 'POST',
        credentials: 'include',
      })
      user.value = null
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Check session on mount
  onMounted(() => {
    checkSession()
  })

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
  }
}

