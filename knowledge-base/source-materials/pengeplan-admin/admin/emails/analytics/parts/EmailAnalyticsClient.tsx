'use client'

import { AlertTriangle, CheckCircle, Clock, Mail, Shield } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface AnalyticsData {
  totalEmails: number
  deliveryRate: number
  bounceRate: number
  spamRate: number
  avgTTFW: number
  p95TTFW: number
  suppressionStats: Array<{
    reason: string
    _count: { id: number }
  }>
  alerts: Array<{
    type: 'info' | 'warning' | 'critical'
    message: string
  }>
}

interface EmailAnalyticsClientProps {
  data: AnalyticsData
}

export function EmailAnalyticsClient({ data }: EmailAnalyticsClientProps) {
  const getStatusColor = (rate: number, threshold: number, reverse = false) => {
    const isGood = reverse ? rate <= threshold : rate >= threshold
    return isGood ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = (rate: number, threshold: number, reverse = false) => {
    const isGood = reverse ? rate <= threshold : rate >= threshold
    return isGood ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">E-post Analytics</h1>
        <p className="text-gray-600">SLO-måltall og leveranse-statistikk for siste 24 timer</p>
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'critical' ? 'destructive' : alert.type === 'warning' ? 'default' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* SLO Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leveransegrad</p>
              <p className={`text-2xl font-bold ${getStatusColor(data.deliveryRate, 95)}`}>
                {data.deliveryRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Grense: ≥95%</p>
            </div>
            {getStatusIcon(data.deliveryRate, 95)}
          </div>
          <Progress value={data.deliveryRate} className="mt-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className={`text-2xl font-bold ${getStatusColor(data.bounceRate, 2, true)}`}>
                {data.bounceRate.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">Grense: ≤2%</p>
            </div>
            {getStatusIcon(data.bounceRate, 2, true)}
          </div>
          <Progress value={data.bounceRate * 10} className="mt-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Spam Complaints</p>
              <p className={`text-2xl font-bold ${getStatusColor(data.spamRate, 0.1, true)}`}>
                {data.spamRate.toFixed(3)}%
              </p>
              <p className="text-xs text-gray-500">Grense: ≤0.1%</p>
            </div>
            {getStatusIcon(data.spamRate, 0.1, true)}
          </div>
          <Progress value={data.spamRate * 100} className="mt-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">TTFW p95</p>
              <p className={`text-2xl font-bold ${getStatusColor(data.p95TTFW, 60, true)}`}>
                {data.p95TTFW}s
              </p>
              <p className="text-xs text-gray-500">Grense: ≤60s</p>
            </div>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total E-poster</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalEmails.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Siste 24 timer</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Gjennomsnitt TTFW</p>
              <p className="text-2xl font-bold text-gray-900">{data.avgTTFW}s</p>
              <p className="text-xs text-gray-500">Time to First Webhook</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Suppressed</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.suppressionStats.reduce((sum, stat) => sum + stat._count.id, 0)}
              </p>
              <p className="text-xs text-gray-500">Totalt i suppression-liste</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Suppression Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Suppression-liste Oversikt</h3>
        <div className="space-y-3">
          {data.suppressionStats.map((stat) => (
            <div key={stat.reason} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{stat.reason}</Badge>
                <span className="text-sm text-gray-600">
                  {stat.reason === 'BOUNCE' && 'Bounced e-poster'}
                  {stat.reason === 'COMPLAINT' && 'Spam complaints'}
                  {stat.reason === 'UNSUBSCRIBE' && 'Avmeldte brukere'}
                  {stat.reason === 'MANUAL' && 'Manuelt lagt til'}
                </span>
              </div>
              <span className="font-semibold">{stat._count.id}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

