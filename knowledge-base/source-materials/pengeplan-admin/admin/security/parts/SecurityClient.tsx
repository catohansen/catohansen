"use client";

import { useState } from "react";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SecurityClient() {
  const [securitySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    auditLogging: true,
    ipWhitelist: false,
    rateLimiting: true
  });

  const securityAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Svekkede passord oppdaget",
      description: "3 brukere har svekkede passord som må oppdateres",
      timestamp: "2025-01-09T10:30:00Z"
    },
    {
      id: 2,
      type: "info",
      title: "Ny innlogging fra ukjent enhet",
      description: "Bruker admin@pengeplan.no logget inn fra ny IP-adresse",
      timestamp: "2025-01-09T09:15:00Z"
    }
  ];

  const securityMetrics = {
    totalLogins: 1247,
    failedLogins: 23,
    blockedIPs: 5,
    twoFactorUsers: 89,
    lastSecurityScan: "2025-01-09T08:00:00Z"
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale innlogginger</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.totalLogins.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% fra forrige måned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mislykkede innlogginger</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityMetrics.failedLogins}</div>
            <p className="text-xs text-muted-foreground">-5% fra forrige måned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blokkerte IP-adresser</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">Aktive blokkeringer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA brukere</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.twoFactorUsers}</div>
            <p className="text-xs text-muted-foreground">72% av alle brukere</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Sikkerhetsvarsler
          </CardTitle>
          <CardDescription>
            Aktive sikkerhetsvarsler som krever oppmerksomhet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString('nb-NO')}
                  </p>
                </div>
                <Badge variant={alert.type === 'warning' ? 'destructive' : 'secondary'}>
                  {alert.type === 'warning' ? 'Advarsel' : 'Info'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sikkerhetsinnstillinger</CardTitle>
          <CardDescription>
            Konfigurer systemets sikkerhetsparametere
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">To-faktor autentisering</h4>
                <p className="text-sm text-gray-600">Krev 2FA for alle brukere</p>
              </div>
              <Badge variant={securitySettings.twoFactorEnabled ? 'default' : 'secondary'}>
                {securitySettings.twoFactorEnabled ? 'Aktivert' : 'Deaktivert'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Session timeout</h4>
                <p className="text-sm text-gray-600">Automatisk utlogging etter {securitySettings.sessionTimeout} minutter</p>
              </div>
              <Badge variant="outline">{securitySettings.sessionTimeout} min</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Passordpolicy</h4>
                <p className="text-sm text-gray-600">Krav til brukerpassord</p>
              </div>
              <Badge variant="outline">{securitySettings.passwordPolicy}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Audit logging</h4>
                <p className="text-sm text-gray-600">Logg alle sikkerhetshendelser</p>
              </div>
              <Badge variant={securitySettings.auditLogging ? 'default' : 'secondary'}>
                {securitySettings.auditLogging ? 'Aktivert' : 'Deaktivert'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Rate limiting</h4>
                <p className="text-sm text-gray-600">Begrens antall API-kall per bruker</p>
              </div>
              <Badge variant={securitySettings.rateLimiting ? 'default' : 'secondary'}>
                {securitySettings.rateLimiting ? 'Aktivert' : 'Deaktivert'}
              </Badge>
            </div>

            <div className="pt-4">
              <Button>Oppdater innstillinger</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
