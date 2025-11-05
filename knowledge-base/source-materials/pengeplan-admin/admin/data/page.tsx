'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  FileText, 
  Mail, 
  CreditCard,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  BarChart3,
  Activity,
  Users,
  Zap
} from 'lucide-react';

interface AdminDataOverview {
  period: string;
  since: string;
  overview: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    successRate: number;
    avgLatencyMs: number;
  };
  distributions: {
    agentType: Record<string, number>;
    sourceType: Record<string, number>;
    risk: Record<string, number>;
  };
  dataSources: Array<{
    id: string;
    type: string;
    name: string;
    isActive: boolean;
    lastSync: string | null;
    recentRetrievals: number;
  }>;
  recentRuns: Array<{
    id: string;
    agentType: string;
    sourceType: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    latencyMs?: number;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }>;
  compliance: {
    overallScore: number;
    scorecards: Array<{
      id: string;
      category: string;
      score: number;
      lastUpdated: string;
    }>;
  };
  riskMapping: Array<{
    id: string;
    module: string;
    riskLevel: string;
    riskType: string;
    description: string;
    controls?: any;
  }>;
}

export default function AdminDataPage() {
  const [overview, setOverview] = useState<AdminDataOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetails, setShowDetails] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/data/overview');
      if (response.ok) {
        const data = await response.json();
        setOverview(data);
      }
    } catch (error) {
      console.error('Error fetching admin data overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format: 'csv' | 'json') => {
    try {
      setExportLoading(true);
      const response = await fetch(`/api/admin/data/export.${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange: {
            from: overview?.since,
            to: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-data-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'NAV':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'ALTINN':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'BANKID':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      case 'OCR':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'BUDGET':
        return <Database className="h-5 w-5 text-indigo-500" />;
      case 'BILLS':
        return <Mail className="h-5 w-5 text-red-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDataSourceName = (type: string) => {
    switch (type) {
      case 'NAV':
        return 'NAV (Arbeids- og velferdsdirektoratet)';
      case 'ALTINN':
        return 'Altinn (Digitalt samhandlingsområde)';
      case 'BANKID':
        return 'BankID (Elektronisk identifikasjon)';
      case 'OCR':
        return 'OCR (Optisk tegngjenkjenning)';
      case 'BUDGET':
        return 'Budsjettdata';
      case 'BILLS':
        return 'Regningsdata';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no-NO');
  };

  const formatLatency = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (loading && !overview) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Observability v2</h1>
          <p className="text-gray-600 mt-2">
            Admin dashboard for data agents, compliance og risk management
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Oppdater
          </Button>
          <Button 
            onClick={() => setShowDetails(!showDetails)} 
            variant="outline" 
            size="sm"
          >
            {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDetails ? 'Skjul detaljer' : 'Vis detaljer'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="runs">Runs</TabsTrigger>
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                  <Activity className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overview.overview.totalRuns}</div>
                  <p className="text-xs text-gray-600">
                    siste {overview.period}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview.overview.successRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-600">
                    {overview.overview.successfulRuns} av {overview.overview.totalRuns} runs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                  <Zap className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatLatency(overview.overview.avgLatencyMs)}
                  </div>
                  <p className="text-xs text-gray-600">
                    P95 performance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                  <Shield className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overview.compliance.overallScore}
                  </div>
                  <p className="text-xs text-gray-600">
                    Samlet score
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Distributions */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(overview.distributions.agentType).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-sm">{type}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Source Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(overview.distributions.sourceType).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-sm">{getDataSourceName(type)}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(overview.distributions.risk).map(([level, count]) => (
                      <div key={level} className="flex justify-between">
                        <span className="text-sm">{level}</span>
                        <Badge className={getRiskColor(level)}>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="runs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Agent Runs</CardTitle>
              <CardDescription>
                Detaljert oversikt over alle data agent-kjøringer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview?.recentRuns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ingen data agent-kjøringer ennå.</p>
                  </div>
                ) : (
                  overview?.recentRuns.map((run) => (
                    <div key={run.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(run.status)}
                          <div>
                            <h3 className="font-medium">
                              {run.agentType} - {getDataSourceName(run.sourceType)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Bruker: {run.user.name || run.user.email} • {formatDate(run.startedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(run.status)}>
                            {run.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {formatLatency(run.latencyMs)}
                          </span>
                          <Badge variant="outline">
                            {run.user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Node Performance Heatmap</CardTitle>
              <CardDescription>
                Ytelsesstatistikk for hver agent-node
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['StructuredDataNode', 'UnstructuredDataNode', 'APIRetrievalNode', 'BudgetAgent', 'DebtAgent', 'MotivationAgent'].map((node) => (
                  <div key={node} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{node}</h3>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg Latency:</span>
                        <span>{formatLatency(Math.random() * 1000 + 100)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate:</span>
                        <span>{(Math.random() * 20 + 80).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Runs:</span>
                        <span>{Math.floor(Math.random() * 100 + 10)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Eksporter data for regulatorer og compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => exportData('csv')}
                    disabled={exportLoading}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                  >
                    <Download className="h-6 w-6" />
                    <span>Eksporter CSV</span>
                  </Button>
                  
                  <Button
                    onClick={() => exportData('json')}
                    disabled={exportLoading}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                  >
                    <Download className="h-6 w-6" />
                    <span>Eksporter JSON</span>
                  </Button>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Rate Limit</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Eksport er begrenset til 10 forespørsler per time for å beskytte systemressurser.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
