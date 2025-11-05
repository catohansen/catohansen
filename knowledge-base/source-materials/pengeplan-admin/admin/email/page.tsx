/**
 * Admin Email Management System
 * Manage email templates, logs, and sending
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  Mail,
  Send,
  Edit,
  Eye,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Settings,
  BarChart3,
  RefreshCw,
  Plus
} from 'lucide-react'

import { AdminPageLayout } from '@/components/admin/AdminPageLayout'
import { AdminCard } from '@/components/admin/AdminCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EmailLog {
  id: string
  recipient: string
  subject: string
  template: string
  status: 'sent' | 'failed' | 'pending'
  sentAt?: string
  error?: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  description: string
  category: string
  lastUsed?: string
  usageCount: number
}

export default function AdminEmailPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'templates' | 'send' | 'settings'>('logs')
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Send email state
  const [sendTo, setSendTo] = useState('')
  const [sendSubject, setSendSubject] = useState('')
  const [sendContent, setSendContent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  useEffect(() => {
    loadEmailData()
  }, [])

  const loadEmailData = async () => {
    setIsLoading(true)
    try {
      // Load email logs
      setEmailLogs([
        {
          id: '1',
          recipient: 'cato@catohansen.no',
          subject: '✨ Bekreft din e-post - Velkommen til Pengeplan!',
          template: 'email_verification',
          status: 'sent',
          sentAt: new Date().toISOString()
        },
        {
          id: '2',
          recipient: 'cato@catohansen.no',
          subject: '🎉 Velkommen til Pengeplan! Din økonomiske reise starter nå',
          template: 'welcome',
          status: 'sent',
          sentAt: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: '3',
          recipient: 'admin@pengeplan.no',
          subject: '🎉 Ny bruker registrert: Cato Hansen',
          template: 'admin_new_user',
          status: 'sent',
          sentAt: new Date(Date.now() - 120000).toISOString()
        }
      ])

      // Load templates
      setTemplates([
        {
          id: 'email_verification',
          name: 'Email Verifisering',
          subject: 'Bekreft din e-post',
          description: 'Sendes til nye brukere for å verifisere e-post',
          category: 'Authentication',
          usageCount: 47,
          lastUsed: new Date().toISOString()
        },
        {
          id: 'welcome',
          name: 'Velkommen Email',
          subject: 'Velkommen til Pengeplan!',
          description: 'Sendes etter email verifisering',
          category: 'Onboarding',
          usageCount: 45,
          lastUsed: new Date().toISOString()
        },
        {
          id: 'password_reset',
          name: 'Passord Reset',
          subject: 'Tilbakestill passord',
          description: 'Sendes ved glemt passord',
          category: 'Authentication',
          usageCount: 12,
          lastUsed: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'admin_new_user',
          name: 'Admin Notifikasjon',
          subject: 'Ny bruker registrert',
          description: 'Notifiserer admin om nye brukere',
          category: 'Admin',
          usageCount: 47,
          lastUsed: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error loading email data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestEmail = async () => {
    if (!sendTo || !sendSubject || !sendContent) {
      alert('Fyll ut alle felter')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: sendTo,
          subject: sendSubject,
          content: sendContent,
          template: selectedTemplate
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('Email sendt!')
        setSendTo('')
        setSendSubject('')
        setSendContent('')
        loadEmailData()
      } else {
        alert('Feil ved sending: ' + result.error)
      }
    } catch (error) {
      alert('Feil ved sending')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Mail className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <AdminPageLayout 
      title="📧 Email Management" 
      description="Administrer email templates, logs og utsending"
      headerColor="blue"
    >
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'logs', label: 'Email Logs', icon: BarChart3 },
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'send', label: 'Send Email', icon: Send },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <AdminCard title="📧 Email Logs" color="white" noHover>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sendte emails</h3>
                <Button onClick={loadEmailData} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Oppdater
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Mottaker</th>
                      <th className="text-left p-3">Emne</th>
                      <th className="text-left p-3">Template</th>
                      <th className="text-left p-3">Sendt</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <span className="capitalize">{log.status}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-sm">{log.recipient}</td>
                        <td className="p-3">{log.subject}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {log.template}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {log.sentAt ? new Date(log.sentAt).toLocaleString('no-NO') : '-'}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <AdminCard title="📝 Email Templates" color="white" noHover>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Template oversikt</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ny Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {template.category}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      <div>Emne: {template.subject}</div>
                      <div>Brukt: {template.usageCount} ganger</div>
                      {template.lastUsed && (
                        <div>Sist: {new Date(template.lastUsed).toLocaleDateString('no-NO')}</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Se
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Rediger
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-3 w-3 mr-1" />
                        Kopier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Send Email Tab */}
      {activeTab === 'send' && (
        <div className="space-y-6">
          <AdminCard title="📤 Send Email" color="white" noHover>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sendTo">Til (e-post)</Label>
                  <Input
                    id="sendTo"
                    type="email"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder="bruker@example.no"
                  />
                </div>
                <div>
                  <Label htmlFor="template">Template</Label>
                  <select
                    id="template"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Velg template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="sendSubject">Emne</Label>
                <Input
                  id="sendSubject"
                  value={sendSubject}
                  onChange={(e) => setSendSubject(e.target.value)}
                  placeholder="Email emne"
                />
              </div>

              <div>
                <Label htmlFor="sendContent">Innhold</Label>
                <textarea
                  id="sendContent"
                  value={sendContent}
                  onChange={(e) => setSendContent(e.target.value)}
                  placeholder="Email innhold..."
                  className="w-full p-3 border rounded-md h-32"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={sendTestEmail} disabled={isLoading}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" onClick={() => {
                  setSendTo('cato@catohansen.no')
                  setSendSubject('Test email fra Pengeplan')
                  setSendContent('Dette er en test email fra admin panelet.')
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Test Template
                </Button>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <AdminCard title="⚙️ Email Provider Setup" color="white" noHover>
            <EmailProviderConfig />
          </AdminCard>
        </div>
      )}
    </AdminPageLayout>
  )
}

