"use client"

import { useEffect, useMemo, useState } from "react"
import { 
  Shield, 
  Users, 
  Settings, 
  Save, 
  Download,
  RefreshCw,
  Info
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Permission = { 
  id: string
  key: string
  group: string
  displayName: string
  description?: string
  isSystem: boolean
}

type Role = { 
  id: string
  name: string
  displayName: string
  description?: string
  isSystem: boolean
  userCount: number
}

type Scope = "own" | "dependent" | "global" | null

interface RbacMatrixProps {
  className?: string
}

export default function RbacMatrix({ className }: RbacMatrixProps) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [assignments, setAssignments] = useState<Record<string, Record<string, Scope[]>>>({})
  const [filter, setFilter] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [permsRes, rolesRes] = await Promise.all([
        fetch("/api/admin/rbac/permissions"),
        fetch("/api/admin/rbac/roles")
      ])
      
      const [permsData, rolesData] = await Promise.all([
        permsRes.json(),
        rolesRes.json()
      ])
      
      setPermissions(permsData.permissions || [])
      setRoles(rolesData.roles || [])
      setAssignments(rolesData.assignments || {})
      setHasChanges({})
    } catch (error) {
      console.error("Failed to load RBAC data:", error)
      toast.error("Kunne ikke laste RBAC-data")
    } finally {
      setLoading(false)
    }
  }

  function togglePermission(roleId: string, permKey: string, scope: Scope) {
    setAssignments(prev => {
      const newAssignments = { ...prev }
      if (!newAssignments[roleId]) {
        newAssignments[roleId] = {}
      }
      
      const currentScopes = new Set(newAssignments[roleId][permKey] || [])
      
      if (scope === null) {
        // Toggle global access
        if (currentScopes.has("global")) {
          currentScopes.delete("global")
        } else {
          currentScopes.add("global")
          // Remove specific scopes when global is added
          currentScopes.delete("own")
          currentScopes.delete("dependent")
        }
      } else {
        // Toggle specific scope
        if (currentScopes.has(scope)) {
          currentScopes.delete(scope)
        } else {
          currentScopes.add(scope)
          // Remove global when specific scope is added
          currentScopes.delete("global")
        }
      }
      
      newAssignments[roleId][permKey] = Array.from(currentScopes) as Scope[]
      
      // Mark role as having changes
      setHasChanges(prev => ({ ...prev, [roleId]: true }))
      
      return newAssignments
    })
  }

  async function saveRole(roleId: string) {
    try {
      setSaving(prev => ({ ...prev, [roleId]: true }))
      
      const response = await fetch(`/api/admin/rbac/roles/${roleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignments[roleId] || {})
      })
      
      if (!response.ok) {
        throw new Error("Failed to save role")
      }
      
      toast.success("Rolle lagret!")
      setHasChanges(prev => ({ ...prev, [roleId]: false }))
    } catch (error) {
      console.error("Failed to save role:", error)
      toast.error("Kunne ikke lagre rolle")
    } finally {
      setSaving(prev => ({ ...prev, [roleId]: false }))
    }
  }

  async function applyTemplate(roleId: string, templateName: string) {
    try {
      const response = await fetch("/api/admin/rbac/templates/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, templateName })
      })
      
      if (!response.ok) {
        throw new Error("Failed to apply template")
      }
      
      toast.success("Mal anvendt!")
      await loadData()
    } catch (error) {
      console.error("Failed to apply template:", error)
      toast.error("Kunne ikke anvende mal")
    }
  }

  async function exportRbac() {
    try {
      const response = await fetch("/api/admin/rbac/export")
      const data = await response.blob()
      
      const url = window.URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = `rbac-export-${new Date().toISOString().split('T')[0]}.yaml`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success("RBAC eksportert!")
    } catch (error) {
      console.error("Failed to export RBAC:", error)
      toast.error("Kunne ikke eksportere RBAC")
    }
  }

  const groupedPermissions = useMemo(() => {
    const filtered = permissions.filter(p => {
      const matchesFilter = !filter || 
        p.key.toLowerCase().includes(filter.toLowerCase()) ||
        p.displayName.toLowerCase().includes(filter.toLowerCase()) ||
        p.group.toLowerCase().includes(filter.toLowerCase())
      
      const matchesGroup = selectedGroup === "all" || p.group === selectedGroup
      
      return matchesFilter && matchesGroup
    })
    
    return filtered.reduce((acc, p) => {
      if (!acc[p.group]) {
        acc[p.group] = []
      }
      acc[p.group].push(p)
      return acc
    }, {} as Record<string, Permission[]>)
  }, [permissions, filter, selectedGroup])

  const groups = useMemo(() => {
    const groupSet = new Set(permissions.map(p => p.group))
    return Array.from(groupSet).sort()
  }, [permissions])

  const getScopeIcon = (scope: Scope) => {
    switch (scope) {
      case "global": return <Shield className="h-3 w-3" />
      case "own": return <Users className="h-3 w-3" />
      case "dependent": return <Settings className="h-3 w-3" />
      default: return null
    }
  }

  const getScopeColor = (scope: Scope) => {
    switch (scope) {
      case "global": return "bg-blue-100 text-blue-800"
      case "own": return "bg-green-100 text-green-800"
      case "dependent": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Laster RBAC-data...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card className="rounded-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Roller & Rettigheter
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Administrer systemtilganger og rettigheter
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportRbac}
                className="rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Eksporter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                className="rounded-xl"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Oppdater
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="matrix" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="matrix" className="rounded-lg">
                <Shield className="h-4 w-4 mr-2" />
                Rettighetsmatrise
              </TabsTrigger>
              <TabsTrigger value="roles" className="rounded-lg">
                <Users className="h-4 w-4 mr-2" />
                Roller
              </TabsTrigger>
              <TabsTrigger value="permissions" className="rounded-lg">
                <Settings className="h-4 w-4 mr-2" />
                Rettigheter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matrix" className="mt-6">
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Søk i funksjoner..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Gruppe:</span>
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                    >
                      <option value="all">Alle grupper</option>
                      {groups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Legend */}
                <Alert className="rounded-xl">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Global
                        </Badge>
                        <span>Full tilgang</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          <Users className="h-3 w-3 mr-1" />
                          Egen
                        </Badge>
                        <span>Kun egne data</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          <Settings className="h-3 w-3 mr-1" />
                          Avhengig
                        </Badge>
                        <span>Avhengiges data</span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Permission Matrix */}
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                  <div key={group} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{group}</h3>
                        <Badge variant="secondary" className="rounded-full">
                          {perms.length} funksjoner
                        </Badge>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 pr-4 font-medium text-gray-700">
                              Funksjon
                            </th>
                            {roles.map(role => (
                              <th key={role.id} className="text-center py-3 px-2 font-medium text-gray-700 min-w-[200px]">
                                <div className="flex flex-col items-center space-y-1">
                                  <span>{role.displayName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {role.userCount} brukere
                                  </Badge>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {perms.map(perm => (
                            <tr key={perm.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 pr-4">
                                <div>
                                  <div className="font-medium text-gray-900">{perm.displayName}</div>
                                  <div className="text-xs text-gray-500">{perm.key}</div>
                                  {perm.description && (
                                    <div className="text-xs text-gray-400 mt-1">{perm.description}</div>
                                  )}
                                </div>
                              </td>
                              {roles.map(role => {
                                const scopes = new Set(assignments[role.id]?.[perm.key] || [])
                                const hasGlobal = scopes.has("global")
                                const hasOwn = scopes.has("own")
                                const hasDependent = scopes.has("dependent")
                                
                                return (
                                  <td key={role.id} className="py-3 px-2">
                                    <div className="flex items-center justify-center space-x-2">
                                      <label className="flex items-center space-x-1 cursor-pointer">
                                        <Checkbox
                                          checked={hasGlobal}
                                          onCheckedChange={() => togglePermission(role.id, perm.key, null)}
                                          disabled={role.isSystem}
                                          className="rounded"
                                        />
                                        <span className="text-xs">Global</span>
                                      </label>
                                      <label className="flex items-center space-x-1 cursor-pointer">
                                        <Checkbox
                                          checked={hasOwn}
                                          onCheckedChange={() => togglePermission(role.id, perm.key, "own")}
                                          disabled={role.isSystem}
                                          className="rounded"
                                        />
                                        <span className="text-xs">Egen</span>
                                      </label>
                                      <label className="flex items-center space-x-1 cursor-pointer">
                                        <Checkbox
                                          checked={hasDependent}
                                          onCheckedChange={() => togglePermission(role.id, perm.key, "dependent")}
                                          disabled={role.isSystem}
                                          className="rounded"
                                        />
                                        <span className="text-xs">Avhengig</span>
                                      </label>
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {/* Save Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center space-x-4">
                    {roles.map(role => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Button
                          onClick={() => saveRole(role.id)}
                          disabled={saving[role.id] || !hasChanges[role.id]}
                          className="rounded-xl"
                          size="sm"
                        >
                          {saving[role.id] ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Lagre {role.displayName}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => applyTemplate(role.id, role.name)}
                          disabled={role.isSystem}
                          className="rounded-xl"
                          size="sm"
                        >
                          Bruk "{role.name}"-mal
                        </Button>
                        {hasChanges[role.id] && (
                          <Badge variant="destructive" className="text-xs">
                            Ulagrede endringer
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roles" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map(role => (
                  <Card key={role.id} className="rounded-xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{role.displayName}</CardTitle>
                        <Badge variant={role.isSystem ? "default" : "secondary"}>
                          {role.isSystem ? "System" : "Tilpasset"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Brukere:</span>
                          <Badge variant="outline">{role.userCount}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Rettigheter:</span>
                          <Badge variant="outline">
                            {Object.keys(assignments[role.id] || {}).length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                  <Card key={group} className="rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">{group}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        {perms.map(perm => (
                          <div key={perm.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{perm.displayName}</div>
                              <div className="text-sm text-gray-500">{perm.key}</div>
                              {perm.description && (
                                <div className="text-xs text-gray-400 mt-1">{perm.description}</div>
                              )}
                            </div>
                            <Badge variant={perm.isSystem ? "default" : "secondary"}>
                              {perm.isSystem ? "System" : "Tilpasset"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
