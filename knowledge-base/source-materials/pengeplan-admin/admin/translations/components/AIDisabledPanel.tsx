'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle, 
  Settings, 
  Globe, 
  FileText, 
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import ManualTranslationHelper from './ManualTranslationHelper'

export default function AIDisabledPanel() {
  const [isAIDisabled, setIsAIDisabled] = useState(true)
  const [manualMode, setManualMode] = useState(true)

  const handleToggleAI = () => {
    setIsAIDisabled(!isAIDisabled)
    // Her kan du legge til logikk for å faktisk deaktivere AI
    console.log('AI disabled:', !isAIDisabled)
  }

  const handleToggleManual = () => {
    setManualMode(!manualMode)
    console.log('Manual mode:', !manualMode)
  }

  return (
    <div className="space-y-6">
      {/* AI Status Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>AI-funksjoner midlertidig deaktivert</strong> - Vi jobber med å fikse AI-oversettelsene. 
          Bruk manuell oversettelse inntil videre.
        </AlertDescription>
      </Alert>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI & Oversettelseskontroll
          </CardTitle>
          <CardDescription>
            Kontroller AI-funksjoner og oversettelsesmodus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {isAIDisabled ? (
                <XCircle className="h-6 w-6 text-red-500" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
              <div>
                <p className="font-medium">AI-oversettelser</p>
                <p className="text-sm text-gray-600">
                  {isAIDisabled ? 'Deaktivert' : 'Aktivert'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggleAI}
              variant={isAIDisabled ? "outline" : "default"}
              className={isAIDisabled ? "border-red-200 text-red-700 hover:bg-red-50" : ""}
            >
              {isAIDisabled ? 'Aktiver AI' : 'Deaktiver AI'}
            </Button>
          </div>

          {/* Manual Mode */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {manualMode ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-gray-400" />
              )}
              <div>
                <p className="font-medium">Manuell oversettelse</p>
                <p className="text-sm text-gray-600">
                  {manualMode ? 'Aktivert' : 'Deaktivert'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleToggleManual}
              variant={manualMode ? "default" : "outline"}
            >
              {manualMode ? 'Deaktiver' : 'Aktiver'}
            </Button>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Oversettelsesmodus</span>
              </div>
              <Badge variant={manualMode ? "default" : "secondary"}>
                {manualMode ? 'Manuell' : 'Automatisk'}
              </Badge>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="font-medium">AI-status</span>
              </div>
              <Badge variant={isAIDisabled ? "destructive" : "default"}>
                {isAIDisabled ? 'Deaktivert' : 'Aktivert'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Translation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manuell Oversettelsesguide
          </CardTitle>
          <CardDescription>
            Slik oversetter du manuelt inntil AI-en er fikset
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Finn hardkodet tekst</p>
                <p className="text-sm text-gray-600">
                  Se etter tekst som ikke bruker t() funksjonen
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                  "Gjør Økonomi Gøy" → t('landing.hero.title')
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Legg til nøkkel i JSON</p>
                <p className="text-sm text-gray-600">
                  Legg til oversettelsen i messages/no/common.json og messages/en/common.json
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                  "landing.hero.title": "Gjør Økonomi"
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Test oversettelsen</p>
                <p className="text-sm text-gray-600">
                  Bytt språk i language selector og sjekk at det fungerer
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Tips for manuell oversettelse</p>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Bruk beskrivende nøkkelnavn (f.eks. landing.hero.title)</li>
                  <li>• Grupper relaterte nøkler (f.eks. landing.*)</li>
                  <li>• Test alltid på begge språk</li>
                  <li>• Bruk konsistent terminologi</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hurtighandlinger</CardTitle>
          <CardDescription>
            Nyttige verktøy for manuell oversettelse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4" />
                <span className="font-medium">Skan for hardkodet tekst</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Finn alle steder som trenger oversettelse
              </span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Valider oversettelser</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Sjekk for manglende oversettelser
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Translation Helper */}
      <ManualTranslationHelper />
    </div>
  )
}
