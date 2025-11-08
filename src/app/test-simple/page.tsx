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

export default function TestSimplePage() {
  return (
    <html lang="no">
      <head>
        <title>Test Side - Next.js</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        fontFamily: 'Arial, sans-serif', 
        maxWidth: '800px', 
        margin: '50px auto', 
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ color: '#667eea', marginTop: 0 }}>✅ Next.js Test Side</h1>
          <p>Hvis du ser dette, fungerer Next.js server-side rendering.</p>
          
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '5px',
            margin: '20px 0',
            border: '1px solid #c3e6cb'
          }}>
            <strong>Status:</strong> Next.js fungerer!
          </div>
          
          <h2>Test Informasjon:</h2>
          <ul>
            <li>Framework: Next.js 14</li>
            <li>Rendering: Server-side</li>
            <li>Fil: /app/test-simple/page.tsx</li>
            <li>Ingen React hooks eller client components</li>
          </ul>
          
          <h2>Neste Steg:</h2>
          <p>Hvis denne siden fungerer, er problemet i client-side komponenter på landing-siden.</p>
          <p>
            <a href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
              ← Tilbake til landing side
            </a>
          </p>
          <p>
            <a href="/test.html" style={{ color: '#667eea', textDecoration: 'none' }}>
              → Test statisk HTML
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}


