'use client'

import { useState } from 'react'
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Shield,
  Settings
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface TestResult {
  allow: boolean
  policyVersion: string
  latencyMs: number
  reason?: string
  test: {
    subject: any
    action: string
    resource: string
    attrs: any
  }
}

export function TestPanel() {
  const [testForm, setTestForm] = useState({
    role: 'USER',
    userId: '',
    orgId: '',
    plan: 'free',
    scopes: '',
    graceReadonly: false,
    resource: 'bills',
    action: 'read',
    attrs: '{}'
  })
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Parse attributes
      let attrs = {}
      try {
        attrs = JSON.parse(testForm.attrs)
      } catch (e) {
        setError('Invalid JSON in attributes')
        return
      }

      // Parse scopes
      const scopes = testForm.scopes ? testForm.scopes.split(',').map(s => s.trim()) : []

      const response = await fetch('/api/cerbos/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: {
            userId: testForm.userId || undefined,
            role: testForm.role,
            orgId: testForm.orgId || undefined,
            plan: testForm.plan,
            scopes: scopes.length > 0 ? scopes : undefined,
            graceReadonly: testForm.graceReadonly
          },
          action: testForm.action,
          resource: testForm.resource,
          attrs
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Test failed')
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getEffectIcon = (allow: boolean) => {
    return allow ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    )
  }

  const getEffectColor = (allow: boolean) => {
    return allow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Decision Tester</h2>
        <p className="text-muted-foreground">
          Test Cerbos policy beslutninger med forskjellige brukerattributter
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Konfigurasjon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTest} className="space-y-4">
              {/* Subject Configuration */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Subject (Bruker)
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Rolle</Label>
                    <Select value={testForm.role} onValueChange={(value) => setTestForm({ ...testForm, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="VERGE">VERGE</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Select value={testForm.plan} onValueChange={(value) => setTestForm({ ...testForm, plan: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="userId">User ID (valgfritt)</Label>
                  <Input
                    id="userId"
                    value={testForm.userId}
                    onChange={(e) => setTestForm({ ...testForm, userId: e.target.value })}
                    placeholder="user_123"
                  />
                </div>

                <div>
                  <Label htmlFor="orgId">Org ID (valgfritt)</Label>
                  <Input
                    id="orgId"
                    value={testForm.orgId}
                    onChange={(e) => setTestForm({ ...testForm, orgId: e.target.value })}
                    placeholder="org_456"
                  />
                </div>

                <div>
                  <Label htmlFor="scopes">Scopes (komma-separert)</Label>
                  <Input
                    id="scopes"
                    value={testForm.scopes}
                    onChange={(e) => setTestForm({ ...testForm, scopes: e.target.value })}
                    placeholder="read:bills,write:budget"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="graceReadonly"
                    checked={testForm.graceReadonly}
                    onChange={(e) => setTestForm({ ...testForm, graceReadonly: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="graceReadonly">Grace Read-only</Label>
                </div>
              </div>

              {/* Resource and Action */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Resource & Action
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resource">Resource</Label>
                    <Input
                      id="resource"
                      value={testForm.resource}
                      onChange={(e) => setTestForm({ ...testForm, resource: e.target.value })}
                      placeholder="bills"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="action">Action</Label>
                    <Select value={testForm.action} onValueChange={(value) => setTestForm({ ...testForm, action: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">read</SelectItem>
                        <SelectItem value="create">create</SelectItem>
                        <SelectItem value="update">update</SelectItem>
                        <SelectItem value="delete">delete</SelectItem>
                        <SelectItem value="list">list</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div>
                <Label htmlFor="attrs">Attributes (JSON)</Label>
                <Textarea
                  id="attrs"
                  value={testForm.attrs}
                  onChange={(e) => setTestForm({ ...testForm, attrs: e.target.value })}
                  placeholder='{"amount": 1000, "category": "utilities"}'
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Tester...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Kjør Test
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Result */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Test Resultat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg mb-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {result ? (
              <div className="space-y-4">
                {/* Decision */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEffectIcon(result.allow)}
                    <div>
                      <p className="font-semibold">
                        {result.allow ? 'ALLOW' : 'DENY'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.reason || 'No reason provided'}
                      </p>
                    </div>
                  </div>
                  <Badge className={getEffectColor(result.allow)}>
                    {result.allow ? 'Tillatt' : 'Nektet'}
                  </Badge>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Latency</p>
                    <p className="font-semibold">{result.latencyMs}ms</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Policy Version</p>
                    <p className="font-semibold">{result.policyVersion}</p>
                  </div>
                </div>

                {/* Test Details */}
                <div className="space-y-2">
                  <h4 className="font-medium">Test Detaljer</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(result.test, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Kjør en test for å se resultatet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}