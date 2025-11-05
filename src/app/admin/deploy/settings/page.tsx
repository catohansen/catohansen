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
 * Deploy Settings
 * Configure FTP and database credentials for deployment
 */

'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, CheckCircle2, AlertCircle, Server, User, Key, Folder, Database, Globe, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface DeploymentConfig {
  id?: string
  name?: string
  ftpServer?: string
  ftpUsername?: string
  ftpPassword?: string
  ftpServerDir?: string
  protocol?: string
  dbHost?: string
  dbUsername?: string
  dbPassword?: string
  dbName?: string
  dbPort?: number
  dbType?: string
  serverUrl?: string
  buildOutputDir?: string
}

export default function DeploySettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<DeploymentConfig>({
    name: 'Production',
    ftpServer: 'ftp.domeneshop.no',
    ftpServerDir: '/www',
    buildOutputDir: 'out',
    dbPort: 5432,
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

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

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/deploy/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(config),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Deployment config lagret!' })
        setConfig(data.config)
      } else {
        setMessage({ type: 'error', text: data.error || 'Kunne ikke lagre config' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Kunne ikke lagre config' })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof DeploymentConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Laster...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Deployment Settings</h1>
        </div>
        <Link
          href="/admin/deploy"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-900' 
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <p className="font-semibold">{message.text}</p>
        </div>
      )}

      {/* FTP Configuration */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          FTP Configuration
        </h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FTP Server
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={config.ftpServer || ''}
                  onChange={(e) => handleChange('ftpServer', e.target.value)}
                  placeholder="ftp.domeneshop.no"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protocol
              </label>
              <select
                value={config.protocol || 'ftp'}
                onChange={(e) => handleChange('protocol', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ftp">FTP (Port 21)</option>
                <option value="sftp">SFTP (Sikrere)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                SFTP bruker sftp.domeneshop.no (sikrere)
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-900">
              <strong>Info:</strong> Domeneshop støtter også SFTP (sftp.domeneshop.no) 
              og SCP (scp.domeneshop.no) for sikrere filoverføring.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FTP Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={config.ftpUsername || ''}
                onChange={(e) => handleChange('ftpUsername', e.target.value)}
                placeholder="Brukernavn"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FTP Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={config.ftpPassword === '••••••••' ? '' : (config.ftpPassword || '')}
                onChange={(e) => handleChange('ftpPassword', e.target.value)}
                placeholder="Passord (skriv nytt for å oppdatere)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Passordet blir kryptert før lagring</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Server Directory
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={config.ftpServerDir || ''}
                onChange={(e) => handleChange('ftpServerDir', e.target.value)}
                placeholder="/www"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Database Configuration (Optional) */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Configuration (Optional)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Konfigurer database synkronisering hvis du vil synkronisere database endringer til production serveren.
        </p>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Host
              </label>
              <input
                type="text"
                value={config.dbHost || ''}
                onChange={(e) => handleChange('dbHost', e.target.value)}
                placeholder="catohansen.mysql.domeneshop.no"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Domeneshop MySQL: catohansen.mysql.domeneshop.no
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Port
              </label>
              <input
                type="number"
                value={config.dbPort || 3306}
                onChange={(e) => handleChange('dbPort', parseInt(e.target.value) || 3306)}
                placeholder="3306"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">MySQL default port er 3306</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Username
            </label>
            <input
              type="text"
              value={config.dbUsername || ''}
              onChange={(e) => handleChange('dbUsername', e.target.value)}
              placeholder="Brukernavn"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Password
            </label>
            <input
              type="password"
              value={config.dbPassword === '••••••••' ? '' : (config.dbPassword || '')}
              onChange={(e) => handleChange('dbPassword', e.target.value)}
              placeholder="Passord (skriv nytt for å oppdatere)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Passordet blir kryptert før lagring</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Name
              </label>
              <input
                type="text"
                value={config.dbName || ''}
                onChange={(e) => handleChange('dbName', e.target.value)}
                placeholder="catohansen"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Type
              </label>
              <select
                value={config.dbType || 'mysql'}
                onChange={(e) => handleChange('dbType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="mysql">MySQL (Domeneshop)</option>
                <option value="postgresql">PostgreSQL</option>
              </select>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Viktig:</strong> Domeneshop bruker MySQL (ikke PostgreSQL). 
              Systemet konverterer automatisk fra PostgreSQL (lokalt) til MySQL (server) 
              ved export. Du må importere SQL-dump manuelt via Domeneshop admin panel 
              etter deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Server Configuration */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Server Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Server URL
            </label>
            <input
              type="text"
              value={config.serverUrl || ''}
              onChange={(e) => handleChange('serverUrl', e.target.value)}
              placeholder="https://www.domenehsop.no"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">URL til production serveren</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Build Output Directory
            </label>
            <input
              type="text"
              value={config.buildOutputDir || 'out'}
              onChange={(e) => handleChange('buildOutputDir', e.target.value)}
              placeholder="out"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Mappen hvor Next.js genererer statiske filer</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Lagrer...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Lagre Configuration
            </>
          )}
        </button>
      </div>
    </div>
  )
}

