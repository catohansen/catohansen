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
 * Settings Dashboard
 * General settings and configuration
 */

'use client'

import { Settings, User, Users, Shield, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/profile"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <User className="w-12 h-12 text-blue-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">My Profile</h3>
          <p className="text-sm text-gray-600">Manage your profile and account settings</p>
        </Link>

        <Link
          href="/admin/settings/users"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <Users className="w-12 h-12 text-purple-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Users & Roles</h3>
          <p className="text-sm text-gray-600">Manage users and role permissions</p>
        </Link>

        <Link
          href="/admin/settings/policies"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <Shield className="w-12 h-12 text-green-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Security Policies</h3>
          <p className="text-sm text-gray-600">Manage Hansen Security policies</p>
        </Link>

        <Link
          href="/admin/settings/integrations"
          className="glass rounded-2xl p-6 hover:shadow-lg transition-all"
        >
          <LinkIcon className="w-12 h-12 text-orange-500 opacity-50 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Integrations</h3>
          <p className="text-sm text-gray-600">Configure third-party integrations</p>
        </Link>
      </div>
    </div>
  )
}
