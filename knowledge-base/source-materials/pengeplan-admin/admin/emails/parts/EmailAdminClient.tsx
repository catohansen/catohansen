'use client'

import { useState } from 'react'
import { 
  Eye, 
  RefreshCw, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Filter,
  Search,
  Download
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

type EmailRecord = {
  id: string | number
  toEmail: string
  toName?: string
  subject?: string
  template?: { title?: string; type?: string } | Record<string, unknown>
  status: string
  error?: string
  sentAt?: string
  createdAt: string
  renderedHtml?: string
  renderedText?: string
  events?: Array<{ type: string; createdAt: string }> | unknown[]
} | Record<string, any>

interface EmailAdminClientProps {
  emails: EmailRecord[]
}

export function EmailAdminClient({ emails: initialEmails }: EmailAdminClientProps) {
  const [emails, setEmails] = useState(initialEmails)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredEmails = emails.filter((email: any) => {
    const matchesFilter = filter === 'all' || email.status === filter
    const matchesSearch = search === '' || 
      String(email.toEmail).toLowerCase().includes(search.toLowerCase()) ||
      String(email.subject).toLowerCase().includes(search.toLowerCase()) ||
      String((email.template as Record<string, unknown>)?.title || '').toLowerCase().includes(search.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'OPENED':
      case 'CLICKED':
        return <Eye className="w-4 h-4 text-blue-600" />
      case 'QUEUED':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'FAILED':
      case 'BOUNCED':
      case 'SPAM':
      case 'DROPPED':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'SENT': 'default',
      'DELIVERED': 'default', 
      'OPENED': 'secondary',
      'CLICKED': 'secondary',
      'QUEUED': 'outline',
      'FAILED': 'destructive',
      'BOUNCED': 'destructive',
      'SPAM': 'destructive',
      'DROPPED': 'destructive'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const handleRetry = async (emailId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/emails/${emailId}/retry`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Refresh the email list
        const updatedEmails = emails.map(email => 
          email.id === emailId 
            ? { ...email, status: 'QUEUED', error: null }
            : email
        )
        setEmails(updatedEmails)
      }
    } catch (error) {
      console.error('Failed to retry email:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('nb-NO')
  }

  const maskEmail = (email: string) => {
    if (!email) return ''
    const [local, domain] = email.split('@')
    if (!local || !domain || local.length <= 2) return email
    return `${local.substring(0, 2)}***@${domain}`
  }

  const maskPII = (text: string) => {
    if (!text) return ''
    // Masker fødselsnummer (11 siffer)
    text = text.replace(/\b\d{11}\b/g, '***-****-***')
    // Masker telefonnummer
    text = text.replace(/\b\d{8}\b/g, '****-****')
    return text
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtrer e-poster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Søk etter mottaker, emne eller mal..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Velg status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle status</SelectItem>
                <SelectItem value="QUEUED">I kø</SelectItem>
                <SelectItem value="SENT">Sendt</SelectItem>
                <SelectItem value="DELIVERED">Levert</SelectItem>
                <SelectItem value="OPENED">Åpnet</SelectItem>
                <SelectItem value="CLICKED">Klikket</SelectItem>
                <SelectItem value="FAILED">Feilet</SelectItem>
                <SelectItem value="BOUNCED">Bounce</SelectItem>
                <SelectItem value="SPAM">Spam</SelectItem>
                <SelectItem value="DROPPED">Droppet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            E-post utsendelser ({filteredEmails.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mottaker</TableHead>
                  <TableHead>Emne</TableHead>
                  <TableHead>Mal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sendt</TableHead>
                  <TableHead>Handlinger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map((email: any) => (
                  <TableRow key={String(email.id)}>
                    <TableCell>
                      <div>
                        <div className="font-medium" title={String(email.toEmail)}>
                          {maskEmail(String(email.toEmail))}
                        </div>
                        {email.toName ? (
                          <div className="text-sm text-gray-500" title={String(email.toName)}>
                            {maskPII(String(email.toName))}
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={String(email.subject)}>
                        {String(email.subject || 'No subject')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {email.template ? (
                        <div>
                          <div className="font-medium">{String((email.template as Record<string, unknown>).title)}</div>
                          <div className="text-sm text-gray-500">{String((email.template as Record<string, unknown>).type)}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Direkte e-post</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(String(email.status))}
                        {getStatusBadge(String(email.status))}
                      </div>
                      {email.error && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs truncate" title={email.error}>
                          {email.error}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {email.sentAt ? formatDate(email.sentAt) : 'Ikke sendt'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Opprettet: {formatDate(email.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEmail(email)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/api/admin/emails/${email.id}/pdf`, '_blank')}
                          title="Last ned PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {email.status === 'FAILED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(email.id)}
                            disabled={loading}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Email Preview Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">E-post forhåndsvisning</h3>
              <Button variant="outline" onClick={() => setSelectedEmail(null)}>
                Lukk
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <strong>Til:</strong> {selectedEmail.toEmail}
                {selectedEmail.toName && ` (${selectedEmail.toName})`}
              </div>
              <div>
                <strong>Emne:</strong> {selectedEmail.subject}
              </div>
              <div>
                <strong>Status:</strong> {getStatusBadge(selectedEmail.status)}
              </div>
              {selectedEmail.template && (
                <div>
                  <strong>Mal:</strong> {String((selectedEmail.template as Record<string, unknown>).title)}
                </div>
              )}
              <div>
                <strong>HTML innhold:</strong>
                <div className="border rounded p-4 mt-2 max-h-96 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: String(selectedEmail.renderedHtml) }} />
                </div>
              </div>
              {selectedEmail.renderedText && (
                <div>
                  <strong>Tekst versjon:</strong>
                  <div className="border rounded p-4 mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {selectedEmail.renderedText}
                  </div>
                </div>
              )}
              {selectedEmail.events && (selectedEmail.events as unknown[]).length > 0 && (
                <div>
                  <strong>Events:</strong>
                  <div className="space-y-2 mt-2">
                    {(selectedEmail.events as Record<string, unknown>[]).map((event: Record<string, unknown>, index: number) => {
                      const ev = event as { type?: unknown; createdAt?: unknown }
                      const typeLabel = String(ev.type ?? '')
                      const createdAtStr = typeof ev.createdAt === 'string' ? ev.createdAt : ''
                      return (
                      <div key={index} className="border rounded p-2 text-sm">
                        <div className="font-medium">{typeLabel || 'Event'}</div>
                        <div className="text-gray-500">{createdAtStr ? formatDate(createdAtStr) : ''}</div>
                      </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
