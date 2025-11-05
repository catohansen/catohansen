'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Download,
  RefreshCw,
  Filter,
  Eye,
  FileText
} from 'lucide-react';

interface PolicyDriftEvent {
  id: string;
  policyId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  expected: any;
  observed: any;
  detectedAt: string;
  note?: string;
}

export default function PolicyDriftPage() {
  const [events, setEvents] = useState<PolicyDriftEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEvents();
  }, [selectedSeverity]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedSeverity) {
        params.set('severity', selectedSeverity);
      }
      
      const response = await fetch(`/api/admin/ai/policy-drift?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching policy drift events:', error);
    } finally {
      setLoading(false);
    }
  };

  const severityCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    events.forEach(event => {
      counts[event.severity]++;
    });
    return counts;
  }, [events]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Minus className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no-NO');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Policy ID', 'Severity', 'Detected At', 'Note'].join(','),
      ...events.map(event => [
        event.id,
        event.policyId,
        event.severity,
        event.detectedAt,
        event.note || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy-drift-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Policy Drift Monitor</h1>
          <p className="text-gray-600 mt-2">
            Overvåk avvik mellom forventet og faktisk AI-policy bruk
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={fetchEvents}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Oppdater
          </Button>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={events.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Eksporter CSV
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="events">Hendelser</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Severity Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['critical', 'high', 'medium', 'low'] as const).map((severity) => (
              <Card key={severity} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        {severity} drift
                      </p>
                      <p className="text-2xl font-bold">{severityCounts[severity]}</p>
                    </div>
                    {getSeverityIcon(severity)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Nylige drift-hendelser</CardTitle>
              <CardDescription>
                De 5 siste policy drift-hendelsene
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(event.severity)}
                      <div>
                        <p className="font-medium">{event.policyId}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(event.detectedAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtrer hendelser</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSeverity === '' ? 'default' : 'outline'}
                  onClick={() => setSelectedSeverity('')}
                >
                  Alle
                </Button>
                {(['low', 'medium', 'high', 'critical'] as const).map((severity) => (
                  <Button
                    key={severity}
                    variant={selectedSeverity === severity ? 'default' : 'outline'}
                    onClick={() => setSelectedSeverity(severity)}
                  >
                    {severity} ({severityCounts[severity]})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Drift Hendelser</CardTitle>
              <CardDescription>
                {events.length} hendelser funnet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Laster hendelser...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Ingen policy drift-hendelser funnet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Detektert</th>
                        <th className="text-left p-3 font-medium">Policy ID</th>
                        <th className="text-left p-3 font-medium">Severity</th>
                        <th className="text-left p-3 font-medium">Forventet</th>
                        <th className="text-left p-3 font-medium">Observasjon</th>
                        <th className="text-left p-3 font-medium">Notat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} className="border-t">
                          <td className="p-3">{formatDate(event.detectedAt)}</td>
                          <td className="p-3 font-mono text-xs">{event.policyId}</td>
                          <td className="p-3">
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
                              {JSON.stringify(event.expected, null, 2)}
                            </pre>
                          </td>
                          <td className="p-3">
                            <pre className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
                              {JSON.stringify(event.observed, null, 2)}
                            </pre>
                          </td>
                          <td className="p-3">{event.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Drift-analyse</CardTitle>
              <CardDescription>
                Statistikk og trender for policy drift
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Severity-fordeling</h3>
                  <div className="space-y-2">
                    {(['critical', 'high', 'medium', 'low'] as const).map((severity) => (
                      <div key={severity} className="flex items-center justify-between">
                        <span className="capitalize">{severity}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${events.length > 0 ? (severityCounts[severity] / events.length) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {severityCounts[severity]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Siste 24 timer</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {events.filter(e => 
                      new Date(e.detectedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </div>
                  <p className="text-sm text-gray-600">Nye drift-hendelser</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
