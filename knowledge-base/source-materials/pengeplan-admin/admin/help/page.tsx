'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  ExternalLink, 
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Settings,
  Shield,
  Database,
  Zap,
  Globe,
  FileText,
  Video,
  Download,
  Star,
  Heart
} from 'lucide-react'

export default function AdminHelp() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Kom i gang',
      icon: <Zap className="h-5 w-5" />,
      items: [
        { title: 'Første gang som admin', description: 'Hvordan sette opp admin-konto', link: '#' },
        { title: 'Navigasjon i admin-panelet', description: 'Lær å navigere i systemet', link: '#' },
        { title: 'Brukerhåndtering', description: 'Administrer brukere og roller', link: '#' },
        { title: 'Sikkerhetsinnstillinger', description: 'Konfigurer sikkerhet', link: '#' }
      ]
    },
    {
      id: 'user-management',
      title: 'Brukerhåndtering',
      icon: <User className="h-5 w-5" />,
      items: [
        { title: 'Opprette nye brukere', description: 'Legg til nye brukere i systemet', link: '#' },
        { title: 'Endre brukerroller', description: 'Administrer tilgangsrettigheter', link: '#' },
        { title: 'Slette brukere', description: 'Fjern brukere fra systemet', link: '#' },
        { title: 'Bulk-operasjoner', description: 'Masseendringer av brukere', link: '#' }
      ]
    },
    {
      id: 'system-settings',
      title: 'Systeminnstillinger',
      icon: <Settings className="h-5 w-5" />,
      items: [
        { title: 'Generelle innstillinger', description: 'Konfigurer systemet', link: '#' },
        { title: 'E-post konfigurasjon', description: 'Sett opp e-post tjenester', link: '#' },
        { title: 'Database backup', description: 'Sikkerhetskopier data', link: '#' },
        { title: 'Logg og overvåkning', description: 'Overvåk systemaktivitet', link: '#' }
      ]
    },
    {
      id: 'security',
      title: 'Sikkerhet',
      icon: <Shield className="h-5 w-5" />,
      items: [
        { title: 'To-faktor autentisering', description: 'Aktiver 2FA for brukere', link: '#' },
        { title: 'Sesjonshåndtering', description: 'Administrer brukersesjoner', link: '#' },
        { title: 'IP-restriksjoner', description: 'Begrens tilgang basert på IP', link: '#' },
        { title: 'Audit logging', description: 'Spor alle systemhendelser', link: '#' }
      ]
    }
  ]

  const faqs = [
    {
      question: 'Hvordan oppretter jeg en ny admin-bruker?',
      answer: 'Gå til Brukerhåndtering → Ny bruker → Velg rolle "ADMIN" og fyll ut nødvendig informasjon.',
      category: 'Brukerhåndtering'
    },
    {
      question: 'Kan jeg endre tilgangsrettigheter for admin-brukere?',
      answer: 'Ja, som super admin kan du kontrollere hva hver admin-bruker kan se og gjøre i systemet.',
      category: 'Sikkerhet'
    },
    {
      question: 'Hvordan aktiverer jeg to-faktor autentisering?',
      answer: 'Gå til Sikkerhet → To-faktor autentisering → Aktiver for ønskede brukere.',
      category: 'Sikkerhet'
    },
    {
      question: 'Hvor finner jeg systemlogger?',
      answer: 'Gå til System → Logg og overvåkning for å se alle systemhendelser.',
      category: 'System'
    }
  ]

  const filteredSections = helpSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-20 top-40 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute -right-32 -top-20 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute right-16 top-60 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="container mx-auto space-y-6">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                    <HelpCircle className="h-10 w-10 text-violet-600" />
                    Admin Hjelp & Support
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">Få hjelp med admin-funksjoner og systemadministrasjon</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1">
                      <Book className="h-3 w-3 mr-1" />
                      Dokumentasjon
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Live Support
                    </Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Oppdatert
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Kontakt Support
                  </Button>
                  <Button variant="outline" className="border-2 border-gray-300 hover:border-violet-500 hover:bg-violet-50">
                    <Download className="h-4 w-4 mr-2" />
                    Last ned guide
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-blue-600/5 to-purple-600/5 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Søk i hjelp og dokumentasjon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  />
                </div>
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Tøm søk
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Få umiddelbar hjelp</p>
                <Button size="sm" className="w-full">Start chat</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Ring Support</h3>
                <p className="text-sm text-gray-600 mb-4">+47 123 45 678</p>
                <Button size="sm" variant="outline" className="w-full">Ring nå</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">E-post Support</h3>
                <p className="text-sm text-gray-600 mb-4">support@pengeplan.no</p>
                <Button size="sm" variant="outline" className="w-full">Send e-post</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Video Guide</h3>
                <p className="text-sm text-gray-600 mb-4">Se hvordan det gjøres</p>
                <Button size="sm" variant="outline" className="w-full">Se videoer</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <Book className="h-4 w-4 mr-2" />
                Oversikt
              </TabsTrigger>
              <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="guides" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Guider
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Kontakt
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSections.map((section) => (
                  <Card key={section.id} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {section.icon}
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {section.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    Ofte stilte spørsmål
                  </CardTitle>
                  <CardDescription>Finn svar på de vanligste spørsmålene</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                            <p className="text-gray-600 mb-3">{faq.answer}</p>
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Admin oppsett guide', description: 'Komplett guide for å sette opp admin-konto', icon: <Settings className="h-6 w-6" />, duration: '15 min' },
                  { title: 'Brukerhåndtering', description: 'Hvordan administrere brukere effektivt', icon: <User className="h-6 w-6" />, duration: '20 min' },
                  { title: 'Sikkerhetskonfigurasjon', description: 'Sett opp sikkerhet og tilgangskontroll', icon: <Shield className="h-6 w-6" />, duration: '25 min' },
                  { title: 'Database administrasjon', description: 'Administrer database og backup', icon: <Database className="h-6 w-6" />, duration: '30 min' },
                  { title: 'System overvåkning', description: 'Overvåk systemytelse og aktivitet', icon: <Globe className="h-6 w-6" />, duration: '20 min' },
                  { title: 'Troubleshooting', description: 'Løs vanlige problemer og feil', icon: <AlertCircle className="h-6 w-6" />, duration: '35 min' }
                ].map((guide, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                          {guide.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{guide.title}</h3>
                          <p className="text-sm text-gray-600">{guide.duration}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <Button size="sm" className="w-full">
                          Start guide
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      Kontakt oss
                    </CardTitle>
                    <CardDescription>Få hjelp fra vårt support-team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Telefon</p>
                        <p className="text-sm text-gray-600">+47 123 45 678</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">E-post</p>
                        <p className="text-sm text-gray-600">support@pengeplan.no</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Åpningstider</p>
                        <p className="text-sm text-gray-600">Man-fre: 08:00-17:00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      Vi hjelper deg
                    </CardTitle>
                    <CardDescription>Vårt team er her for å hjelpe deg</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">24/7 support tilgjengelig</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Rask respons (under 1 time)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Eksperter på Pengeplan 2.0</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Personlig oppfølging</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
