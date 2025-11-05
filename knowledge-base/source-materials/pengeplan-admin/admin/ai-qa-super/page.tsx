'use client'

import { useState, useEffect } from 'react'

// import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CheckResult {
  id: string
  name: string
  passed: boolean
  details: Record<string, unknown>
  createdAt: string
}

interface QARun {
  id: string
  startedAt: string
  finishedAt: string | null
  status: 'ok' | 'degraded' | 'fail'
  summary: string | null
  createdBy: string | null
  results: CheckResult[]
}

export default function AIQAPage() {
  const [runs, setRuns] = useState<QARun[]>([])
  const [selectedRun, setSelectedRun] = useState<QARun | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // const router = useRouter()

  useEffect(() => {
    fetchRuns()
  }, [])

  const fetchRuns = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/aiqa/runs')
      if (response.ok) {
        const data = await response.json()
        setRuns(data.runs || [])
      } else {
        console.error('Failed to fetch AI-QA runs')
      }
    } catch (error) {
      console.error('Error fetching AI-QA runs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runAIQA = async () => {
    try {
      setIsRunning(true)
      const response = await fetch('/api/admin/aiqa/run', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('AI-QA run completed:', data.result)
        await fetchRuns() // Refresh the list
      } else {
        const error = await response.json()
        console.error('AI-QA run failed:', error)
        alert(`AI-QA kjøring feilet: ${error.error}`)
      }
    } catch (error) {
      console.error('Error running AI-QA:', error)
      alert('Feil ved kjøring av AI-QA')
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge className="bg-green-100 text-green-700">OK</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-700">Degradert</Badge>
      case 'fail':
        return <Badge className="bg-red-100 text-red-700">Feil</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>
    }
  }

  const getCheckBadge = (passed: boolean) => {
    return passed ? 
      <Badge className="bg-green-100 text-green-800">✓ OK</Badge> : 
      <Badge className="bg-red-100 text-red-800">✗ Feil</Badge>
  }

  const formatDuration = (startedAt: string, finishedAt: string | null) => {
    if (!finishedAt) return 'Pågår...'
    const start = new Date(startedAt)
    const end = new Date(finishedAt)
    const diff = end.getTime() - start.getTime()
    return `${Math.round(diff / 1000)}s`
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('nb-NO')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-pp-dark">AI-QA Agent</h1>
          <p className="text-gray-600 mt-2">
            Automatisk kvalitetssikring og systemovervåking
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Cron status badge */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Cron:</span>
            <Badge className="bg-green-100 text-green-700">Aktiv</Badge>
          </div>
          
          <Button 
            onClick={runAIQA}
            disabled={isRunning}
            className="bg-pp-purple hover:bg-pp-purple-dark text-white"
          >
            {isRunning ? 'Kjører...' : 'Kjør AI-QA nå'}
          </Button>
        </div>
      </div>

      {/* Overall status */}
      {runs.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium">Siste status:</span>
            {getStatusBadge(runs[0]?.status || 'unknown')}
            <span className="text-gray-600">
              {runs[0]?.summary}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runs list */}
        <div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Siste Kjøringer</h3>
            {runs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Ingen AI-QA kjøringer ennå. Klikk &quot;Kjør AI-QA nå&quot; for å starte.
              </p>
            ) : (
              <div className="space-y-3">
                {runs.map((run) => (
                  <Card 
                    key={run.id} 
                    className={`p-4 cursor-pointer border-2 transition-colors ${
                      selectedRun?.id === run.id 
                        ? 'border-pp-purple bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRun(run)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(run.status)}
                        <span className="font-medium">
                          {run.results.length} sjekker
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDuration(run.startedAt, run.finishedAt)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatTime(run.startedAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {run.createdBy === 'cron' ? '🤖 Automatisk' : '👤 Manuell'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {run.results.filter(r => r.passed).length}/{run.results.length} passerte
                      </span>
                    </div>
                    
                    {run.summary && (
                      <p className="text-sm text-gray-600 mt-2 truncate">
                        {run.summary}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Run details */}
        <div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Detaljer</h3>
            {!selectedRun ? (
              <p className="text-gray-500 text-center py-8">
                Velg en kjøring fra listen for å se detaljer
              </p>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <div className="mt-1">{getStatusBadge(selectedRun.status)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Startet:</span>
                      <div className="mt-1 text-gray-600">
                        {formatTime(selectedRun.startedAt)}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Varighet:</span>
                      <div className="mt-1 text-gray-600">
                        {formatDuration(selectedRun.startedAt, selectedRun.finishedAt)}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Opprettet av:</span>
                      <div className="mt-1 text-gray-600">
                        {selectedRun.createdBy === 'cron' ? 'Automatisk (cron)' : selectedRun.createdBy}
                      </div>
                    </div>
                  </div>
                  
                  {selectedRun.summary && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-700">Sammendrag:</span>
                      <p className="mt-1 text-gray-600">{selectedRun.summary}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sjekker ({selectedRun.results.length})</h4>
                  <div className="space-y-3">
                    {selectedRun.results.map((check) => (
                      <Card key={check.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {getCheckBadge(check.passed)}
                            <span className="font-medium capitalize">
                              {check.name.replace(/-/g, ' ')}
                            </span>
                          </div>
                          {(check.details as Record<string, unknown>).responseTime ? (
                            <span className="text-xs text-gray-500">
                              {String((check.details as Record<string, unknown>).responseTime)}ms
                            </span>
                          ) : null}
                        </div>
                        
                        {(check.details as Record<string, unknown>).notes ? (
                          <p className="text-sm text-gray-600 mb-2">
                            {String((check.details as Record<string, unknown>).notes)}
                          </p>
                        ) : null}
                        
                        {(check.details as Record<string, unknown>).error ? (
                          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            <strong>Feil:</strong> {String((check.details as Record<string, unknown>).error)}
                          </p>
                        ) : null}
                        
                        {(check.details as Record<string, unknown>).httpStatus ? (
                          <div className="text-xs text-gray-500">
                            HTTP {String((check.details as Record<string, unknown>).httpStatus)}
                          </div>
                        ) : null}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

