"use client";

import useSWR from "swr";
import { useState } from "react";
import { Bot, Brain, Shield, AlertTriangle, CheckCircle, TrendingUp, Users, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface AIAgent {
  id: string;
  scope: string;
  requests: number;
  allow: number;
  deny: number;
  p50: number;
  p95: number;
  consentRequired: boolean;
  lastActivity: string;
  topDenyReasons: string[];
}

interface AIStatsData {
  totals: {
    requests24h: number;
    denyRate: number;
    p50Ms: number;
    explainability: number;
  };
  agents: AIAgent[];
  consent: {
    guardianConsents: {
      active: number;
      expired: number;
      pending: number;
      revoked: number;
    };
    explainabilityStatus: {
      compliant: number;
      missing: number;
      totalRequests: number;
    };
  };
  healthChecks: {
    lastSyntheticCheck: string;
    syntheticChecksPassed: number;
    aiActCompliance: string;
    gdprCompliance: string;
  };
}

export default function CerbosAIComplianceTab() {
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  
  const { data, isLoading, mutate } = useSWR<AIStatsData>(
    "/api/admin/cerbos/ai-stats",
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  const runSyntheticCheck = async () => {
    try {
      setIsRunningCheck(true);
      const response = await fetch('/api/admin/cerbos/synthetic-check', {
        method: 'POST'
      });
      
      if (response.ok) {
        await mutate(); // Refresh data
      }
    } catch (error) {
      console.error('Synthetic check failed:', error);
    } finally {
      setIsRunningCheck(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = data || {
    totals: { requests24h: 0, denyRate: 0, p50Ms: 0, explainability: 0 },
    agents: [],
    consent: { guardianConsents: { active: 0, expired: 0, pending: 0, revoked: 0 }, explainabilityStatus: { compliant: 0, missing: 0, totalRequests: 0 } },
    healthChecks: { lastSyntheticCheck: '', syntheticChecksPassed: 0, aiActCompliance: 'UNKNOWN', gdprCompliance: 'UNKNOWN' }
  };

  const totalConsents = stats.consent.guardianConsents.active + stats.consent.guardianConsents.expired + stats.consent.guardianConsents.pending + stats.consent.guardianConsents.revoked;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🤖 AI Compliance</h2>
          <p className="text-gray-600 mt-1">AI Act compliance og agent-monitoring</p>
        </div>
        
        <Button
          onClick={runSyntheticCheck}
          disabled={isRunningCheck}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isRunningCheck ? (
            <Clock className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Bot className="h-4 w-4 mr-2" />
          )}
          {isRunningCheck ? 'Kjører...' : 'Run Synthetic Agent Check'}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Forespørsler (24t)</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totals.requests24h.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.totals.denyRate < 5 ? 'bg-green-100' : stats.totals.denyRate < 10 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Shield className={`h-5 w-5 ${
                  stats.totals.denyRate < 5 ? 'text-green-600' : stats.totals.denyRate < 10 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <div className="text-sm text-gray-600">Deny Rate</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totals.denyRate.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Median Latency</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totals.p50Ms}ms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Explainability</div>
                <div className="text-2xl font-bold text-gray-900">{stats.totals.explainability}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Agent Performance
          </CardTitle>
          <CardDescription>
            Oversikt over alle AI-agenter og deres Cerbos-interaksjoner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allow/Deny</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.agents.map((agent) => {
                  const allowRate = agent.requests > 0 ? (agent.allow / agent.requests) * 100 : 0;
                  const isHealthy = allowRate > 90 && agent.p95 < 100;
                  
                  return (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isHealthy ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            <Bot className={`h-4 w-4 ${isHealthy ? 'text-green-600' : 'text-yellow-600'}`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{agent.id}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(agent.lastActivity).toLocaleString('nb-NO')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{agent.scope}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{agent.requests}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">{agent.allow}</Badge>
                          <Badge className="bg-red-100 text-red-800 text-xs">{agent.deny}</Badge>
                          <span className="text-xs text-gray-500">({allowRate.toFixed(1)}%)</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        p50: {agent.p50}ms / p95: {agent.p95}ms
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={agent.consentRequired ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                          {agent.consentRequired ? "Påkrevd" : "Ikke påkrevd"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={isHealthy ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {isHealthy ? "Healthy" : "Warning"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Consent Status & Explainability */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guardian Consent Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Consents</span>
                <Badge className="bg-green-100 text-green-800">{stats.consent.guardianConsents.active}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expired</span>
                <Badge className="bg-yellow-100 text-yellow-800">{stats.consent.guardianConsents.expired}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <Badge className="bg-blue-100 text-blue-800">{stats.consent.guardianConsents.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revoked</span>
                <Badge className="bg-red-100 text-red-800">{stats.consent.guardianConsents.revoked}</Badge>
              </div>
              
              {/* Consent Health */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Consent Health</span>
                </div>
                <Progress 
                  value={totalConsents > 0 ? (stats.consent.guardianConsents.active / totalConsents) * 100 : 0} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {totalConsents > 0 ? Math.round((stats.consent.guardianConsents.active / totalConsents) * 100) : 0}% active consents
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Act Explainability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliant Requests</span>
                <Badge className="bg-green-100 text-green-800">
                  {stats.consent.explainabilityStatus.compliant.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Missing Explainability</span>
                <Badge className="bg-red-100 text-red-800">
                  {stats.consent.explainabilityStatus.missing.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Requests</span>
                <span className="text-sm font-medium">{stats.consent.explainabilityStatus.totalRequests}</span>
              </div>
              
              {/* Explainability Progress */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">AI Act Compliance</span>
                </div>
                <Progress 
                  value={stats.consent.explainabilityStatus.compliant} 
                  className="h-2"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {stats.consent.explainabilityStatus.compliant.toFixed(1)}% compliant
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className={`${
          stats.healthChecks.aiActCompliance === 'COMPLIANT' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.healthChecks.aiActCompliance === 'COMPLIANT' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {stats.healthChecks.aiActCompliance === 'COMPLIANT' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <div className="text-sm text-gray-600">AI Act</div>
                <div className={`font-bold ${
                  stats.healthChecks.aiActCompliance === 'COMPLIANT' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {stats.healthChecks.aiActCompliance}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${
          stats.healthChecks.gdprCompliance === 'COMPLIANT' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.healthChecks.gdprCompliance === 'COMPLIANT' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {stats.healthChecks.gdprCompliance === 'COMPLIANT' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <div className="text-sm text-gray-600">GDPR</div>
                <div className={`font-bold ${
                  stats.healthChecks.gdprCompliance === 'COMPLIANT' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {stats.healthChecks.gdprCompliance}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Synthetic Tests</div>
                <div className="font-bold text-blue-700">
                  {stats.healthChecks.syntheticChecksPassed.toFixed(1)}% Pass
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Deny Reasons */}
      {stats.agents.some(agent => agent.topDenyReasons.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Top Deny Reasons
            </CardTitle>
            <CardDescription>
              Mest vanlige årsaker til DENY-beslutninger
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.agents.map((agent) => (
                agent.topDenyReasons.length > 0 && (
                  <div key={agent.id} className="border-l-4 border-red-200 pl-4">
                    <div className="font-medium text-gray-900 mb-2">{agent.id}</div>
                    <div className="space-y-1">
                      {agent.topDenyReasons.map((reason, i) => (
                        <div key={i} className="text-sm text-red-700 bg-red-50 px-2 py-1 rounded">
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Synthetic Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Siste Synthetic Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Kjørt</div>
              <div className="font-medium">
                {stats.healthChecks.lastSyntheticCheck 
                  ? new Date(stats.healthChecks.lastSyntheticCheck).toLocaleString('nb-NO')
                  : 'Aldri'
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className={`font-bold ${
                stats.healthChecks.syntheticChecksPassed > 95 ? 'text-green-700' : 
                stats.healthChecks.syntheticChecksPassed > 90 ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {stats.healthChecks.syntheticChecksPassed.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}