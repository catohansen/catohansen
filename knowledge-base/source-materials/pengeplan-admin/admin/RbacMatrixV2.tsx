"use client"

import { useEffect, useMemo, useState } from "react"
import { Info, Users, Clock, User, Save, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Perm = { key: string; group: string }
type Role = { id: string; name: "USER"|"GUARDIAN"|"ADMIN"|"SUPERADMIN"; displayName: string }
type Scope = "own"|"dependent"|null
type AuditChange = {
  id: string
  action: string
  roleName: string
  permissionKey: string
  scope: string | null
  userId: string
  ipAddress: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}
type Stats = {
  totalRoles: number
  totalPermissions: number
  totalUsers: number
  recentChanges: number
  usersPerRole: Record<string, number>
}

export default function RbacMatrixV2() {
  const [perms, setPerms] = useState<Perm[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [assign, setAssign] = useState<Record<string, Record<string, Scope[]>>>({})
  const [filter, setFilter] = useState("")
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentChanges, setRecentChanges] = useState<AuditChange[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<Record<string, boolean>>({})
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    void load()
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  function checkMobile() {
    setIsMobile(window.innerWidth < 768)
  }

  async function load() {
    try {
      const [p, r, s, a] = await Promise.all([
        fetch("/api/admin/rbac/permissions").then(r=>r.json()),
        fetch("/api/admin/rbac/roles").then(r=>r.json()),
        fetch("/api/admin/rbac/stats").then(r=>r.json()),
        fetch("/api/admin/rbac/audit/recent?limit=10").then(r=>r.json())
      ])
      setPerms(p.permissions || [])
      setRoles(r.roles || [])
      setAssign(r.assigned || {})
      setStats(s)
      setRecentChanges(a.changes || [])
    } catch (error) {
      console.error('Failed to load RBAC data:', error)
      toast.error('Kunne ikke laste RBAC-data')
    }
  }

  function toggle(roleId: string, permKey: string, scope: Scope) {
    setAssign(prev => {
      const r = { ...(prev[roleId]||{}) }
      const arr = new Set([...(r[permKey]||[])])
      if (scope === null) {
        arr.has(null as any) ? arr.delete(null as any) : arr.add(null as any)
      } else {
        arr.has(scope) ? arr.delete(scope) : arr.add(scope)
      }
      r[permKey] = Array.from(arr) as Scope[]
      
      // Mark as having unsaved changes
      setHasUnsavedChanges(prev => ({ ...prev, [roleId]: true }))
      
      return { ...prev, [roleId]: r }
    })
  }

  async function save(roleId: string) {
    try {
      await fetch(`/api/admin/rbac/roles/${roleId}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(assign[roleId] || {})
      })
      setHasUnsavedChanges(prev => ({ ...prev, [roleId]: false }))
      toast.success(`Rettigheter lagret for ${roles.find(r => r.id === roleId)?.displayName}`)
      await load() // Refresh audit data
    } catch (error) {
      toast.error('Kunne ikke lagre endringer')
    }
  }

  async function applyTemplate(roleId: string, templateName: string) {
    try {
      await fetch(`/api/admin/rbac/templates/apply`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ roleId, templateName })
      })
      await load()
      toast.success(`Mal "${templateName}" brukt`)
    } catch (error) {
      toast.error('Kunne ikke bruke mal')
    }
  }

  const grouped = useMemo(() => {
    const f = filter.toLowerCase()
    return perms
      .filter(p => !f || p.key.toLowerCase().includes(f) || p.group.toLowerCase().includes(f))
      .reduce((acc, p) => {
        (acc[p.group] ||= []).push(p)
        return acc
      }, {} as Record<string, Perm[]>)
  }, [perms, filter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isMobile) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{stats.totalRoles}</div>
                  <div className="text-sm text-muted-foreground">Roller</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{stats.totalPermissions}</div>
                  <div className="text-sm text-muted-foreground">Rettigheter</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mobile Accordion View */}
          <Card className="rounded-2xl">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Roller & Rettigheter</CardTitle>
              <Input 
                placeholder="Filtrer..." 
                value={filter} 
                onChange={e=>setFilter(e.target.value)} 
                className="max-w-xs" 
              />
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">{group}</div>
                    <div className="text-xs text-muted-foreground">{items.length} funksjoner</div>
                  </div>
                  
                  {items.map(p => (
                    <div key={p.key} className="border-t pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
                      <div className="font-medium text-sm mb-2">{p.key}</div>
                      <div className="space-y-2">
                        {roles.map(r => {
                          const v = new Set(assign[r.id]?.[p.key] || [])
                          const hasGlobal = v.has(null as any)
                          return (
                            <div key={r.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{r.displayName}</span>
                                {stats?.usersPerRole[r.name] && (
                                  <Badge variant="secondary" className="text-xs">
                                    {stats.usersPerRole[r.name]} brukere
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1">
                                  <Checkbox 
                                    checked={hasGlobal} 
                                    onCheckedChange={()=>toggle(r.id,p.key,null)} 
                                  />
                                  <span className="text-xs">alle</span>
                                </label>
                                <label className="flex items-center gap-1">
                                  <Checkbox 
                                    checked={v.has("own" as any)} 
                                    onCheckedChange={()=>toggle(r.id,p.key,"own")} 
                                  />
                                  <span className="text-xs">own</span>
                                </label>
                                <label className="flex items-center gap-1">
                                  <Checkbox 
                                    checked={v.has("dependent" as any)} 
                                    onCheckedChange={()=>toggle(r.id,p.key,"dependent")} 
                                  />
                                  <span className="text-xs">dependent</span>
                                </label>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Changes */}
          {recentChanges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Siste endringer (24t)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentChanges.slice(0, 5).map(change => (
                    <div key={change.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div>
                        <span className="font-medium">{change.action}</span> {change.permissionKey}
                        <div className="text-xs text-muted-foreground">
                          {change.roleName} • {change.user.name}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(change.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.totalRoles}</div>
                <div className="text-sm text-muted-foreground">Roller</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.totalPermissions}</div>
                <div className="text-sm text-muted-foreground">Rettigheter</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Brukere</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.recentChanges}</div>
                <div className="text-sm text-muted-foreground">Endringer (24t)</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Matrix */}
        <Card className="rounded-2xl">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Roller & Rettigheter</CardTitle>
            <Input 
              placeholder="Filtrer funksjoner…" 
              value={filter} 
              onChange={e=>setFilter(e.target.value)} 
              className="max-w-xs" 
            />
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="border rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{group}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">{items.length} funksjoner</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Apply template for this group
                        roles.forEach(role => {
                          applyTemplate(role.id, role.name)
                        })
                      }}
                      className="text-xs"
                    >
                      Bruk mal
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white z-20 border-b">
                      <tr>
                        <th className="text-left py-2 pr-3">Funksjon</th>
                        {roles.map(r => (
                          <th key={r.id} className="text-left py-2 pr-3">
                            <div className="flex items-center gap-2">
                              {r.displayName}
                              {hasUnsavedChanges[r.id] && (
                                <Badge variant="destructive" className="text-xs">
                                  ● Endringer
                                </Badge>
                              )}
                              {stats?.usersPerRole[r.name] && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="secondary" className="text-xs cursor-help">
                                      <Users className="h-3 w-3 mr-1" />
                                      {stats.usersPerRole[r.name]}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{stats.usersPerRole[r.name]} brukere har denne rollen</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(p => (
                        <tr key={p.key} className="border-t">
                          <td className="py-2 pr-3">
                            <div className="flex items-center gap-2">
                              {p.key}
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Sist endret: {formatDate(new Date().toISOString())}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </td>
                          {roles.map(r => {
                            const v = new Set(assign[r.id]?.[p.key] || [])
                            const hasGlobal = v.has(null as any)
                            return (
                              <td key={r.id} className="py-2 pr-3">
                                <div className="flex items-center gap-3">
                                  <label className="flex items-center gap-1">
                                    <Checkbox 
                                      checked={hasGlobal} 
                                      onCheckedChange={()=>toggle(r.id,p.key,null)} 
                                    />
                                    <span className="text-xs">alle</span>
                                  </label>
                                  <label className="flex items-center gap-1">
                                    <Checkbox 
                                      checked={v.has("own" as any)} 
                                      onCheckedChange={()=>toggle(r.id,p.key,"own")} 
                                    />
                                    <span className="text-xs">own</span>
                                  </label>
                                  <label className="flex items-center gap-1">
                                    <Checkbox 
                                      checked={v.has("dependent" as any)} 
                                      onCheckedChange={()=>toggle(r.id,p.key,"dependent")} 
                                    />
                                    <span className="text-xs">dependent</span>
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
            
            <div className="flex gap-2 flex-wrap">
              {roles.map(r => (
                <div key={r.id} className="flex items-center gap-2">
                  <Button 
                    onClick={()=>save(r.id)} 
                    className="rounded-xl"
                    disabled={!hasUnsavedChanges[r.id]}
                    variant={hasUnsavedChanges[r.id] ? "default" : "outline"}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lagre {r.displayName}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={()=>applyTemplate(r.id, r.name)} 
                    className="rounded-xl"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Bruk "{r.name}"-mal
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Tips: "alle" = globalt uten scope. "own" og "dependent" håndheves i backend.
            </div>
          </CardContent>
        </Card>

        {/* Recent Changes Feed */}
        {recentChanges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Siste endringer (24t)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentChanges.map(change => (
                  <div key={change.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{change.user.name}</span>
                      </div>
                      <span className="text-sm">{change.action}</span>
                      <Badge variant="outline">{change.permissionKey}</Badge>
                      <span className="text-sm text-muted-foreground">på {change.roleName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(change.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}



































