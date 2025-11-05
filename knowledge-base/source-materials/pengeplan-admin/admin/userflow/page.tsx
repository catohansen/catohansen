'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Eye,
  BarChart3,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';
import useSWR from 'swr';

interface UserFlowData {
  kpis: {
    totalUsers: number;
    activeUsers: number;
    avgProposalDecisionTime: number;
    proposalAcceptRate: number;
    guardianActiveTokens: number;
    pendingFollowups: number;
    avgOnboardingTime: number;
    completionRate: number;
  };
  funnel: {
    onboarding: { started: number; completed: number; completionRate: number };
    reports: { generated: number; acknowledged: number; completionRate: number };
    proposals: { created: number; accepted: number; rejected: number; acceptanceRate: number };
    followups: { created: number; acknowledged: number; completed: number; completionRate: number };
  };
  bottlenecks: Array<{
    stage: string;
    users: number;
    avgTime: number;
    description: string;
  }>;
  recentActivity: Array<{
    id: string;
    userId: string;
    kind: string;
    timestamp: string;
    details: any;
  }>;
  trends: {
    daily: Array<{ date: string; proposals: number; acceptances: number; rejections: number }>;
    weekly: Array<{ week: string; proposals: number; acceptances: number; rejections: number }>;
  };
}

// Fetcher for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

export default function AdminUserFlowPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');

  // Fetch user flow data
  const { data: userFlowData, mutate: mutateUserFlow } = useSWR('/api/admin/userflow/overview', fetcher);
  const data: UserFlowData = userFlowData;

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch(`/api/admin/userflow/export?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `userflow-data.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Data eksportert som ${format.toUpperCase()}`);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast.error('Kunne ikke eksportere data');
    }
  };

  const getActivityIcon = (kind: string) => {
    switch (kind) {
      case 'proposal_accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'proposal_rejected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'followup_created': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'onboarding_completed': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityLabel = (kind: string) => {
    switch (kind) {
      case 'proposal_accepted': return 'Forslag godkjent';
      case 'proposal_rejected': return 'Forslag avslått';
      case 'followup_created': return 'Oppfølging opprettet';
      case 'onboarding_completed': return 'Onboarding fullført';
      default: return kind;
    }
  };

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Brukerflyt Oversikt</h1>
            <p className="text-gray-600">
              Helikopterview av brukerreiser fra onboarding til beslutning.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('json')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="bottlenecks">Flaskehalser</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card data-testid="userflow-kpi-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Totale brukere</p>
                    <p className="text-2xl font-bold text-gray-900">{data.kpis.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {data.kpis.activeUsers} aktive
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Godkjenningsrate</p>
                    <p className="text-2xl font-bold text-gray-900">{data.kpis.proposalAcceptRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {data.kpis.avgProposalDecisionTime}d avg. beslutningstid
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktive verge</p>
                    <p className="text-2xl font-bold text-gray-900">{data.kpis.guardianActiveTokens}</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {data.kpis.pendingFollowups} ventende oppfølginger
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fullføringsrate</p>
                    <p className="text-2xl font-bold text-gray-900">{data.kpis.completionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {data.kpis.avgOnboardingTime}d avg. onboarding
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Siste aktivitet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    {getActivityIcon(activity.kind)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {getActivityLabel(activity.kind)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Bruker {activity.userId} • {new Date(activity.timestamp).toLocaleString('no-NO')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.kind}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Startet</span>
                    <Badge variant="secondary">{data.funnel.onboarding.started}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fullført</span>
                    <Badge variant="secondary">{data.funnel.onboarding.completed}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fullføringsrate</span>
                    <Badge className="bg-green-100 text-green-800">
                      {data.funnel.onboarding.completionRate}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forslag Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Opprettet</span>
                    <Badge variant="secondary">{data.funnel.proposals.created}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Godkjent</span>
                    <Badge className="bg-green-100 text-green-800">{data.funnel.proposals.accepted}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avslått</span>
                    <Badge className="bg-red-100 text-red-800">{data.funnel.proposals.rejected}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Godkjenningsrate</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {data.funnel.proposals.acceptanceRate}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bottlenecks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Flaskehalser og trege flyter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.bottlenecks.map((bottleneck, index) => (
                  <Card key={index} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 capitalize">
                            {bottleneck.stage.replace('_', ' ')}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{bottleneck.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-yellow-600">{bottleneck.users}</p>
                          <p className="text-xs text-gray-500">brukere</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <span>Gj.sn. tid: {bottleneck.avgTime} dager</span>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Se detaljer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Forslagstrender</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedTimeframe === 'daily' ? 'default' : 'outline'}
                  onClick={() => setSelectedTimeframe('daily')}
                >
                  Daglig
                </Button>
                <Button
                  size="sm"
                  variant={selectedTimeframe === 'weekly' ? 'default' : 'outline'}
                  onClick={() => setSelectedTimeframe('weekly')}
                >
                  Ukentlig
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Forslag vs Beslutninger</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedTimeframe === 'daily' ? data.trends.daily : data.trends.weekly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={selectedTimeframe === 'daily' ? 'date' : 'week'} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="proposals" stroke="#3b82f6" strokeWidth={2} name="Forslag" />
                    <Line type="monotone" dataKey="acceptances" stroke="#10b981" strokeWidth={2} name="Godkjent" />
                    <Line type="monotone" dataKey="rejections" stroke="#ef4444" strokeWidth={2} name="Avslått" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
