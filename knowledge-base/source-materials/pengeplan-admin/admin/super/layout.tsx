'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import AppShell from '@/components/layout/AppShell'

interface User {
  id: string
  email: string
  name: string
  role: string
  plan: string
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.push('/login')
          return
        }

        const userData = await response.json()
        
        // Check if user has SUPERADMIN role
        if (userData.role !== 'SUPERADMIN') {
          router.push('/dashboard')
          return
        }

        setUser(userData)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-pp-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pp-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Verifiserer SuperAdmin tilgang...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AppShell role="superadmin">
      {children}
    </AppShell>
  )
}
