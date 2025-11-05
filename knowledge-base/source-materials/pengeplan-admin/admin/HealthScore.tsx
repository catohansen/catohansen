/**
 * AI Health Score Widget
 * Displays overall AI system health with component breakdown
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { HealthScoreSchema, type HealthScore } from "@/lib/analytics/schemas";
import { cacheGet, cacheSet } from "@/lib/core/offlineCache";
import { useOnlineStatus } from "@/lib/core/useOnlineStatus";

interface HealthScoreWidgetProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
  period?: string;
  enableOfflineCache?: boolean;
}

export default function HealthScoreWidget({ 
  autoRefresh = true, 
  refreshInterval = 30000,
  className = "",
  period = "7d",
  enableOfflineCache = true
}: HealthScoreWidgetProps) {
  const [data, setData] = useState<HealthScore | null>(null);
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
      const url = `/api/analytics/health-score?period=${period}`;
      
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
        const validated = HealthScoreSchema.parse(json);
        
        setData(validated);
        setLastUpdated(new Date());
        setIsOffline(false);
        
        // Cache the data for offline use
        if (enableOfflineCache) {
          await cacheSet(url, validated, {
            ttl: 300_000, // 5 minutes
            source: "health-score"
          });
        }
      } else {
        // Offline: try to load from cache
        if (enableOfflineCache) {
          const { value, ts, expired } = await cacheGet<HealthScore>(url);
          
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
      console.error('Failed to load health score:', err);
      setError(err.message || 'Kunne ikke hente helsescore');
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 80) return 'bg-blue-600';
    if (score >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getComponentLabel = (key: string) => {
    switch (key) {
      case 'performance': return 'Ytelse';
      case 'ux': return 'Brukeropplevelse';
      case 'ethics': return 'Etikk';
      case 'system': return 'System';
      default: return key;
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Laster helsescore...</div>
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

  if (!data) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
        <div className="text-gray-400">Ingen data tilgjengelig</div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI Health Score</h2>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${getTrendColor(data.trend)}`}>
            {getTrendIcon(data.trend)} {data.trend}
          </span>
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
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold ${getScoreColor(data.score)}`}>
          {Math.round(data.score)}
        </div>
        <div className="text-sm text-gray-400">Samlet helsescore</div>
      </div>

      {/* Component Breakdown */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        {data.components.map((component) => (
          <div key={component.key} className="rounded-lg bg-neutral-800 p-3">
            <div className="text-xs uppercase text-gray-400 mb-1">
              {getComponentLabel(component.key)}
            </div>
            <div className={`text-2xl font-semibold ${getScoreColor(component.score)}`}>
              {Math.round(component.score)}
            </div>
            <div className="mt-2 h-2 w-full rounded bg-neutral-700">
              <div 
                className={`h-2 rounded ${getScoreBgColor(component.score)}`}
                style={{ width: `${Math.min(100, component.score)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-semibold text-yellow-400">Varsler:</div>
          {data.alerts.map((alert, index) => (
            <div key={index} className="text-sm text-gray-300 bg-yellow-900/20 p-2 rounded">
              {alert}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400">
          <span>
            {isOffline 
              ? "📱 Offline data fra cache • Verifisert fra ekte kilder" 
              : "Data fra auditTrail • Verifisert fra ekte kilder"
            }
          </span>
          <div className="flex items-center gap-2">
            {!onlineStatus.isOnline && (
              <span className="text-yellow-400">🔴 Offline</span>
            )}
            <button 
              onClick={loadData}
              disabled={!onlineStatus.isOnline && !enableOfflineCache}
              className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs"
            >
              🔄 Oppdater
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
