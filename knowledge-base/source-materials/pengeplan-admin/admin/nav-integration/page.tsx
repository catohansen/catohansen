'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users,
  Shield,
  Database,
  Eye,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface NAVIntegrationStatus {
  connected: boolean;
  lastSync: string;
  totalUsers: number;
  activeConnections: number;
  benefitsProcessed: number;
  alertsGenerated: number;
  uptime: number;
  errorRate: number;
}

interface NAVBenefitSummary {
  type: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
  trend: 'up' | 'down' | 'stable';
}

interface NAVAlert {
  id: string;
  userId: string;
  userName: string;
  type: 'benefit_change' | 'deadline' | 'application_required' | 'review_needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created: string;
  resolved: boolean;
}

export default function NAVIntegrationPage() {
  const [status, setStatus] = useState<NAVIntegrationStatus | null>(null);
  const [benefits, setBenefits] = useState<NAVBenefitSummary[]>([]);
  const [alerts, setAlerts] = useState<NAVAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadNAVData();
  }, []);

  const loadNAVData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in production, fetch from NAV API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        connected: true,
        lastSync: new Date().toISOString(),
        totalUsers: 1268,
        activeConnections: 847,
        benefitsProcessed: 15420,
        alertsGenerated: 23,
        uptime: 99.95,
        errorRate: 0.05
      });

      setBenefits([
        {
          type: 'Arbeidsavklaringspenger (AAP)',
          count: 234,
          totalAmount: 4680000,
          averageAmount: 20000,
          trend: 'up'
        },
        {
          type: 'Uføretrygd',
          count: 156,
          totalAmount: 3900000,
          averageAmount: 25000,
          trend: 'stable'
        },
        {
          type: 'Sosialhjelp',
          count: 89,
          totalAmount: 1780000,
          averageAmount: 20000,
          trend: 'down'
        },
        {
          type: 'Barnetrygd',
          count: 412,
          totalAmount: 5148000,
          averageAmount: 12500,
          trend: 'up'
        }
      ]);

      setAlerts([
        {
          id: '1',
          userId: 'user_123',
          userName: 'Ola Nordmann',
          type: 'benefit_change',
          severity: 'high',
          message: 'AAP-utbetaling redusert med 15% fra neste måned',
          created: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolved: false
        },
        {
          id: '2',
          userId: 'user_456',
          userName: 'Kari Hansen',
          type: 'deadline',
          severity: 'critical',
          message: 'Frist for søknad om forlenget uføretrygd utløper om 3 dager',
          created: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          resolved: false
        },
        {
          id: '3',
          userId: 'user_789',
          userName: 'Lars Eriksen',
          type: 'application_required',
          severity: 'medium',
          message: 'Ny søknad om arbeidsavklaringspenger må sendes inn',
          created: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          resolved: true
        }
      ]);

    } catch (error) {
      console.error('Error loading NAV data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncNAVData = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadNAVData();
    } finally {
      setIsSyncing(false);
    }
  };

  const formatNOK = (amount: number) => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAlertIcon = (type: NAVAlert['type']) => {
    switch (type) {
      case 'benefit_change':
        return <TrendingUp className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      case 'application_required':
        return <Upload className="w-4 h-4" />;
      case 'review_needed':
        return <Eye className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: NAVAlert['severity']) => {
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

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Laster NAV-integrasjon...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            NAV-integrasjon
          </h1>
          <p className="text-gray-600 mt-1">
            Administrer NAV-tilkoblinger og overvåk støtteordninger
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={syncNAVData}
            disabled={isSyncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isSyncing ? 'Synkroniserer...' : 'Synkroniser'}
          </button>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Eksporter rapport
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">NAV-tilkobling</p>
              <p className="text-2xl font-bold text-green-600">
                {status?.connected ? 'Tilkoblet' : 'Frakoblet'}
              </p>
            </div>
            {status?.connected ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-600" />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive brukere</p>
              <p className="text-2xl font-bold text-blue-600">{status?.activeConnections}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stønader behandlet</p>
              <p className="text-2xl font-bold text-purple-600">{status?.benefitsProcessed}</p>
            </div>
            <Database className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Oppetid</p>
              <p className="text-2xl font-bold text-green-600">{status?.uptime}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Benefits Overview */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Støtteordninger oversikt</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{benefit.type}</h3>
                  {getTrendIcon(benefit.trend)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Antall mottakere</p>
                    <p className="font-semibold">{benefit.count}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gjennomsnitt/måned</p>
                    <p className="font-semibold">{formatNOK(benefit.averageAmount)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">Total utbetalt</p>
                  <p className="font-semibold text-lg">{formatNOK(benefit.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Aktive varsler</h2>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              {alerts.filter(alert => !alert.resolved).length} aktive
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {alerts.filter(alert => !alert.resolved).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{alert.userName}</h4>
                    <span className="text-xs opacity-75">
                      {new Date(alert.created).toLocaleString('nb-NO')}
                    </span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-white bg-opacity-50 rounded text-xs hover:bg-opacity-75">
                    Se detaljer
                  </button>
                  <button className="px-3 py-1 bg-white bg-opacity-50 rounded text-xs hover:bg-opacity-75">
                    Marker som løst
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Settings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Integrasjonsinnstillinger</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">API-konfigurasjon</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API-endpoint</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    https://api.nav.no/v1
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Autentisering</span>
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    OAuth 2.0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rate limit</span>
                  <span className="text-sm text-gray-900">1000 req/min</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Synkronisering</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Automatisk sync</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sync-intervall</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Hver time</option>
                    <option>Hver 6. time</option>
                    <option>Daglig</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Siste sync</span>
                  <span className="text-sm text-gray-900">
                    {status?.lastSync ? new Date(status.lastSync).toLocaleString('nb-NO') : 'Aldri'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Oppdater innstillinger
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Test tilkobling
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


















