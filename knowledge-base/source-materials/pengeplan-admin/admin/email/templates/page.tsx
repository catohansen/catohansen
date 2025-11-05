'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Send,
  Copy,
  Save
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'welcome'
  })

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      // Mock data for now
      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Velkommen til Pengeplan',
          subject: 'Velkommen til Pengeplan 2.0! 🎉',
          content: 'Hei {{name}}!\n\nVelkommen til Pengeplan 2.0 - din personlige økonomiske assistent!\n\nVi er glade for at du er med oss på reisen mot bedre økonomi.\n\nMed vennlig hilsen,\nPengeplan-teamet',
          type: 'welcome',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Venteliste Invitasjon',
          subject: 'Din invitasjon til Pengeplan 2.0 er klar! 🚀',
          content: 'Hei {{name}}!\n\nGode nyheter! Din plass på ventelisten er nå tilgjengelig.\n\nKlikk på lenken nedenfor for å starte din gratis prøveperiode:\n{{inviteLink}}\n\nMed vennlig hilsen,\nPengeplan-teamet',
          type: 'invitation',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setTemplates(mockTemplates)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        name: formData.name,
        subject: formData.subject,
        content: formData.content,
        type: formData.type,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setTemplates([...templates, newTemplate])
      setShowCreateForm(false)
      setFormData({ name: '', subject: '', content: '', type: 'welcome' })
    } catch (error) {
      console.error('Error creating template:', error)
    }
  }

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return
    
    try {
      const updatedTemplates = templates.map(template =>
        template.id === editingTemplate.id
          ? { ...template, ...formData, updatedAt: new Date().toISOString() }
          : template
      )
      
      setTemplates(updatedTemplates)
      setEditingTemplate(null)
      setFormData({ name: '', subject: '', content: '', type: 'welcome' })
    } catch (error) {
      console.error('Error updating template:', error)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne malen?')) {
      setTemplates(templates.filter(template => template.id !== id))
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'welcome':
        return <Badge variant="default" className="bg-green-100 text-green-800">Velkommen</Badge>
      case 'invitation':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Invitasjon</Badge>
      case 'reminder':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Påminnelse</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Laster e-post maler...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">E-post Maler</h1>
        <p className="text-gray-600">Administrer e-post maler for nyhetsbrev og kommunikasjon</p>
      </div>

      {/* Create Template Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Opprett Ny Mal
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingTemplate) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingTemplate ? 'Rediger Mal' : 'Opprett Ny Mal'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Mal Navn</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="F.eks. Velkommen til Pengeplan"
              />
            </div>
            
            <div>
              <Label htmlFor="subject">E-post Emne</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="F.eks. Velkommen til Pengeplan 2.0! 🎉"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Mal Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="welcome">Velkommen</option>
                <option value="invitation">Invitasjon</option>
                <option value="reminder">Påminnelse</option>
                <option value="newsletter">Nyhetsbrev</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="content">E-post Innhold</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Skriv e-post innholdet her..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500 mt-1">
                Bruk {'{{name}}'} for å inkludere brukernavn, {'{{inviteLink}}'} for invitasjonslenke, etc.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                className="bg-gradient-to-r from-violet-600 to-purple-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingTemplate ? 'Oppdater Mal' : 'Opprett Mal'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingTemplate(null)
                  setFormData({ name: '', subject: '', content: '', type: 'welcome' })
                }}
              >
                Avbryt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates List */}
      <div className="grid gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    {getTypeBadge(template.type)}
                    {template.isActive && (
                      <Badge variant="outline" className="text-green-600">Aktiv</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Emne:</strong> {template.subject}
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {template.content.substring(0, 200)}
                      {template.content.length > 200 && '...'}
                    </pre>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Opprettet: {new Date(template.createdAt).toLocaleDateString('nb-NO')}</span>
                    <span>Sist oppdatert: {new Date(template.updatedAt).toLocaleDateString('nb-NO')}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Forhåndsvis
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setEditingTemplate(template)
                      setFormData({
                        name: template.name,
                        subject: template.subject,
                        content: template.content,
                        type: template.type
                      })
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Rediger
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    Kopier
                  </Button>
                  <Button size="sm" variant="outline">
                    <Send className="h-4 w-4 mr-1" />
                    Send Test
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

