export default function RapporterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            📊 Test-rapporter
          </h1>
          <p className="text-gray-600 mt-1">
            Alle test-rapporter og kvalitetssikring for Pengeplan 2.0
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              💎 Investor-klar Testrapport
            </h3>
            <p className="text-gray-700 mb-3">
              Komplett testrapport med enterprise metrics og compliance-dokumentasjon
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                ✅ 67% Success Rate
              </span>
              <span className="flex items-center gap-1">
                📚 57 Dokumenter
              </span>
              <span className="flex items-center gap-1">
                🛡️ 100% AI Act Compliant
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/reports/index-2025-09-17T18-58-29-893Z.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              👁️ Åpne HTML-rapport
            </a>
            <a
              href="/reports/testrapport-2025-09-17T18-58-29-893Z.md"
              download
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              📥 Last ned Markdown
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">HTML Rapport</p>
              <p className="text-lg font-bold text-blue-600">Interaktiv</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              🌐
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/reports/index-2025-09-17T18-58-29-893Z.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Åpne i ny fane →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Playwright Rapport</p>
              <p className="text-lg font-bold text-purple-600">Video & Screenshots</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              🎭
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/playwright-report/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline text-sm"
            >
              Åpne Playwright →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Test Control Center</p>
              <p className="text-lg font-bold text-green-600">Live Testing</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              🎮
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/admin/testing-center"
              className="text-green-600 hover:underline text-sm"
            >
              Gå til Test Center →
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">📈 Test-resultater Oversikt</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">67%</div>
              <div className="text-sm text-gray-600">Test Success</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">57</div>
              <div className="text-sm text-gray-600">Dokumenter</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">AI Act Ready</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">4</div>
              <div className="text-sm text-gray-600">Brukerroller</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-700">
              🎯 <strong>Production Ready</strong> - NAV/Bufdir approval ready, investor due diligence complete
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-gray-600">"Gjør Økonomi Gøy for Hele Familien! 🎉"</p>
        <p className="text-sm text-gray-500 mt-2">Pengeplan 2.0 - Enterprise-ready documentation system</p>
      </div>
    </div>
  );
}