'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Play,
  Pause,
  Square,
  Settings,
  Target,
  Clock,
  TrendingUp,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react'
import { AdminCard } from '@/components/admin/AdminCard'

interface TranslationJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  totalItems: number
  completedItems: number
  results: any[]
  errors: string[]
  startedAt: Date
  completedAt?: Date
  estimatedTimeRemaining?: number
}

interface EnhancedAIPanelProps {
  onJobComplete?: (job: TranslationJob) => void
  onJobError?: (job: TranslationJob) => void
}

export default function EnhancedAIPanel({ 
  onJobComplete, 
  onJobError 
}: EnhancedAIPanelProps) {
  const [activeJobs, setActiveJobs] = useState<TranslationJob[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedJob, setSelectedJob] = useState<TranslationJob | null>(null)
  const [aiSettings, setAiSettings] = useState({
    confidenceThreshold: 85,
    sourceLanguage: 'no',
    targetLanguage: 'en',
    culturalAdaptation: true,
    tone: 'friendly' as 'formal' | 'casual' | 'friendly' | 'professional',
    maxLength: 200
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Poll for job updates
    const interval = setInterval(() => {
      fetchActiveJobs()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const fetchActiveJobs = async () => {
    try {
      const response = await fetch('/api/translations/ai-jobs')
      if (response.ok) {
        const jobs = await response.json()
        setActiveJobs(jobs)
      }
    } catch (error) {
      console.error('Failed to fetch active jobs:', error)
    }
  }

  const startBatchTranslation = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/translations/enhanced-ai-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: aiSettings,
          autoDetect: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start batch translation')
      }

      const job = await response.json()
      setActiveJobs(prev => [...prev, job])
      setSelectedJob(job)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start translation')
    } finally {
      setIsProcessing(false)
    }
  }

  const cancelJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/translations/ai-jobs/${jobId}/cancel`, {
        method: 'POST'
      })

      if (response.ok) {
        setActiveJobs(prev => prev.filter(job => job.id !== jobId))
        if (selectedJob?.id === jobId) {
          setSelectedJob(null)
        }
      }
    } catch (error) {
      console.error('Failed to cancel job:', error)
    }
  }

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'processing': return 'text-blue-600'
      case 'failed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'processing': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'outline'
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminCard noHover={true}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Enhanced AI Translation
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Context-aware translation with cultural adaptation and quality scoring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={startBatchTranslation}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isProcessing ? 'Starting...' : 'Start Batch Translation'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </AdminCard>

      {/* AI Settings */}
      <AdminCard noHover={true}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Confidence Threshold</Label>
                <Input
                  type="number"
                  value={aiSettings.confidenceThreshold}
                  onChange={(e) => setAiSettings(prev => ({
                    ...prev,
                    confidenceThreshold: parseInt(e.target.value)
                  }))}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum confidence for auto-approval
                </p>
              </div>
              
              <div>
                <Label>Source Language</Label>
                <select
                  value={aiSettings.sourceLanguage}
                  onChange={(e) => setAiSettings(prev => ({
                    ...prev,
                    sourceLanguage: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="no">Norwegian (Norsk)</option>
                  <option value="en">English</option>
                </select>
              </div>
              
              <div>
                <Label>Target Language</Label>
                <select
                  value={aiSettings.targetLanguage}
                  onChange={(e) => setAiSettings(prev => ({
                    ...prev,
                    targetLanguage: e.target.value
                  }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="en">English</option>
                  <option value="no">Norwegian (Norsk)</option>
                  <option value="se">Swedish (Svenska)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="da">Danish (Dansk)</option>
                  <option value="fi">Finnish (Suomi)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Tone</Label>
                <select
                  value={aiSettings.tone}
                  onChange={(e) => setAiSettings(prev => ({
                    ...prev,
                    tone: e.target.value as any
                  }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
              
              <div>
                <Label>Max Length</Label>
                <Input
                  type="number"
                  value={aiSettings.maxLength}
                  onChange={(e) => setAiSettings(prev => ({
                    ...prev,
                    maxLength: parseInt(e.target.value)
                  }))}
                  min="10"
                  max="500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum translation length
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="culturalAdaptation"
                  checked={aiSettings.culturalAdaptation}
                  onChange={(e) => setAiSettings(prev => ({
                    ...prev,
                    culturalAdaptation: e.target.checked
                  }))}
                  className="rounded"
                />
                <Label htmlFor="culturalAdaptation">
                  Cultural Adaptation
                </Label>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <AdminCard noHover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Active Translation Jobs</h3>
            
            <div className="space-y-3">
              {activeJobs.map(job => (
                <div
                  key={job.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedJob?.id === job.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Job {job.id}</span>
                        <Badge variant={getJobStatusBadge(job.status)}>
                          {job.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {job.completedItems}/{job.totalItems} items
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Started: {job.startedAt.toLocaleTimeString()}</span>
                        {job.estimatedTimeRemaining && (
                          <span>ETA: {formatDuration(job.estimatedTimeRemaining)}</span>
                        )}
                        {job.completedAt && (
                          <span>Completed: {job.completedAt.toLocaleTimeString()}</span>
                        )}
                      </div>
                      
                      {job.status === 'processing' && (
                        <div className="mt-2">
                          <Progress value={job.progress} className="h-2" />
                        </div>
                      )}
                      
                      {job.errors.length > 0 && (
                        <div className="mt-2">
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              {job.errors.length} error(s) occurred
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {job.status === 'processing' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            cancelJob(job.id)
                          }}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedJob(job)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      )}

      {/* Job Details */}
      {selectedJob && (
        <AdminCard noHover={true}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Job Details: {selectedJob.id}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedJob(null)}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedJob.totalItems}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {selectedJob.completedItems}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedJob.results.length}
                </div>
                <div className="text-sm text-gray-600">Results</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {selectedJob.errors.length}
                </div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>
            
            {selectedJob.status === 'processing' && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{selectedJob.progress}%</span>
                </div>
                <Progress value={selectedJob.progress} className="h-2" />
              </div>
            )}
          </div>
        </AdminCard>
      )}
    </div>
  )
}


