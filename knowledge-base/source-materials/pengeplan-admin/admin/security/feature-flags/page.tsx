'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Key, 
  Bell,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface FeatureFlags {
  // GeoIP
  geoipEnabled: boolean
  geoipProvider: string
  geoipCacheTtlDays: number
  geoipSuspiciousTravelWindowMin: number
  geoipSuspiciousTravelDistanceKm: number
  geoipShadowMode: boolean
  
  // Brute Force
  bruteforceEnabled: boolean
  bruteforceMaxAttemptsPerIp: number
  bruteforceMaxAttemptsPerEmail: number
  bruteforceBlockDurationMinutes: number
  bruteforceAutoBlock: boolean
  
  // 2FA
  twoFactorEnabled: boolean
  twoFactorRequireUsers: boolean
  twoFactorRequireVerge: boolean
  twoFactorRequireAdmin: boolean
  twoFactorRequireSuperAdmin: boolean
  
  // Notifications
  notificationsNewLocationEnabled: boolean
  notificationsSuspiciousActivityEnabled: boolean
  notificationsEmailRateLimitHours: number
  
  // Security
  securityDashboardEnabled: boolean
  securityAuditLogEnabled: boolean
  securitySessionMonitoringEnabled: boolean
}

export default function SecurityFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlags | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadFeatureFlags = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/security/feature-flags')
      if (response.ok) {
        const data = await response.json()
        setFlags(data.flags)
      } else {
        setMessage({ type: 'error', text: 'Kunne ikke laste innstillinger' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Feil ved lasting av innstillinger' })
    } finally {
      setLoading(false)
    }
  }

  const saveFeatureFlags = async () => {
    if (!flags) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/admin/security/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flags })
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Innstillinger lagret!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Kunne ikke lagre innstillinger' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Feil ved lagring av innstillinger' })
    } finally {
      setSaving(false)
    }
  }

  const updateFlag = (key: keyof FeatureFlags, value: boolean | string | number) => {
    if (!flags) return
    setFlags({ ...flags, [key]: value })
  }

  useEffect(() => {
    loadFeatureFlags()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Laster sikkerhetsinnstillinger...</span>
        </div>
      </div>
    )
  }

  if (!flags) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Kunne ikke laste innstillinger</h2>
          <Button onClick={loadFeatureFlags} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Prøv igjen
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sikkerhetsinnstillinger</h1>
        <p className="text-gray-600">Administrer alle sikkerhetsfunksjoner og feature flags</p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge variant={flags.geoipShadowMode ? "secondary" : "default"}>
            {flags.geoipShadowMode ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Shadow Mode
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Live Mode
              </>
            )}
          </Badge>
        </div>
        <Button onClick={saveFeatureFlags} disabled={saving}>
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Lagre endringer
        </Button>
      </div>

      <Tabs defaultValue="geoip" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geoip">GeoIP</TabsTrigger>
          <TabsTrigger value="bruteforce">Brute Force</TabsTrigger>
          <TabsTrigger value="2fa">2FA</TabsTrigger>
          <TabsTrigger value="notifications">Varsler</TabsTrigger>
          <TabsTrigger value="security">Sikkerhet</TabsTrigger>
        </TabsList>

        {/* GeoIP Tab */}
        <TabsContent value="geoip">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                GeoIP-innstillinger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="geoip-enabled">Aktiver GeoIP</Label>
                  <p className="text-sm text-gray-600">Resolve IP-adresser til geografisk lokasjon</p>
                </div>
                <Switch
                  id="geoip-enabled"
                  checked={flags.geoipEnabled}
                  onCheckedChange={(checked) => updateFlag('geoipEnabled', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="geoip-provider">Provider</Label>
                  <Input
                    id="geoip-provider"
                    value={flags.geoipProvider}
                    onChange={(e) => updateFlag('geoipProvider', e.target.value)}
                    placeholder="ipapi"
                  />
                </div>
                <div>
                  <Label htmlFor="geoip-cache-ttl">Cache TTL (dager)</Label>
                  <Input
                    id="geoip-cache-ttl"
                    type="number"
                    value={flags.geoipCacheTtlDays}
                    onChange={(e) => updateFlag('geoipCacheTtlDays', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="geoip-shadow-mode">Shadow Mode</Label>
                  <p className="text-sm text-gray-600">Detekter mistenkelig aktivitet uten å varsle brukere</p>
                </div>
                <Switch
                  id="geoip-shadow-mode"
                  checked={flags.geoipShadowMode}
                  onCheckedChange={(checked) => updateFlag('geoipShadowMode', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="suspicious-window">Mistenkelig reise-vindu (min)</Label>
                  <Input
                    id="suspicious-window"
                    type="number"
                    value={flags.geoipSuspiciousTravelWindowMin}
                    onChange={(e) => updateFlag('geoipSuspiciousTravelWindowMin', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="suspicious-distance">Mistenkelig reise-avstand (km)</Label>
                  <Input
                    id="suspicious-distance"
                    type="number"
                    value={flags.geoipSuspiciousTravelDistanceKm}
                    onChange={(e) => updateFlag('geoipSuspiciousTravelDistanceKm', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brute Force Tab */}
        <TabsContent value="bruteforce">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Brute Force-innstillinger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bruteforce-enabled">Aktiver Brute Force-deteksjon</Label>
                  <p className="text-sm text-gray-600">Detekter og blokker brute force-angrep</p>
                </div>
                <Switch
                  id="bruteforce-enabled"
                  checked={flags.bruteforceEnabled}
                  onCheckedChange={(checked) => updateFlag('bruteforceEnabled', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-attempts-ip">Maks forsøk per IP</Label>
                  <Input
                    id="max-attempts-ip"
                    type="number"
                    value={flags.bruteforceMaxAttemptsPerIp}
                    onChange={(e) => updateFlag('bruteforceMaxAttemptsPerIp', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="max-attempts-email">Maks forsøk per e-post</Label>
                  <Input
                    id="max-attempts-email"
                    type="number"
                    value={flags.bruteforceMaxAttemptsPerEmail}
                    onChange={(e) => updateFlag('bruteforceMaxAttemptsPerEmail', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="block-duration">Blokkeringsvarighet (min)</Label>
                  <Input
                    id="block-duration"
                    type="number"
                    value={flags.bruteforceBlockDurationMinutes}
                    onChange={(e) => updateFlag('bruteforceBlockDurationMinutes', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-block">Automatisk blokkering</Label>
                    <p className="text-sm text-gray-600">Blokker IP-er automatisk</p>
                  </div>
                  <Switch
                    id="auto-block"
                    checked={flags.bruteforceAutoBlock}
                    onCheckedChange={(checked) => updateFlag('bruteforceAutoBlock', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2FA Tab */}
        <TabsContent value="2fa">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                2FA-innstillinger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa-enabled">Aktiver 2FA-system</Label>
                  <p className="text-sm text-gray-600">Tillat brukere å aktivere to-faktor autentisering</p>
                </div>
                <Switch
                  id="2fa-enabled"
                  checked={flags.twoFactorEnabled}
                  onCheckedChange={(checked) => updateFlag('twoFactorEnabled', checked)}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Krev 2FA for roller:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="2fa-users">Brukere</Label>
                    <Switch
                      id="2fa-users"
                      checked={flags.twoFactorRequireUsers}
                      onCheckedChange={(checked) => updateFlag('twoFactorRequireUsers', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="2fa-verge">Verge</Label>
                    <Switch
                      id="2fa-verge"
                      checked={flags.twoFactorRequireVerge}
                      onCheckedChange={(checked) => updateFlag('twoFactorRequireVerge', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="2fa-admin">Admin</Label>
                    <Switch
                      id="2fa-admin"
                      checked={flags.twoFactorRequireAdmin}
                      onCheckedChange={(checked) => updateFlag('twoFactorRequireAdmin', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="2fa-superadmin">Super Admin</Label>
                    <Switch
                      id="2fa-superadmin"
                      checked={flags.twoFactorRequireSuperAdmin}
                      onCheckedChange={(checked) => updateFlag('twoFactorRequireSuperAdmin', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Varslingsinnstillinger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-location-notifications">Nye lokasjoner</Label>
                  <p className="text-sm text-gray-600">Varsle brukere ved innlogging fra ny lokasjon</p>
                </div>
                <Switch
                  id="new-location-notifications"
                  checked={flags.notificationsNewLocationEnabled}
                  onCheckedChange={(checked) => updateFlag('notificationsNewLocationEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="suspicious-activity-notifications">Mistenkelig aktivitet</Label>
                  <p className="text-sm text-gray-600">Varsle admin ved mistenkelig aktivitet</p>
                </div>
                <Switch
                  id="suspicious-activity-notifications"
                  checked={flags.notificationsSuspiciousActivityEnabled}
                  onCheckedChange={(checked) => updateFlag('notificationsSuspiciousActivityEnabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="email-rate-limit">E-post rate limit (timer)</Label>
                <Input
                  id="email-rate-limit"
                  type="number"
                  value={flags.notificationsEmailRateLimitHours}
                  onChange={(e) => updateFlag('notificationsEmailRateLimitHours', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sikkerhetsinnstillinger
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security-dashboard">Sikkerhetsdashboard</Label>
                  <p className="text-sm text-gray-600">Aktiver sikkerhetsdashboard for admin</p>
                </div>
                <Switch
                  id="security-dashboard"
                  checked={flags.securityDashboardEnabled}
                  onCheckedChange={(checked) => updateFlag('securityDashboardEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audit-log">Audit logging</Label>
                  <p className="text-sm text-gray-600">Logg alle sikkerhetshendelser</p>
                </div>
                <Switch
                  id="audit-log"
                  checked={flags.securityAuditLogEnabled}
                  onCheckedChange={(checked) => updateFlag('securityAuditLogEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="session-monitoring">Session-overvåkning</Label>
                  <p className="text-sm text-gray-600">Overvåk aktive sesjoner</p>
                </div>
                <Switch
                  id="session-monitoring"
                  checked={flags.securitySessionMonitoringEnabled}
                  onCheckedChange={(checked) => updateFlag('securitySessionMonitoringEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
