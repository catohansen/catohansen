'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Settings, 
  Lock, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

interface Team {
  id: string
  name: string
  description?: string
  orgId?: string
  org?: {
    id: string
    name: string
    type?: string
  }
  members: Array<{
    id: string
    role: string
    user: {
      id: string
      name?: string
      email: string
    }
  }>
  teamSettings: Array<{
    id: string
    scope: string
    key: string
    valueJson: unknown
    mode: string
    description?: string
    createdAt: string
    updatedAt: string
  }>
}

interface TeamSetting {
  id?: string
  scope: string
  key: string
  valueJson: unknown
  mode: 'DEFAULT' | 'ENFORCED'
  description?: string
}

const SETTING_SCOPES = [
  { value: 'PAYMENTS', label: 'Betalinger' },
  { value: 'NOTIFICATIONS', label: 'Varsler' },
  { value: 'VERGE', label: 'Verge' },
  { value: 'NAV', label: 'NAV' },
  { value: 'COMMUNITY', label: 'Fellesskap' },
  { value: 'PREFERENCES', label: 'Preferanser' },
  { value: 'ADVANCED', label: 'Avansert' }
]

const COMMON_SETTINGS = {
  'notifications.email.enabled': { label: 'E-postvarsler', type: 'boolean' },
  'notifications.push.enabled': { label: 'Push-varsler', type: 'boolean' },
  'notifications.sms.enabled': { label: 'SMS-varsler', type: 'boolean' },
  'notifications.reminderDays': { label: 'Påminnelsesdager', type: 'array' },
  'notifications.overdueAlerts': { label: 'Forfalte varsler', type: 'boolean' },
  
  'paymentMethods.bankConnected': { label: 'Bank tilkoblet', type: 'boolean' },
  'paymentMethods.vippsConnected': { label: 'Vipps tilkoblet', type: 'boolean' },
  'paymentMethods.defaultMethod': { label: 'Standard betalingsmetode', type: 'select', options: ['MANUAL', 'BANK', 'VIPPS'] },
  'paymentMethods.autoPay': { label: 'Automatisk betaling', type: 'boolean' },
  
  'vergeSettings.enabled': { label: 'Verge aktivert', type: 'boolean' },
  'vergeSettings.defaultAccess': { label: 'Standard tilgang', type: 'select', options: ['NONE', 'LIMITED', 'FULL'] },
  'vergeSettings.autoShare': { label: 'Auto-del', type: 'boolean' },
  'vergeSettings.chatEnabled': { label: 'Chat aktivert', type: 'boolean' },
  
  'navSettings.connected': { label: 'NAV tilkoblet', type: 'boolean' },
  'navSettings.benefitSync': { label: 'Ytelse-synkronisering', type: 'boolean' },
  'navSettings.supportSchemes': { label: 'Støtteordninger', type: 'boolean' },
  'navSettings.preventionAlerts': { label: 'Forebyggende varsler', type: 'boolean' },
  'navSettings.dataSharing': { label: 'Datadeling', type: 'boolean' },
  
  'communitySettings.leaderboard': { label: 'Leaderboard', type: 'boolean' },
  'communitySettings.challenges': { label: 'Utfordringer', type: 'boolean' },
  'communitySettings.achievements': { label: 'Prestasjoner', type: 'boolean' },
  'communitySettings.visibility': { label: 'Synlighet', type: 'select', options: ['PRIVATE', 'ANONYMOUS', 'PUBLIC'] },
  
  'preferences.defaultView': { label: 'Standard visning', type: 'select', options: ['TRIAGE', 'TABLE', 'DASHBOARD'] },
  'preferences.theme': { label: 'Tema', type: 'select', options: ['AUTO', 'LIGHT', 'DARK'] },
  'preferences.language': { label: 'Språk', type: 'select', options: ['nb-NO', 'en-US'] },
  'preferences.currency': { label: 'Valuta', type: 'select', options: ['NOK', 'EUR', 'USD'] },
  
  'advancedFeatures.whatIfSimulation': { label: 'What-if simulering', type: 'boolean' },
  'advancedFeatures.aiInsights': { label: 'AI-insikter', type: 'select', options: ['BASIC', 'ADVANCED', 'EXPERT'] },
  'advancedFeatures.realTimeSync': { label: 'Sanntidssynkronisering', type: 'boolean' },
  'advancedFeatures.exportFormats': { label: 'Eksportformater', type: 'array' }
}

