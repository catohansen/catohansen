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

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          ✅ Landing Side - Enkel Test
        </h1>
        <p className="text-lg text-slate-700 mb-8">
          Hvis du ser dette, fungerer Next.js og React rendering.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <ul className="space-y-2">
            <li>✅ Next.js fungerer</li>
            <li>✅ React rendering fungerer</li>
            <li>✅ CSS/Tailwind fungerer</li>
            <li>✅ Server-side rendering fungerer</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Neste Steg
          </h3>
          <p className="text-yellow-700">
            Hvis denne siden fungerer, er problemet i client-side komponenter på den originale landing-siden.
            Test også: <a href="/test.html" className="underline">/test.html</a> og <a href="/test-simple" className="underline">/test-simple</a>
          </p>
        </div>
      </div>
    </main>
  );
}


