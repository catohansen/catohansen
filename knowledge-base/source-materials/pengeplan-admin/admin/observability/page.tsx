'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  Activity
} from 'lucide-react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import useSWR from 'swr';

interface ObservabilityMetrics {
  userFlow: {
    onboarding: number;
    firstReport: number;
    firstProposal: number;
    firstDecision: number;
    activeUsers: number;
  };
  proposalMetrics: {
    acceptanceRate: number;
    averageDecisionTime: number;
    totalProposals: number;
    pendingProposals: number;
  };
  guardianMetrics: {
    activeTokens: number;
    pendingFollowups: number;
    safeProposals: number;
    consentRenewals: number;
  };
  systemHealth: {
    apiLatency: number;
    errorRate: number;
    uptime: number;
    activeUsers: number;
  };
}

interface FunnelData {
  stage: string;
  users: number;
  conversion: number;
}

interface TimeSeriesData {
  date: string;
  proposals: number;
  decisions: number;
  acceptanceRate: number;
}

// Fetcher for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

export default function AdminObservabilityPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch observability data
  const { data: observabilityData, error, mutate } = useSWR(
    `/api/admin/observability?timeframe=${selectedTimeframe}`,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true
    }
  );

  const metrics: ObservabilityMetrics = observabilityData?.metrics || {
    userFlow: { onboarding: 0, firstReport: 0, firstProposal: 0, firstDecision: 0, activeUsers: 0 },
    proposalMetrics: { acceptanceRate: 0, averageDecisionTime: 0, totalProposals: 0, pendingProposals: 0 },
    guardianMetrics: { activeTokens: 0, pendingFollowups: 0, safeProposals: 0, consentRenewals: 0 },
    systemHealth: { apiLatency: 0, errorRate: 0, uptime: 0, activeUsers: 0 }
  };

  const funnelData: FunnelData[] = observabilityData?.funnelData || [];
  const timeSeriesData: TimeSeriesData[] = observabilityData?.timeSeriesData || [];

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/admin/observability/export?format=${format}&timeframe=${selectedTimeframe}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `observability-${selectedTimeframe}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getHealthColor = (value: number, type: 'latency' | 'error' | 'uptime') => {
    switch (type) {
      case 'latency':
        return value < 200 ? 'text-green-600' : value < 500 ? 'text-yellow-600' : 'text-red-600';
      case 'error':
        return value < 1 ? 'text-green-600' : value < 5 ? 'text-yellow-600' : 'text-red-600';
      case 'uptime':
        return value > 99.5 ? 'text-green-600' : value > 99 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (error) {
    return (
      <AdminPageLayout title="Observability">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">Kunne ikke laste observability-data</p>
          <Button onClick={() => mutate()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Prøv igjen
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Observability">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Observability Dashboard</h1>
            <p className="text-gray-600 mt-1">
              End-to-end metrics og brukerflyt-analyse
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as '7d' | '30d' | '90d')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Siste 7 dager</option>
              <option value="30d">Siste 30 dager</option>
              <option value="90d">Siste 90 dager</option>
            </select>
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('json')}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">AI Proposal Accept Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.proposalMetrics.acceptanceRate}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Decision Time</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.proposalMetrics.averageDecisionTime}d</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Guardian Follow-ups</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.guardianMetrics.pendingFollowups}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.guardianMetrics.activeTokens}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="funnel" className="space-y-6">
          <TabsList>
            <TabsTrigger value="funnel">Brukerflyt</TabsTrigger>
            <TabsTrigger value="trends">Trender</TabsTrigger>
            <TabsTrigger value="health">Systemhelse</TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Brukerflyt - Onboarding til Beslutning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'users' ? `${value} brukere` : `${value}%`,
                        name === 'users' ? 'Brukere' : 'Konvertering'
                      ]}
                    />
                    <Bar dataKey="users" fill="#3b82f6" name="users" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Forslag og Beslutninger over Tid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="proposals" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Forslag"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="decisions" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Beslutninger"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="acceptanceRate" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Godkjenningsrate %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Ytelse</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">P95 Latency</span>
                    <span className={getHealthColor(metrics.systemHealth.apiLatency, 'latency')}>
                      {metrics.systemHealth.apiLatency}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Error Rate</span>
                    <span className={getHealthColor(metrics.systemHealth.errorRate, 'error')}>
                      {metrics.systemHealth.errorRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className={getHealthColor(metrics.systemHealth.uptime, 'uptime')}>
                      {metrics.systemHealth.uptime}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Brukeraktivitet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aktive brukere</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {metrics.systemHealth.activeUsers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Totale forslag</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {metrics.proposalMetrics.totalProposals}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ventende forslag</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {metrics.proposalMetrics.pendingProposals}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
}
