'use client'

import { useState, useEffect } from 'react'
import { useAdminPage } from '@/contexts/AdminPageContext'

export default function SimpleAdminDashboard() {
  const [loading, setLoading] = useState(true)
  const { setPageInfo } = useAdminPage()

  useEffect(() => {
    setPageInfo(
      'Simple Admin Dashboard',
      'Enkel test-versjon av admin dashboard',
      null
    )
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [setPageInfo])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laster admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Simple Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              System Status
            </h2>
            <p className="text-green-600 font-medium">All systems operational</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Active Users
            </h2>
            <p className="text-blue-600 font-medium">1,247 users</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Revenue
            </h2>
            <p className="text-purple-600 font-medium">NOK 2.4M</p>
          </div>
        </div>
        
        <div className="mt-8">
          <a 
            href="/admin" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gå tilbake til full admin dashboard
          </a>
        </div>
      </div>
    </div>
  )
}


