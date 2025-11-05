'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  Shield, 
  Database, 
  Users,
  Settings,
  Lock,
  Unlock,
  Power,
  RefreshCw,
  CheckCircle
} from 'lucide-react'

export default function EmergencyModePage() {
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    database: 'ONLINE',
    auth: 'ONLINE',
    api: 'ONLINE',
    backup: 'ONLINE'
  })
  const [actions, setActions] = useState<string[]>([])

  const handleEmergencyToggle = () => {
    if (!emergencyMode) {
      if (confirm('Aktiver nødmodus? Dette gir full systemtilgang uten sikkerhetsrestriksjoner.')) {
        setEmergencyMode(true)
        addAction('Nødmodus aktivert')
      }
    } else {
      if (confirm('Deaktiver nødmodus? Dette gjenoppretter normale sikkerhetsrestriksjoner.')) {
        setEmergencyMode(false)
        addAction('Nødmodus deaktivert')
      }
    }
  }

  const handleSystemReset = () => {
    if (confirm('Utfør system reset? Dette kan påvirke alle brukere.')) {
      addAction('System reset utført')
      // Simulate system reset
      setTimeout(() => {
        setSystemStatus({
          database: 'ONLINE',
          auth: 'ONLINE',
          api: 'ONLINE',
          backup: 'ONLINE'
        })
        addAction('System reset fullført')
      }, 2000)
    }
  }

  const handleDatabaseReset = () => {
    if (confirm('Reset database? Dette kan slette data.')) {
      addAction('Database reset startet')
      // Simulate database reset
      setTimeout(() => {
        addAction('Database reset fullført')
      }, 3000)
    }
  }

  const handleAuthBypass = () => {
    if (confirm('Aktiver autentisering bypass? Dette deaktiverer alle login-krav.')) {
      addAction('Autentisering bypass aktivert')
    }
  }

  const addAction = (action: string) => {
    const timestamp = new Date().toLocaleString('nb-NO')
    setActions(prev => [`${timestamp}: ${action}`, ...prev.slice(0, 9)])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Online</Badge>
      case 'OFFLINE':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Offline</Badge>
      case 'ERROR':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          Nødmodus Kontrollpanel
        </h1>
        <p className="text-gray-600">Kritisk systemtilgang for Super Admin</p>
      </div>

      {/* Emergency Status */}
      <div className="mb-8">
        <Alert className={emergencyMode ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className={emergencyMode ? "text-red-800" : "text-yellow-800"}>
            <strong>
              {emergencyMode ? 'NØDMODUS AKTIVERT' : 'NØDMODUS DEAKTIVERT'}
            </strong>
            <br />
            {emergencyMode 
              ? 'Full systemtilgang uten sikkerhetsrestriksjoner er aktivt.'
              : 'Systemet kjører med normale sikkerhetsrestriksjoner.'
            }
          </AlertDescription>
        </Alert>
      </div>

      {/* Emergency Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className={emergencyMode ? "border-red-200" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5" />
              Nødmodus Kontroll
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Nødmodus Status</span>
              <Badge className={emergencyMode ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                {emergencyMode ? 'AKTIVERT' : 'DEAKTIVERT'}
              </Badge>
            </div>
            
            <Button
              onClick={handleEmergencyToggle}
              className={`w-full ${emergencyMode 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {emergencyMode ? (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Deaktiver Nødmodus
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Aktiver Nødmodus
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Database</span>
              {getStatusBadge(systemStatus.database)}
            </div>
            <div className="flex items-center justify-between">
              <span>Autentisering</span>
              {getStatusBadge(systemStatus.auth)}
            </div>
            <div className="flex items-center justify-between">
              <span>API</span>
              {getStatusBadge(systemStatus.api)}
            </div>
            <div className="flex items-center justify-between">
              <span>Backup</span>
              {getStatusBadge(systemStatus.backup)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Nødhandlinger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleSystemReset}
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              System Reset
            </Button>
            
            <Button
              onClick={handleDatabaseReset}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Database className="h-4 w-4 mr-2" />
              Database Reset
            </Button>
            
            <Button
              onClick={handleAuthBypass}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Shield className="h-4 w-4 mr-2" />
              Auth Bypass
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Nødhandling Logg
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Ingen nødhandlinger utført ennå
            </div>
          ) : (
            <div className="space-y-2">
              {actions.map((action, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-mono text-gray-700">{action}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


