'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Globe,
  Shield,
  Mail,
  Database
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import AppShell from '@/components/layout/AppShell'

interface SystemSetting {
  key: string
  valueJson: unknown
  description?: string
  category: string
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSystemSettings()
  }, [])

  const loadSystemSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/superadmin/system-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || [])
      }
    } catch (error) {
      console.error('Error loading system settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: unknown) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/superadmin/system-settings/${key}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      })
      
      if (response.ok) {
        loadSystemSettings()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating setting:', error)
      alert('Error updating setting')
    } finally {
      setSaving(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <Shield className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'database':
        return <Database className="w-4 h-4" />
      case 'general':
        return <Globe className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth':
        return 'bg-red-100 text-red-800'
      case 'email':
        return 'bg-blue-100 text-blue-800'
      case 'database':
        return 'bg-green-100 text-green-800'
      case 'general':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = []
    }
    acc[setting.category]?.push(setting)
    return acc
  }, {} as { [key: string]: SystemSetting[] })

  if (loading) {
    return (
      <AppShell role="admin" user={{ name: 'Admin', email: 'admin@pengeplan.no', role: 'ADMIN' }}>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading system settings...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell role="admin" user={{ name: 'Admin', email: 'admin@pengeplan.no', role: 'ADMIN' }}>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Settings</h1>
            <p className="text-gray-600">Global system configuration and preferences</p>
          </div>
          <Button onClick={loadSystemSettings} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Settings by Category */}
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <Card key={category} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                {getCategoryIcon(category)}
                <span className="ml-2 capitalize">{category} Settings</span>
                <Badge className={`ml-2 ${getCategoryColor(category)}`}>
                  {categorySettings.length} settings
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySettings.map((setting) => (
                  <div key={setting.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{setting.key}</h4>
                        {setting.description && (
                          <p className="text-sm text-gray-600 mb-2">{setting.description}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          Current value: {JSON.stringify(setting.valueJson)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {typeof setting.valueJson === 'boolean' ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">Enabled:</span>
                            <Switch
                              checked={setting.valueJson}
                              onCheckedChange={(enabled) => updateSetting(setting.key, enabled)}
                              disabled={saving}
                            />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            {typeof setting.valueJson === 'string' ? 
                              `"${setting.valueJson}"` : 
                              JSON.stringify(setting.valueJson)
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <p>Changes to system settings take effect immediately</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <p>All setting changes are logged in the audit trail</p>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <p>Be careful when modifying authentication and security settings</p>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <p>Some settings may require a system restart to take effect</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
