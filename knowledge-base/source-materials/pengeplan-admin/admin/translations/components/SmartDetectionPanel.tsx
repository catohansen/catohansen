'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Search, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Upload,
  Eye,
  EyeOff,
  Settings,
  FileText,
  Target,
  Zap,
  Loader2
} from 'lucide-react'
import { AdminCard } from '@/components/admin/AdminCard'

interface DetectedText {
  text: string
  file: string
  line: number
  column: number
  context: string
  suggestedKey: string
  confidence: number
  language: 'no' | 'en' | 'unknown'
  category: string
  isAlreadyTranslated: boolean
  existingTranslation?: string
}

interface DetectionResult {
  totalFiles: number
  scannedFiles: number
  detectedTexts: DetectedText[]
  summary: {
    norwegian: number
    english: number
    unknown: number
    alreadyTranslated: number
    needsTranslation: number
  }
  suggestions: {
    highConfidence: DetectedText[]
    mediumConfidence: DetectedText[]
    lowConfidence: DetectedText[]
  }
}

interface SmartDetectionPanelProps {
  onDetectedTexts?: (texts: DetectedText[]) => void
  onAutoTranslate?: (texts: DetectedText[]) => void
}

export default function SmartDetectionPanel({ 
  onDetectedTexts, 
  onAutoTranslate 
}: SmartDetectionPanelProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showOnlyMissing, setShowOnlyMissing] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All', count: 0 },
    { id: 'economy', name: 'Economy', count: 0 },
    { id: 'family', name: 'Family', count: 0 },
    { id: 'admin', name: 'Admin', count: 0 },
    { id: 'security', name: 'Security', count: 0 },
    { id: 'ui', name: 'UI', count: 0 },
    { id: 'error', name: 'Error', count: 0 },
    { id: 'general', name: 'General', count: 0 }
  ]

  const startScan = async () => {
    setIsScanning(true)
    setError(null)
    setScanProgress(0)
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/translations/smart-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      clearInterval(progressInterval)
      setScanProgress(100)

      if (!response.ok) {
        throw new Error('Scan failed')
      }

      const result = await response.json()
      setDetectionResult(result)
      
      // Update category counts
      categories.forEach(category => {
        if (category.id === 'all') {
          category.count = result.detectedTexts.length
        } else {
          category.count = result.detectedTexts.filter(
            (text: DetectedText) => text.category === category.id
          ).length
        }
      })

      if (onDetectedTexts) {
        onDetectedTexts(result.detectedTexts)
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Scan failed')
    } finally {
      setIsScanning(false)
      setTimeout(() => setScanProgress(0), 1000)
    }
  }

  const handleAutoTranslate = async () => {
    if (!detectionResult) return

    const missingTexts = detectionResult.detectedTexts.filter(
      text => !text.isAlreadyTranslated
    )

    if (onAutoTranslate) {
      onAutoTranslate(missingTexts)
    }
  }

  const filteredTexts = detectionResult?.detectedTexts.filter(text => {
    const categoryMatch = selectedCategory === 'all' || text.category === selectedCategory
    const missingMatch = !showOnlyMissing || !text.isAlreadyTranslated
    return categoryMatch && missingMatch
  }) || []

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return 'default'
    if (confidence >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminCard noHover={true}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Search className="h-6 w-6 text-blue-600" />
              Smart Text Detection
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Automatically detect hardcoded text and suggest translation keys
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={startScan}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Button>
            {detectionResult && (
              <Button
                onClick={handleAutoTranslate}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Auto Translate
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Scanning codebase...</span>
              <span>{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </AdminCard>

      {/* Results Summary */}
      {detectionResult && (
        <AdminCard noHover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scan Results</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {detectionResult.scannedFiles}
                </div>
                <div className="text-sm text-gray-600">Files Scanned</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {detectionResult.summary.needsTranslation}
                </div>
                <div className="text-sm text-gray-600">Need Translation</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {detectionResult.summary.alreadyTranslated}
                </div>
                <div className="text-sm text-gray-600">Already Translated</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {detectionResult.suggestions.highConfidence.length}
                </div>
                <div className="text-sm text-gray-600">High Confidence</div>
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Filters */}
      {detectionResult && (
        <AdminCard noHover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlyMissing}
                  onChange={(e) => setShowOnlyMissing(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show only missing translations</span>
              </label>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Detected Texts List */}
      {detectionResult && (
        <AdminCard noHover={true}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Detected Texts ({filteredTexts.length})
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTexts.map((text, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          "{text.text}"
                        </span>
                        <Badge variant={getConfidenceBadge(text.confidence)}>
                          {text.confidence}%
                        </Badge>
                        <Badge variant="outline">
                          {text.category}
                        </Badge>
                        <Badge variant="outline">
                          {text.language}
                        </Badge>
                        {text.isAlreadyTranslated && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Translated
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Suggested Key:</strong> {text.suggestedKey}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <strong>File:</strong> {text.file}:{text.line}
                      </div>
                      
                      {text.context && (
                        <div className="text-sm text-gray-500 mt-1">
                          <strong>Context:</strong> {text.context.substring(0, 100)}...
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4" />
                      </Button>
                      {!text.isAlreadyTranslated && (
                        <Button size="sm" variant="outline">
                          <Zap className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  )
}





