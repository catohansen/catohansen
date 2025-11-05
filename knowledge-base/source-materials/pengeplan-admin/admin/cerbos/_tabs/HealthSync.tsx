"use client";

import useSWR from "swr";
import { useState } from "react";
import { Activity, Server, Wifi, Database, AlertTriangle, CheckCircle, Clock, TrendingUp, Zap, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface HealthData {
  grpc: {
    ok: boolean;
    latencyMs: number;
    lastCheck: string;
    endpoint: string;
    version: string;
  };
  http: {
    ok: boolean;
    latencyMs: number;
    lastCheck: string;
    endpoint: string;
    version: string;
  };
  sync: {
    uptimeSec: number;
    lastSyncAt: string;
    syncStatus: string;
    policyBundleSize: number;
    lastPolicyUpdate: string;
  };
  policies: {
    count: number;
    kinds: Record<string, number>;
    lastCompiled: string;
    compileStatus: string;
  };
  metrics: {
    requestsPerSecond: number;
    p50LatencyMs: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
    errorRate: number;
    cacheHitRate: number;
  };
  failMode: {
    current: string;
    configured: string;
    isHealthy: boolean;
    lastFailModeChange: string;
  };
  alerts: any[];
  probes: {
    synthetic: {
      lastRun: string;
      status: string;
      testsRun: number;
      testsPassed: number;
      testsFailed: number;
    };
    traffic: {
      allowRate: number;
      denyRate: number;
      totalRequests24h: number;
      uniquePrincipals24h: number;
      uniqueResources24h: number;
    };
  };
  metadata: {
    healthStatus: string;
    overallStatus: string;
  };
}

export default function CerbosHealthSyncTab() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { data, isLoading, mutate } = useSWR<HealthData>(
    "/api/admin/cerbos/health",
    fetcher,
    {
      refreshInterval: autoRefresh ? 5000 : 0, // Refresh every 5 seconds
      revalidateOnFocus: false
    }
  );

  const runHealthCheck = async () => {
    try {
      await fetch('/api/admin/cerbos/health-check', { method: 'POST' });
      await mutate();
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const health = data || {
    grpc: { ok: false, latencyMs: 0, lastCheck: '', endpoint: '', version: '' },
    http: { ok: false, latencyMs: 0, lastCheck: '', endpoint: '', version: '' },
    sync: { uptimeSec: 0, lastSyncAt: '', syncStatus: 'unknown', policyBundleSize: 0, lastPolicyUpdate: '' },
    policies: { count: 0, kinds: {}, lastCompiled: '', compileStatus: 'unknown' },
    metrics: { requestsPerSecond: 0, p50LatencyMs: 0, p95LatencyMs: 0, p99LatencyMs: 0, errorRate: 0, cacheHitRate: 0 },
    failMode: { current: 'UNKNOWN', configured: 'UNKNOWN', isHealthy: false, lastFailModeChange: '' },
    alerts: [],
    probes: { 
      synthetic: { lastRun: '', status: 'UNKNOWN', testsRun: 0, testsPassed: 0, testsFailed: 0 },
      traffic: { allowRate: 0, denyRate: 0, totalRequests24h: 0, uniquePrincipals24h: 0, uniqueResources24h: 0 }
    },
    metadata: { healthStatus: 'UNKNOWN', overallStatus: 'RED' }
  };

  const overallHealthy = health.grpc.ok || health.http.ok;
  const uptimeDays = Math.floor(health.sync.uptimeSec / 86400);
  const uptimeHours = Math.floor((health.sync.uptimeSec % 86400) / 3600);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">💚 Health & Sync</h2>
          <p className="text-gray-600 mt-1">Cerbos system health og performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200" : ""}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? "text-green-600" : ""}`} />
            Auto-refresh {autoRefresh ? "ON" : "OFF"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={runHealthCheck}>
            <Zap className="h-4 w-4 mr-2" />
            Run Health Check
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={`${
        health.metadata.overallStatus === 'GREEN' ? 'border-green-200 bg-green-50' :
        health.metadata.overallStatus === 'YELLOW' ? 'border-yellow-200 bg-yellow-50' :
        'border-red-200 bg-red-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              health.metadata.overallStatus === 'GREEN' ? 'bg-green-100' :
              health.metadata.overallStatus === 'YELLOW' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              {health.metadata.overallStatus === 'GREEN' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : health.metadata.overallStatus === 'YELLOW' ? (
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                System Status: <span className={`${
                  health.metadata.overallStatus === 'GREEN' ? 'text-green-700' :
                  health.metadata.overallStatus === 'YELLOW' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {health.metadata.overallStatus}
                </span>
              </h3>
              <p className="text-gray-600">
                {overallHealthy ? 'Cerbos kjører normalt' : 'Cerbos har problemer'} • 
                Uptime: {uptimeDays}d {uptimeHours}h
              </p>
              <div className="text-sm text-gray-500 mt-1">
                "Grønn hvis én er grønn" policy: {overallHealthy ? '✅ Aktiv' : '❌ Begge nede'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* gRPC & HTTP Health */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className={health.grpc.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className={`h-5 w-5 ${health.grpc.ok ? 'text-green-600' : 'text-red-600'}`} />
              gRPC Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={health.grpc.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {health.grpc.ok ? "OK" : "FEIL"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Latency</span>
                <span className="text-sm font-medium">{health.grpc.latencyMs}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Endpoint</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{health.grpc.endpoint}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium">{health.grpc.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Check</span>
                <span className="text-xs text-gray-500">
                  {health.grpc.lastCheck ? new Date(health.grpc.lastCheck).toLocaleString('nb-NO') : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={health.http.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className={`h-5 w-5 ${health.http.ok ? 'text-green-600' : 'text-red-600'}`} />
              HTTP Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={health.http.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {health.http.ok ? "OK" : "FEIL"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Latency</span>
                <span className="text-sm font-medium">{health.http.latencyMs}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Endpoint</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{health.http.endpoint}</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium">{health.http.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Check</span>
                <span className="text-xs text-gray-500">
                  {health.http.lastCheck ? new Date(health.http.lastCheck).toLocaleString('nb-NO') : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{health.metrics.requestsPerSecond.toFixed(1)}</div>
              <div className="text-sm text-blue-600">Requests/sec</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{health.metrics.p50LatencyMs}ms</div>
              <div className="text-sm text-green-600">p50 Latency</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{health.metrics.p95LatencyMs}ms</div>
              <div className="text-sm text-yellow-600">p95 Latency</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{health.metrics.p99LatencyMs}ms</div>
              <div className="text-sm text-red-600">p99 Latency</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm font-medium">{health.metrics.errorRate.toFixed(2)}%</span>
              </div>
              <Progress 
                value={health.metrics.errorRate} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cache Hit Rate</span>
                <span className="text-sm font-medium">{health.metrics.cacheHitRate.toFixed(1)}%</span>
              </div>
              <Progress 
                value={health.metrics.cacheHitRate} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fail Mode & Policies */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Fail Mode Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Mode</span>
                <Badge className={health.failMode.current === 'CLOSED' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {health.failMode.current}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Configured</span>
                <Badge variant="outline">{health.failMode.configured}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Health Status</span>
                <Badge className={health.failMode.isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {health.failMode.isHealthy ? "Healthy" : "Unhealthy"}
                </Badge>
              </div>
              {health.failMode.lastFailModeChange && (
                <div className="pt-2 border-t text-xs text-gray-500">
                  Sist endret: {new Date(health.failMode.lastFailModeChange).toLocaleString('nb-NO')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Policy Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Policies</span>
                <span className="text-lg font-bold text-gray-900">{health.policies.count}</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Policy Types:</div>
                {Object.entries(health.policies.kinds).map(([kind, count]) => (
                  <div key={kind} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 capitalize">{kind}</span>
                    <Badge variant="outline" className="text-xs">{count}</Badge>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Compile Status</span>
                  <Badge className={health.policies.compileStatus === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {health.policies.compileStatus}
                  </Badge>
                </div>
                {health.policies.lastCompiled && (
                  <div className="text-xs text-gray-500 mt-1">
                    Sist kompilert: {new Date(health.policies.lastCompiled).toLocaleString('nb-NO')}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Traffic Analytics (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{health.probes.traffic.totalRequests24h.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Total Requests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{health.probes.traffic.allowRate.toFixed(1)}%</div>
              <div className="text-sm text-green-600">Allow Rate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{health.probes.traffic.denyRate.toFixed(1)}%</div>
              <div className="text-sm text-red-600">Deny Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{health.probes.traffic.uniquePrincipals24h}</div>
              <div className="text-sm text-purple-600">Unique Users</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-700">{health.probes.traffic.uniqueResources24h}</div>
              <div className="text-sm text-indigo-600">Unique Resources</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Synthetic Probes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Synthetic Probes
          </CardTitle>
          <CardDescription>
            Automatiske tester som sjekker Cerbos-funksjonalitet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white border rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Last Run</div>
              <div className="font-medium text-gray-900">
                {health.probes.synthetic.lastRun 
                  ? new Date(health.probes.synthetic.lastRun).toLocaleString('nb-NO')
                  : 'Aldri'
                }
              </div>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Tests Run</div>
              <div className="font-medium text-gray-900">
                {health.probes.synthetic.testsRun}
              </div>
            </div>
            <div className="text-center p-4 bg-white border rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Success Rate</div>
              <div className={`font-bold ${
                health.probes.synthetic.testsPassed === health.probes.synthetic.testsRun ? 'text-green-700' : 'text-red-700'
              }`}>
                {health.probes.synthetic.testsRun > 0 
                  ? ((health.probes.synthetic.testsPassed / health.probes.synthetic.testsRun) * 100).toFixed(1)
                  : 0
                }%
              </div>
            </div>
          </div>

          {health.probes.synthetic.testsFailed > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertTriangle className="h-4 w-4" />
                {health.probes.synthetic.testsFailed} test(s) feilet
              </div>
              <div className="text-sm text-red-700">
                Sjekk logs for detaljer om hvilke synthetic tests som feiler.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts & Monitoring */}
      {health.alerts.length > 0 ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {health.alerts.map((alert, i) => (
                <div key={i} className="p-3 bg-white border border-red-200 rounded-lg">
                  <div className="font-medium text-red-800">{alert.title}</div>
                  <div className="text-sm text-red-600">{alert.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Triggered: {new Date(alert.triggeredAt).toLocaleString('nb-NO')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-green-800 mb-2">Ingen aktive alarmer</h3>
            <p className="text-sm text-green-600">
              Alle Cerbos-systemer kjører normalt
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alert Conditions Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert Conditions
          </CardTitle>
          <CardDescription>
            Konfigurerte terskler for alarmer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-3">🚨 Critical Alerts</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Fail mode != CLOSED (prod) → Critical Alert</div>
                <div>• Both gRPC AND HTTP down → Critical Alert</div>
                <div>• Error rate &gt; 5% → Critical Alert</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-3">⚠️ Warning Alerts</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• DENY rate &gt; 10% (5 min) → Warning</div>
                <div>• P95 latency &gt; 500ms → Warning</div>
                <div>• Synthetic tests &lt; 95% → Warning</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}