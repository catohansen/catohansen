'use client'

import React from 'react'
import { AdminErrorBoundary } from '@/components/ui/ErrorBoundary'

export default function TestErrorBoundary() {
  return (
    <AdminErrorBoundary>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Error Boundary Test</h1>
        <p>This page tests if AdminErrorBoundary is working correctly.</p>
        <button 
          onClick={() => {
            throw new Error('Test error to trigger ErrorBoundary')
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trigger Test Error
        </button>
      </div>
    </AdminErrorBoundary>
  )
}


