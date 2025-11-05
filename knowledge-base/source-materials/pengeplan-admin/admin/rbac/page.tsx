'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, FileText, BarChart3, Download, Settings } from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function RBACAdminPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 4,
    totalPermissions: 0,
    activeSessions: 0
  })

  useEffect(() => {
    setMounted(true)
    loadRBACStats()
  }, [])

  const loadRBACStats = async () => {
    try {
      const response = await fetch('/api/admin/rbac/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading RBAC stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <AdminPageLayout
      title="🔐 RBAC Administration"
      description="Role-Based Access Control og tilgangsstyring"
      headerColor="indigo"
    >

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Brukere</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Aktive brukere i systemet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roller</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">USER, VERGE, ADMIN, SUPERADMIN</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tilganger</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPermissions}</div>
            <p className="text-xs text-muted-foreground">Definerte tilganger</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Sesjoner</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Pålogget nå</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Roller & Tilganger</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="templates">Maler</TabsTrigger>
          <TabsTrigger value="export">Eksport</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roller i Systemet</CardTitle>
              <CardDescription>
                Administrer brukerroller og deres tilganger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">USER</h3>
                      <Badge variant="secondary">Bruker</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Standard brukerrolle med tilgang til dashboard og egne data
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs">• Dashboard</div>
                      <div className="text-xs">• Egen profil</div>
                      <div className="text-xs">• Budsjett & gjeld</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">VERGE</h3>
                      <Badge variant="outline">Verge</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Verge-rolle med tilgang til verge-dashboard og klientdata
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs">• Verge dashboard</div>
                      <div className="text-xs">• Klientadministrasjon</div>
                      <div className="text-xs">• Rapporter</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">ADMIN</h3>
                      <Badge variant="default">Admin</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Administrativ rolle med full tilgang til admin-panel
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs">• Admin panel</div>
                      <div className="text-xs">• Brukeradministrasjon</div>
                      <div className="text-xs">• Systeminnstillinger</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">SUPERADMIN</h3>
                      <Badge variant="destructive">Superadmin</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Høyeste rolle med full systemtilgang
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs">• Alle admin-funksjoner</div>
                      <div className="text-xs">• Systemkonfigurasjon</div>
                      <div className="text-xs">• Sikkerhetsinnstillinger</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                Spor alle tilgangsrelaterte aktiviteter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Audit Log</h3>
                <p className="text-muted-foreground mb-4">
                  Viser alle tilgangsrelaterte aktiviteter og endringer
                </p>
                <Button>Last inn Audit Log</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rolle-maler</CardTitle>
              <CardDescription>
                Forhåndsdefinerte rolle-maler for rask oppsett
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Rolle-maler</h3>
                <p className="text-muted-foreground mb-4">
                  Administrer forhåndsdefinerte rolle-maler
                </p>
                <Button>Last inn Maler</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eksport</CardTitle>
              <CardDescription>
                Eksporter RBAC-data og konfigurasjoner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter Roller</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter Tilganger</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter Audit Log</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Eksporter Konfigurasjon</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  )
}

