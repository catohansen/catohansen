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

export default function HomeMinimal() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '50px 20px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        color: '#333',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ color: '#667eea', marginTop: 0 }}>✅ Minimal Landing Side</h1>
        <p>Hvis du ser dette, fungerer Next.js og React rendering.</p>
        
        <div style={{
          background: '#d4edda',
          color: '#155724',
          padding: '15px',
          borderRadius: '5px',
          margin: '20px 0',
          border: '1px solid #c3e6cb'
        }}>
          <strong>Status:</strong> Server-side rendering fungerer!
        </div>
        
        <h2>Test Informasjon:</h2>
        <ul>
          <li>Ingen 'use client' directive</li>
          <li>Ingen komponenter</li>
          <li>Kun server-side rendering</li>
          <li>Ingen JavaScript på klienten</li>
        </ul>
        
        <h2>Neste Steg:</h2>
        <p>Hvis denne siden fungerer, er problemet i client-side komponenter.</p>
        <p>
          <a href="/" style={{ color: '#667eea' }}>← Tilbake til landing side</a>
        </p>
      </div>
    </main>
  );
}


