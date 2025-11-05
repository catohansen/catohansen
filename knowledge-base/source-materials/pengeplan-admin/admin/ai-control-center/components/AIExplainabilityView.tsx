'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Search, Download, Eye, Target, TrendingUp, AlertCircle } from 'lucide-react';

interface ExplainabilityData {
  actionId: string;
  what: string;
  why: string;
  how: string;
  when: string;
  where: string;
  confidence: number;
  reasoningTrace: string[];
  decisionTree: any;
  alternatives: string[];
  impact: string;
}

interface AIExplainabilityViewProps {
  className?: string;
}

export function AIExplainabilityView({ className }: AIExplainabilityViewProps) {
  const [reasoningData, setReasoningData] = useState<ExplainabilityData[]>([]);
  const [filteredData, setFilteredData] = useState<ExplainabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<ExplainabilityData | null>(null);
  const [actionId, setActionId] = useState('');

  useEffect(() => {
    fetchReasoningData();
  }, []);

  useEffect(() => {
    filterData();
  }, [reasoningData, searchTerm]);

  const fetchReasoningData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai/reasoning');
      const data = await response.json();
      
      if (data.success) {
        setReasoningData(data.data.summaries || []);
      }
    } catch (error) {
      console.error('Error fetching reasoning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecificReasoning = async (actionId: string) => {
    try {
      const response = await fetch(`/api/admin/ai/reasoning?actionId=${actionId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setSelectedAction(data.data);
      }
    } catch (error) {
      console.error('Error fetching specific reasoning:', error);
    }
  };

  const filterData = () => {
    let filtered = reasoningData;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.what.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.why.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.how.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const exportExplainabilityReport = async (actionId?: string) => {
    try {
      const url = actionId 
        ? `/api/admin/ai/reasoning?actionId=${actionId}&format=JSON`
        : '/api/admin/ai/reasoning?format=JSON';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-explainability-${actionId || 'all'}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting explainability report:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    const variant = confidence >= 0.8 ? 'default' : confidence >= 0.6 ? 'secondary' : 'destructive';
    
    return (
      <Badge variant={variant}>
        {percentage}% Confidence
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Explainability View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Explainability View
          </CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search reasoning data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Enter Action ID"
              value={actionId}
              onChange={(e) => setActionId(e.target.value)}
              className="w-48"
            />
            <Button
              onClick={() => fetchSpecificReasoning(actionId)}
              disabled={!actionId}
              variant="outline"
            >
              <Search className="h-4 w-4 mr-1" />
              Lookup
            </Button>
            <Button
              onClick={() => exportExplainabilityReport()}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedAction ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Action Details: {selectedAction.actionId}</h3>
                <Button
                  onClick={() => setSelectedAction(null)}
                  variant="outline"
                  size="sm"
                >
                  Back to List
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">What was decided</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAction.what}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Why this decision was made</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAction.why}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">How the decision was reached</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAction.how}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Confidence & Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getConfidenceBadge(selectedAction.confidence)}
                      <p className="text-sm">{selectedAction.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Reasoning Trace</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedAction.reasoningTrace.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">
                          {index + 1}
                        </Badge>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Alternatives Considered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {selectedAction.alternatives.map((alternative, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{alternative}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredData.map((item) => (
                  <div
                    key={item.actionId}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAction(item)}
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{item.what}</div>
                        <div className="text-sm text-gray-500">{item.why}</div>
                        <div className="text-xs text-gray-400">
                          {item.when} • {item.where}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getConfidenceBadge(item.confidence)}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportExplainabilityReport(item.actionId);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No reasoning data found matching your search.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



