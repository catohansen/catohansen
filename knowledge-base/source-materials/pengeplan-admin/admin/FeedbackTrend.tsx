/**
 * User Feedback Trend Component
 * Displays user feedback trends and engagement metrics
 */

"use client";

import { useEffect, useState } from "react";
import { FeedbackSchema, type FeedbackData } from "@/lib/analytics/schemas";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line,
  BarChart,
  Bar
} from "recharts";

interface FeedbackTrendProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
  chartType?: 'area' | 'line' | 'bar';
}

export default function FeedbackTrend({ 
  autoRefresh = true, 
  refreshInterval = 30000,
  className = "",
  chartType = 'area'
}: FeedbackTrendProps) {
  const [data, setData] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const response = await fetch("/api/analytics/feedback", { 
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
      const validated = FeedbackSchema.parse(json);
      
      setData(validated);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to load feedback data:', err);
      setError(err.message || 'Feil ved henting av tilbakemeldinger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('no-NO', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'rating':
        return [`${value.toFixed(1)}/5`, 'Rating'];
      case 'responses':
        return [`${value}`, 'Antall svar'];
      default:
        return [value.toString(), name];
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Laster feedback-data...</div>
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

  if (!data || data.trend.length === 0) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
        <h3 className="text-lg font-semibold mb-4">Brukerfeedback</h3>
        <div className="text-gray-400">Ingen feedback-data tilgjengelig</div>
      </div>
    );
  }

  const chartData = data.trend.map(point => ({
    ...point,
    t: formatDate(point.t)
  }));

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      children: (
        <>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="t" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            domain={[0, 5]}
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
        </>
      )
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <Line 
              type="monotone" 
              dataKey="rating" 
              name="Rating" 
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <Bar 
              dataKey="rating" 
              name="Rating" 
              fill="#3B82F6"
            />
          </BarChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            <Area 
              type="monotone" 
              dataKey="rating" 
              name="Rating" 
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Brukerfeedback</h3>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={loadData}
            className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-neutral-800 p-3 rounded">
          <div className="text-sm text-gray-400">Gjennomsnittlig Rating</div>
          <div className="text-2xl font-bold text-blue-400">
            {data.avg_rating.toFixed(1)}/5
          </div>
        </div>
        <div className="bg-neutral-800 p-3 rounded">
          <div className="text-sm text-gray-400">Totalt Svar</div>
          <div className="text-2xl font-bold text-green-400">
            {data.trend.reduce((sum, point) => sum + point.responses, 0)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Friction Points */}
      {data.friction && data.friction.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2">Friksjonspunkter</h4>
          <div className="space-y-1">
            {data.friction.slice(0, 3).map((friction, index) => (
              <div key={index} className="bg-yellow-900/20 p-2 rounded text-sm">
                <div className="font-medium text-yellow-300">{friction.step}</div>
                <div className="text-gray-400">{friction.count} rapporter</div>
                {friction.note && (
                  <div className="text-xs text-gray-500">{friction.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Innsikter</h4>
          <div className="space-y-1">
            {data.insights.slice(0, 2).map((insight, index) => (
              <div key={index} className="bg-blue-900/20 p-2 rounded text-sm">
                <div className="text-gray-300">{insight}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Kilde: /api/analytics/feedback • Verifisert fra brukerdata</span>
          <div className="flex items-center gap-2">
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
