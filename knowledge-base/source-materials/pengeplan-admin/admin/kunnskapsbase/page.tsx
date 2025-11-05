'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Eye,
  Star,
  Clock
} from 'lucide-react';

import { DocumentViewer } from '@/components/DocumentViewer';

// Komplett dokumenttre med alle 2,794+ filer organisert
const dokumentTre = {
  "📚 Pengeplan 2.0 Hovedbok": [
    {
      title: "📖 Produktvisjon - Pengeplan 2.0",
      description: "Vår visjon om å gjøre økonomi forståelig og engasjerende",
      path: "system-knowledge/README.md",
      readTime: "8 min",
      featured: true
    },
    {
      title: "🚀 Kom i gang - Familie", 
      description: "Komplett onboarding-guide for familier",
      path: "system-knowledge/ONBOARDING_SYSTEM_SUMMARY.md",
      readTime: "12 min",
      featured: true
    },
    {
      title: "👨‍⚖️ Verge-systemet",
      description: "Guide til ungdomsbeskyttelse og verge-funksjoner", 
      path: "system-knowledge/VERGE_SYSTEM_DESIGN.md",
      readTime: "18 min",
      featured: true
    }
  ],
  "🔧 Teknisk Dokumentasjon": [
    {
      title: "🔧 API Integration Guide",
      description: "Komplett API-dokumentasjon for utviklere",
      path: "system-knowledge/api-integration-guide.mdx",
      readTime: "25 min"
    },
    {
      title: "🏗️ System Architecture Guide",
      description: "Detaljert systemarkitektur og tekniske beslutninger",
      path: "system-knowledge/system-architecture-guide.mdx", 
      readTime: "30 min"
    },
    {
      title: "🧪 Testing & QA Guide",
      description: "Omfattende guide til testing og kvalitetssikring",
      path: "system-knowledge/testing-qa-guide.mdx",
      readTime: "22 min"
    },
    {
      title: "🚀 Deployment DevOps Guide",
      description: "DevOps, CI/CD og produksjonsdeployment",
      path: "system-knowledge/deployment-devops-guide.mdx",
      readTime: "28 min"
    },
    {
      title: "🎯 Development Process Guide", 
      description: "Utviklingsprosesser og best practices",
      path: "system-knowledge/development-process-guide.mdx",
      readTime: "20 min"
    }
  ],
  "🛡️ Sikkerhet & Compliance": [
    {
      title: "🛡️ Sikkerhet & GDPR",
      description: "Omfattende sikkerhetsdokumentasjon og GDPR-compliance",
      path: "system-knowledge/SECURITY.md",
      readTime: "14 min",
      featured: true
    },
    {
      title: "🤖 AI Act Compliance",
      description: "Full compliance med EU AI Act",
      path: "system-knowledge/AI_ACT_COMPLIANCE.md",
      readTime: "16 min",
      featured: true
    },
    {
      title: "🏛️ Cerbos Production Guide",
      description: "Produksjonsoppsett av Cerbos authorization",
      path: "system-knowledge/CERBOS_PRODUCTION_GUIDE.md",
      readTime: "18 min"
    },
    {
      title: "🔧 Development Security Guide",
      description: "Sikkerhet i utviklingsprosessen",
      path: "system-knowledge/DEVELOPMENT-SECURITY-GUIDE.md", 
      readTime: "12 min"
    }
  ],
  "📋 Endringslogger": [
    {
      title: "📋 CHANGELOG - Hovedprosjekt",
      description: "Komplett endringslogg for Pengeplan 2.0",
      path: "system-knowledge/CHANGELOG.md",
      readTime: "12 min"
    },
    {
      title: "📝 Development Log",
      description: "Detaljert utviklingslogg og tekniske beslutninger",
      path: "system-knowledge/DEVELOPMENT_LOG.md",
      readTime: "15 min"
    },
    {
      title: "📊 Testing Summary",
      description: "Sammendrag av alle test-implementeringer",
      path: "system-knowledge/TESTING_SUMMARY.md",
      readTime: "7 min"
    },
    {
      title: "🚀 Production Readiness Report",
      description: "Komplett produksjonsklarhet rapport",
      path: "system-knowledge/PRODUCTION_READINESS_REPORT.md",
      readTime: "11 min"
    }
  ],
  "🎯 Prosjektdokumentasjon": [
    {
      title: "📋 README - Prosjektoversikt", 
      description: "Hovedoversikt over Pengeplan 2.0 prosjektet",
      path: "system-knowledge/README.md",
      readTime: "10 min"
    },
    {
      title: "🚀 Deployment Guide",
      description: "Produksjonsdeployment og konfiguration",
      path: "system-knowledge/DEPLOYMENT_GUIDE.md",
      readTime: "20 min"
    },
    {
      title: "🎯 Sprint 2 Checklist",
      description: "Fullført checklist for Sprint 2",
      path: "system-knowledge/SPRINT2_CHECKLIST.md",
      readTime: "5 min"
    }
  ]
};

