'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Brain,
  Heart,
  Target,
  Sparkles,
  Users,
  BarChart3
} from 'lucide-react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Module {
  id: string
  key: string
  name: string
  description: string
  category: string
  theme: string
  price: number
  currency: string
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const moduleIcons = {
  'nlp_coach': Brain,
  'psychology_coach': Heart,
  'classic_coach': Target,
  'gamification': Sparkles,
  'social_features': Users,
  'analytics': BarChart3
}

const themeColors = {
  nlp: 'bg-purple-100 text-purple-800',
  psychology: 'bg-pink-100 text-pink-800',
  classic: 'bg-blue-100 text-blue-800'
}

export default function ModuleAdmin() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  // const [editingModule] = useState<Module | null>(null)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules')
      const data = await response.json()
      setModules(data.modules || [])
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const createModule = async (moduleData: Partial<Module>) => {
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      })
      
      if (response.ok) {
        await fetchModules()
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Error creating module:', error)
    }
  }

  const toggleModuleStatus = async (moduleId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      })
      
      if (response.ok) {
        await fetchModules()
      }
    } catch (error) {
      console.error('Error updating module:', error)
    }
  }

  const getModuleIcon = (key: string) => {
    const Icon = moduleIcons[key as keyof typeof moduleIcons] || Target
    return <Icon className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Tilgjengelige moduler ({modules.length})
          </h2>
          <p className="text-gray-600">
            Administrer moduler som brukere kan kjøpe
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ny modul
        </Button>
      </div>

      {/* Create Module Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Opprett ny modul</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateModuleForm 
              onSubmit={createModule}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = getModuleIcon(module.key)
          const themeColor = themeColors[module.theme as keyof typeof themeColors] || themeColors.classic

          return (
            <Card key={module.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {Icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <Badge className={themeColor}>
                        {module.theme}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleModuleStatus(module.id, !module.isActive)}
                    >
                      {module.isActive ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {module.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pris:</span>
                    <span className="font-semibold">{module.price} {module.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Kategori:</span>
                    <span>{module.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <Badge className={module.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {module.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Funksjoner:</h4>
                  <div className="space-y-1">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        • {feature}
                      </div>
                    ))}
                    {module.features.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{module.features.length - 3} flere...
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function CreateModuleForm({ onSubmit, onCancel }: { 
  onSubmit: (data: Partial<Module>) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    category: 'coaching',
    theme: 'nlp',
    price: 0,
    features: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modul-nøkkel
          </label>
          <Input
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="nlp_coach"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Navn
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="NLP Coach Module"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beskrivelse
        </label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Avansert NLP-basert coaching..."
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="coaching">Coaching</option>
            <option value="gamification">Gamification</option>
            <option value="social">Sosial</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tema
          </label>
          <select
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="nlp">NLP</option>
            <option value="psychology">Psykologi</option>
            <option value="classic">Klassisk</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pris (NOK)
          </label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="299"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
          Opprett modul
        </Button>
      </div>
    </form>
  )
}














