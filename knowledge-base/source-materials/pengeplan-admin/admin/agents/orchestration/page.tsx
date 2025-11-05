'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Brain, 
  Clock, 
  TrendingUp, 
  Users, 
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AgentRun {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  status: string;
  entryPoint: string;
  startedAt: string;
  finishedAt?: string;
  latencyMs?: number;
  suggestionsCount: number;
  suggestions: Array<{
    id: string;
    kind: string;
    status: string;
    confidence?: number;
    createdAt: string;
  }>;
  nodeTraces: Array<{
    node: string;
    step: number;
    latencyMs?: number;
  }>;
  resultSummary?: any;
}

interface AgentMetrics {
  period: string;
  since: string;
  runs: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
    avgLatencyMs: number;
  };
  suggestions: {
    total: number;
    accepted: number;
    rejected: number;
    acceptRate: number;
  };
  nodeLatency: Record<string, { avg: number; p95: number; count: number }>;
  entryPointDistribution: Record<string, number>;
  suggestionKindDistribution: Record<string, number>;
  recentActivity: number;
}

interface AgentGraph {
  version: string;
  description: string;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    from: string;
    to: string;
    type: string;
    label: string;
  }>;
  entryPoints: string[];
  exitPoints: string[];
  policies: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
  }>;
}

export default function AgentOrchestrationPage() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [graph, setGraph] = useState<AgentGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<AgentRun | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [runsRes, metricsRes, graphRes] = await Promise.all([
        fetch('/api/admin/agents/runs?limit=20'),
        fetch('/api/admin/agents/metrics'),
        fetch('/api/admin/agents/graph')
      ]);

      if (runsRes.ok) {
        const runsData = await runsRes.json();
        setRuns(runsData.runs || []);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }

      if (graphRes.ok) {
        const graphData = await graphRes.json();
        setGraph(graphData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
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
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatLatency = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no-NO');
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold">Agent Orchestration</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage AI agent workflows and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.runs.successRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-600">
                {metrics.runs.successful} of {metrics.runs.total} runs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLatency(metrics.runs.avgLatencyMs)}</div>
              <p className="text-xs text-gray-600">
                Last {metrics.period}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accept Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.suggestions.acceptRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-600">
                {metrics.suggestions.accepted} of {metrics.suggestions.total} suggestions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.recentActivity}</div>
              <p className="text-xs text-gray-600">
                Runs in last 24h
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="runs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="runs">Recent Runs</TabsTrigger>
          <TabsTrigger value="graph">Agent Graph</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Agent Runs</CardTitle>
              <CardDescription>
                Latest agent orchestration executions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRun(run)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(run.status)}
                        <div>
                          <div className="font-medium">
                            {run.user.name || run.user.email}
                          </div>
                          <div className="text-sm text-gray-600">
                            {run.entryPoint} • {formatDate(run.startedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(run.status)}>
                          {run.status}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {formatLatency(run.latencyMs)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {run.suggestionsCount} suggestions
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Workflow Graph</CardTitle>
              <CardDescription>
                {graph?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {graph && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {graph.nodes.map((node) => (
                      <div key={node.id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            node.type === 'input' ? 'bg-green-500' :
                            node.type === 'agent' ? 'bg-blue-500' :
                            node.type === 'processor' ? 'bg-purple-500' :
                            node.type === 'validator' ? 'bg-orange-500' :
                            'bg-gray-500'
                          }`} />
                          <h3 className="font-medium">{node.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{node.description}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Policies</h3>
                    <div className="space-y-2">
                      {graph.policies.map((policy) => (
                        <div key={policy.id} className="flex items-center space-x-2">
                          <Badge variant="outline">{policy.type}</Badge>
                          <span className="font-medium">{policy.name}</span>
                          <span className="text-sm text-gray-600">{policy.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Node Performance</CardTitle>
              <CardDescription>
                Latency metrics for each agent node
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.nodeLatency && (
                <div className="space-y-4">
                  {Object.entries(metrics.nodeLatency).map(([node, stats]) => (
                    <div key={node} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{node}</h3>
                        <Badge variant="outline">{stats.count} runs</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Average</div>
                          <div className="font-medium">{formatLatency(stats.avg)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">P95</div>
                          <div className="font-medium">{formatLatency(stats.p95)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Run Detail Modal */}
      {selectedRun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Run Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRun(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">User</h3>
                  <p>{selectedRun.user.name || selectedRun.user.email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedRun.status)}
                    <Badge className={getStatusColor(selectedRun.status)}>
                      {selectedRun.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Timing</h3>
                  <p>Started: {formatDate(selectedRun.startedAt)}</p>
                  {selectedRun.finishedAt && (
                    <p>Finished: {formatDate(selectedRun.finishedAt)}</p>
                  )}
                  {selectedRun.latencyMs && (
                    <p>Duration: {formatLatency(selectedRun.latencyMs)}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Node Traces</h3>
                  <div className="space-y-2">
                    {selectedRun.nodeTraces.map((trace, index) => (
                      <div key={index} className="flex items-center justify-between border rounded p-2">
                        <span>{trace.node}</span>
                        <span className="text-sm text-gray-600">
                          Step {trace.step} • {formatLatency(trace.latencyMs)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Suggestions</h3>
                  <div className="space-y-2">
                    {selectedRun.suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="flex items-center justify-between border rounded p-2">
                        <div>
                          <span className="font-medium">{suggestion.kind}</span>
                          {suggestion.confidence && (
                            <span className="text-sm text-gray-600 ml-2">
                              ({suggestion.confidence}% confidence)
                            </span>
                          )}
                        </div>
                        <Badge variant="outline">{suggestion.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
