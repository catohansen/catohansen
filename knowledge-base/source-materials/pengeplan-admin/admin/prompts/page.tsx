'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  History,
  BarChart3,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface Prompt {
  id: string
  name: string
  description: string
  category: string
  prompt_text: string
  rules: any
  version: number
  is_active: boolean
  updated_by: string
  updated_at: string
  created_at: string
  updatedBy?: {
    id: string
    name: string
    email: string
  }
}

interface PromptStats {
  totalPrompts: number
  activePrompts: number
  inactivePrompts: number
  mostUsed: Prompt[]
  recentUpdates: Prompt[]
}

export default function AdminPrompts() {
  const [mounted, setMounted] = useState(false)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [stats, setStats] = useState<PromptStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const categories = [
    { value: 'all', label: 'Alle kategorier' },
    { value: 'chat', label: 'Chat' },
    { value: 'document', label: 'Dokument' },
    { value: 'policy', label: 'Policy' },
    { value: 'voice', label: 'Stemme' },
    { value: 'system', label: 'System' },
    { value: 'nav', label: 'NAV' },
    { value: 'economic', label: 'Økonomi' },
    { value: 'verge', label: 'Verge' },
    { value: 'user', label: 'Bruker' }
  ]

  const statusOptions = [
    { value: 'all', label: 'Alle statuser' },
    { value: 'true', label: 'Aktive' },
    { value: 'false', label: 'Deaktiverte' }
  ]

  useEffect(() => {
    setMounted(true)
    loadPrompts()
    loadStats()
  }, [])

  useEffect(() => {
    filterPrompts()
  }, [prompts, searchTerm, categoryFilter, statusFilter])

  const loadPrompts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use complete API endpoint
      const response = await fetch('/api/prompts/complete')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts || [])
        setSuccess(`Loaded ${data.prompts?.length || 0} prompts`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load prompts')
      }
    } catch (error) {
      console.error('Error loading prompts:', error)
      setError('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // TODO: Implement stats API
      setStats({
        totalPrompts: prompts.length,
        activePrompts: prompts.filter(p => p.is_active).length,
        inactivePrompts: prompts.filter(p => !p.is_active).length,
        mostUsed: prompts.slice(0, 5),
        recentUpdates: prompts.slice(0, 5)
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filterPrompts = () => {
    let filtered = prompts

    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(prompt => 
        statusFilter === 'true' ? prompt.is_active : !prompt.is_active
      )
    }

    setFilteredPrompts(filtered)
  }

  const handleToggleActive = async (prompt: Prompt) => {
    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !prompt.is_active })
      })

      if (response.ok) {
        setSuccess(`Prompt ${!prompt.is_active ? 'aktivert' : 'deaktivert'} successfully`)
        loadPrompts()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update prompt')
      }
    } catch (error) {
      console.error('Error toggling prompt:', error)
      setError('Failed to update prompt')
    }
  }

  const handleDelete = async (prompt: Prompt) => {
    if (!confirm(`Er du sikker på at du vil slette "${prompt.name}"?`)) return

    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccess('Prompt deleted successfully')
        loadPrompts()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete prompt')
      }
    } catch (error) {
      console.error('Error deleting prompt:', error)
      setError('Failed to delete prompt')
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      chat: 'bg-blue-100 text-blue-800',
      document: 'bg-green-100 text-green-800',
      policy: 'bg-purple-100 text-purple-800',
      voice: 'bg-pink-100 text-pink-800',
      system: 'bg-gray-100 text-gray-800',
      nav: 'bg-orange-100 text-orange-800',
      economic: 'bg-yellow-100 text-yellow-800',
      verge: 'bg-indigo-100 text-indigo-800',
      user: 'bg-teal-100 text-teal-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      chat: 'Chat',
      document: 'Dokument',
      policy: 'Policy',
      voice: 'Stemme',
      system: 'System',
      nav: 'NAV',
      economic: 'Økonomi',
      verge: 'Verge',
      user: 'Bruker'
    }
    return labels[category] || category
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧠 AI Prompt & Rule Manager
          </h1>
          <p className="text-gray-600">
            Administrer alle AI-prompter og systemregler for Pengeplan 2.0
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Totalt</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPrompts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktive</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activePrompts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Deaktiverte</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactivePrompts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kategorier</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Søk i prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* New Prompt Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ny Prompt
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Prompts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Laster prompts...</p>
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Ingen prompts funnet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prompt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Versjon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oppdatert
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Handlinger
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPrompts.map((prompt) => (
                    <tr key={prompt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {prompt.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {prompt.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(prompt.category)}`}>
                          {getCategoryLabel(prompt.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        v{prompt.version}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          prompt.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prompt.is_active ? 'Aktiv' : 'Deaktivert'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(prompt.updated_at).toLocaleDateString('no-NO')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPrompt(prompt)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Se detaljer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowEditModal(true)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Rediger"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowHistoryModal(true)}
                            className="p-1 text-gray-400 hover:text-purple-600"
                            title="Versjonshistorikk"
                          >
                            <History className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowTestModal(true)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Test prompt"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(prompt)}
                            className={`p-1 ${
                              prompt.is_active 
                                ? 'text-gray-400 hover:text-red-600' 
                                : 'text-gray-400 hover:text-green-600'
                            }`}
                            title={prompt.is_active ? 'Deaktiver' : 'Aktiver'}
                          >
                            {prompt.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(prompt)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Slett"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
