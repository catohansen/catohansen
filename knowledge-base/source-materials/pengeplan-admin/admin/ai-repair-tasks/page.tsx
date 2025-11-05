"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wrench, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause,
  AlertTriangle,
  Activity,
  Zap,
  Settings,
  Database,
  Shield,
  Code,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';

interface AIAction {
  id: string;
  moduleName: string;
  actionType: string;
  aiDescription: string;
  status: string;
  resultLog?: string;
  startedAt?: string;
  completedAt?: string;
  responsibleSystem: string;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

interface HealthSummary {
  totalActions: number;
  pendingActions: number;
  completedActions: number;
  failedActions: number;
  averagePerformanceGain: number;
}

export default function AIRepairTasksPage() {
  const [actions, setActions] = useState<AIAction[]>([]);
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ai/actions');
      const data = await response.json();
      
      if (data.success) {
        setActions(data.actions);
        setHealthSummary(data.healthSummary);
      }
    } catch (error) {
      console.error('Error fetching AI actions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartAutoRepair = async () => {
    try {
      setIsRunning(true);
      const response = await fetch('/api/admin/ai/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_auto_repair' })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        alert(`Auto-repair started! Created ${data.actionsCreated} actions.`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error starting auto-repair:', error);
      alert('Error starting auto-repair');
    } finally {
      setIsRunning(false);
    }
  };

  const handleExecuteAction = async (actionId: string) => {
    try {
      const response = await fetch('/api/admin/ai/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'execute_action', actionId })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        alert('Action executed successfully!');
      } else {
        alert('Error executing action');
      }
    } catch (error) {
      console.error('Error executing action:', error);
      alert('Error executing action');
    }
  };

  const handleApproveAction = async (actionId: string) => {
    try {
      const response = await fetch('/api/admin/ai/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'approve_action', 
          actionId, 
          approvedBy: 'admin@test.no' 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        alert('Action approved successfully!');
      } else {
        alert('Error approving action');
      }
    } catch (error) {
      console.error('Error approving action:', error);
      alert('Error approving action');
    }
  };

  const handleCancelAction = async (actionId: string) => {
    try {
      const response = await fetch('/api/admin/ai/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel_action', actionId })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchData(); // Refresh data
        alert('Action cancelled successfully!');
      } else {
        alert('Error cancelling action');
      }
    } catch (error) {
      console.error('Error cancelling action:', error);
      alert('Error cancelling action');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'RUNNING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'Cache Optimization': return <Zap className="w-4 h-4" />;
      case 'Config Update': return <Settings className="w-4 h-4" />;
      case 'UI Fix': return <Code className="w-4 h-4" />;
      case 'API Fix': return <Activity className="w-4 h-4" />;
      case 'Database Fix': return <Database className="w-4 h-4" />;
      case 'Security Fix': return <Shield className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  const getPerformanceGain = (resultLog?: string) => {
    if (!resultLog) return null;
    try {
      const result = JSON.parse(resultLog);
      return result.performanceGain;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading AI repair tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-purple-600" />
            AI Repair Tasks
          </h1>
          <p className="text-gray-600 mt-2">
            Oversikt over AI-drevet reparasjon og forbedring av systemet
          </p>
        </div>
        
        <Button 
          onClick={handleStartAutoRepair}
          disabled={isRunning}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isRunning ? 'Starting...' : 'Start Auto-Repair'}
        </Button>
      </div>

      {/* Health Summary */}
      {healthSummary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{healthSummary.totalActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{healthSummary.pendingActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{healthSummary.completedActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-gray-900">{healthSummary.failedActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Performance Gain</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {healthSummary.averagePerformanceGain.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            AI Repair Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Actions Found</h3>
              <p className="text-gray-600">Start auto-repair to create AI actions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {actions.map((action) => {
                const performanceGain = getPerformanceGain(action.resultLog);
                return (
                  <div key={action.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getActionIcon(action.actionType)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.moduleName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(action.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                        {performanceGain && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            +{performanceGain.toFixed(1)}% gain
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">Action Type:</h4>
                      <p className="text-sm text-gray-600">{action.actionType}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Description:</h4>
                      <p className="text-sm text-gray-600">{action.aiDescription}</p>
                    </div>

                    {action.approvalRequired && action.status === 'PENDING' && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ This action requires manual approval before execution.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {action.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveAction(action.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleExecuteAction(action.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Execute
                          </Button>
                        </>
                      )}
                      {action.status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelAction(action.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAction(action.id)}
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Details Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Action Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAction(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              {(() => {
                const action = actions.find(a => a.id === selectedAction);
                if (!action) return null;
                
                return (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Module:</h3>
                      <p className="text-gray-600">{action.moduleName}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">Action Type:</h3>
                      <p className="text-gray-600">{action.actionType}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">Description:</h3>
                      <p className="text-gray-600">{action.aiDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">Status:</h3>
                      <Badge className={getStatusColor(action.status)}>
                        {action.status}
                      </Badge>
                    </div>
                    
                    {action.resultLog && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Result Log:</h3>
                        <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(JSON.parse(action.resultLog), null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => setSelectedAction(null)}
                        variant="outline"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={() => {
                          // Download result log
                          const blob = new Blob([action.resultLog || ''], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `action-${action.id}-log.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Log
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



