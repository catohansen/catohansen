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
 * React Adapter
 * React hooks for User Management (Better Auth style)
 */

'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check session on mount
    fetch('/api/modules/user-management/auth/session', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.user) {
          setUser(data.user)
        }
      })
      .catch((err) => {
        console.error('Session check error:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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
        setUser(data.user)
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
        setUser(data.user)
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
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}