export default function TeamAdmin() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [scopeFilter, setScopeFilter] = useState('')
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showCreateSetting, setShowCreateSetting] = useState(false)
  const [editingSetting, setEditingSetting] = useState<TeamSetting | null>(null)
  
  // Form states
  const [newTeam, setNewTeam] = useState({ name: '', description: '' })
  const [newSetting, setNewSetting] = useState<TeamSetting>({
    scope: 'PREFERENCES',
    key: '',
    valueJson: true,
    mode: 'DEFAULT',
    description: ''
  })

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teams')
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams)
      }
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTeam = async () => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam)
      })

      if (response.ok) {
        await loadTeams()
        setShowCreateTeam(false)
        setNewTeam({ name: '', description: '' })
      }
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  const saveTeamSetting = async (setting: TeamSetting) => {
    if (!selectedTeam) return

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting)
      })

      if (response.ok) {
        await loadTeams()
        setShowCreateSetting(false)
        setEditingSetting(null)
        setNewSetting({
          scope: 'PREFERENCES',
          key: '',
          valueJson: true,
          mode: 'DEFAULT',
          description: ''
        })
      }
    } catch (error) {
      console.error('Error saving team setting:', error)
    }
  }

  const deleteTeamSetting = async (key: string) => {
    if (!selectedTeam) return

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/settings?key=${key}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadTeams()
      }
    } catch (error) {
      console.error('Error deleting team setting:', error)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSettings = selectedTeam?.teamSettings.filter(setting =>
    !scopeFilter || setting.scope === scopeFilter
  ) || []

  const renderSettingValue = (setting: TeamSetting) => {
    const settingDef = COMMON_SETTINGS[setting.key as keyof typeof COMMON_SETTINGS]
    
    if (settingDef?.type === 'boolean') {
      return (
        <Switch
          checked={Boolean(setting.valueJson)}
          onCheckedChange={(checked) => setNewSetting({ ...setting, valueJson: checked })}
        />
      )
    } else if (settingDef?.type === 'select') {
      return (
        <Select
          value={String(setting.valueJson || '')}
          onValueChange={(value) => setNewSetting({ ...setting, valueJson: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(settingDef as any).options?.map((option: string) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    } else {
      return (
        <Input
          value={String(setting.valueJson || '')}
          onChange={(e) => setNewSetting({ ...setting, valueJson: e.target.value })}
        />
      )
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Laster...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team-oversikt</h2>
          <p className="text-gray-600">Administrer team og deres innstillinger</p>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Opprett team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Opprett nytt team</DialogTitle>
              <DialogDescription>
                Opprett et nytt team for å administrere innstillinger
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Team-navn"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              />
              <Input
                placeholder="Beskrivelse (valgfritt)"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateTeam(false)}>
                  Avbryt
                </Button>
                <Button onClick={createTeam}>
                  Opprett team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teams List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Team ({filteredTeams.length})</CardTitle>
              <CardDescription>Velg et team for å administrere innstillinger</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Søk team..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Beskrivelse</TableHead>
                <TableHead>Medlemmer</TableHead>
                <TableHead>Innstillinger</TableHead>
                <TableHead>Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map(team => (
                <TableRow 
                  key={team.id}
                  className={selectedTeam?.id === team.id ? 'bg-blue-50' : 'cursor-pointer'}
                  onClick={() => setSelectedTeam(team)}
                >
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{team.members.length} medlemmer</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{team.teamSettings.length} innstillinger</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTeam(team)
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Team Settings */}
      {selectedTeam && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Innstillinger for {selectedTeam.name}</CardTitle>
                <CardDescription>
                  Administrer team-innstillinger og maler
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Select value={scopeFilter} onValueChange={setScopeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer på omfang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Alle omfang</SelectItem>
                    {SETTING_SCOPES.map(scope => (
                      <SelectItem key={scope.value} value={scope.value}>
                        {scope.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Legg til innstilling
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Legg til team-innstilling</DialogTitle>
                      <DialogDescription>
                        Opprett en ny innstilling for dette teamet
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Omfang</label>
                          <Select
                            value={newSetting.scope}
                            onValueChange={(value) => setNewSetting({ ...newSetting, scope: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SETTING_SCOPES.map(scope => (
                                <SelectItem key={scope.value} value={scope.value}>
                                  {scope.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Nøkkel</label>
                          <Select
                            value={newSetting.key}
                            onValueChange={(value) => setNewSetting({ ...newSetting, key: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Velg nøkkel" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(COMMON_SETTINGS).map(([key, def]) => (
                                <SelectItem key={key} value={key}>{def.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Modus</label>
                          <Select
                            value={newSetting.mode}
                            onValueChange={(value: 'DEFAULT' | 'ENFORCED') => setNewSetting({ ...newSetting, mode: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DEFAULT">Standard</SelectItem>
                              <SelectItem value="ENFORCED">Tvungen</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Beskrivelse</label>
                          <Input
                            placeholder="Beskrivelse (valgfritt)"
                            value={newSetting.description || ''}
                            onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Verdi</label>
                        {newSetting.key && renderSettingValue(newSetting)}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowCreateSetting(false)}>
                          Avbryt
                        </Button>
                        <Button onClick={() => saveTeamSetting(newSetting)}>
                          Lagre innstilling
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Omfang</TableHead>
                  <TableHead>Nøkkel</TableHead>
                  <TableHead>Verdi</TableHead>
                  <TableHead>Modus</TableHead>
                  <TableHead>Beskrivelse</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettings.map(setting => (
                  <TableRow key={setting.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {SETTING_SCOPES.find(s => s.value === setting.scope)?.label || setting.scope}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {setting.key}
                    </TableCell>
                    <TableCell>
                      {typeof setting.valueJson === 'boolean' ? (
                        <Badge variant={setting.valueJson ? 'default' : 'secondary'}>
                          {setting.valueJson ? 'På' : 'Av'}
                        </Badge>
                      ) : (
                        <span className="text-sm">{JSON.stringify(setting.valueJson)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={setting.mode === 'ENFORCED' ? 'destructive' : 'secondary'}>
                        {setting.mode === 'ENFORCED' ? (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Tvungen
                          </>
                        ) : (
                          'Standard'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{setting.description || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSetting(setting as any)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTeamSetting(setting.key)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
