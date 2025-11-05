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
 * Hansen Security Settings Page
 * Configure security settings including Remember Me functionality
 */

'use client'

import { useState, useEffect } from 'react'
import { Shield, Save, Loader2, CheckCircle2, AlertCircle, Lock, Clock, Power, Code } from 'lucide-react'
import { motion } from 'framer-motion'

interface SecuritySettings {
  securityEnabled: boolean // Master toggle for security system
  rememberMeEnabled: boolean
  defaultSessionDurationDays: number
  maxSessionDurationDays: number
  requireMFA: boolean
  requireStrongPasswords: boolean
  enableAccountLockout: boolean
  maxFailedAttempts: number
  lockoutDurationMinutes: number
  enableAuditLogging: boolean
  auditRetentionDays: number
  denyByDefault: boolean
  enablePolicyVersioning: boolean
}

export default function SecuritySettingsPage() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/modules/hansen-security/settings', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSettings(data.settings)
        }
      } else {
        setError('Failed to load security settings')
      }
    } catch (error) {
      console.error('Load settings error:', error)
      setError('Failed to load security settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/modules/hansen-security/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ settings })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSuccess('Security settings updated successfully!')
          setTimeout(() => setSuccess(''), 5000)
        } else {
          setError(data.error || 'Failed to update settings')
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update settings')
      }
    } catch (error) {
      console.error('Save settings error:', error)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load security settings</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            Security Settings
          </h1>
          <p className="text-gray-600">Configure authentication and security features</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </motion.button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-600">{success}</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Development Mode - Security System Toggle */}
      <div className="glass rounded-2xl p-6 border-2 border-orange-200 bg-orange-50/50">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-orange-600" />
          Development Mode
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200">
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Power className="w-5 h-5 text-orange-600" />
              Security System (Av/På)
            </label>
            <p className="text-sm text-gray-600 mt-1">
              {settings.securityEnabled 
                ? 'Sikkerhetssystemet er aktivert. Alle sikkerhetssjekker er aktive.'
                : 'Sikkerhetssystemet er deaktivert. Sikkerhetssjekker er skrudd av for utvikling.'}
            </p>
            {!settings.securityEnabled && (
              <p className="text-xs text-orange-600 mt-2 font-medium">
                ⚠️ Advarsel: Sikkerhetssystemet er av under utvikling!
              </p>
            )}
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.securityEnabled}
              onChange={(e) => setSettings({ ...settings, securityEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>

      {/* Authentication Settings */}
      <div className={`glass rounded-2xl p-6 ${!settings.securityEnabled ? 'opacity-50' : ''}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-purple-600" />
          Authentication Settings
        </h2>

        <div className="space-y-6">
          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-900">
                Husk meg / Stay Logged In
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Enable &quot;Remember Me&quot; functionality in login form. When enabled, users can choose to stay logged in for up to {settings.maxSessionDurationDays} days.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.rememberMeEnabled}
                onChange={(e) => setSettings({ ...settings, rememberMeEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Session Duration */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-purple-600" />
              <label className="text-sm font-semibold text-gray-900">
                Session Duration (Days)
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Default</label>
                <input
                  type="number"
                  min="1"
                  max={settings.maxSessionDurationDays}
                  value={settings.defaultSessionDurationDays}
                  onChange={(e) => setSettings({ ...settings, defaultSessionDurationDays: parseInt(e.target.value) || 7 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max (Remember Me)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.maxSessionDurationDays}
                  onChange={(e) => setSettings({ ...settings, maxSessionDurationDays: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="glass rounded-2xl p-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">About Remember Me</h3>
            <p className="text-sm text-blue-700">
              When &quot;Husk meg / Stay Logged In&quot; is enabled, users will see a checkbox on the login page.
              If they check it, their session will last for {settings.maxSessionDurationDays} days instead of the default {settings.defaultSessionDurationDays} days.
              The session is stored securely in an httpOnly cookie.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

