'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Mic, Volume2, Settings, TrendingUp, DollarSign, 
  Users, AlertTriangle, CheckCircle, RefreshCw,
  Zap, Shield, BarChart3, Activity
} from 'lucide-react';

interface VoiceControlPanelProps {
  className?: string;
}

interface VoiceUsageStats {
  totalRequests: number;
  successfulRequests: number;
  totalCost: number;
  averageLatency: number;
  activeUsers: number;
  errorRate: number;
}

interface VoiceSettings {
  enabled: boolean;
  maxCostPerDay: number;
  maxRequestsPerUser: number;
  allowedPlans: string[];
  emergencyDisable: boolean;
}

export default function VoiceControlPanel({ className = '' }: VoiceControlPanelProps) {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    maxCostPerDay: 100,
    maxRequestsPerUser: 50,
    allowedPlans: ['PREMIUM', 'VERGE'],
    emergencyDisable: false
  });

  const [stats, setStats] = useState<VoiceUsageStats>({
    totalRequests: 0,
    successfulRequests: 0,
    totalCost: 0,
    averageLatency: 0,
    activeUsers: 0,
    errorRate: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadVoiceSettings();
    loadVoiceStats();
  }, []);

  const loadVoiceSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/system/voice-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      setError('Failed to load voice settings');
    } finally {
      setLoading(false);
    }
  };

  const loadVoiceStats = async () => {
    try {
      const response = await fetch('/api/admin/system/voice-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load voice stats:', err);
    }
  };

  const saveSettings = async (newSettings: Partial<VoiceSettings>) => {
    try {
      setSaving(true);
      setError(null);

      const updatedSettings = { ...settings, ...newSettings };
      
      const response = await fetch('/api/admin/system/voice-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to save voice settings');
      }

      setSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleVoiceAI = async (enabled: boolean) => {
    await saveSettings({ enabled });
  };

  const emergencyDisable = async () => {
    await saveSettings({ 
      enabled: false, 
      emergencyDisable: true 
    });
  };

  const getStatusColor = () => {
    if (settings.emergencyDisable) return 'bg-red-500';
    if (!settings.enabled) return 'bg-gray-500';
    if (stats.errorRate > 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (settings.emergencyDisable) return 'Emergency Disabled';
    if (!settings.enabled) return 'Disabled';
    if (stats.errorRate > 10) return 'Degraded';
    return 'Operational';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className={`w-full max-w-6xl mx-auto shadow-lg ${className}`}>
        <CardContent className="pt-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading voice control panel...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
              <Mic className="h-7 w-7 text-blue-500" />
              <span>Voice AI Control Panel</span>
              <Badge className={`${getStatusColor()} text-white`}>
                {getStatusText()}
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={loadVoiceStats}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              {settings.enabled && (
                <Button
                  variant="destructive"
                  onClick={emergencyDisable}
                  className="flex items-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Emergency Disable</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Success Rate: {((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCost)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Daily Budget: {formatCurrency(settings.maxCostPerDay)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Max per user: {settings.maxRequestsPerUser}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Latency</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageLatency}ms</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <span>Error Rate: {stats.errorRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center space-x-2 text-xl font-bold text-gray-800">
              <Settings className="h-6 w-6 text-blue-500" />
              <span>Voice AI Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="voice-enabled" className="text-base font-medium">
                  Enable Voice AI
                </Label>
                <p className="text-sm text-gray-600">
                  Allow users to interact with AI using voice
                </p>
              </div>
              <Switch
                id="voice-enabled"
                checked={settings.enabled}
                onCheckedChange={toggleVoiceAI}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-cost" className="text-base font-medium">
                Daily Cost Limit
              </Label>
              <div className="flex items-center space-x-4">
                <input
                  id="max-cost"
                  type="number"
                  value={settings.maxCostPerDay}
                  onChange={(e) => saveSettings({ maxCostPerDay: parseFloat(e.target.value) })}
                  className="flex-1 p-2 border rounded-md"
                  min="0"
                  step="10"
                />
                <span className="text-sm text-gray-600">NOK</span>
              </div>
              <p className="text-sm text-gray-600">
                Current usage: {formatCurrency(stats.totalCost)} / {formatCurrency(settings.maxCostPerDay)}
              </p>
              <Progress 
                value={(stats.totalCost / settings.maxCostPerDay) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-requests" className="text-base font-medium">
                Max Requests per User
              </Label>
              <input
                id="max-requests"
                type="number"
                value={settings.maxRequestsPerUser}
                onChange={(e) => saveSettings({ maxRequestsPerUser: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-md"
                min="1"
                max="1000"
              />
              <p className="text-sm text-gray-600">
                Limit voice requests per user per day
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">
                Allowed Subscription Plans
              </Label>
              <div className="space-y-2">
                {['FREE', 'PREMIUM', 'VERGE'].map(plan => (
                  <div key={plan} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`plan-${plan}`}
                      checked={settings.allowedPlans.includes(plan)}
                      onChange={(e) => {
                        const newPlans = e.target.checked
                          ? [...settings.allowedPlans, plan]
                          : settings.allowedPlans.filter(p => p !== plan);
                        saveSettings({ allowedPlans: newPlans });
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={`plan-${plan}`} className="text-sm">
                      {plan}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center space-x-2 text-xl font-bold text-gray-800">
              <BarChart3 className="h-6 w-6 text-green-500" />
              <span>Usage Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Success Rate</span>
                  <span>{((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(stats.successfulRequests / stats.totalRequests) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Error Rate</span>
                  <span>{stats.errorRate.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={stats.errorRate} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Cost Usage</span>
                  <span>{((stats.totalCost / settings.maxCostPerDay) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(stats.totalCost / settings.maxCostPerDay) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Recent Activity</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Voice Recognition Calls</span>
                  <span>{stats.totalRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Response Time</span>
                  <span>{stats.averageLatency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Voice Users</span>
                  <span>{stats.activeUsers}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="shadow-lg border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saving Indicator */}
      {saving && (
        <Card className="shadow-lg border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-blue-700">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Saving voice settings...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
