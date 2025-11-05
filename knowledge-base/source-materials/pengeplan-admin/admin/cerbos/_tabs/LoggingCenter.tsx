"use client";

import useSWR from "swr";
import { useState } from "react";
import { Search, Download, Filter, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CerbosLogEvent {
  id: string;
  at: string;
  decision: "ALLOW" | "DENY";
  principal: {
    id: string;
    role: string;
  };
  resource: {
    kind: string;
    id: string;
  };
  action: string;
  latencyMs: number;
  policyVersion?: string;
  reason?: string;
}

export default function CerbosLoggingCenterTab() {
  const [query, setQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<"ALL" | "ALLOW" | "DENY">("ALL");
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { data, isLoading, mutate } = useSWR<{ events: CerbosLogEvent[] }>(
    `/api/admin/cerbos/logs?limit=200&decision=${decisionFilter !== 'ALL' ? decisionFilter : ''}`,
    fetcher,
    {
      refreshInterval: autoRefresh ? 2000 : 0, // Auto-refresh every 2 seconds
      revalidateOnFocus: false
    }
  );

  const events = data?.events ?? [];
  
  // Filter events based on search query
  const filteredEvents = events.filter((event) => {
    if (!query) return true;
    
    const searchText = `${event.decision} ${event.principal?.id ?? ""} ${event.resource?.kind ?? ""} ${event.resource?.id ?? ""} ${event.action ?? ""}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/cerbos/logs/export', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `cerbos-logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Calculate stats
  const totalEvents = filteredEvents.length;
  const allowCount = filteredEvents.filter(e => e.decision === 'ALLOW').length;
  const denyCount = filteredEvents.filter(e => e.decision === 'DENY').length;
  const avgLatency = filteredEvents.length > 0 
    ? Math.round(filteredEvents.reduce((sum, e) => sum + (e.latencyMs || 0), 0) / filteredEvents.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📋 Logging Center</h2>
          <p className="text-gray-600 mt-1">Live ALLOW/DENY stream fra Cerbos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200" : ""}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin text-green-600" : ""}`} />
            Auto-refresh {autoRefresh ? "ON" : "OFF"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Eksporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-600">Total Events</div>
          <div className="text-2xl font-bold text-gray-900">{totalEvents}</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-sm text-green-600">ALLOW</div>
          <div className="text-2xl font-bold text-green-700">{allowCount}</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="text-sm text-red-600">DENY</div>
          <div className="text-2xl font-bold text-red-700">{denyCount}</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-sm text-blue-600">Avg Latency</div>
          <div className="text-2xl font-bold text-blue-700">{avgLatency}ms</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Søk i logs (principal, resource, action...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="ALL">Alle beslutninger</option>
            <option value="ALLOW">Kun ALLOW</option>
            <option value="DENY">Kun DENY</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tidspunkt
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beslutning
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Principal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latency
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Laster logs...
                  </td>
                </tr>
              )}
              
              {!isLoading && filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Ingen events funnet
                  </td>
                </tr>
              )}
              
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(event.at).toLocaleString('nb-NO')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      className={
                        event.decision === "ALLOW" 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {event.decision}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{event.principal?.id || "—"}</div>
                      <div className="text-gray-500">({event.principal?.role || "—"})</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{event.resource?.kind || "—"}</div>
                      <div className="text-gray-500">{event.resource?.id || "—"}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {event.action || "—"}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {event.latencyMs ? `${event.latencyMs}ms` : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {event.reason || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Denials Section */}
      {denyCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 Top Denials</h3>
          <div className="space-y-2">
            {filteredEvents
              .filter(e => e.decision === 'DENY')
              .slice(0, 5)
              .map((event, i) => (
                <div key={i} className="text-sm text-red-700">
                  <span className="font-mono bg-red-100 px-2 py-1 rounded">
                    {event.principal?.id} → {event.resource?.kind}:{event.action}
                  </span>
                  {event.reason && <span className="ml-2 text-red-600">({event.reason})</span>}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}