'use client'

import { useState } from 'react'
import { Heart, Plus, Edit, Trash2, Download, Search, Eye, EyeOff, CheckCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Mock data - replace with real API calls
const mockSupporters = [
  {
    id: '1',
    displayName: 'Anna & Familie',
    emailInternal: 'anna@example.com',
    tier: 'family_hero',
    method: 'vipps',
    amountMonthlyEstimate: 200,
    since: '2024-01-15',
    message: 'Tusen takk for at dere gjør økonomi gøy for våre barn! 💜',
    verified: true,
    showAmount: false,
    consentPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2', 
    displayName: 'Lars fra Bergen',
    emailInternal: 'lars@example.com',
    tier: 'community_builder',
    method: 'spleis',
    amountMonthlyEstimate: 100,
    since: '2024-02-01',
    message: 'Fantastisk initiativ! Fortsett det gode arbeidet 🚀',
    verified: true,
    showAmount: false,
    consentPublic: true,
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    displayName: 'Maria',
    emailInternal: 'maria@example.com',
    tier: 'early_supporter',
    method: 'coffee',
    amountMonthlyEstimate: 50,
    since: '2024-01-20',
    message: null,
    verified: true,
    showAmount: false,
    consentPublic: true,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  }
]

const tierOptions = [
  { value: 'family_hero', label: 'Familiehelt', color: 'bg-emerald-500' },
  { value: 'community_builder', label: 'Samfunnsbygger', color: 'bg-violet-500' },
  { value: 'early_supporter', label: 'Early Supporter', color: 'bg-amber-500' }
]

const methodOptions = [
  { value: 'vipps', label: 'Vipps' },
  { value: 'spleis', label: 'Spleis' },
  { value: 'coffee', label: 'Buy Me a Coffee' },
  { value: 'sponsor', label: 'Sponsor' }
]

export default function SupporterManagementPage() {
  const [supporters, setSupporters] = useState(mockSupporters)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState('all')
  const [filterVerified, setFilterVerified] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSupporter, setEditingSupporter] = useState<any>(null)

  const filteredSupporters = supporters.filter(supporter => {
    const matchesSearch = supporter.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supporter.emailInternal.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === 'all' || supporter.tier === filterTier
    const matchesVerified = filterVerified === 'all' || 
                           (filterVerified === 'verified' && supporter.verified) ||
                           (filterVerified === 'unverified' && !supporter.verified)
    
    return matchesSearch && matchesTier && matchesVerified
  })

  const handleCreateSupporter = (data: any) => {
    const newSupporter = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setSupporters([...supporters, newSupporter])
    setIsCreateDialogOpen(false)
  }

  const handleUpdateSupporter = (id: string, data: any) => {
    setSupporters(supporters.map(s => 
      s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
    ))
    setEditingSupporter(null)
  }

  const handleDeleteSupporter = (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne supporteren?')) {
      setSupporters(supporters.filter(s => s.id !== id))
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Navn', 'E-post', 'Tier', 'Metode', 'Beløp', 'Siden', 'Verifisert', 'Offentlig', 'Melding'],
      ...filteredSupporters.map(s => [
        s.displayName,
        s.emailInternal,
        s.tier,
        s.method,
        s.amountMonthlyEstimate,
        s.since,
        s.verified ? 'Ja' : 'Nei',
        s.consentPublic ? 'Ja' : 'Nei',
        s.message || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supporters-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="h-8 w-8 text-emerald-600" />
            Supporter Management
          </h1>
          <p className="text-gray-600 mt-1">Administrer supporters og støtte-systemet</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">{supporters.length}</div>
            <div className="text-sm text-emerald-600">Totalt supporters</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-violet-700">
              {supporters.filter(s => s.consentPublic).length}
            </div>
            <div className="text-sm text-violet-600">Offentlige</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">
              {supporters.filter(s => s.verified).length}
            </div>
            <div className="text-sm text-amber-600">Verifiserte</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {supporters.reduce((sum, s) => sum + (s.amountMonthlyEstimate || 0), 0)}
            </div>
            <div className="text-sm text-blue-600">Månedlig støtte</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Søk supporters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle tiers</SelectItem>
                  {tierOptions.map(tier => (
                    <SelectItem key={tier.value} value={tier.value}>
                      {tier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterVerified} onValueChange={setFilterVerified}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Verifisert" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="verified">Verifiserte</SelectItem>
                  <SelectItem value="unverified">Ikke verifiserte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Eksporter CSV
              </Button>
              
              <Dialog>
                <DialogTrigger>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ny supporter
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Opprett ny supporter</DialogTitle>
                  </DialogHeader>
                  <SupporterForm 
                    onSubmit={handleCreateSupporter}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supporters List */}
      <Card>
        <CardHeader>
          <CardTitle>Supportere ({filteredSupporters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSupporters.map((supporter) => (
              <div key={supporter.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💜</div>
                    <div>
                      <div className="font-semibold text-gray-900">{supporter.displayName}</div>
                      <div className="text-sm text-gray-500">{supporter.emailInternal}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${tierOptions.find(t => t.value === supporter.tier)?.color} text-white`}>
                      {tierOptions.find(t => t.value === supporter.tier)?.label}
                    </Badge>
                    
                    {supporter.verified && (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verifisert
                      </Badge>
                    )}
                    
                    {supporter.consentPublic ? (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        <Eye className="h-3 w-3 mr-1" />
                        Offentlig
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600 border-gray-300">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Privat
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {supporter.amountMonthlyEstimate} kr/mnd
                  </span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingSupporter(supporter)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSupporter(supporter.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingSupporter && (
        <Dialog>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Rediger supporter</DialogTitle>
            </DialogHeader>
            <SupporterForm 
              supporter={editingSupporter}
              onSubmit={(data) => handleUpdateSupporter(editingSupporter.id, data)}
              onCancel={() => setEditingSupporter(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Supporter Form Component
function SupporterForm({ supporter, onSubmit, onCancel }: {
  supporter?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    displayName: supporter?.displayName || '',
    emailInternal: supporter?.emailInternal || '',
    tier: supporter?.tier || 'early_supporter',
    method: supporter?.method || 'vipps',
    amountMonthlyEstimate: supporter?.amountMonthlyEstimate || 0,
    since: supporter?.since || new Date().toISOString().split('T')[0],
    message: supporter?.message || '',
    verified: supporter?.verified || false,
    showAmount: supporter?.showAmount || false,
    consentPublic: supporter?.consentPublic || false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="displayName">Visningsnavn *</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="emailInternal">E-post (intern) *</Label>
          <Input
            id="emailInternal"
            type="email"
            value={formData.emailInternal}
            onChange={(e) => setFormData({ ...formData, emailInternal: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tier">Tier</Label>
          <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tierOptions.map(tier => (
                <SelectItem key={tier.value} value={tier.value}>
                  {tier.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="method">Metode</Label>
          <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methodOptions.map(method => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amountMonthlyEstimate">Månedlig beløp (kr)</Label>
          <Input
            id="amountMonthlyEstimate"
            type="number"
            value={formData.amountMonthlyEstimate}
            onChange={(e) => setFormData({ ...formData, amountMonthlyEstimate: parseInt(e.target.value) || 0 })}
          />
        </div>
        
        <div>
          <Label htmlFor="since">Støtter siden</Label>
          <Input
            id="since"
            type="date"
            value={formData.since}
            onChange={(e) => setFormData({ ...formData, since: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="message">Melding (valgfri)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Supporterens melding..."
          rows={3}
        />
      </div>
      
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.verified}
            onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
          />
          <span className="text-sm">Verifisert</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.consentPublic}
            onChange={(e) => setFormData({ ...formData, consentPublic: e.target.checked })}
          />
          <span className="text-sm">Samtykke til offentlig visning</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.showAmount}
            onChange={(e) => setFormData({ ...formData, showAmount: e.target.checked })}
          />
          <span className="text-sm">Vis beløp offentlig</span>
        </label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button type="submit">
          {supporter ? 'Oppdater' : 'Opprett'}
        </Button>
      </div>
    </form>
  )
}


















