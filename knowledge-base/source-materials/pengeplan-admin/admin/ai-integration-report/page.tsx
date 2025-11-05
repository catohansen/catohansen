import type { Metadata } from 'next'

import AIIntegrationReportClient from './parts/AIIntegrationReportClient'

export const metadata: Metadata = {
  title: 'AI Integration Report - Admin',
  description: 'Comprehensive AI integration analytics and performance metrics',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AIIntegrationReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Integration Report</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analytics for AI integrations, performance metrics, and usage patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>

      <AIIntegrationReportClient />
    </div>
  )
}

































