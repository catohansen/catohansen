'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EnhancedTabs, TabsContent } from '@/components/ui/EnhancedTabs'
import { EnhancedToggle, StatusToggle, PriorityToggle } from '@/components/ui/EnhancedToggle'
import { 
  Settings, 
  BarChart3, 
  Users, 
  Shield, 
  Database,
  Mail,
  FileText,
  Activity,
  Server,
  Brain,
  DollarSign,
  Zap,
  Star,
  Heart,
  Target
} from 'lucide-react'

export default function ToggleDemoPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [status, setStatus] = useState<boolean>(true)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedOption, setSelectedOption] = useState('option1')

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎨 Flotte Toggle Komponenter
          </h1>
          <p className="text-gray-600">
            Oppgradert design med flotte farger og animasjoner
          </p>
        </div>

        {/* Enhanced Tabs Demo */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Enhanced Tabs - Forskjellige farger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              tabs={[
                { 
                  value: 'overview', 
                  label: 'Oversikt', 
                  icon: <BarChart3 className="h-4 w-4" />, 
                  color: 'blue' 
                },
                { 
                  value: 'users', 
                  label: 'Brukere', 
                  icon: <Users className="h-4 w-4" />, 
                  color: 'purple' 
                },
                { 
                  value: 'ai', 
                  label: 'AI Analytics', 
                  icon: <Brain className="h-4 w-4" />, 
                  color: 'violet' 
                },
                { 
                  value: 'financial', 
                  label: 'Økonomi', 
                  icon: <DollarSign className="h-4 w-4" />, 
                  color: 'green' 
                },
                { 
                  value: 'system', 
                  label: 'System', 
                  icon: <Server className="h-4 w-4" />, 
                  color: 'orange' 
                }
              ]}
            >
              <TabsContent value="overview" className="mt-6">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Oversikt</h3>
                  <p className="text-gray-600">Blå farge for oversikt og statistikk</p>
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="mt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Brukere</h3>
                  <p className="text-gray-600">Lilla farge for brukeradministrasjon</p>
                </div>
              </TabsContent>
              
              <TabsContent value="ai" className="mt-6">
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-violet-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analytics</h3>
                  <p className="text-gray-600">Violet farge for AI-funksjoner</p>
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="mt-6">
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Økonomi</h3>
                  <p className="text-gray-600">Grønn farge for økonomiske data</p>
                </div>
              </TabsContent>
              
              <TabsContent value="system" className="mt-6">
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">System</h3>
                  <p className="text-gray-600">Oransje farge for systemstatus</p>
                </div>
              </TabsContent>
            </EnhancedTabs>
          </CardContent>
        </Card>

        {/* Enhanced Toggle Demos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Toggle */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Status Toggle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-3">Grønn for aktiv, rød for inaktiv</p>
                <StatusToggle 
                  value={status} 
                  onChange={setStatus}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Valgt: <span className="font-medium">{status ? 'Aktiv' : 'Inaktiv'}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Priority Toggle */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Priority Toggle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-3">Grønn (lav), oransje (medium), rød (høy)</p>
                <PriorityToggle 
                  value={priority} 
                  onChange={setPriority}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Valgt: <span className="font-medium">
                    {priority === 'low' ? 'Lav' : priority === 'medium' ? 'Medium' : 'Høy'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Toggle */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-pink-600" />
                Custom Toggle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-3">Tilpassede farger og ikoner</p>
                <EnhancedToggle
                  options={[
                    { value: 'option1', label: 'Alternativ 1', icon: <Heart className="h-4 w-4" />, color: 'pink' },
                    { value: 'option2', label: 'Alternativ 2', icon: <Star className="h-4 w-4" />, color: 'emerald' },
                    { value: 'option3', label: 'Alternativ 3', icon: <Zap className="h-4 w-4" />, color: 'violet' }
                  ]}
                  value={selectedOption}
                  onChange={setSelectedOption}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Valgt: <span className="font-medium">{selectedOption}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Size Variants */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Størrelse Variants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-3">Små, medium og store toggles</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Small</p>
                    <EnhancedToggle
                      options={[
                        { value: 's1', label: 'S1', color: 'blue' },
                        { value: 's2', label: 'S2', color: 'purple' }
                      ]}
                      value="s1"
                      onChange={() => {}}
                      size="sm"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Medium</p>
                    <EnhancedToggle
                      options={[
                        { value: 'm1', label: 'Medium 1', color: 'green' },
                        { value: 'm2', label: 'Medium 2', color: 'orange' }
                      ]}
                      value="m1"
                      onChange={() => {}}
                      size="md"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Large</p>
                    <EnhancedToggle
                      options={[
                        { value: 'l1', label: 'Large Option 1', color: 'red' },
                        { value: 'l2', label: 'Large Option 2', color: 'violet' }
                      ]}
                      value="l1"
                      onChange={() => {}}
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Color Showcase */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Fargepalett Showcase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['blue', 'purple', 'green', 'orange', 'red', 'violet', 'pink', 'emerald'].map((color) => (
                <div key={color} className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2 capitalize">{color}</p>
                  <EnhancedToggle
                    options={[
                      { value: `${color}1`, label: 'A', color: color as any },
                      { value: `${color}2`, label: 'B', color: color as any }
                    ]}
                    value={`${color}1`}
                    onChange={() => {}}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


