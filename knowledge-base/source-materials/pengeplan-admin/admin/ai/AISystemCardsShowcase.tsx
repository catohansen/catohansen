'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain,
  Shield,
  Globe,
  Settings,
  CheckCircle,
  Eye,
  Users,
  Lightbulb,
  Sparkles
} from 'lucide-react'

const tabs = [
  { key: "all", label: "Alle", icon: <Globe className="h-4 w-4" /> },
  { key: "user", label: "Bruker", icon: <Users className="h-4 w-4" /> },
  { key: "guardian", label: "Verge", icon: <Shield className="h-4 w-4" /> },
  { key: "landing", label: "Landing", icon: <Sparkles className="h-4 w-4" /> },
  { key: "admin", label: "Admin", icon: <Settings className="h-4 w-4" /> },
];

// User AI System Card
function UserAISystemCard() {
  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI System Card – Bruker</h3>
            <p className="text-indigo-100 text-sm">Personlig økonomisk AI-agent</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            🎯 Formål:
          </h4>
          <p className="text-gray-700 text-sm">
            Gi privatpersoner full oversikt og kontroll over økonomien, med AI-agent som foreslår trygge tiltak og gir coaching.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-indigo-900 mb-2">🤖 Hvordan AI brukes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• AI analyserer regninger, budsjett, kontantstrøm og gjeld</li>
            <li>• Genererer forslag (delbetaling, utsettelse, budsjettjustering)</li>
            <li>• Viser før/etter-analyse med grafer og forklaring ≤240 tegn</li>
            <li>• NLP-coach støtter med motivasjon og mestring</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-indigo-900 mb-2">🔒 Kontroll og sikkerhet:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Bruker har alltid siste ord (human-in-the-loop)</li>
            <li>• AI-forslag kan aksepteres eller avvises med ett klikk</li>
            <li>• PII-maskering (konto, KID, e-post, telefon)</li>
            <li>• Alle beslutninger logges (audit trail)</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium mb-2">✨ Fordeler for deg:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Badge className="bg-green-100 text-green-800">Bedre oversikt</Badge>
            <Badge className="bg-green-100 text-green-800">Smarte forslag</Badge>
            <Badge className="bg-green-100 text-green-800">Motivasjon</Badge>
            <Badge className="bg-green-100 text-green-800">Trygghet</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Guardian AI System Card
function GuardianAISystemCard() {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI System Card – Verge</h3>
            <p className="text-blue-100 text-sm">Guardian portal med safe actions</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-blue-900 mb-2">🎯 Formål:</h4>
          <p className="text-gray-700 text-sm">
            Gi foresatte, rådgivere og verger trygg tilgang til klientdata – med kontrollert innsikt og "safe actions".
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-900 mb-2">🤖 Hvordan AI brukes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Viser maskerte data (KID → ****1234)</li>
            <li>• Tillater notater og forslag (delbetaling, utsettelse)</li>
            <li>• AI hjelper verge å foreslå tiltak basert på kontantstrøm</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-blue-900 mb-2">🔒 Kontroll og sikkerhet:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Tilgang via tidsbegrenset token med scopes</li>
            <li>• Ingen endringer uten brukerens godkjenning</li>
            <li>• Alle handlinger logges i AuditLog</li>
            <li>• Rate limiting og policy-guard hindrer misbruk</li>
          </ul>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
          <p className="text-sm text-cyan-800 font-medium mb-2">✨ Fordeler for verge:</p>
          <div className="space-y-1 text-xs text-cyan-700">
            <p>✅ Innsikt uten å utlevere sensitive detaljer</p>
            <p>✅ Kan støtte uten å styre</p>
            <p>✅ Trygge forslag som eier alltid må godkjenne</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Landing AI System Card
function LandingAISystemCard() {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Pengeplan 2.0</h3>
            <p className="text-purple-100 text-sm">Enterprise AI-økonomiplattform</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-purple-900 mb-2">🎯 Formål:</h4>
          <p className="text-gray-700 text-sm">
            Norges første enterprise-grade AI økonomiplattform som kombinerer brukerens kontroll, vergens støtte, AI-agentens intelligens og admins governance.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-indigo-100 border border-indigo-200 rounded-lg p-3 text-center">
            <Users className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-indigo-900">Brukerens kontroll</p>
          </div>
          <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 text-center">
            <Shield className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-blue-900">Vergens støtte</p>
          </div>
          <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 text-center">
            <Brain className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-purple-900">AI-intelligens</p>
          </div>
          <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-center">
            <Settings className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-red-900">Admin governance</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium mb-2">🏆 Enterprise compliance:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Badge className="bg-green-100 text-green-800">Norsk AI-veileder ✅</Badge>
            <Badge className="bg-blue-100 text-blue-800">EU AI Act ✅</Badge>
            <Badge className="bg-purple-100 text-purple-800">GDPR ✅</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Admin AI System Card
function AdminAISystemCard() {
  return (
    <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI System Card – Admin</h3>
            <p className="text-red-100 text-sm">Enterprise governance & compliance</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-red-900 mb-2">🎯 Formål:</h4>
          <p className="text-gray-700 text-sm">
            Sikre transparens, governance og compliance for Pengeplan 2.0 AI-systemet.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-red-900 mb-2">🤖 Hvordan AI brukes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Admin-dashboard viser AI-forslag og policy-evalueringer</li>
            <li>• Policy-motor håndhever regler (f.eks. &quot;ingen budsjettkutt &gt;20%&quot;)</li>
            <li>• Audit trail og fairness-målinger gir innsikt</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-red-900 mb-2">🔒 Kontroll og sikkerhet:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Kun ADMIN med Cerbos-rolle får tilgang</li>
            <li>• Alle policy-endringer logges og kan rulles tilbake</li>
            <li>• Oversikt over accept/reject-rates og risk heatmap</li>
            <li>• Full eksportmulighet til revisjon</li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-orange-800 font-medium mb-2">✨ Fordeler for virksomheten:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Badge className="bg-orange-100 text-orange-800">Enterprise compliance</Badge>
            <Badge className="bg-orange-100 text-orange-800">Transparens</Badge>
            <Badge className="bg-orange-100 text-orange-800">Governance</Badge>
            <Badge className="bg-orange-100 text-orange-800">Observability</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AISystemCardsShowcase() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            AI System Cards – Enterprise Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparens og compliance for Pengeplan 2.0 AI-systemet - i tråd med Norsk AI-veileder og EU AI Act
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Norsk AI-veileder
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              EU AI Act
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              GDPR
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all shadow-md ${
                activeTab === tab.key
                  ? "bg-violet-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:scale-102"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === "all" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UserAISystemCard />
              <GuardianAISystemCard />
              <LandingAISystemCard />
              <AdminAISystemCard />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {activeTab === "user" && <UserAISystemCard />}
              {activeTab === "guardian" && <GuardianAISystemCard />}
              {activeTab === "landing" && <LandingAISystemCard />}
              {activeTab === "admin" && <AdminAISystemCard />}
            </div>
          )}
        </div>

        {/* Compliance Footer */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-900 mb-2">Enterprise Compliance Status</h3>
                <p className="text-green-700 mb-4">
                  Pengeplan 2.0 oppfyller alle krav i Norsk AI-veileder og EU AI Act for høy-risiko AI-systemer
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">Human-in-the-loop ✅</Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1">Explainability ✅</Badge>
                  <Badge className="bg-purple-100 text-purple-800 px-3 py-1">Audit Trail ✅</Badge>
                  <Badge className="bg-orange-100 text-orange-800 px-3 py-1">Risk Management ✅</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Instructions */}
        <Card className="mt-6 bg-violet-50 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-6 w-6 text-violet-600 mt-1" />
              <div>
                <h4 className="font-bold text-violet-900 mb-2">Demo & Investor-tips:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-violet-700">
                  <div>
                    <p className="font-medium mb-1">For investor-demoer:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Bruk "Alle" for full oversikt</li>
                      <li>Bytt tab for å fokusere på spesifikke roller</li>
                      <li>Fremhev compliance-badges</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">For myndigheter:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Vis audit trail og governance</li>
                      <li>Demonstrer PII-maskering</li>
                      <li>Fremhev human control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

