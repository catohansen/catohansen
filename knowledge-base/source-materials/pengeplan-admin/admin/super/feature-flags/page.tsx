'use client'

import { useState, useEffect } from 'react'
import { 
  Flag, 
  Plus, 
  Trash2, 
  CheckCircle,
  XCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import AppShell from '@/components/layout/AppShell'

interface FeatureFlag {
  id: string
  key: string
  enabled: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export default function FeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [newFlag, setNewFlag] = useState({ key: '', description: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadFeatureFlags()
  }, [])

  const loadFeatureFlags = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/superadmin/feature-flags')
      if (response.ok) {
        const data = await response.json()
        setFlags(data.flags || [])
      }
    } catch (error) {
      console.error('Error loading feature flags:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFlag = async (flagId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/superadmin/feature-flags/${flagId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled })
      })
      
      if (response.ok) {
        loadFeatureFlags()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error toggling feature flag:', error)
      alert('Error toggling feature flag')
    }
  }

  const addFlag = async () => {
    if (!newFlag.key.trim()) {
      alert('Flag key is required')
      return
    }

    try {
      const response = await fetch('/api/superadmin/feature-flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFlag)
      })
      
      if (response.ok) {
        setNewFlag({ key: '', description: '' })
        setShowAddForm(false)
        loadFeatureFlags()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding feature flag:', error)
      alert('Error adding feature flag')
    }
  }

  const deleteFlag = async (flagId: string) => {
    if (!confirm('Are you sure you want to delete this feature flag?')) {
      return
    }

    try {
      const response = await fetch(`/api/superadmin/feature-flags/${flagId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadFeatureFlags()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting feature flag:', error)
      alert('Error deleting feature flag')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AppShell role="superadmin">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading feature flags...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="superadmin">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
            <p className="text-gray-600">Manage system feature toggles and experimental features</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Flag
          </Button>
        </div>

        {/* Add Flag Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Feature Flag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Flag Key</label>
                <input
                  type="text"
                  value={newFlag.key}
                  onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })}
                  placeholder="e.g., AI_ADVISOR_ENABLED"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newFlag.description}
                  onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                  placeholder="Describe what this flag controls..."
                  className="w-full px-3 py-2 border rounded-md h-20"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={addFlag}>Add Flag</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Flags List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flag className="w-5 h-5 mr-2" />
              Feature Flags ({flags.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flags.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No feature flags found. Add your first flag to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {flags.map((flag) => (
                  <div key={flag.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{flag.key}</h3>
                          <Badge variant={flag.enabled ? "default" : "secondary"}>
                            {flag.enabled ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Enabled
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Disabled
                              </>
                            )}
                          </Badge>
                        </div>
                        {flag.description && (
                          <p className="text-sm text-gray-600 mb-2">{flag.description}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(flag.createdAt)} | 
                          Updated: {formatDate(flag.updatedAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Enabled:</span>
                          <Switch
                            checked={flag.enabled}
                            onCheckedChange={(enabled) => toggleFlag(flag.id, enabled)}
                          />
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFlag(flag.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
