/**
 * Admin Improvement Dashboard
 * Panel der Admin kan se alle foreslåtte forbedringer, godkjenne eller avvise, 
 * og måle resultat.
 */

"use client";

import { useState, useEffect } from "react";
import { ImprovementRanking, ImprovementPlan, ImplementationProgress } from "@/lib/upgrade/continuous-improvement";

interface ImprovementDashboardData {
  rankings: ImprovementRanking[];
  plans: ImprovementPlan[];
  progress: ImplementationProgress[];
  summary: {
    totalSuggestions: number;
    approvedSuggestions: number;
    implementedSuggestions: number;
    averageROI: number;
    criticalIssues: number;
  };
}

export default function AdminImprovementsPage() {
  const [data, setData] = useState<ImprovementDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'implement' | 'investigate' | 'defer' | 'reject'>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Hent forslag fra API
      const suggestionsResponse = await fetch('/api/improvements/list');
      const suggestionsData = await suggestionsResponse.json();
      
      // Hent siste analyse-resultater
      const analysisResponse = await fetch('/api/ai/trigger-insight');
      const analysisData = await analysisResponse.json();
      
      // Konstruer dashboard data
      const dashboardData: ImprovementDashboardData = {
        rankings: suggestionsData.suggestions.map((s: any) => ({
          suggestionId: s.id,
          title: s.suggestion,
          priority: s.priority as any,
          impact: s.impact,
          effort: s.effort,
          roi: s.impact / s.effort,
          estimatedValue: s.impact * 1000,
          riskLevel: s.effort > 7 ? 'high' : s.effort > 4 ? 'medium' : 'low',
          dependencies: [],
          recommendedAction: s.priority === 'critical' ? 'implement' : 
                           s.priority === 'high' ? 'investigate' : 'defer',
          reasoning: `AI-generated suggestion with ${s.impact}/10 impact and ${s.effort}/10 effort`
        })),
        plans: [],
        progress: [],
        summary: {
          totalSuggestions: suggestionsData.suggestions.length,
          approvedSuggestions: 0,
          implementedSuggestions: 0,
          averageROI: suggestionsData.suggestions.reduce((sum: number, s: any) => sum + (s.impact / s.effort), 0) / suggestionsData.suggestions.length,
          criticalIssues: suggestionsData.suggestions.filter((s: any) => s.priority === 'critical').length
        }
      };
      
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to load improvement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveSuggestion = async (suggestionId: string, suggestion: string, impact: number, effort: number) => {
    try {
      await fetch(`/api/improvements/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: suggestionId, 
          suggestion,
          impact,
          effort,
          category: 'ai-suggestion',
          priority: 'high'
        })
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to approve suggestion:', error);
    }
  };

  const rejectSuggestion = async (suggestionId: string, reason: string) => {
    try {
      await fetch(`/api/improvements/approve`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: suggestionId, reason })
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to reject suggestion:', error);
    }
  };

  const triggerNewAnalysis = async () => {
    try {
      await fetch(`/api/ai/trigger-insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceAnalysis: true, analysisType: 'full' })
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to trigger new analysis:', error);
    }
  };

  const generateHealthReport = async () => {
    try {
      const response = await fetch('/api/ai/report?format=markdown');
      const report = await response.text();
      
      // Vis rapport i nytt vindu
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>AI Health Report</title></head>
            <body style="font-family: monospace; padding: 20px; background: #1a1a1a; color: #fff;">
              <pre style="white-space: pre-wrap;">${report}</pre>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Failed to generate health report:', error);
    }
  };

  const filteredRankings = data?.rankings.filter(ranking => {
    if (filter === 'all') return true;
    return ranking.recommendedAction === filter;
  }) || [];

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Laster forbedringsforslag...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Forbedringsstyring</h1>
        <p className="text-gray-500">
          Oversikt over AI-genererte forbedringsforslag og implementeringsfremgang
        </p>
      </header>

      {/* Sammendrag */}
      {data?.summary && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-neutral-900 p-4 text-white shadow">
            <h3 className="text-sm text-gray-400">Totalt forslag</h3>
            <div className="mt-2 text-2xl font-bold">{data.summary.totalSuggestions}</div>
          </div>
          <div className="rounded-xl bg-neutral-900 p-4 text-white shadow">
            <h3 className="text-sm text-gray-400">Godkjent</h3>
            <div className="mt-2 text-2xl font-bold text-green-400">{data.summary.approvedSuggestions}</div>
          </div>
          <div className="rounded-xl bg-neutral-900 p-4 text-white shadow">
            <h3 className="text-sm text-gray-400">Implementert</h3>
            <div className="mt-2 text-2xl font-bold text-blue-400">{data.summary.implementedSuggestions}</div>
          </div>
          <div className="rounded-xl bg-neutral-900 p-4 text-white shadow">
            <h3 className="text-sm text-gray-400">Gjennomsnittlig ROI</h3>
            <div className="mt-2 text-2xl font-bold">{data.summary.averageROI.toFixed(2)}</div>
          </div>
        </section>
      )}

      {/* Filter og handlinger */}
      <section className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter('implement')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'implement' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Implementer
          </button>
          <button
            onClick={() => setFilter('investigate')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'investigate' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Undersøk
          </button>
          <button
            onClick={() => setFilter('defer')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'defer' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Utsett
          </button>
          <button
            onClick={() => setFilter('reject')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'reject' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Avvis
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={triggerNewAnalysis}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold"
          >
            🔄 Kjør ny analyse
          </button>
          <button
            onClick={generateHealthReport}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-semibold"
          >
            📊 AI Health Report
          </button>
        </div>
      </section>

      {/* Forbedringsforslag */}
      <section className="rounded-xl bg-neutral-900 text-white shadow">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-xl font-semibold">Forbedringsforslag</h2>
          <p className="text-sm text-gray-400">
            AI-genererte forslag basert på systemanalyse og brukerfeedback
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-400 border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3">Tittel</th>
                <th className="px-4 py-3">Prioritet</th>
                <th className="px-4 py-3">ROI</th>
                <th className="px-4 py-3">Anbefaling</th>
                <th className="px-4 py-3">Handling</th>
              </tr>
            </thead>
            <tbody>
              {filteredRankings.map((ranking) => (
                <tr key={ranking.suggestionId} className="border-b border-neutral-800">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{ranking.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Impact: {ranking.impact}/10, Effort: {ranking.effort}/10
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      ranking.priority === 'critical' ? 'bg-red-700' :
                      ranking.priority === 'high' ? 'bg-orange-700' :
                      ranking.priority === 'medium' ? 'bg-yellow-700' :
                      'bg-gray-700'
                    }`}>
                      {ranking.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono">{ranking.roi.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      ranking.recommendedAction === 'implement' ? 'bg-green-700' :
                      ranking.recommendedAction === 'investigate' ? 'bg-yellow-700' :
                      ranking.recommendedAction === 'defer' ? 'bg-orange-700' :
                      'bg-red-700'
                    }`}>
                      {ranking.recommendedAction.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {ranking.recommendedAction === 'implement' && (
                        <button
                          onClick={() => approveSuggestion(ranking.suggestionId, ranking.title, ranking.impact, ranking.effort)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold"
                        >
                          Godkjenn
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const reason = prompt('Begrunnelse for avvisning:');
                          if (reason) rejectSuggestion(ranking.suggestionId, reason);
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold"
                      >
                        Avvis
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRankings.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-400 text-center" colSpan={5}>
                    Ingen forslag matcher filteret
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Forbedringsplaner */}
      {data?.plans && data.plans.length > 0 && (
        <section className="rounded-xl bg-neutral-900 text-white shadow">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="text-xl font-semibold">Forbedringsplaner</h2>
            <p className="text-sm text-gray-400">
              Strukturerte planer for implementering av forbedringer
            </p>
          </div>
          
          <div className="p-4 space-y-4">
            {data.plans.map((plan) => (
              <div key={plan.id} className="border border-neutral-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{plan.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    plan.status === 'completed' ? 'bg-green-700' :
                    plan.status === 'in_progress' ? 'bg-blue-700' :
                    plan.status === 'approved' ? 'bg-yellow-700' :
                    'bg-gray-700'
                  }`}>
                    {plan.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  {plan.suggestions.length} forslag • ROI: {plan.overallROI.toFixed(2)} • 
                  Effort: {plan.totalEffort}/10 • Impact: {plan.totalImpact}/10
                </div>
                <div className="text-xs text-gray-500">
                  {plan.timeline.start} - {plan.timeline.end}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Implementeringsfremgang */}
      {data?.progress && data.progress.length > 0 && (
        <section className="rounded-xl bg-neutral-900 text-white shadow">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="text-xl font-semibold">Implementeringsfremgang</h2>
            <p className="text-sm text-gray-400">
              Sanntids oversikt over implementeringsstatus
            </p>
          </div>
          
          <div className="p-4 space-y-3">
            {data.progress.map((progress) => (
              <div key={progress.suggestionId} className="border border-neutral-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Suggestion {progress.suggestionId}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    progress.status === 'completed' ? 'bg-green-700' :
                    progress.status === 'in_progress' ? 'bg-blue-700' :
                    progress.status === 'failed' ? 'bg-red-700' :
                    'bg-gray-700'
                  }`}>
                    {progress.status.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">
                  {progress.progress}% fullført • Oppdatert: {new Date(progress.updatedAt).toLocaleString()}
                </div>
                {progress.blockers.length > 0 && (
                  <div className="text-xs text-red-400 mt-1">
                    Blokkeringer: {progress.blockers.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
