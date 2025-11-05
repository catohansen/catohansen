'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PPSection } from '@/components/ui/PPSection'

interface SystemSettings {
  openai: {
    apiKey: string
    model: string
    maxTokens: number
    temperature: number
  }
  email: {
    provider: string
    apiKey: string
    fromAddress: string
  }
  sms: {
    provider: string
    apiKey: string
    fromNumber: string
  }
  cron: {
    signingSecret: string
  }
  security: {
    sessionSecret: string
    encryptionKey: string
  }
  features: {
    maintenanceMode: boolean
    registrationOpen: boolean
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [activeTab, setActiveTab] = useState('api-keys')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        console.error('Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    try {
      setIsSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })

      if (response.ok) {
        setSaveMessage('✅ Innstillinger lagret')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        const error = await response.json()
        setSaveMessage(`❌ Feil: ${error.error}`)
      }
    } catch (error) {
      setSaveMessage(`❌ Feil: ${error}`)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (path: string, value: unknown) => {
    if (!settings) return
    
    const keys = path.split('.')
    const newSettings = { ...settings }
    let current: unknown = newSettings
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (key) {
        current = (current as any)[key]
      }
    }
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      if (lastKey) {
        (current as any)[lastKey] = value
      }
    }
    
    setSettings(newSettings)
  }

  const testOpenAI = async () => {
    try {
      const response = await fetch('/api/admin/test-openai', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (response.ok) {
        setSaveMessage('✅ OpenAI API test OK')
      } else {
        setSaveMessage(`❌ OpenAI test feilet: ${result.error}`)
      }
    } catch (error) {
      setSaveMessage(`❌ OpenAI test feilet: ${error}`)
    }
  }

  const tabs = [
    { id: 'api-keys', name: 'API Nøkler', icon: '🔑' },
    { id: 'notifications', name: 'Varsler', icon: '📧' },
    { id: 'security', name: 'Sikkerhet', icon: '🔒' },
    { id: 'features', name: 'Funksjoner', icon: '⚙️' }
  ]

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Kunne ikke laste innstillinger</p>
          <Button onClick={fetchSettings} className="mt-4">
            Prøv igjen
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-pp-dark">System Innstillinger</h1>
          <p className="text-gray-600 mt-2">
            Administrer API nøkler, varsler og systemkonfigurasjon
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {saveMessage && (
            <span className="text-sm">{saveMessage}</span>
          )}
          <Button 
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-pp-purple hover:bg-pp-purple-dark text-white"
          >
            {isSaving ? 'Lagrer...' : 'Lagre Endringer'}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-pp-purple text-white border-b-2 border-pp-purple'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <PPSection title="OpenAI / ChatGPT">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="openai-key">API Nøkkel</Label>
                <div className="flex space-x-2">
                  <Input
                    id="openai-key"
                    type="password"
                    value={settings.openai.apiKey}
                    onChange={(e) => updateSetting('openai.apiKey', e.target.value)}
                    placeholder="sk-..."
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={testOpenAI}
                    variant="outline"
                    size="sm"
                  >
                    Test
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hent fra <a href="https://platform.openai.com/api-keys" target="_blank" className="text-pp-purple hover:underline">OpenAI Platform</a>
                </p>
              </div>
              
              <div>
                <Label htmlFor="openai-model">Modell</Label>
                <select
                  id="openai-model"
                  value={settings.openai.model}
                  onChange={(e) => updateSetting('openai.model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="openai-tokens">Max Tokens</Label>
                <Input
                  id="openai-tokens"
                  type="number"
                  value={settings.openai.maxTokens}
                  onChange={(e) => updateSetting('openai.maxTokens', parseInt(e.target.value))}
                  min="100"
                  max="4000"
                />
              </div>
              
              <div>
                <Label htmlFor="openai-temp">Temperature</Label>
                <Input
                  id="openai-temp"
                  type="number"
                  step="0.1"
                  value={settings.openai.temperature}
                  onChange={(e) => updateSetting('openai.temperature', parseFloat(e.target.value))}
                  min="0"
                  max="2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  0 = deterministisk, 1 = balansert, 2 = kreativ
                </p>
              </div>
            </div>
          </PPSection>

          <PPSection title="Cron & Automation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cron-secret">Cron Signing Secret</Label>
                <Input
                  id="cron-secret"
                  type="password"
                  value={settings.cron.signingSecret}
                  onChange={(e) => updateSetting('cron.signingSecret', e.target.value)}
                  placeholder="Generer en sterk hemmelighet..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Brukes for å sikre automatiske cron jobs
                </p>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    const secret = crypto.randomUUID() + '-' + Date.now()
                    updateSetting('cron.signingSecret', secret)
                  }}
                  variant="outline"
                >
                  Generer Ny Secret
                </Button>
              </div>
            </div>
          </PPSection>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <PPSection title="E-post Varsler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email-provider">Provider</Label>
                <select
                  id="email-provider"
                  value={settings.email.provider}
                  onChange={(e) => updateSetting('email.provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="sendgrid">SendGrid</option>
                  <option value="postmark">Postmark</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="smtp">SMTP</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="email-key">API Nøkkel</Label>
                <Input
                  id="email-key"
                  type="password"
                  value={settings.email.apiKey}
                  onChange={(e) => updateSetting('email.apiKey', e.target.value)}
                  placeholder="API nøkkel..."
                />
              </div>
              
              <div>
                <Label htmlFor="email-from">Fra Adresse</Label>
                <Input
                  id="email-from"
                  type="email"
                  value={settings.email.fromAddress}
                  onChange={(e) => updateSetting('email.fromAddress', e.target.value)}
                  placeholder="noreply@pengeplan.no"
                />
              </div>
            </div>
          </PPSection>

          <PPSection title="SMS Varsler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sms-provider">Provider</Label>
                <select
                  id="sms-provider"
                  value={settings.sms.provider}
                  onChange={(e) => updateSetting('sms.provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="twilio">Twilio</option>
                  <option value="link-mobility">Link Mobility</option>
                  <option value="pswin">PSWinCom</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="sms-key">API Nøkkel</Label>
                <Input
                  id="sms-key"
                  type="password"
                  value={settings.sms.apiKey}
                  onChange={(e) => updateSetting('sms.apiKey', e.target.value)}
                  placeholder="API nøkkel..."
                />
              </div>
              
              <div>
                <Label htmlFor="sms-from">Fra Nummer</Label>
                <Input
                  id="sms-from"
                  value={settings.sms.fromNumber}
                  onChange={(e) => updateSetting('sms.fromNumber', e.target.value)}
                  placeholder="+4712345678"
                />
              </div>
            </div>
          </PPSection>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <PPSection title="Sikkerhet & Kryptering">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="session-secret">Session Secret</Label>
                <Input
                  id="session-secret"
                  type="password"
                  value={settings.security.sessionSecret}
                  onChange={(e) => updateSetting('security.sessionSecret', e.target.value)}
                  placeholder="Sterk hemmelighet for sessions..."
                  className="font-mono text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="encryption-key">Encryption Key</Label>
                <Input
                  id="encryption-key"
                  type="password"
                  value={settings.security.encryptionKey}
                  onChange={(e) => updateSetting('security.encryptionKey', e.target.value)}
                  placeholder="32-byte nøkkel for kryptering..."
                  className="font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-medium">Sikkerhetsmerknad</p>
                  <p className="text-yellow-700 text-sm">
                    Endring av disse nøklene vil ugyldiggjøre eksisterende sessions og krypterte data.
                    Vær forsiktig i produksjon.
                  </p>
                </div>
              </div>
            </div>
          </PPSection>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <PPSection title="System Funksjoner">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Vedlikeholdsmodus</h4>
                  <p className="text-sm text-gray-600">
                    Steng systemet for vedlikehold (kun admin tilgang)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.features.maintenanceMode}
                    onChange={(e) => updateSetting('features.maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pp-purple"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Åpen Registrering</h4>
                  <p className="text-sm text-gray-600">
                    Tillat nye brukere å registrere seg
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.features.registrationOpen}
                    onChange={(e) => updateSetting('features.registrationOpen', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pp-purple"></div>
                </label>
              </div>
            </div>
          </PPSection>
        </div>
      )}
    </div>
  )
}