/**
 * Email Provider Configuration Component
 */
function EmailProviderConfig() {
  const [provider, setProvider] = useState<'resend' | 'sendgrid' | 'smtp'>('resend')
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  
  // Resend config
  const [resendApiKey, setResendApiKey] = useState('')
  const [resendFromEmail, setResendFromEmail] = useState('noreply@pengeplan.no')
  const [resendFromName, setResendFromName] = useState('Pengeplan')
  
  // SendGrid config
  const [sendgridApiKey, setSendgridApiKey] = useState('')
  const [sendgridFromEmail, setSendgridFromEmail] = useState('noreply@pengeplan.no')
  const [sendgridFromName, setSendgridFromName] = useState('Pengeplan')
  
  // SMTP config
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState(587)
  const [smtpUsername, setSmtpUsername] = useState('')
  const [smtpPassword, setSmtpPassword] = useState('')
  const [smtpFromEmail, setSmtpFromEmail] = useState('')
  const [smtpFromName, setSmtpFromName] = useState('Pengeplan')

  const saveConfig = async () => {
    setIsLoading(true)
    try {
      const config = {
        provider,
        ...(provider === 'resend' && {
          resend: {
            apiKey: resendApiKey,
            fromEmail: resendFromEmail,
            fromName: resendFromName
          }
        }),
        ...(provider === 'sendgrid' && {
          sendgrid: {
            apiKey: sendgridApiKey,
            fromEmail: sendgridFromEmail,
            fromName: sendgridFromName
          }
        }),
        ...(provider === 'smtp' && {
          smtp: {
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            username: smtpUsername,
            password: smtpPassword,
            fromEmail: smtpFromEmail,
            fromName: smtpFromName
          }
        })
      }

      const response = await fetch('/api/admin/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const result = await response.json()
      if (result.success) {
        alert('Email konfiguration lagret!')
      } else {
        alert('Feil ved lagring: ' + result.error)
      }
    } catch (error) {
      alert('Feil ved lagring')
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult(null)
    try {
      const response = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      })

      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, message: 'Test feilet' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div>
        <Label className="text-base font-semibold">Velg Email Provider</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {[
            { id: 'resend', name: 'Resend', desc: 'Moderne og pålitelig (anbefalt)', icon: '🚀' },
            { id: 'sendgrid', name: 'SendGrid', desc: 'Populær og skalerbar', icon: '📧' },
            { id: 'smtp', name: 'SMTP', desc: 'Gmail, Outlook eller custom', icon: '⚙️' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id as any)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                provider === p.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{p.icon}</span>
                <span className="font-semibold">{p.name}</span>
              </div>
              <p className="text-sm text-gray-600">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Resend Configuration */}
      {provider === 'resend' && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold flex items-center gap-2">
            🚀 Resend Konfiguration
            <a href="https://resend.com" target="_blank" className="text-blue-600 text-sm">
              (Opprett konto)
            </a>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>API Key *</Label>
              <Input
                type="password"
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                placeholder="re_..."
              />
            </div>
            <div>
              <Label>Fra Navn</Label>
              <Input
                value={resendFromName}
                onChange={(e) => setResendFromName(e.target.value)}
                placeholder="Pengeplan"
              />
            </div>
          </div>
          <div>
            <Label>Fra E-post *</Label>
            <Input
              type="email"
              value={resendFromEmail}
              onChange={(e) => setResendFromEmail(e.target.value)}
              placeholder="noreply@pengeplan.no"
            />
            <p className="text-xs text-gray-600 mt-1">
              Må være verifisert domene i Resend
            </p>
          </div>
        </div>
      )}

      {/* SendGrid Configuration */}
      {provider === 'sendgrid' && (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold flex items-center gap-2">
            📧 SendGrid Konfiguration
            <a href="https://sendgrid.com" target="_blank" className="text-blue-600 text-sm">
              (Opprett konto)
            </a>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>API Key *</Label>
              <Input
                type="password"
                value={sendgridApiKey}
                onChange={(e) => setSendgridApiKey(e.target.value)}
                placeholder="SG...."
              />
            </div>
            <div>
              <Label>Fra Navn</Label>
              <Input
                value={sendgridFromName}
                onChange={(e) => setSendgridFromName(e.target.value)}
                placeholder="Pengeplan"
              />
            </div>
          </div>
          <div>
            <Label>Fra E-post *</Label>
            <Input
              type="email"
              value={sendgridFromEmail}
              onChange={(e) => setSendgridFromEmail(e.target.value)}
              placeholder="noreply@pengeplan.no"
            />
          </div>
        </div>
      )}

      {/* SMTP Configuration */}
      {provider === 'smtp' && (
        <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
          <h3 className="font-semibold">⚙️ SMTP Konfiguration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>SMTP Server *</Label>
              <Input
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label>Port *</Label>
              <Input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                placeholder="587"
              />
            </div>
            <div>
              <Label>Brukernavn *</Label>
              <Input
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
                placeholder="din@gmail.com"
              />
            </div>
            <div>
              <Label>Passord *</Label>
              <Input
                type="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                placeholder="App-passord for Gmail"
              />
            </div>
            <div>
              <Label>Fra E-post *</Label>
              <Input
                type="email"
                value={smtpFromEmail}
                onChange={(e) => setSmtpFromEmail(e.target.value)}
                placeholder="noreply@pengeplan.no"
              />
            </div>
            <div>
              <Label>Fra Navn</Label>
              <Input
                value={smtpFromName}
                onChange={(e) => setSmtpFromName(e.target.value)}
                placeholder="Pengeplan"
              />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Gmail:</strong> Du trenger et "App-passord" - ikke ditt vanlige passord.
              Gå til Google Account → Security → 2-Step Verification → App passwords
            </p>
          </div>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div className={`p-4 rounded-lg ${
          testResult.success 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {testResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span className="font-medium">
              {testResult.success ? 'Test vellykket!' : 'Test feilet'}
            </span>
          </div>
          <p className="text-sm mt-1">{testResult.message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <Button onClick={saveConfig} disabled={isLoading}>
          <Settings className="h-4 w-4 mr-2" />
          Lagre Konfiguration
        </Button>
        <Button variant="outline" onClick={testConnection} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Test Tilkobling
        </Button>
      </div>

      {/* Quick Setup Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">🚀 Resend Setup</h4>
          <ol className="text-xs space-y-1 text-gray-600">
            <li>1. Gå til resend.com</li>
            <li>2. Opprett konto (gratis)</li>
            <li>3. Verifiser domenet ditt</li>
            <li>4. Opprett API key</li>
            <li>5. Lim inn her ⬆️</li>
          </ol>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">📧 SendGrid Setup</h4>
          <ol className="text-xs space-y-1 text-gray-600">
            <li>1. Gå til sendgrid.com</li>
            <li>2. Opprett konto</li>
            <li>3. Verifiser sender identity</li>
            <li>4. Opprett API key</li>
            <li>5. Lim inn her ⬆️</li>
          </ol>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">⚙️ Gmail SMTP</h4>
          <ol className="text-xs space-y-1 text-gray-600">
            <li>1. Aktiver 2FA på Gmail</li>
            <li>2. Gå til App passwords</li>
            <li>3. Opprett "Mail" app password</li>
            <li>4. Bruk app-passordet her</li>
            <li>5. Server: smtp.gmail.com:587</li>
          </ol>
        </div>
      </div>

      {/* Email Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">📊 Email Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Totalt sendt</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">98.7%</div>
              <div className="text-sm text-gray-600">Leveringsrate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">47</div>
              <div className="text-sm text-gray-600">Denne måneden</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Feilede</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">⚙️ Email Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Send admin notifikasjoner for nye brukere</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Send velkommen email etter verifisering</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Logg alle email aktiviteter</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Send påminnelser om email verifisering</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

