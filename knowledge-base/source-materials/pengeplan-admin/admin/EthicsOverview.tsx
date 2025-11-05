/**
 * Ethics Overview Component
 * Displays ethics and compliance metrics with bias detection
 */

"use client";

import { useEffect, useState } from "react";
import { EthicsSchema, type EthicsData } from "@/lib/analytics/schemas";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

interface EthicsOverviewProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
  chartType?: 'bar' | 'pie' | 'line';
}

export default function EthicsOverview({ 
  autoRefresh = true, 
  refreshInterval = 30000,
  className = "",
  chartType = 'bar'
}: EthicsOverviewProps) {
  const [data, setData] = useState<EthicsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const response = await fetch("/api/analytics/ethics", { 
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
      const validated = EthicsSchema.parse(json);
      
      setData(validated);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to load ethics data:', err);
      setError(err.message || 'Feil ved henting av etikkdata');
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

  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'cases':
        return [`${value}`, 'Antall saker'];
      case 'compliance_score':
        return [`${value}%`, 'Compliance Score'];
      default:
        return [value.toString(), name];
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getComplianceBgColor = (score: number) => {
    if (score >= 95) return 'bg-green-600';
    if (score >= 85) return 'bg-blue-600';
    if (score >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Laster etikkdata...</div>
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
        <h3 className="text-lg font-semibold mb-4">Etikk & Compliance</h3>
        <div className="text-gray-400">Ingen etikkdata tilgjengelig</div>
      </div>
    );
  }

  const renderChart = () => {
    if (!data.by_dimension || data.by_dimension.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          Ingen bias-data tilgjengelig
        </div>
      );
    }

    const commonProps = {
      data: data.by_dimension,
      children: (
        <>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              dataKey="cases"
              nameKey="dimension"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              data={data.by_dimension}
              label={({ dimension, cases }) => `${dimension}: ${cases}`}
            >
              {data.by_dimension.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <XAxis 
              dataKey="dimension" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Line 
              type="monotone" 
              dataKey="cases" 
              name="Antall saker" 
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <XAxis 
              dataKey="dimension" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Bar 
              dataKey="cases" 
              name="Antall saker" 
              fill="#3B82F6"
            />
          </BarChart>
        );
    }
  };

  return (
    <div className={`rounded-xl bg-neutral-900 p-6 text-white shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Etikk & Compliance</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${getComplianceBgColor(data.compliance_score)}`}>
            {data.compliance_score}%
          </span>
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
          <div className="text-sm text-gray-400">Compliance Score</div>
          <div className={`text-2xl font-bold ${getComplianceColor(data.compliance_score)}`}>
            {data.compliance_score}%
          </div>
        </div>
        <div className="bg-neutral-800 p-3 rounded">
          <div className="text-sm text-gray-400">Bias-saker</div>
          <div className={`text-2xl font-bold ${data.bias_cases > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {data.bias_cases}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Bias by Dimension */}
      {data.by_dimension && data.by_dimension.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">Bias etter dimensjon</h4>
          <div className="space-y-1">
            {data.by_dimension.map((dimension, index) => (
              <div key={index} className="bg-neutral-800 p-2 rounded text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{dimension.dimension}</span>
                  <span className="text-gray-400">{dimension.cases} saker</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {data.notes && data.notes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Notater</h4>
          <div className="space-y-1">
            {data.notes.map((note, index) => (
              <div key={index} className="bg-blue-900/20 p-2 rounded text-sm">
                <div className="text-gray-300">{note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Kilde: /api/analytics/ethics • Verifisert fra etikk-monitor</span>
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
