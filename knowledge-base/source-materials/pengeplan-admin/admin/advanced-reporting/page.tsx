'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  PrinterIcon,
  ShareIcon,
  EyeIcon,
  CogIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ChartPieIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'

import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'FINANCIAL' | 'USER' | 'SYSTEM' | 'AI' | 'AUTOMATION'
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON'
  lastGenerated?: Date
  isScheduled: boolean
  aiGenerated: boolean
}

interface ReportData {
  templates: ReportTemplate[]
  recentReports: Array<{
    id: string
    name: string
    generatedAt: Date
    size: string
    format: string
    status: 'COMPLETED' | 'GENERATING' | 'FAILED'
  }>
  scheduledReports: Array<{
    id: string
    name: string
    nextRun: Date
    frequency: string
    isActive: boolean
  }>
}

export default function AdvancedReportingPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedFormat, setSelectedFormat] = useState('ALL')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/advanced-reporting')
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        // Fallback til mock data
        setReportData(getMockReportData())
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      setReportData(getMockReportData())
    } finally {
      setLoading(false)
    }
  }

  const getMockReportData = (): ReportData => ({
    templates: [
      {
        id: '1',
        name: 'Økonomisk Helse-rapport',
        description: 'Komplett oversikt over brukernes økonomiske helse og risikoscore',
        category: 'FINANCIAL',
        frequency: 'MONTHLY',
        format: 'PDF',
        lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isScheduled: true,
        aiGenerated: true
      },
      {
        id: '2',
        name: 'AI-Coaching Statistikk',
        description: 'Detaljert analyse av AI-coaching effektivitet og brukerrespons',
        category: 'AI',
        frequency: 'WEEKLY',
        format: 'EXCEL',
        lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isScheduled: true,
        aiGenerated: true
      },
      {
        id: '3',
        name: 'Automasjon Ytelse',
        description: 'Rapport over automasjonsregler, kjøringer og suksessrate',
        category: 'AUTOMATION',
        frequency: 'DAILY',
        format: 'CSV',
        lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isScheduled: true,
        aiGenerated: false
      },
      {
        id: '4',
        name: 'Brukeraktivitet Dashboard',
        description: 'Omfattende brukeraktivitet og engasjement metrics',
        category: 'USER',
        frequency: 'WEEKLY',
        format: 'PDF',
        isScheduled: false,
        aiGenerated: false
      },
      {
        id: '5',
        name: 'System Ytelse',
        description: 'Teknisk ytelse, feil og optimalisering forslag',
        category: 'SYSTEM',
        frequency: 'MONTHLY',
        format: 'JSON',
        isScheduled: true,
        aiGenerated: true
      }
    ],
    recentReports: [
      {
        id: 'r1',
        name: 'Økonomisk Helse-rapport - Desember 2024',
        generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        size: '2.4 MB',
        format: 'PDF',
        status: 'COMPLETED'
      },
      {
        id: 'r2',
        name: 'AI-Coaching Statistikk - Uke 51',
        generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        size: '1.8 MB',
        format: 'EXCEL',
        status: 'COMPLETED'
      },
      {
        id: 'r3',
        name: 'Automasjon Ytelse - Daglig',
        generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        size: '456 KB',
        format: 'CSV',
        status: 'GENERATING'
      }
    ],
    scheduledReports: [
      {
        id: 's1',
        name: 'Økonomisk Helse-rapport',
        nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        frequency: 'MONTHLY',
        isActive: true
      },
      {
        id: 's2',
        name: 'AI-Coaching Statistikk',
        nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        frequency: 'WEEKLY',
        isActive: true
      },
      {
        id: 's3',
        name: 'System Ytelse',
        nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        frequency: 'MONTHLY',
        isActive: true
      }
    ]
  })

  const generateReport = async (templateId: string) => {
    try {
      setIsGenerating(true)
      
      const response = await fetch(`/api/admin/advanced-reporting/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templateId })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${templateId}-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FINANCIAL':
        return <ChartBarIcon className="w-5 h-5 text-green-400" />
      case 'USER':
        return <EyeIcon className="w-5 h-5 text-blue-400" />
      case 'SYSTEM':
        return <CogIcon className="w-5 h-5 text-purple-400" />
      case 'AI':
        return <ChartPieIcon className="w-5 h-5 text-pink-400" />
      case 'AUTOMATION':
        return <TableCellsIcon className="w-5 h-5 text-orange-400" />
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-400" />
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <DocumentTextIcon className="w-4 h-4 text-red-500" />
      case 'EXCEL':
        return <TableCellsIcon className="w-4 h-4 text-green-500" />
      case 'CSV':
        return <TableCellsIcon className="w-4 h-4 text-blue-500" />
      case 'JSON':
        return <CogIcon className="w-4 h-4 text-purple-500" />
      default:
        return <DocumentTextIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400'
      case 'GENERATING':
        return 'text-yellow-400'
      case 'FAILED':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const filteredTemplates = reportData?.templates.filter(template => {
    const categoryMatch = selectedCategory === 'ALL' || template.category === selectedCategory
    const formatMatch = selectedFormat === 'ALL' || template.format === selectedFormat
    return categoryMatch && formatMatch
  }) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/20 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 Avanserte Rapporter
          </h1>
          <p className="text-blue-200 text-lg">
            Generer og administrer omfattende rapporter med AI-drevet analyse
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20"
          >
            <option value="ALL">Alle kategorier</option>
            <option value="FINANCIAL">Økonomisk</option>
            <option value="USER">Bruker</option>
            <option value="SYSTEM">System</option>
            <option value="AI">AI</option>
            <option value="AUTOMATION">Automasjon</option>
          </select>
          
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20"
          >
            <option value="ALL">Alle formater</option>
            <option value="PDF">PDF</option>
            <option value="EXCEL">Excel</option>
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
          </select>
        </div>

        {/* Report Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.map((template) => (
            <GlassmorphismCard key={template.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getCategoryIcon(template.category)}
                  <span className="ml-2 text-white font-medium">{template.name}</span>
                </div>
                <div className="flex items-center">
                  {getFormatIcon(template.format)}
                  {template.aiGenerated && (
                    <span className="ml-1 text-xs bg-purple-500 text-white px-2 py-1 rounded">AI</span>
                  )}
                </div>
              </div>
              
              <p className="text-blue-200 text-sm mb-4">{template.description}</p>
              
              <div className="flex items-center justify-between text-sm text-blue-200 mb-4">
                <span>Frekvens: {template.frequency}</span>
                <span>Format: {template.format}</span>
              </div>
              
              {template.lastGenerated && (
                <p className="text-blue-200 text-xs mb-4">
                  Sist generert: {template.lastGenerated.toLocaleDateString('no-NO')}
                </p>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => generateReport(template.id)}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Genererer...' : 'Generer'}
                </button>
                <button className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  <CogIcon className="w-4 h-4" />
                </button>
              </div>
            </GlassmorphismCard>
          ))}
        </div>

        {/* Recent Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Siste Rapporter</h3>
            <div className="space-y-3">
              {reportData?.recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center">
                    {getFormatIcon(report.format)}
                    <div className="ml-3">
                      <p className="text-white font-medium">{report.name}</p>
                      <p className="text-blue-200 text-sm">
                        {report.generatedAt.toLocaleDateString('no-NO')} • {report.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <button className="p-1 hover:bg-white/20 rounded">
                      <DocumentArrowDownIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Planlagte Rapporter</h3>
            <div className="space-y-3">
              {reportData?.scheduledReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{report.name}</p>
                    <p className="text-blue-200 text-sm">
                      Neste kjøring: {report.nextRun.toLocaleDateString('no-NO')}
                    </p>
                    <p className="text-blue-200 text-sm">
                      Frekvens: {report.frequency}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${report.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <button className="p-1 hover:bg-white/20 rounded">
                      <CogIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
        </div>

        {/* Quick Actions */}
        <GlassmorphismCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Hurtighandlinger</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <DocumentArrowDownIcon className="w-6 h-6 text-white mr-2" />
              <span className="text-white">Eksporter alle</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <CalendarIcon className="w-6 h-6 text-white mr-2" />
              <span className="text-white">Planlegg rapport</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <ShareIcon className="w-6 h-6 text-white mr-2" />
              <span className="text-white">Del rapport</span>
            </button>
            <button className="flex items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <PrinterIcon className="w-6 h-6 text-white mr-2" />
              <span className="text-white">Skriv ut</span>
            </button>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  )
}

















