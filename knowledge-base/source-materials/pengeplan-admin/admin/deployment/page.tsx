'use client';

import React, { useState } from 'react';
import { 
  Rocket, 
  Server, 
  Globe, 
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Shield,
  RefreshCw
} from 'lucide-react';

interface DeploymentConfig {
  id: string;
  platform: string;
  environment: string;
  status: 'active' | 'inactive' | 'deploying' | 'error';
  lastDeployment: string;
  version: string;
  url?: string;
}

export default function DeploymentCenterPage() {
  const [deployments, setDeployments] = useState<DeploymentConfig[]>([
    {
      id: 'prod-vercel',
      platform: 'Vercel',
      environment: 'Production',
      status: 'active',
      lastDeployment: '2025-01-15T10:30:00Z',
      version: 'v2.1.3',
      url: 'https://pengeplan.vercel.app'
    },
    {
      id: 'staging-vercel',
      platform: 'Vercel',
      environment: 'Staging',
      status: 'active',
      lastDeployment: '2025-01-15T09:15:00Z',
      version: 'v2.1.4-beta',
      url: 'https://pengeplan-staging.vercel.app'
    },
    {
      id: 'dev-local',
      platform: 'Local',
      environment: 'Development',
      status: 'active',
      lastDeployment: '2025-01-15T11:00:00Z',
      version: 'v2.1.4-dev',
      url: 'http://localhost:3000'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'deploying':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Pause className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deploying':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-blue-600" />
            Deployment Center
          </h1>
          <p className="text-gray-600 mt-1">
            Administrer og overvåk alle miljøer og deployments
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Ny Deployment
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Deployments</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Server className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktive Miljøer</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siste Deploy</p>
              <p className="text-2xl font-bold text-gray-900">11:00</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-green-600">99.9%</p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Deployments List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Aktive Deployments</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {deployment.platform} - {deployment.environment}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {deployment.version} • Sist oppdatert: {new Date(deployment.lastDeployment).toLocaleString('no-NO')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(deployment.status)}`}>
                    {deployment.status === 'active' ? 'Aktiv' : 
                     deployment.status === 'deploying' ? 'Deployer' :
                     deployment.status === 'error' ? 'Feil' : 'Inaktiv'}
                  </span>
                  
                  {deployment.url && (
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Åpne miljø"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Hurtighandlinger</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <GitBranch className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Deploy fra Git</h3>
              <p className="text-sm text-gray-600">Deploy siste commit fra main branch</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <RotateCcw className="w-6 h-6 text-orange-600 mb-2" />
              <h3 className="font-medium text-gray-900">Rollback</h3>
              <p className="text-sm text-gray-600">Gå tilbake til forrige versjon</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Activity className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Health Check</h3>
              <p className="text-sm text-gray-600">Kjør helsesjekk på alle miljøer</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


















