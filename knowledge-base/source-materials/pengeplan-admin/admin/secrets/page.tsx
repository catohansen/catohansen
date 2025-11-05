'use client'

import { useState, useEffect } from 'react'
import { Key, Eye, EyeOff, Plus, Trash2, Edit, Shield } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Secret {
  key: string
  value: string
  description: string
  lastUpdated: string
  environment: string
}

export default function SecretsAdminPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set())
  const [newSecret, setNewSecret] = useState({
    key: '',
    value: '',
    description: '',
    environment: 'development'
  })

  useEffect(() => {
    setMounted(true)
    loadSecrets()
  }, [])

  const loadSecrets = async () => {
    try {
      const response = await fetch('/api/admin/secrets')
      if (response.ok) {
        const data = await response.json()
        setSecrets(data.secrets || [])
      }
    } catch (error) {
      console.error('Error loading secrets:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSecretVisibility = (key: string) => {
    const newVisible = new Set(visibleSecrets)
    if (newVisible.has(key)) {
      newVisible.delete(key)
    } else {
      newVisible.add(key)
    }
    setVisibleSecrets(newVisible)
  }

  const handleCreateSecret = async () => {
    try {
      const response = await fetch('/api/admin/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSecret)
      })
      
      if (response.ok) {
        setNewSecret({ key: '', value: '', description: '', environment: 'development' })
        loadSecrets()
      }
    } catch (error) {
      console.error('Error creating secret:', error)
    }
  }

  const handleDeleteSecret = async (key: string) => {
    if (!confirm('Er du sikker på at du vil slette denne hemmeligheten?')) return
    
    try {
      const response = await fetch(`/api/admin/secrets/${key}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadSecrets()
      }
    } catch (error) {
      console.error('Error deleting secret:', error)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Secrets Management</h1>
            <p className="text-red-100">Administrer systemhemmeligheter og API-nøkler</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Sikkerhet</div>
            <div className="text-red-200">Kryptert lagring</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Secrets</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{secrets.length}</div>
            <p className="text-xs text-muted-foreground">Lagrede hemmeligheter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miljøer</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(secrets.map(s => s.environment)).size}
            </div>
            <p className="text-xs text-muted-foreground">Aktive miljøer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Siste Oppdatering</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {secrets.length > 0 ? 
                new Date(Math.max(...secrets.map(s => new Date(s.lastUpdated).getTime()))).toLocaleDateString('no-NO') 
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">Siste endring</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="secrets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="secrets">Hemmeligheter</TabsTrigger>
          <TabsTrigger value="create">Opprett Ny</TabsTrigger>
          <TabsTrigger value="environments">Miljøer</TabsTrigger>
        </TabsList>

        <TabsContent value="secrets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lagrede Hemmeligheter</CardTitle>
              <CardDescription>
                Administrer API-nøkler, tokens og andre hemmeligheter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Laster hemmeligheter...</p>
                </div>
              ) : secrets.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ingen hemmeligheter</h3>
                  <p className="text-muted-foreground mb-4">
                    Opprett din første hemmelighet for å komme i gang
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {secrets.map((secret) => (
                    <div key={secret.key} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{secret.key}</h3>
                          <Badge variant="outline">{secret.environment}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSecretVisibility(secret.key)}
                          >
                            {visibleSecrets.has(secret.key) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSecret(secret.key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {secret.description}
                      </p>
                      <div className="bg-gray-100 rounded p-2 font-mono text-sm">
                        {visibleSecrets.has(secret.key) ? 
                          secret.value : 
                          '•'.repeat(secret.value.length)
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sist oppdatert: {new Date(secret.lastUpdated).toLocaleString('no-NO')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Opprett Ny Hemmelighet</CardTitle>
              <CardDescription>
                Legg til en ny API-nøkkel eller hemmelighet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nøkkel</label>
                  <Input
                    placeholder="f.eks. OPENAI_API_KEY"
                    value={newSecret.key}
                    onChange={(e) => setNewSecret({...newSecret, key: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Verdi</label>
                  <Input
                    type="password"
                    placeholder="Hemmelig verdi"
                    value={newSecret.value}
                    onChange={(e) => setNewSecret({...newSecret, value: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Beskrivelse</label>
                  <Input
                    placeholder="Beskrivelse av hemmeligheten"
                    value={newSecret.description}
                    onChange={(e) => setNewSecret({...newSecret, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Miljø</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newSecret.environment}
                    onChange={(e) => setNewSecret({...newSecret, environment: e.target.value})}
                  >
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <Button onClick={handleCreateSecret} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Opprett Hemmelighet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Miljø-oversikt</CardTitle>
              <CardDescription>
                Oversikt over hemmeligheter per miljø
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['development', 'staging', 'production'].map((env) => {
                  const envSecrets = secrets.filter(s => s.environment === env)
                  return (
                    <div key={env} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold capitalize">{env}</h3>
                        <Badge variant="outline">{envSecrets.length} hemmeligheter</Badge>
                      </div>
                      <div className="space-y-1">
                        {envSecrets.map((secret) => (
                          <div key={secret.key} className="text-sm text-muted-foreground">
                            • {secret.key}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

