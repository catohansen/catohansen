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
 * Security Policies Settings
 * Manage Hansen Security policies from settings
 */

'use client'

import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPoliciesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Security Policies</h1>
        </div>
        <Link
          href="/admin/hansen-security/policies"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Manage Policies
        </Link>
      </div>

      <div className="glass rounded-2xl p-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Hansen Security Policies</h3>
            <p className="text-sm text-blue-700 mb-3">
              Manage security policies from the Hansen Security module. Click &quot;Manage Policies&quot; 
              to access the full policy management interface.
            </p>
            <Link
              href="/admin/hansen-security/policies"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Go to Policies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
