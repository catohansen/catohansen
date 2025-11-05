'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
// Mock schemas - replace with actual implementation as needed

interface Policy {
  id: string
  name: string
  version: string
  status: string
  createdBy: string
  createdAt: string
  activatedAt?: string
  notes?: string
}

export function PolicyManager() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    content: '',
    notes: ''
  })

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('name', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`/api/cerbos/policies?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPolicies(data.policies)
      }
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/cerbos/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPolicy)
      })

      if (response.ok) {
        setNewPolicy({ name: '', content: '', notes: '' })
        setShowCreateForm(false)
        fetchPolicies()
      }
    } catch (error) {
      console.error('Error creating policy:', error)
    }
  }

  const handleSearch = () => {
    setLoading(true)
    fetchPolicies()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'staged':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-600" />
      case 'retired':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getPolicyStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'staged':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'retired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPolicyStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv'
      case 'staged':
        return 'Klargjort'
      case 'draft':
        return 'Utkast'
      case 'retired':
        return 'Utgått'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Policy Management</h2>
          <p className="text-muted-foreground">
            Administrer Cerbos policyer og versjoner
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ny Policy
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Søk policyer</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Søk etter policy navn..."
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Status filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Alle statuser" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle statuser</SelectItem>
                  <SelectItem value="draft">Utkast</SelectItem>
                  <SelectItem value="staged">Klar for deploy</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="retired">Pensjonert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Policy Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Opprett ny policy</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <Label htmlFor="policyName">Policy navn</Label>
                <Input
                  id="policyName"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  placeholder="e.g. bills.yaml"
                  required
                />
              </div>
              <div>
                <Label htmlFor="policyContent">YAML innhold</Label>
                <Textarea
                  id="policyContent"
                  value={newPolicy.content}
                  onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                  placeholder="YAML policy innhold..."
                  rows={10}
                  required
                />
              </div>
              <div>
                <Label htmlFor="policyNotes">Notater (valgfritt)</Label>
                <Textarea
                  id="policyNotes"
                  value={newPolicy.notes}
                  onChange={(e) => setNewPolicy({ ...newPolicy, notes: e.target.value })}
                  placeholder="Beskrivelse av policy..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Opprett Policy</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Avbryt
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Policies List */}
      <div className="space-y-4">
        {policies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Ingen policyer funnet</p>
            </CardContent>
          </Card>
        ) : (
          policies.map((policy) => (
            <Card key={policy.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(policy.status)}
                    <div>
                      <h3 className="font-semibold">{policy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Versjon: {policy.version} • Opprettet: {new Date(policy.createdAt).toLocaleDateString('nb-NO')}
                      </p>
                      {policy.activatedAt && (
                        <p className="text-sm text-muted-foreground">
                          Aktivert: {new Date(policy.activatedAt).toLocaleDateString('nb-NO')}
                        </p>
                      )}
                      {policy.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{policy.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPolicyStatusColor(policy.status)}>
                      {getPolicyStatusLabel(policy.status)}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}