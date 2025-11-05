'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Settings, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Brain,
  Zap,
  Shield,
  AlertTriangle
} from 'lucide-react'

interface AutoTranslationConfig {
  enabled: boolean
  autoDetect: boolean
  autoTranslate: boolean
  qualityThreshold: number
  backupBeforeTranslate: boolean
  realTimeScanning: boolean
  supportedLanguages: string[]
  excludedPaths: string[]
  includedExtensions: string[]
}

interface TranslationJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  detectedTexts: number
  translations: number
  createdAt: string
  completedAt?: string
  error?: string
}

interface SystemStatus {
  isRunning: boolean
  activeJobs: number
  config: AutoTranslationConfig
  lastScan?: string
}

export default function AutoTranslationPanel() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [activeJobs, setActiveJobs] = useState<TranslationJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<AutoTranslationConfig | null>(null)
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/translations/auto-system')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data.system)
        setActiveJobs(data.activeJobs)
        setConfig(data.system.config)
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error)
    }
  }

  const handleSystemAction = async (action: string, configData?: Partial<AutoTranslationConfig>) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/translations/auto-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, config: configData })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(data.message)
        await fetchSystemStatus()
      } else {
        const errorData = await response.json()
        setError(errorData.message)
      }
    } catch (error) {
      setError('Failed to perform action')
      console.error('Action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfigUpdate = (key: keyof AutoTranslationConfig, value: any) => {
    if (!config) return
    
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    handleSystemAction('config', newConfig)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!systemStatus || !config) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading Auto Translation System...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Auto Translation System
            <Badge variant={systemStatus.isRunning ? "default" : "secondary"}>
              {systemStatus.isRunning ? 'Running' : 'Stopped'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Automatisk deteksjon og oversettelse av hardkodet tekst
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* System Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => handleSystemAction('start')}
              disabled={loading || systemStatus.isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start System
            </Button>
            
            <Button
              onClick={() => handleSystemAction('stop')}
              disabled={loading || !systemStatus.isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Stop System
            </Button>
            
            <Button
              onClick={() => handleSystemAction('scan')}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Run Scan
            </Button>
            
            <Button
              onClick={() => setShowConfig(!showConfig)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configuration
            </Button>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Active Jobs</p>
                <p className="text-2xl font-bold text-blue-600">{systemStatus.activeJobs}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Zap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Real-time Scanning</p>
                <p className="text-2xl font-bold text-green-600">
                  {config.realTimeScanning ? 'ON' : 'OFF'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Quality Threshold</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(config.qualityThreshold * 100)}%
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      {showConfig && (
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              Konfigurer automatisk oversettelsessystem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Settings</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable System</p>
                  <p className="text-sm text-gray-600">Enable automatic translation system</p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => handleConfigUpdate('enabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Detect</p>
                  <p className="text-sm text-gray-600">Automatically detect hardcoded text</p>
                </div>
                <Switch
                  checked={config.autoDetect}
                  onCheckedChange={(checked) => handleConfigUpdate('autoDetect', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Translate</p>
                  <p className="text-sm text-gray-600">Automatically translate detected text</p>
                </div>
                <Switch
                  checked={config.autoTranslate}
                  onCheckedChange={(checked) => handleConfigUpdate('autoTranslate', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Real-time Scanning</p>
                  <p className="text-sm text-gray-600">Monitor file changes in real-time</p>
                </div>
                <Switch
                  checked={config.realTimeScanning}
                  onCheckedChange={(checked) => handleConfigUpdate('realTimeScanning', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Before Translate</p>
                  <p className="text-sm text-gray-600">Create backup before translating</p>
                </div>
                <Switch
                  checked={config.backupBeforeTranslate}
                  onCheckedChange={(checked) => handleConfigUpdate('backupBeforeTranslate', checked)}
                />
              </div>
            </div>

            {/* Quality Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Quality Settings</h4>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Quality Threshold</p>
                  <span className="text-sm text-gray-600">
                    {Math.round(config.qualityThreshold * 100)}%
                  </span>
                </div>
                <Slider
                  value={[config.qualityThreshold]}
                  onValueChange={([value]) => handleConfigUpdate('qualityThreshold', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum confidence level for AI translations
                </p>
              </div>
            </div>

            {/* Language Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Language Settings</h4>
              
              <div>
                <p className="font-medium mb-2">Supported Languages</p>
                <div className="flex flex-wrap gap-2">
                  {config.supportedLanguages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Translation Jobs</CardTitle>
            <CardDescription>
              Oversikt over aktive oversettelsesjobber
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="font-medium">Job {job.id.slice(-8)}</span>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Detected Texts:</span>
                        <span className="ml-2 font-medium">{job.detectedTexts}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Translations:</span>
                        <span className="ml-2 font-medium">{job.translations}</span>
                      </div>
                    </div>
                    
                    {job.error && (
                      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        Error: {job.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}





