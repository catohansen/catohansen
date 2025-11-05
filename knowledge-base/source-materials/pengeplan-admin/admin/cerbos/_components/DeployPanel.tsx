'use client'

import { useState } from 'react'
import { Rocket, History, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Policy {
  id: string
  name: string
  version: string
  status: string
  createdAt: string
}

interface Deployment {
  id: string
  versionTag: string
  status: string
  createdAt: string
  notes?: string
}

interface DeployPanelProps {
  policies: Policy[]
  deployments: Deployment[]
  onDeploy: (policyIds: string[], versionTag: string, notes?: string) => void
  onRollback: (deploymentId: string) => void
}

export function DeployPanel({ policies, deployments, onDeploy, onRollback }: DeployPanelProps) {
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [versionTag, setVersionTag] = useState('')
  const [notes, setNotes] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed': return <XCircle className="h-5 w-5 text-red-600" />
      case 'partial': return <Clock className="h-5 w-5 text-yellow-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Vellykket'
      case 'failed': return 'Feilet'
      case 'partial': return 'Delvis'
      default: return status
    }
  }

  const handlePolicyToggle = (policyId: string) => {
    setSelectedPolicies(prev => 
      prev.includes(policyId) 
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    )
  }

  const handleDeploy = async () => {
    if (selectedPolicies.length === 0 || !versionTag.trim()) {
      return
    }

    setIsDeploying(true)
    try {
      await onDeploy(selectedPolicies, versionTag.trim(), notes.trim() || undefined)
      setSelectedPolicies([])
      setVersionTag('')
      setNotes('')
    } finally {
      setIsDeploying(false)
    }
  }

  const generateVersionTag = () => {
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
    setVersionTag(`prod-${timestamp}`)
  }

  return (
    <div className="space-y-6">
      {/* Deploy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deploy Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Policy Selection */}
            <div>
              <Label className="text-base font-medium">Velg policies å deploye</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {policies.map((policy) => (
                  <div
                    key={policy.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPolicies.includes(policy.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePolicyToggle(policy.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{policy.name}</p>
                        <p className="text-sm text-gray-600">v{policy.version}</p>
                      </div>
                      <Badge className={policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {policy.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Tag */}
            <div>
              <Label htmlFor="versionTag">Version Tag</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="versionTag"
                  value={versionTag}
                  onChange={(e) => setVersionTag(e.target.value)}
                  placeholder="e.g. prod-2025-01-20T12:00Z"
                />
                <Button variant="outline" onClick={generateVersionTag}>
                  Generer
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notater (valgfri)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Beskriv endringene..."
                rows={3}
              />
            </div>

            {/* Deploy Button */}
            <Button
              onClick={handleDeploy}
              disabled={selectedPolicies.length === 0 || !versionTag.trim() || isDeploying}
              className="w-full"
            >
              <Rocket className="h-4 w-4 mr-2" />
              {isDeploying ? 'Deployer...' : `Deploy ${selectedPolicies.length} policy(ies)`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Deployment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deployments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Ingen deployments ennå
              </p>
            ) : (
              deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <p className="font-medium text-gray-900">{deployment.versionTag}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(deployment.createdAt).toLocaleString('nb-NO')}
                      </p>
                      {deployment.notes && (
                        <p className="text-sm text-gray-500 mt-1">{deployment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(deployment.status)}>
                      {getStatusLabel(deployment.status)}
                    </Badge>
                    {deployment.status === 'success' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRollback(deployment.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
















