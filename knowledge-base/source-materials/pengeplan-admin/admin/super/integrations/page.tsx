'use client'

import { useState, useEffect } from 'react'
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AppShell from '@/components/layout/AppShell'

interface IntegrationKey {
  id: string
  name: string
  provider: string
  last4: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function Integrations() {
  const [keys, setKeys] = useState<IntegrationKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newKey, setNewKey] = useState({ name: '', provider: '', key: '' })

  useEffect(() => {
    loadIntegrationKeys()
  }, [])

  const loadIntegrationKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/superadmin/integrations')
      if (response.ok) {
        const data = await response.json()
        setKeys(data.keys || [])
      }
    } catch (error) {
      console.error('Error loading integration keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const addKey = async () => {
    if (!newKey.name.trim() || !newKey.provider.trim() || !newKey.key.trim()) {
      alert('All fields are required')
      return
    }

    try {
      const response = await fetch('/api/superadmin/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newKey)
      })
      
      if (response.ok) {
        setNewKey({ name: '', provider: '', key: '' })
        setShowAddForm(false)
        loadIntegrationKeys()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding integration key:', error)
      alert('Error adding integration key')
    }
  }

  const toggleKeyStatus = async (keyId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/superadmin/integrations/${keyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })
      
      if (response.ok) {
        loadIntegrationKeys()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error toggling key status:', error)
      alert('Error toggling key status')
    }
  }

  const deleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this integration key?')) {
      return
    }

    try {
      const response = await fetch(`/api/superadmin/integrations/${keyId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadIntegrationKeys()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting integration key:', error)
      alert('Error deleting integration key')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
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
      <AppShell role="superadmin" user={{ email: 'temp@temp.com', name: 'Temp', role: 'superadmin' }}>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading integration keys...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="superadmin" user={{ email: 'temp@temp.com', name: 'Temp', role: 'superadmin' }}>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">API Keys & Integrations</h1>
            <p className="text-gray-600">Manage API keys and third-party integrations</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Key
          </Button>
        </div>

        {/* Add Key Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Integration Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="e.g., OpenAI API Key"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <input
                  type="text"
                  value={newKey.provider}
                  onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                  placeholder="e.g., OpenAI, Resend, Stripe"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                  placeholder="Enter the API key..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={addKey}>Add Key</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Integration Keys List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Integration Keys ({keys.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {keys.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No integration keys found. Add your first key to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {keys.map((key) => (
                  <div key={key.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{key.name}</h3>
                          <Badge variant="outline">{key.provider}</Badge>
                          <Badge variant={key.isActive ? "default" : "secondary"}>
                            {key.isActive ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Key: ••••{key.last4}
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {formatDate(key.createdAt)} | 
                          Updated: {formatDate(key.updatedAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`••••${key.last4}`)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyStatus(key.id, !key.isActive)}
                        >
                          {key.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteKey(key.id)}
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

        {/* Security Notice */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• API keys are encrypted at rest and only the last 4 characters are displayed</p>
              <p>• Keys are never logged in audit trails or error messages</p>
              <p>• Only SuperAdmin users can manage integration keys</p>
              <p>• Deactivate keys immediately if compromised</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
