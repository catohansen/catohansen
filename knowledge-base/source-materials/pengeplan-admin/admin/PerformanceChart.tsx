/**
 * AI Performance Chart Component
 * Displays AI performance metrics with interactive charts
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { PerformanceSchema, type PerformanceData } from "@/lib/analytics/schemas";
import { cacheGet, cacheSet } from "@/lib/core/offlineCache";
import { useOnlineStatus } from "@/lib/core/useOnlineStatus";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  YAxis, 
  XAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  Area,
  AreaChart
} from "recharts";

interface PerformanceChartProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
  chartType?: 'line' | 'area';
  period?: string;
  enableOfflineCache?: boolean;
}

export default function PerformanceChart({ 
  autoRefresh = true, 
  refreshInterval = 30000,
  className = "",
  chartType = 'line',
  period = "7d",
  enableOfflineCache = true
}: PerformanceChartProps) {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState<Date | null>(null);

  const onlineStatus = useOnlineStatus({
    enableNetworkInfo: true,
    enablePingTest: false
  });

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const url = `/api/analytics/performance?period=${period}`;
      
      if (onlineStatus.isOnline) {
        // Online: fetch fresh data
        const response = await fetch(url, { 
          cache: "no-store",
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
      
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const json = await response.json();
        const validated = PerformanceSchema.parse(json);
        
        setData(validated);
        setLastUpdated(new Date());
        setIsOffline(false);
        
        // Cache the data for offline use
        if (enableOfflineCache) {
          await cacheSet(url, validated, {
            ttl: 300_000, // 5 minutes
            source: "performance"
          });
        }
      } else {
        // Offline: try to load from cache
        if (enableOfflineCache) {
          const { value, ts, expired } = await cacheGet<PerformanceData>(url);
          
          if (value && !expired) {
            setData(value);
            setCacheTimestamp(ts ? new Date(ts) : null);
            setIsOffline(true);
            setError(null);
          } else {
            throw new Error("Ingen nett – ingen cached data tilgjengelig");
          }
        } else {
          throw new Error("Ingen nett – offline cache deaktivert");
        }
      }
    } catch (err: any) {
      console.error('Failed to load performance data:', err);
      setError(err.message || 'Feil ved henting av ytelsesdata');
      setIsOffline(!onlineStatus.isOnline);
    } finally {
      setLoading(false);
    }
  }, [onlineStatus.isOnline, period, enableOfflineCache]);

  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, loadData]);

  // Listen for custom refresh events
  useEffect(() => {
    const handleRefresh = () => {
      if (autoRefresh) {
        loadData();
      }
    };

    window.addEventListener("analytics:refresh", handleRefresh);
    return () => window.removeEventListener("analytics:refresh", handleRefresh);
  }, [autoRefresh, loadData]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'latency_ms':
        return [`${value.toFixed(0)}ms`, 'Responstid'];
      case 'success_rate':
        return [`${(value * 100).toFixed(1)}%`, 'Suksessrate'];
      case 'cost':
        return [`$${value.toFixed(4)}`, 'Kostnad'];
      default:
        return [value.toString(), name];
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Laster ytelsesdata...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow border border-red-500 ${className}`}>
        <div className="flex items-center gap-2 text-red-300">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
        <button 
          onClick={loadData}
          className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  if (!data || data.series.length === 0) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
        <h3 className="text-lg font-semibold mb-4">AI-ytelse</h3>
        <div className="text-gray-400">Ingen ytelsesdata tilgjengelig</div>
      </div>
    );
  }

  const chartData = data.series.map(point => ({
    ...point,
    t: formatTime(point.t),
    success_rate_pct: point.success_rate * 100
  }));

  return (
    <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI-ytelse</h3>
        <div className="flex items-center gap-2">
          {isOffline && (
            <span className="text-xs text-yellow-400" title="Offline data">
              📱 Offline
            </span>
          )}
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {isOffline && cacheTimestamp 
                ? `Cache: ${cacheTimestamp.toLocaleTimeString()}`
                : lastUpdated.toLocaleTimeString()
              }
            </span>
          )}
          <button 
            onClick={loadData}
            disabled={!onlineStatus.isOnline && !enableOfflineCache}
            className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="t" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }}
                formatter={formatTooltipValue}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="latency_ms"
                name="Responstid (ms)"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="success_rate_pct"
                name="Suksessrate (%)"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="t" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }}
                formatter={formatTooltipValue}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="latency_ms" 
                name="Responstid (ms)" 
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="success_rate_pct" 
                name="Suksessrate (%)" 
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Top Agents */}
      {data.top_agents && data.top_agents.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Topp Agenter</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.top_agents.slice(0, 4).map((agent, index) => (
              <div key={index} className="bg-neutral-800 p-2 rounded text-sm">
                <div className="font-medium">{agent.name}</div>
                <div className="text-gray-400">
                  {agent.calls} kall • {agent.latency_ms}ms
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Problem Agents */}
      {data.problem_agents && data.problem_agents.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-red-300 mb-2">Problematiske Agenter</h4>
          <div className="space-y-1">
            {data.problem_agents.map((agent, index) => (
              <div key={index} className="bg-red-900/20 p-2 rounded text-sm">
                <div className="font-medium text-red-300">{agent.name}</div>
                <div className="text-gray-400">{agent.issue}</div>
                <div className="text-xs text-red-400">
                  {agent.delta_pct > 0 ? '+' : ''}{agent.delta_pct.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400">
          <span>
            {isOffline 
              ? "📱 Offline data fra cache • Verifisert fra ekte kilder" 
              : "Kilde: /api/analytics/performance • Verifisert fra auditTrail"
            }
          </span>
          <div className="flex items-center gap-2">
            {!onlineStatus.isOnline && (
              <span className="text-yellow-400">🔴 Offline</span>
            )}
            <button 
              onClick={() => {/* TODO: Export functionality */}}
              className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs"
            >
              📊 Eksporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
