"use client"

import { useEffect, useState } from "react"
import { Users, Shield, UserCheck, Crown } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type UsersPerRole = { 
  USER: number
  GUARDIAN: number
  ADMIN: number
  SUPERADMIN: number
}

export default function RbacWidget() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<UsersPerRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  async function loadData() {
    try {
      const response = await fetch("/api/admin/rbac/stats")
      const result = await response.json()
      if (result.success && result.usersPerRole) {
        setData(result.usersPerRole)
      } else {
        // Fallback to mock data
        setData({ USER: 1247, GUARDIAN: 18, ADMIN: 3, SUPERADMIN: 1 })
      }
    } catch (error) {
      console.error('Failed to load RBAC data:', error)
      // Fallback to mock data
      setData({ USER: 1247, GUARDIAN: 18, ADMIN: 3, SUPERADMIN: 1 })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Card data-testid="rbac-widget" className="rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-violet-200 shadow-sm" onClick={() => window.location.href = '/admin/access-control'}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-violet-600" />
          Roller & Brukere
          <Badge className="bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 border border-violet-200">RBAC</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {loading ? (
          <div className="animate-pulse h-14 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-xl" />
        ) : data ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="User" value={data.USER} icon={Users} tone="slate" />
            <Stat label="Guardian" value={data.GUARDIAN} icon={UserCheck} tone="violet" />
            <Stat label="Admin" value={data.ADMIN} icon={Shield} tone="emerald" />
            <Stat label="Superadmin" value={data.SUPERADMIN} icon={Crown} tone="rose" />
          </div>
        ) : (
          <div className="text-slate-500">Ingen data</div>
        )}
        <div className="mt-3">
          <span className="text-xs text-violet-600 underline hover:text-violet-800 transition-colors">
            Gå til Tilgangskontroll →
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ 
  label, 
  value, 
  icon: Icon, 
  tone = "slate" 
}: { 
  label: string
  value: number
  icon: React.ComponentType<any>
  tone?: string 
}) {
  const toneClasses = {
    slate: "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50",
    violet: "border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50",
    emerald: "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50",
    rose: "border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50"
  }

  return (
    <div className={`rounded-xl border p-3 ${toneClasses[tone as keyof typeof toneClasses]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3 w-3 text-slate-500" />
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="text-lg font-semibold text-slate-900">{(value || 0).toLocaleString("no-NO")}</div>
    </div>
  )
}


