'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2,
  Target,
  Calendar,
  Settings
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { AdminCard } from '@/components/admin/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface ProgressPlan {
  id: string
  name: string
  description?: string
  type: string
  status: string
  targetDate?: string
  priority: number
  isDefault: boolean
  steps: ProgressStep[]
  createdAt: string
  updatedAt: string
}

interface ProgressStep {
  id: string
  title: string
  description?: string
  status: string
  order: number
  dueDate?: string
  completedAt?: string
}

export default function ProgressPlansAdminPage() {
  const [plans, setPlans] = useState<ProgressPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  // const [editingPlan] = useState<ProgressPlan | null>(null)
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    type: 'budget',
    targetDate: '',
    priority: 1,
    isDefault: false,
    steps: [] as Record<string, unknown>[]
  })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const response = await fetch('/api/admin/progress-plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async () => {
    try {
      const response = await fetch('/api/admin/progress-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlan),
      })

      if (response.ok) {
        setNewPlan({
          name: '',
          description: '',
          type: 'budget',
          targetDate: '',
          priority: 1,
          isDefault: false,
          steps: []
        })
        setShowCreateForm(false)
        loadPlans()
      }
    } catch (error) {
      console.error('Error creating plan:', error)
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Er du sikker på at du vil slette denne planen?')) return

    try {
      const response = await fetch(`/api/admin/progress-plans/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadPlans()
      }
    } catch (error) {
      console.error('Error deleting plan:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'budget': return 'bg-blue-100 text-blue-800'
      case 'debt': return 'bg-red-100 text-red-800'
      case 'savings': return 'bg-green-100 text-green-800'
      case 'crisis': return 'bg-orange-100 text-orange-800'
      case 'custom': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminPageLayout 
      title="🎯 Fremgangsplaner" 
      description="Administrer og konfigurer brukeres fremgangsplaner"
      headerColor="green"
    >
      {/* Create Plan Button */}
      <AdminCard color="white" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Planadministrasjon</h2>
            <p className="text-gray-600">Opprett og administrer maler for brukeres fremgangsplaner</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Ny plan
          </Button>
        </div>
      </AdminCard>

      {/* Create Form */}
      {showCreateForm && (
        <AdminCard title="Opprett ny fremgangsplan" color="white">
          <p className="text-gray-600 mb-6">Lag en ny mal for brukeres fremgangsplaner</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Navn
                </label>
                <Input
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="F.eks. Budsjettplan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="budget">Budsjett</option>
                  <option value="debt">Gjeld</option>
                  <option value="savings">Sparing</option>
                  <option value="crisis">Krise</option>
                  <option value="custom">Tilpasset</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beskrivelse
              </label>
              <Input
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="Beskrivelse av planen"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Måldato (valgfritt)
                </label>
                <Input
                  type="date"
                  value={newPlan.targetDate}
                  onChange={(e) => setNewPlan({ ...newPlan, targetDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioritet (1-5)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={newPlan.priority}
                  onChange={(e) => setNewPlan({ ...newPlan, priority: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newPlan.isDefault}
                onChange={(e) => setNewPlan({ ...newPlan, isDefault: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                Standard plan
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePlan} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Opprett plan
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Avbryt
              </Button>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <AdminCard key={plan.id} color="white" hover={true}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(plan.type)}>
                    {plan.type}
                  </Badge>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                  {plan.isDefault && (
                    <Badge className="bg-violet-100 text-violet-800">
                      Standard
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {plan.steps?.length || 0} steg
                  </div>
                  {plan.targetDate && (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      Måldato: {new Date(plan.targetDate).toLocaleDateString('nb-NO')}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Settings className="h-4 w-4" />
                    Prioritet: {plan.priority}/5
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {plans.length === 0 && (
        <AdminCard color="white">
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ingen fremgangsplaner
            </h3>
            <p className="text-gray-600 mb-4">
              Opprett din første fremgangsplan for å komme i gang
            </p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Opprett plan
            </Button>
          </div>
        </AdminCard>
      )}
    </AdminPageLayout>
  )
}