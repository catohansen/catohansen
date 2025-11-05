'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  Mail, 
  Shield, 
  Eye, 
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

interface SuppressionData {
  id: string
  email: string
  reason: string
  provider?: string
  details?: string
  createdAt: Date
  lastEvent?: {
    type: string
    createdAt: Date
    outbox: {
      subject: string
    }
  }
  blockedCount: number
}

interface SuppressionStats {
  reason: string
  _count: { id: number }
}

interface SuppressionAdminClientProps {
  suppressions: SuppressionData[]
  stats: SuppressionStats[]
}

export function SuppressionAdminClient({ suppressions, stats }: SuppressionAdminClientProps) {
  const [whitelisting, setWhitelisting] = useState<string | null>(null)

  const handleWhitelist = async (suppressionId: string, email: string) => {
    setWhitelisting(suppressionId)
    
    try {
      const response = await fetch(`/api/admin/emails/suppression/${suppressionId}/whitelist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        // Refresh page to show updated data
        window.location.reload()
      } else {
        alert('Feil ved whitelisting')
      }
    } catch (error) {
      console.error('Whitelist error:', error)
      alert('Feil ved whitelisting')
    } finally {
      setWhitelisting(null)
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'BOUNCE': return 'bg-red-100 text-red-800'
      case 'COMPLAINT': return 'bg-orange-100 text-orange-800'
      case 'UNSUBSCRIBE': return 'bg-blue-100 text-blue-800'
      case 'MANUAL': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'BOUNCE': return <XCircle className="w-4 h-4" />
      case 'COMPLAINT': return <AlertTriangle className="w-4 h-4" />
      case 'UNSUBSCRIBE': return <Mail className="w-4 h-4" />
      case 'MANUAL': return <Shield className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  const totalSuppressed = stats.reduce((sum, stat) => sum + stat._count.id, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Suppression-liste</h1>
        <p className="text-gray-600">Administrer blokkerte e-postadresser</p>
      </div>

      {/* Statistikk */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Totalt blokkert</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuppressed}</p>
            </div>
          </div>
        </Card>

        {stats.map((stat) => (
          <Card key={stat.reason} className="p-4">
            <div className="flex items-center space-x-2">
              {getReasonIcon(stat.reason)}
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.reason === 'BOUNCE' && 'Bounces'}
                  {stat.reason === 'COMPLAINT' && 'Spam'}
                  {stat.reason === 'UNSUBSCRIBE' && 'Avmeldt'}
                  {stat.reason === 'MANUAL' && 'Manuelt'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat._count.id}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Suppression-liste */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Blokkerte e-postadresser</h2>
          
          {suppressions.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Ingen blokkerte e-postadresser</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Siste event</TableHead>
                  <TableHead>Blokkerte forsøk</TableHead>
                  <TableHead>Dato</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppressions.map((suppression) => (
                  <TableRow key={suppression.id}>
                    <TableCell className="font-mono text-sm">
                      {suppression.email}
                    </TableCell>
                    <TableCell>
                      <Badge className={getReasonColor(suppression.reason)}>
                        {suppression.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {suppression.lastEvent ? (
                        <div className="text-sm">
                          <p className="font-medium">{suppression.lastEvent.type}</p>
                          <p className="text-gray-500 truncate max-w-xs">
                            {suppression.lastEvent.outbox.subject}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-red-600">
                        {suppression.blockedCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{suppression.createdAt.toLocaleDateString('nb-NO')}</p>
                        <p className="text-gray-500">
                          {suppression.createdAt.toLocaleTimeString('nb-NO')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhitelist(suppression.id, suppression.email)}
                          disabled={whitelisting === suppression.id}
                        >
                          {whitelisting === suppression.id ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Whitelist
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            // TODO: Implement details modal
                            alert(`Detaljer for ${suppression.email}`)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Info */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Suppression-liste:</strong> E-postadresser som automatisk blokkeres fra å motta e-poster. 
          Dette inkluderer bounced e-poster, spam complaints og manuelt blokkerte adresser.
        </AlertDescription>
      </Alert>
    </div>
  )
}

