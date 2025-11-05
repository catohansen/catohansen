'use client'

import { useState, useEffect } from 'react'

import BuildHealthClient from './parts/BuildHealthClient'

export default function BuildHealthPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  // Mock build data for client component
  const recentBuilds: Record<string, unknown>[] = []
  const stats: Record<string, unknown>[] = []
  const latestBuilds: Record<string, unknown>[] = []

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Build Health Monitor</h1>
        <p className="text-gray-600 mt-2">
          Overvåk build-status for alle miljøer og få varsler ved feil
        </p>
      </div>

      <BuildHealthClient 
        initialBuilds={recentBuilds as any}
        initialStats={stats as any}
        initialLatestBuilds={latestBuilds as any}
      />
    </div>
  )
}
