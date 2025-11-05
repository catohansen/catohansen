'use client'

import { useState } from 'react'
import { 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Database,
  Calendar,
  HardDrive,
  Shield,
  RefreshCw,
  AlertTriangle,
  X
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Backup {
  name: string,

  path: string,

  size: number,

  created: Date,

  valid?: boolean;
}

interface Props {
  initialBackups: Backup[]
}

export default function BackupAdminClient({ initialBackups }: Props) {
  const [backups, setBackups] = useState<Backup[]>(initialBackups)
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('no-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [backupType, setBackupType] = useState('full');
  const [backupDescription, setBackupDescription] = useState('');
  const [includeLogs, setIncludeLogs] = useState(true);
  const [includeUserData, setIncludeUserData] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const createBackup = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/admin/backup/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: backupType,
          description: backupDescription,
          includeLogs,
          includeUserData
        })
      })
      
      if (response.ok) {
        const result = await response.json();
        // Show success toast,

        setShowSuccessToast(true);
        setShowCreateModal(false);
        // Add new backup to the list,

        const newBackup = {
          name: result.backup.name,
          path: result.backup.path,
          size: result.backup.size,
          created: new Date(result.backup.createdAt),
          valid: true
        }
        setBackups(prev => [newBackup, ...prev]);
        // Auto-hide success toast after 3 seconds,

        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3000)
      } else {
        const error = await response.json();
        setShowErrorToast(true);
        setErrorMessage(error.error);
        // Auto-hide error toast after 5 seconds,

        setTimeout(() => {
          setShowErrorToast(false);
        }, 5000)
      }
    } catch (error) {
      console.error('Backup creation error:', error);
      setShowErrorToast(true);
      setErrorMessage('Network error or server unavailable');
      // Auto-hide error toast after 5 seconds,

      setTimeout(() => {
        setShowErrorToast(false);
      }, 5000)
    } finally {
      setIsCreating(false);
    }
  }

  const restoreBackup = async (backupName: string) => {
    if (!confirm(`Er du sikker på at du vil gjenopprette backup "${backupName}"? Dette vil overskrive gjeldende system.`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: backupName })
      })
      
      if (response.ok) {
        const result = await response.json();
        alert(`✅ ${result.message}`);
        // Refresh the page to show updated state
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`❌ Gjenoppretting feilet: ${error.error}`);
      }
    } catch (error) {
      console.error('Restore error:', error);
      alert('❌ Gjenoppretting feilet');
    }
  }

  const deleteBackup = async (backupName: string) => {

    if (!confirm(`Er du sikker på at du vil slette backup "${backupName}"?`)) {
      return;
    }
    
    setIsDeleting(backupName);
    try {
      const response = await fetch(`/api/admin/backup/${encodeURIComponent(backupName)}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setBackups(backups.filter(b => b.name !== backupName))
      } else {
        const error = await response.json();
        alert(`Sletting feilet: ${error.error}`);
      }
    } catch (error) {
      console.error('Backup deletion error:', error);
      alert('Sletting feilet');
    } finally {
      setIsDeleting(null);
    }
  }

  const downloadBackup = async (backupName: string) => {
    try {
      const response = await fetch(`/api/admin/backup/${encodeURIComponent(backupName)}/download`)
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = backupName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Nedlasting feilet: ${error.error}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Nedlasting feilet');
    }
  }

  const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
  const validBackups = backups.filter(b => b.valid !== false).length;
  const invalidBackups = backups.filter(b => b.valid === false).length;

  return (
    <div className="space-y-6">
      {/* Backup Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Totalt Backups</CardTitle>
              <Database className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{backups.length}</div>
            <div className="text-sm text-gray-600">Backup-filer</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Gyldige Backups</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{validBackups}</div>
            <div className="text-sm text-gray-600">Verifiserte backups</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ugyldige Backups</CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{invalidBackups}</div>
            <div className="text-sm text-gray-600">Korrupte backups</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Total Størrelse</CardTitle>
              <HardDrive className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatFileSize(totalSize)}</div>
            <div className="text-sm text-gray-600">Lagringsplass brukt</div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Handlinger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowCreateModal(true)}
              disabled={isCreating}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {isCreating ? 'Oppretter...' : 'Opprett Backup'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Oppdater Liste
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Backup Sikkerhet</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Backups krypteres og verifiseres automatisk. Sørg for at backups lagres på en sikker plassering.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Oversikt</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {backups.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Ingen backups funnet</p>
              <p className="text-sm">Opprett din første backup for å komme i gang</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="text-left p-4">Backup</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Størrelse</th>
                    <th className="text-left p-4">Opprettet</th>
                    <th className="text-left p-4">Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => (
                    <tr key={backup.name} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-gray-500" />
                          <span className="font-mono text-sm">{backup.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {backup.valid === undefined ? (
                          <Badge variant="outline">Ukjent</Badge>
                        ) : backup.valid ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Gyldig
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Ugyldig
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {formatFileSize(backup.size)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(backup.created)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadBackup(backup.name)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Last ned
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => restoreBackup(backup.name)}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Gjenopprett
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteBackup(backup.name)}
                            disabled={isDeleting === backup.name}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            {isDeleting === backup.name ? 'Sletter...' : 'Slett'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning for invalid backups */}
      {invalidBackups > 0 && (
        <Card className="border-l-4 border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Ugyldige Backups Oppdaget</h4>
                <p className="text-sm text-red-700 mt-1">
                  {invalidBackups} backup{invalidBackups > 1 ? 's' : ''} er korrupte eller ugyldige. 
                  Vurder å slette disse og opprette nye backups.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Backup Modal */}
      <Dialog>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Opprett Ny Backup
            </DialogTitle>
            <DialogDescription>
              Velg backup-type og legg til dokumentasjon for din backup
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Backup Type */}
            <div className="space-y-2">
              <Label htmlFor="backup-type">Backup Type</Label>
              <Select value={backupType} onValueChange={setBackupType}>
                <SelectTrigger>
                  <SelectValue placeholder="Velg backup-type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full System Backup</SelectItem>
                  <SelectItem value="database">Database Only</SelectItem>
                  <SelectItem value="config">Configuration Only</SelectItem>
                  <SelectItem value="incremental">Incremental Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Backup Description */}
            <div className="space-y-2">
              <Label htmlFor="backup-description">Beskrivelse</Label>
              <Textarea
                id="backup-description"
                placeholder="Beskriv hva denne backupen inneholder eller hvorfor den ble opprettet..."
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Backup Options */}
            <div className="space-y-4">
              <Label>Backup Alternativer</Label>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-logs">Inkluder Systemlogger</Label>
                  <p className="text-sm text-gray-500">Inkluder system- og feillogger i backup</p>
                </div>
                <Switch
                  id="include-logs"
                  checked={includeLogs}
                  onCheckedChange={setIncludeLogs}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-user-data">Inkluder Brukerdata</Label>
                  <p className="text-sm text-gray-500">Inkluder brukerdata og personopplysninger</p>
                </div>
                <Switch
                  id="include-user-data"
                  checked={includeUserData}
                  onCheckedChange={setIncludeUserData}
                />
              </div>
            </div>

            {/* Backup Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Backup Informasjon:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Backup vil bli kryptert og verifisert automatisk</li>
                    <li>• Størrelse avhenger av valgt type og alternativer</li>
                    <li>• Backup lagres i: <code className="bg-blue-100 px-1 rounded">backup-Pengeplan2.0/</code></li>
                    <li>• Alle backup-hendelser logges i systemet</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Avbryt
            </Button>
            <Button onClick={createBackup} disabled={isCreating}>
              {isCreating ? 'Oppretter...' : 'Opprett Backup'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-800">Backup Opprettet!</h4>
                <p className="text-sm text-green-700 mt-1">
                  Pengeplan 2.0 v.004 backup ble opprettet vellykket
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Størrelse: 2911 KB • Type: {backupType}
                </p>
              </div>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="flex-shrink-0 text-green-400 hover:text-green-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">Backup Feilet</h4>
                <p className="text-sm text-red-700 mt-1">
                  {errorMessage || 'En ukjent feil oppstod'}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Prøv igjen eller kontakt administrator
                </p>
              </div>
              <button
                onClick={() => setShowErrorToast(false)}
                className="flex-shrink-0 text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}