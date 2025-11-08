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

'use client';

export default function HomeTest() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Test Side - Landing Page
        </h1>
        <p className="text-lg text-slate-700 mb-8">
          Hvis du ser dette, fungerer Next.js og rendering.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <ul className="space-y-2">
            <li>✅ Next.js fungerer</li>
            <li>✅ Client-side rendering fungerer</li>
            <li>✅ CSS/Tailwind fungerer</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


