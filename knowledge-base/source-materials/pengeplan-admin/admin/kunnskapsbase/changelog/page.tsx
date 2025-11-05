'use client';

import React, { useState } from 'react';
import { Calendar, Download, GitBranch, TrendingUp } from 'lucide-react';

import { DocumentViewer } from '@/components/DocumentViewer';

const changelogDokumenter = [
  {
    title: "📋 CHANGELOG - Hovedprosjekt",
    description: "Komplett endringslogg for Pengeplan 2.0 med alle versjoner og oppdateringer",
    path: "system-knowledge/CHANGELOG.md",
    category: "Hovedprosjekt", 
    version: "v2.0.0",
    readTime: "12 min",
    date: "2025-09-18",
    icon: "📋"
  },
  {
    title: "📝 Development Log",
    description: "Detaljert utviklingslogg med tekniske beslutninger og arkitekturvalg",
    path: "system-knowledge/DEVELOPMENT_LOG.md",
    category: "Utvikling",
    version: "v2.0.0", 
    readTime: "15 min",
    date: "2025-09-17",
    icon: "📝"
  },
  {
    title: "📊 Migration Summary",
    description: "Sammendrag av alle migrasjoner og systemoppgraderinger",
    path: "system-knowledge/MIGRATION_SUMMARY.md",
    category: "Migrasjoner",
    version: "v1.9.0",
    readTime: "8 min",
    date: "2025-09-15", 
    icon: "📊"
  },
  {
    title: "🧹 Cleanup Summary",
    description: "Oversikt over kode-cleanup og refaktorering",
    path: "system-knowledge/CLEANUP_SUMMARY.md",
    category: "Cleanup",
    version: "v1.8.5",
    readTime: "6 min",
    date: "2025-09-10",
    icon: "🧹"
  },
  {
    title: "📋 Project Changelog",
    description: "Prosjektspesifikk changelog med detaljerte endringer",
    path: "system-knowledge/CHANGELOG.md",
    category: "Prosjekt",
    version: "v2.0.0",
    readTime: "10 min",
    date: "2025-09-18",
    icon: "📋"
  },
  {
    title: "🎯 Sprint 2 Checklist",
    description: "Fullført checklist for Sprint 2 med alle leveranser",
    path: "system-knowledge/SPRINT2_CHECKLIST.md",
    category: "Sprint",
    version: "Sprint 2",
    readTime: "5 min",
    date: "2025-09-12",
    icon: "🎯"
  },
  {
    title: "📊 Testing Summary",
    description: "Sammendrag av alle test-implementeringer og resultater",
    path: "system-knowledge/TESTING_SUMMARY.md",
    category: "Testing",
    version: "v2.0.0",
    readTime: "7 min",
    date: "2025-09-17",
    icon: "📊"
  },
  {
    title: "🚀 Production Readiness Report",
    description: "Komplett rapport for produksjonsklarhet og deployment",
    path: "system-knowledge/PRODUCTION_READINESS_REPORT.md", 
    category: "Production",
    version: "v2.0.0",
    readTime: "11 min",
    date: "2025-09-18",
    icon: "🚀"
  }
];

const kategorier = [
  { id: 'all', name: 'Alle Endringer', count: changelogDokumenter.length },
  { id: 'Hovedprosjekt', name: 'Hovedprosjekt', count: 1 },
  { id: 'Utvikling', name: 'Utvikling', count: 1 },
  { id: 'Testing', name: 'Testing', count: 1 },
  { id: 'Production', name: 'Production', count: 1 },
  { id: 'Sprint', name: 'Sprint', count: 1 }
];

export default function EndringsloggPage() {
  const [valgtDokument, setValgtDokument] = useState<string | null>(null);
  const [valgtKategori, setValgtKategori] = useState('all');

  const filtrerteOgSorterte = changelogDokumenter
    .filter(doc => valgtKategori === 'all' || doc.category === valgtKategori)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (valgtDokument) {
    return (
      <DocumentViewer 
        documentPath={valgtDokument}
        onClose={() => setValgtDokument(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📋 Endringslogg
          </h1>
          <p className="text-gray-600 mt-1">
            Alle endringer, oppdateringer og versjonshistorikk - Les direkte i browser
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/docs/export/chapter/changelog"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Last ned alle endringslogs
          </a>
        </div>
      </div>

      {/* Current Version Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🎉 Versjon 2.0.0 - September 2025
            </h3>
            <p className="text-green-700 mb-2">
              Komplett NAV-integrasjon, AI Act compliance og enterprise testing suite lansert!
            </p>
            <div className="flex items-center gap-4 text-sm text-green-600">
              <span>✅ NAV-integrasjon</span>
              <span>✅ AI Act compliance</span>
              <span>✅ Verge-system</span>
              <span>✅ Enterprise testing</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">v2.0.0</div>
            <div className="text-sm text-green-700">Nyeste versjon</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filtrer etter kategori:</span>
          <div className="flex flex-wrap items-center gap-2">
            {kategorier.map(kategori => (
              <button
                key={kategori.id}
                onClick={() => setValgtKategori(kategori.id)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  valgtKategori === kategori.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {kategori.name} ({kategori.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Changelog Documents */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">📚 Endringsdokumenter - Klikk for å lese</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filtrerteOgSorterte.length} dokumenter sortert etter dato - Alle lesbare direkte i browser
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {filtrerteOgSorterte.map((doc, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
                onClick={() => setValgtDokument(doc.path)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <span className="text-lg">{doc.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {doc.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {doc.version}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{doc.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(doc.date).toLocaleDateString('nb-NO')}
                      </span>
                      <span>•</span>
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{doc.readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-blue-600 group-hover:underline">
                    Les i browser →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filtrerteOgSorterte.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen endringslogs funnet</h3>
          <p className="text-gray-600 mb-4">Prøv å velge en annen kategori</p>
          <button 
            onClick={() => setValgtKategori('all')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            Vis alle
          </button>
        </div>
      )}

      <div className="text-center py-6">
        <p className="text-gray-600">"Kontinuerlig forbedring for hele familien! 📈"</p>
        <p className="text-sm text-gray-500 mt-1">
          {changelogDokumenter.length} endringsdokumenter - Alle lesbare direkte i browser
        </p>
      </div>
    </div>
  );
}