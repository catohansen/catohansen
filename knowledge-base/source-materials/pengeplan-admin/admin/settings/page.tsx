'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  Zap, 
  Save, 
  RefreshCw,
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Moon,
  Sun,
  Clock,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Lock,
  Key,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Monitor,
  Laptop
} from 'lucide-react'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General Settings
    darkMode: false,
    language: 'no',
    timezone: 'Europe/Oslo',
    dateFormat: 'DD.MM.YYYY',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    securityAlerts: true,
    maintenanceAlerts: false,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Performance
    autoRefresh: true,
    refreshInterval: 30,
    cacheEnabled: true,
    analyticsEnabled: true,
    
    // Appearance
    theme: 'light',
    accentColor: 'blue',
    fontSize: 'medium',
    compactMode: false
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // Save settings logic here
    console.log('Settings saved:', settings)
  }
  
  return (
    <div className="space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <Settings className="h-10 w-10 text-violet-600" />
                    Admin Innstillinger
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">Tilpass systemet etter dine behov</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1">
                      <Settings className="h-3 w-3 mr-1" />
                      System
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1">
                      <Zap className="h-3 w-3 mr-1" />
                      Optimalisert
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={saveSettings}
                    className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lagre alle
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tilbakestill
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <TabsTrigger value="general" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Generelt
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                <Bell className="h-4 w-4 mr-2" />
                Varsler
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Sikkerhet
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
                <Zap className="h-4 w-4 mr-2" />
                Ytelse
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <Palette className="h-4 w-4 mr-2" />
                Utseende
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Språk og Region
                    </CardTitle>
                    <CardDescription>Innstillinger for språk og tidsone</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="language">Språk</Label>
                      <select 
                        id="language"
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="no">Norsk (Bokmål)</option>
                        <option value="en">English</option>
                        <option value="sv">Svenska</option>
                        <option value="da">Dansk</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Tidsone</Label>
                      <select 
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Europe/Oslo">Europa/Oslo (GMT+1)</option>
                        <option value="Europe/Stockholm">Europa/Stockholm (GMT+1)</option>
                        <option value="Europe/Copenhagen">Europa/København (GMT+1)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Datoformat</Label>
                      <select 
                        id="dateFormat"
                        value={settings.dateFormat}
                        onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-purple-600" />
                      System
                    </CardTitle>
                    <CardDescription>Grunnleggende systeminnstillinger</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {settings.darkMode ? <Moon className="h-5 w-5 text-blue-600" /> : <Sun className="h-5 w-5 text-yellow-600" />}
                        <div>
                          <p className="font-medium">Mørk modus</p>
                          <p className="text-sm text-gray-600">Aktiver mørk tema</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Auto-oppdatering</p>
                          <p className="text-sm text-gray-600">Automatisk oppdatering av data</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.autoRefresh}
                        onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Kompakt modus</p>
                          <p className="text-sm text-gray-600">Mindre plass mellom elementer</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.compactMode}
                        onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-green-600" />
                    Varslingsinnstillinger
                  </CardTitle>
                  <CardDescription>Kontroller hvordan du mottar varsler</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">E-post varsler</p>
                          <p className="text-sm text-gray-600">Motta viktige varsler på e-post</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Push-varsler</p>
                          <p className="text-sm text-gray-600">Motta varsler i nettleseren</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Systemvarsler</p>
                          <p className="text-sm text-gray-600">Varsler om systemstatus</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.systemAlerts}
                        onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">Sikkerhetsvarsler</p>
                          <p className="text-sm text-gray-600">Varsler om sikkerhetshendelser</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.securityAlerts}
                        onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Vedlikeholdsvarsler</p>
                          <p className="text-sm text-gray-600">Varsler om planlagt vedlikehold</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.maintenanceAlerts}
                        onCheckedChange={(checked) => handleSettingChange('maintenanceAlerts', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Sikkerhetsinnstillinger
                  </CardTitle>
                  <CardDescription>Administrer kontosikkerhet og tilgang</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">To-faktor autentisering</p>
                          <p className="text-sm text-gray-600">Ekstra sikkerhet for innlogging</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Aktivert</Badge>
                        <Button variant="outline" size="sm">Konfigurer</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Sesjonstimeout</p>
                          <p className="text-sm text-gray-600">Automatisk utlogging etter inaktivitet</p>
                        </div>
                      </div>
                      <select 
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={15}>15 minutter</option>
                        <option value={30}>30 minutter</option>
                        <option value={60}>1 time</option>
                        <option value={120}>2 timer</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">Passordutløp</p>
                          <p className="text-sm text-gray-600">Tving passordendring etter antall dager</p>
                        </div>
                      </div>
                      <select 
                        value={settings.passwordExpiry}
                        onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={30}>30 dager</option>
                        <option value={60}>60 dager</option>
                        <option value={90}>90 dager</option>
                        <option value={180}>180 dager</option>
                        <option value={365}>1 år</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Maks innloggingsforsøk</p>
                          <p className="text-sm text-gray-600">Antall feilede forsøk før låsing</p>
                        </div>
                      </div>
                      <select 
                        value={settings.loginAttempts}
                        onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={3}>3 forsøk</option>
                        <option value={5}>5 forsøk</option>
                        <option value={10}>10 forsøk</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Settings */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Ytelsesinnstillinger
                  </CardTitle>
                  <CardDescription>Optimaliser systemytelse</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Auto-oppdatering</p>
                          <p className="text-sm text-gray-600">Automatisk oppdatering av data</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.autoRefresh}
                        onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Cache</p>
                          <p className="text-sm text-gray-600">Aktiver datacache for raskere lasting</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.cacheEnabled}
                        onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Analytics</p>
                          <p className="text-sm text-gray-600">Samle bruksstatistikk</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings.analyticsEnabled}
                        onCheckedChange={(checked) => handleSettingChange('analyticsEnabled', checked)}
                      />
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium">Oppdateringsintervall</p>
                          <p className="text-sm text-gray-600">Hvor ofte data skal oppdateres</p>
                        </div>
                      </div>
                      <select 
                        value={settings.refreshInterval}
                        onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={10}>10 sekunder</option>
                        <option value={30}>30 sekunder</option>
                        <option value={60}>1 minutt</option>
                        <option value={300}>5 minutter</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    Utseende
                  </CardTitle>
                  <CardDescription>Tilpass systemets utseende</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Label className="text-base font-medium">Tema</Label>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                          { value: 'light', label: 'Lys', icon: Sun },
                          { value: 'dark', label: 'Mørk', icon: Moon },
                          { value: 'auto', label: 'Auto', icon: Monitor }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => handleSettingChange('theme', theme.value)}
                            className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                              settings.theme === theme.value 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <theme.icon className="h-5 w-5" />
                            <span className="text-sm">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Label className="text-base font-medium">Accent-farge</Label>
                      <div className="grid grid-cols-6 gap-3 mt-3">
                        {[
                          { value: 'blue', color: 'bg-blue-500' },
                          { value: 'green', color: 'bg-green-500' },
                          { value: 'purple', color: 'bg-purple-500' },
                          { value: 'red', color: 'bg-red-500' },
                          { value: 'orange', color: 'bg-orange-500' },
                          { value: 'pink', color: 'bg-pink-500' }
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleSettingChange('accentColor', color.value)}
                            className={`w-8 h-8 rounded-full ${color.color} ${
                              settings.accentColor === color.value 
                                ? 'ring-2 ring-offset-2 ring-gray-400' 
                                : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <Label className="text-base font-medium">Skriftstørrelse</Label>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                          { value: 'small', label: 'Liten' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'large', label: 'Stor' }
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() => handleSettingChange('fontSize', size.value)}
                            className={`p-3 border rounded-lg ${
                              settings.fontSize === size.value 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
  )
}