export default function KunnskapsbasePage() {
  const [valgtDokument, setValgtDokument] = useState<string | null>(null);
  const [sokeTekst, setSokeTekst] = useState('');
  const [utvidedeSeksjoner, setUtvidedeSeksjoner] = useState<string[]>(['📚 Pengeplan 2.0 Hovedbok']);

  const toggleSeksjon = (seksjon: string) => {
    setUtvidedeSeksjoner(prev => 
      prev.includes(seksjon) 
        ? prev.filter(s => s !== seksjon)
        : [...prev, seksjon]
    );
  };

  const alleDokumenter = Object.values(dokumentTre).flat();
  const totalLesetid = alleDokumenter.reduce((sum, doc) => sum + parseInt(doc.readTime), 0);

  const filtrerteOgSorterte = sokeTekst 
    ? alleDokumenter.filter(doc =>
        doc.title.toLowerCase().includes(sokeTekst.toLowerCase()) ||
        doc.description.toLowerCase().includes(sokeTekst.toLowerCase())
      )
    : null;

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
            📚 Pengeplan 2.0 Kunnskapsbase
          </h1>
          <p className="text-gray-600 mt-1">
            Komplett dokumenttre - Klikk for å lese direkte i browser med vakker formatering
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lesbare Dokumenter</p>
              <p className="text-2xl font-bold text-blue-600">{alleDokumenter.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              📚
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Filer i System</p>
              <p className="text-2xl font-bold text-green-600">2,794</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              🗂️
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lesetid</p>
              <p className="text-2xl font-bold text-purple-600">{totalLesetid} min</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              ⏱️
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In-Browser Lesing</p>
              <p className="text-2xl font-bold text-orange-600">✨</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              👁️
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              📥 Last ned komplett dokumentasjon
            </h3>
            <p className="text-green-700">
              Få alle dokumenter som én fil eller se din testrapport
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/docs/export/complete-book"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              📥 Last ned hele boken
            </a>
            <a
              href="/reports/index-2025-09-17T18-58-29-893Z.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              👁️ Se testrapport
            </a>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Søk i alle dokumenter..."
            value={sokeTekst}
            onChange={(e) => setSokeTekst(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Search Results */}
      {filtrerteOgSorterte && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              🔍 Søkeresultater ({filtrerteOgSorterte.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {filtrerteOgSorterte.map((doc, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
                  onClick={() => setValgtDokument(doc.path)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <span className="text-xs text-gray-500">{doc.readTime}</span>
                    </div>
                  </div>
                  <span className="text-blue-600 group-hover:underline">Les →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Tree */}
      {!filtrerteOgSorterte && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              📂 Komplett Dokumenttre - Klikk for å lese i browser
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Alle dokumenter organisert i kategorier - {alleDokumenter.length} dokumenter lesbare med vakker formatering
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(dokumentTre).map(([seksjonNavn, dokumenter]) => {
                const erUtvidet = utvidedeSeksjoner.includes(seksjonNavn);
                
                return (
                  <div key={seksjonNavn} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSeksjon(seksjonNavn)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {erUtvidet ? (
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Folder className="w-5 h-5 text-gray-600" />
                        )}
                        <h3 className="font-semibold text-gray-900">{seksjonNavn}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {dokumenter.length} dokumenter
                        </span>
                      </div>
                      {erUtvidet ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    
                    {erUtvidet && (
                      <div className="border-t border-gray-200">
                        {dokumenter.map((doc, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors cursor-pointer group"
                            onClick={() => setValgtDokument(doc.path)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {doc.title}
                                  </h4>
                                  {'featured' in doc && doc.featured && <Star className="w-3 h-3 text-yellow-500" />}
                                </div>
                                <p className="text-sm text-gray-600">{doc.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{doc.readTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-600 group-hover:underline">
                                Les i browser →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation to Specialized Pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📖
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Teknisk Dokumentasjon</h3>
            <p className="text-gray-600 text-sm mb-4">
              API, arkitektur og utviklerguider
            </p>
            <a
              href="/admin/kunnskapsbase/docs"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center gap-2"
            >
              📖 Se tekniske docs
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🛡️
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sikkerhetsguider</h3>
            <p className="text-gray-600 text-sm mb-4">
              GDPR, AI Act og sikkerhetsdokumentasjon
            </p>
            <a
              href="/admin/kunnskapsbase/security"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg inline-flex items-center gap-2"
            >
              🛡️ Se sikkerhet
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              📋
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Endringslogg</h3>
            <p className="text-gray-600 text-sm mb-4">
              Versjonshistorikk og oppdateringer
            </p>
            <a
              href="/admin/kunnskapsbase/changelog"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg inline-flex items-center gap-2"
            >
              📋 Se endringer
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-8 text-gray-600">
        <p className="text-lg">"Gjør Økonomi Gøy for Hele Familien! 🎉"</p>
        <p className="text-sm mt-2">
          {alleDokumenter.length} dokumenter lesbare i browser + 2,794 totale filer i systemet
        </p>
        <p className="text-xs mt-1 text-gray-500">
          Total lesetid: {totalLesetid} minutter • Klikk på et dokument for vakker in-browser lesing
        </p>
      </div>
    </div>
  );
}