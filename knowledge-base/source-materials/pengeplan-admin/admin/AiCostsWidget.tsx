"use client"

import { useEffect, useState } from "react"
import { Bot, DollarSign, TrendingUp, TrendingDown, Zap } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type AiCosts = { 
  todayUsd: number
  monthUsd: number
  tokensK: number
  trendPct: number
}

export default function AiCostsWidget() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<AiCosts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  async function loadData() {
    try {
      // TODO: Replace with real API endpoint
      // const response = await fetch("/api/admin/ai/costs")
      // const result = await response.json()
      
      // Mock data for now
      setTimeout(() => {
        setData({ 
          todayUsd: 23.45, 
          monthUsd: 704.2, 
          tokensK: 1250, 
          trendPct: +8.3 
        })
        setLoading(false)
      }, 250)
    } catch (error) {
      console.error('Failed to load AI costs:', error)
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Card 
      data-testid="ai-costs-widget" 
      className="rounded-2xl hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => window.location.href = '/admin/ai-integration-report'}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-emerald-600" />
          AI-kostnader
          <Badge className="bg-emerald-100 text-emerald-700">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {loading ? (
          <div className="animate-pulse h-14 bg-slate-100 rounded-xl" />
        ) : data ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KV 
              label="I dag" 
              value={`$${data.todayUsd.toFixed(2)}`} 
              icon={DollarSign}
              tone="emerald"
            />
            <KV 
              label="Måned" 
              value={`$${data.monthUsd.toFixed(1)}`} 
              icon={DollarSign}
              tone="blue"
            />
            <KV 
              label="Tokens" 
              value={`${data.tokensK.toLocaleString("no-NO")}K`} 
              icon={Zap}
              tone="purple"
            />
            <KV
              label="Trend"
              value={`${data.trendPct > 0 ? "+" : ""}${data.trendPct.toFixed(1)}%`}
              icon={data.trendPct >= 0 ? TrendingUp : TrendingDown}
              tone={data.trendPct >= 0 ? "emerald" : "rose"}
            />
          </div>
        ) : (
          <div className="text-slate-500">Ingen data</div>
        )}
        <div className="mt-3">
          <span className="text-xs text-slate-600 underline hover:text-slate-900">
            Åpne AI-rapport →
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function KV({
  label,
  value,
  icon: Icon,
  tone = "slate"
}: {
  label: string
  value: string | number
  icon: React.ComponentType<any>
  tone?: string
}) {
  const toneClasses = {
    slate: "border-slate-200 bg-slate-50",
    emerald: "border-emerald-200 bg-emerald-50",
    blue: "border-blue-200 bg-blue-50",
    purple: "border-purple-200 bg-purple-50",
    rose: "border-rose-200 bg-rose-50"
  }

  const iconClasses = {
    slate: "text-slate-500",
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    rose: "text-rose-600"
  }

  return (
    <div className={`rounded-xl border p-3 ${toneClasses[tone as keyof typeof toneClasses]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-3 w-3 ${iconClasses[tone as keyof typeof iconClasses]}`} />
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
    </div>
  )
}



































