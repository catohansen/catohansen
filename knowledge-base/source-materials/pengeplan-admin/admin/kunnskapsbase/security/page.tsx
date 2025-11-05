'use client';

import React, { useState } from 'react';
import { Shield, Download, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

import { DocumentViewer } from '@/components/DocumentViewer';

const sikkerhetsDokumenter = [
  {
    title: "🛡️ Sikkerhet & GDPR",
    description: "Omfattende sikkerhetsdokumentasjon og GDPR-compliance guide",
    path: "SECURITY.md",
    category: "GDPR",
    readTime: "14 min",
    priority: "critical",
    icon: "🛡️"
  },
  {
    title: "🤖 AI Act Compliance",
    description: "Slik sikrer Pengeplan 2.0 full compliance med EU AI Act",
    path: "AI_ACT_COMPLIANCE.md", 
    category: "AI Compliance",
    readTime: "16 min",
    priority: "critical",
    icon: "🤖"
  },
  {
    title: "🏛️ Cerbos Production Guide",
    description: "Produksjonsoppsett av Cerbos authorization og policies",
    path: "CERBOS_PRODUCTION_GUIDE.md",
    category: "Authorization",
    readTime: "18 min",
    priority: "high",
    icon: "🏛️"
  },
  {
    title: "🔧 Development Security Guide", 
    description: "Sikkerhet i utviklingsprosessen og code review",
    path: "DEVELOPMENT-SECURITY-GUIDE.md",
    category: "Development",
    readTime: "12 min",
    priority: "high",
    icon: "🔧"
  },
  {
    title: "🛡️ Security & Privacy Guide (MDX)",
    description: "Detaljert sikkerhet og personvern guide med interaktive elementer",
    path: "docs/security-privacy-guide.mdx",
    category: "Privacy",
    readTime: "20 min",
    priority: "critical",
    icon: "🛡️"
  },
  {
    title: "👨‍⚖️ Psychological Principles Guide",
    description: "Psykologiske prinsipper for sikker og ansvarlig brukeropplevelse",
    path: "docs/psychological-principles-guide.mdx",
    category: "Psychology",
    readTime: "16 min", 
    priority: "medium",
    icon: "👨‍⚖️"
  },
  {
    title: "📋 Deploy Checklist",
    description: "Sikkerhet-sjekkliste for produksjonsdeployment",
    path: "DEPLOY_CHECKLIST.md",
    category: "Deployment",
    readTime: "8 min",
    priority: "high",
    icon: "📋"
  },
  {
    title: "🔐 Credentials Setup",
    description: "Sikker oppsett av API-nøkler og hemmeligheter",
    path: "CREDENTIALS_SETUP.md",
    category: "Credentials",
    readTime: "10 min",
    priority: "high", 
    icon: "🔐"
  }
];

export default function SikkerhetsguiderPage() {
  const [valgtDokument, setValgtDokument] = useState<string | null>(null);
  const [valgtPrioritet, setValgtPrioritet] = useState('all');

  const prioriteter = ['all', 'critical', 'high', 'medium'];

  const filtrerteOgSorterte = sikkerhetsDokumenter.filter(doc => {
    return valgtPrioritet === 'all' || doc.priority === valgtPrioritet;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <Shield className="w-4 h-4 text-orange-600" />;
      case 'medium': return <CheckCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

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
            🛡️ Sikkerhetsguider
          </h1>
          <p className="text-gray-600 mt-1">
            Sikkerhet, personvern og compliance - Les direkte i browser
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/docs/export/chapter/sikkerhet"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Last ned sikkerhetsdokumenter
          </a>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filtrer etter prioritet:</span>
          <div className="flex items-center gap-2">
            {prioriteter.map(priority => (
              <button
                key={priority}
                onClick={() => setValgtPrioritet(priority)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  valgtPrioritet === priority 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority === 'all' ? 'Alle' : priority === 'critical' ? 'Kritisk' : priority === 'high' ? 'Høy' : 'Medium'}
                <span className="ml-1 text-xs">
                  ({sikkerhetsDokumenter.filter(d => priority === 'all' || d.priority === priority).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Security Notice */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              🚨 Kritiske Sikkerhetsdokumenter
            </h3>
            <p className="text-red-800 mb-4">
              Disse dokumentene er essensielle for sikker drift av Pengeplan 2.0 og må leses av alle administratorer.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-700">
                {sikkerhetsDokumenter.filter(d => d.priority === 'critical').length} kritiske dokumenter
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Documents Tree */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">🔒 Sikkerhetsdokumenter - Klikk for å lese</h2>
          <p className="text-sm text-gray-600 mt-1">
            Alle dokumenter åpnes med vakker formatering direkte i browser
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(doc.priority)}`}>
                        {doc.priority === 'critical' ? 'KRITISK' : doc.priority === 'high' ? 'HØY' : 'MEDIUM'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{doc.readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getPriorityIcon(doc.priority)}
                  <span className="text-sm text-blue-600 group-hover:underline">
                    Les i browser →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-gray-600">"Sikkerhet først - Gjør Økonomi Trygt for Hele Familien! 🛡️"</p>
        <p className="text-sm text-gray-500 mt-1">
          {sikkerhetsDokumenter.length} sikkerhetsdokumenter - Alle lesbare direkte i browser
        </p>
      </div>
    </div>
  );
}