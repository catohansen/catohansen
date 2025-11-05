'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Dynamically import the showcase component
const AISystemCardsShowcase = dynamic(
  () => import('@/components/admin/ai/AISystemCardsShowcase'),
  { ssr: false }
)

export default function AISystemCardsPage() {
  const router = useRouter()

  // Client-side guard for UX (server-side guard already in place)
  useEffect(() => {
    // Additional client-side validation could go here
    // Server-side Cerbos + middleware already handles security
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <AISystemCardsShowcase />
    </div>
  )
}
