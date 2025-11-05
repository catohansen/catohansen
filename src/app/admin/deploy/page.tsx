/**
 * Copyright (c) 2025 Cato Hansen. All rights reserved.
 * 
 * Proprietary - Unauthorized copying, modification, distribution, or use
 * of this software, via any medium is strictly prohibited without express
 * written permission from Cato Hansen.
 * 
 * @license PROPRIETARY
 * SPDX-License-Identifier: PROPRIETARY
 * @author Cato Hansen
 * @contact cato@catohansen.no
 * @website www.catohansen.no
 */

/**
 * Deploy to Production
 * Deploy website to production with FTP sync
 */

'use client'

import { useState, useEffect } from 'react'
import { Rocket, CheckCircle2, AlertCircle, Clock, FileText, Settings, RefreshCw, ExternalLink, Database, Server, Folder, User, Key, Globe, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface DeploymentConfig {
  id?: string
  name?: string
  ftpServer?: string
  ftpUsername?: string
  ftpPassword?: string
  ftpServerDir?: string
  dbHost?: string
  dbUsername?: string
  dbPassword?: string
  dbName?: string
  dbPort?: number
  serverUrl?: string
  buildOutputDir?: string
  lastSyncAt?: string | null
  lastSyncStatus?: string | null
  lastSyncError?: string | null
}

export default function DeployPage() {
  const [deploying, setDeploying] = useState(false)
  const [config, setConfig] = useState<DeploymentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [deployStatus, setDeployStatus] = useState<{
    success?: boolean
    message?: string
    url?: string
    buildDuration?: number
    ftpDuration?: number
    filesUploaded?: number
    dbSyncDuration?: number
    dbDumpFile?: string
    healthCheck?: { success?: boolean; status?: number; responseTime?: number }
    canRollback?: boolean
    dbImportInstructions?: string[]
    deploymentId?: string
  } | null>(null)

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/deploy/config', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.config) {
          setConfig(data.config)
        }
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const handleDeploy = async () => {
    setDeploying(true)
    setDeployStatus(null)
    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      
      if (data.success) {
        setDeployStatus({
          success: true,
          message: data.message || 'Deployment fullført!',
          url: data.url,
          buildDuration: data.buildDuration,
          ftpDuration: data.ftpDuration,
          filesUploaded: data.filesUploaded,
        })
        // Refresh config to get updated lastSyncAt
        fetchConfig()
      } else {
        setDeployStatus({
          success: false,
          message: data.error || 'Deployment feilet',
        })
      }
    } catch (error: any) {
      setDeployStatus({
        success: false,
        message: error.message || 'Deployment feilet',
      })
    } finally {
      setDeploying(false)
    }
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'Aldri'
    return new Date(date).toLocaleString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  const getStatusIcon = (status: string | null | undefined) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Deploy to Production</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/deploy/history"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Deployment History
          </Link>
          <Link
            href="/admin/deploy/settings"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>

      {/* Status Section */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Siste Synkronisering
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Laster status...
          </div>
        ) : config ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${getStatusColor(config.lastSyncStatus)}`}>
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(config.lastSyncStatus)}
                <div className="flex-1">
                  <p className="font-semibold">
                    {config.lastSyncStatus === 'success' 
                      ? 'Siste synkronisering var vellykket' 
                      : config.lastSyncStatus === 'failed'
                      ? 'Siste synkronisering feilet'
                      : 'Ingen synkronisering enda'}
                  </p>
                  <p className="text-sm mt-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatDate(config.lastSyncAt)}
                  </p>
                </div>
              </div>
              {config.serverUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <a 
                    href={config.serverUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {config.serverUrl}
                  </a>
                </div>
              )}
              {config.lastSyncError && (
                <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-800">
                  <strong>Feil:</strong> {config.lastSyncError}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">Ingen deployment config funnet. Gå til Settings for å konfigurere.</p>
          </div>
        )}
      </div>

      {/* Configuration Overview */}
      {config && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Konfigurasjon</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* FTP Config */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Server className="w-5 h-5" />
                FTP Configuration
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Server:</span>
                  <span className="font-medium">{config.ftpServer || 'Ikke satt'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Bruker:</span>
                  <span className="font-medium">{config.ftpUsername || 'Ikke satt'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Mappe:</span>
                  <span className="font-medium">{config.ftpServerDir || 'Ikke satt'}</span>
                </div>
              </div>
            </div>

            {/* Database Config */}
            {config.dbHost && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Configuration
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Host:</span>
                    <span className="font-medium">{config.dbHost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Bruker:</span>
                    <span className="font-medium">{config.dbUsername || 'Ikke satt'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Database:</span>
                    <span className="font-medium">{config.dbName || 'Ikke satt'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deployment Status */}
      {deployStatus && (
        <div className={`glass rounded-2xl p-6 ${deployStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            {deployStatus.success ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <h2 className="text-xl font-bold">{deployStatus.success ? 'Deployment Vellykket!' : 'Deployment Feilet'}</h2>
          </div>
          <div className="space-y-2">
            <p className={deployStatus.success ? 'text-green-900' : 'text-red-900'}>
              {deployStatus.message}
            </p>
            {deployStatus.success && (
              <div className="space-y-2 mt-4">
                {deployStatus.url && (
                  <a 
                    href={deployStatus.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Vis live side: {deployStatus.url}
                  </a>
                )}
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  {deployStatus.buildDuration !== undefined && (
                    <div>
                      <span className="text-gray-600">Build tid:</span>
                      <span className="font-semibold ml-2">{deployStatus.buildDuration}s</span>
                    </div>
                  )}
                  {deployStatus.ftpDuration !== undefined && (
                    <div>
                      <span className="text-gray-600">FTP upload:</span>
                      <span className="font-semibold ml-2">{deployStatus.ftpDuration}s</span>
                    </div>
                  )}
                  {deployStatus.filesUploaded !== undefined && (
                    <div>
                      <span className="text-gray-600">Filer opplastet:</span>
                      <span className="font-semibold ml-2">{deployStatus.filesUploaded}</span>
                    </div>
                  )}
                </div>
                
                {/* Database Sync Info */}
                {deployStatus.dbSyncDuration !== undefined && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Database Sync</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Database dump eksportert og lastet opp: {deployStatus.dbDumpFile || 'db-backup.sql'}
                    </p>
                    <p className="text-sm text-blue-700 mb-3">
                      Export tid: {deployStatus.dbSyncDuration}s
                    </p>
                    {deployStatus.dbImportInstructions && (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Import instruksjoner:</p>
                        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                          {deployStatus.dbImportInstructions.map((instruction, i) => (
                            <li key={i}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Health Check */}
                {deployStatus.healthCheck && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    deployStatus.healthCheck.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <h4 className="font-semibold mb-2">
                      Health Check: {deployStatus.healthCheck.success ? '✓ OK' : '⚠ Feil'}
                    </h4>
                    {deployStatus.healthCheck.status && (
                      <p className="text-sm">
                        HTTP Status: {deployStatus.healthCheck.status}
                      </p>
                    )}
                    {deployStatus.healthCheck.responseTime && (
                      <p className="text-sm">
                        Response Time: {deployStatus.healthCheck.responseTime}ms
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deploy Section */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Deployment</h2>
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${
            config?.lastSyncStatus === 'success' 
              ? 'bg-green-50 border-green-200' 
              : config?.lastSyncStatus === 'failed'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              {config?.lastSyncStatus === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {config?.lastSyncStatus === 'success' 
                    ? 'Production Status: Klar' 
                    : config?.lastSyncStatus === 'failed'
                    ? 'Production Status: Feil i siste deploy'
                    : 'Production Status: Ikke konfigurert'}
                </p>
                <p className="text-sm text-gray-600">
                  {config 
                    ? `Sist synkronisert: ${formatDate(config.lastSyncAt)}`
                    : 'Konfigurer deployment settings først'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDeploy}
            disabled={deploying || !config}
            className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            {deploying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Deployer...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Deploy til Production
              </>
            )}
          </button>
          
          {!config && (
            <p className="text-sm text-center text-gray-600">
              <Link href="/admin/deploy/settings" className="text-purple-600 hover:underline">
                Gå til Settings
              </Link> for å konfigurere FTP og database credentials før deployment.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
