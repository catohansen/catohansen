'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  RefreshCw
} from 'lucide-react'

interface HardcodedText {
  text: string
  file: string
  line: number
  context: string
  suggestedKey: string
}

export default function ManualTranslationHelper() {
  const [hardcodedTexts, setHardcodedTexts] = useState<HardcodedText[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedText, setSelectedText] = useState<HardcodedText | null>(null)
  const [newKey, setNewKey] = useState('')
  const [norwegianText, setNorwegianText] = useState('')
  const [englishText, setEnglishText] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    setHardcodedTexts([
      {
        text: "Gjør Økonomi Gøy for Hele Familien!",
        file: "app/landing/page.tsx",
        line: 45,
        context: "Hero section title",
        suggestedKey: "landing.hero.title"
      },
      {
        text: "Din smarte økonomiske hjelper",
        file: "app/landing/page.tsx",
        line: 52,
        context: "Hero section subtitle",
        suggestedKey: "landing.hero.subtitle"
      },
      {
        text: "Logg inn",
        file: "components/layout/PublicHeader.tsx",
        line: 23,
        context: "Login button",
        suggestedKey: "common.login"
      },
      {
        text: "Bli med på ventelisten",
        file: "components/layout/PublicHeader.tsx",
        line: 28,
        context: "Waitlist button",
        suggestedKey: "common.joinWaitlist"
      }
    ])
  }, [])

  const filteredTexts = hardcodedTexts.filter(text =>
    text.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    text.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
    text.suggestedKey.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectText = (text: HardcodedText) => {
    setSelectedText(text)
    setNewKey(text.suggestedKey)
    setNorwegianText(text.text)
    setEnglishText('') // La brukeren fylle inn engelsk oversettelse
  }

  const handleSaveTranslation = async () => {
    if (!selectedText || !newKey || !norwegianText || !englishText) {
      alert('Vennligst fyll inn alle felt')
      return
    }

    setLoading(true)
    
    try {
      // Her kan du legge til logikk for å faktisk lagre oversettelsen
      console.log('Saving translation:', {
        key: newKey,
        no: norwegianText,
        en: englishText
      })
      
      // Simuler lagring
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Fjern fra listen
      setHardcodedTexts(prev => prev.filter(t => t !== selectedText))
      setSelectedText(null)
      setNewKey('')
      setNorwegianText('')
      setEnglishText('')
      
      alert('Oversettelse lagret!')
      
    } catch (error) {
      console.error('Error saving translation:', error)
      alert('Feil ved lagring av oversettelse')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Kopiert til utklippstavle!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manuell Oversettelsesassistent
          </CardTitle>
          <CardDescription>
            Hjelp til å oversette hardkodet tekst manuelt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Søk i hardkodet tekst</Label>
              <Input
                id="search"
                placeholder="Søk etter tekst, fil eller nøkkel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Oppdater
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardkodet tekst liste */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Hardkodet tekst ({filteredTexts.length})
            </CardTitle>
            <CardDescription>
              Klikk på en tekst for å oversette den
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTexts.map((text, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedText === text 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectText(text)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">"{text.text}"</p>
                      <p className="text-xs text-gray-600 mb-1">
                        {text.file}:{text.line}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {text.context}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {text.suggestedKey}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(text.suggestedKey)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredTexts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Ingen hardkodet tekst funnet</p>
                  <p className="text-sm">Prøv å endre søketermen</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Oversettelseseditor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Oversettelseseditor
            </CardTitle>
            <CardDescription>
              {selectedText ? 'Rediger oversettelsen' : 'Velg en tekst for å oversette'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedText ? (
              <>
                <div>
                  <Label htmlFor="key">Oversettelsesnøkkel</Label>
                  <Input
                    id="key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="f.eks. landing.hero.title"
                  />
                </div>

                <div>
                  <Label htmlFor="norwegian">Norsk tekst</Label>
                  <Textarea
                    id="norwegian"
                    value={norwegianText}
                    onChange={(e) => setNorwegianText(e.target.value)}
                    placeholder="Norsk tekst..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="english">Engelsk oversettelse</Label>
                  <Textarea
                    id="english"
                    value={englishText}
                    onChange={(e) => setEnglishText(e.target.value)}
                    placeholder="English translation..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveTranslation}
                    disabled={loading || !newKey || !norwegianText || !englishText}
                    className="flex-1"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Lagre oversettelse
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedText(null)
                      setNewKey('')
                      setNorwegianText('')
                      setEnglishText('')
                    }}
                  >
                    Avbryt
                  </Button>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Husk:</strong> Legg til oversettelsen i både messages/no/common.json og messages/en/common.json
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Velg en tekst fra listen til venstre</p>
                <p className="text-sm">for å begynne oversettelsen</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for manuell oversettelse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Nøkkelnavn</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bruk beskrivende navn</li>
                <li>• Grupper med punktum (landing.hero.title)</li>
                <li>• Unngå norske tegn</li>
                <li>• Vær konsistent</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Oversettelser</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Test på begge språk</li>
                <li>• Bruk samme tone</li>
                <li>• Vær presis og klar</li>
                <li>• Sjekk kontekst</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





