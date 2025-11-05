'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, Trash2, RefreshCw } from 'lucide-react'

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/reporting/recipients')
      if (response.ok) {
        const data = await response.json()
        setRecipients(data.recipients || [])
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch recipients')
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching recipients:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipients()
  }, [])

  const addRecipient = async () => {
    setError(null)
    if (!email) {
      setError('Email cannot be empty.')
      return
    }
    try {
      const response = await fetch('/api/admin/reporting/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add recipient')
      }
      setEmail('')
      setName('')
      fetchRecipients()
    } catch (err: any) {
      setError(err.message)
      console.error('Error adding recipient:', err)
    }
  }

  const deleteRecipient = async (emailToDelete: string) => {
    setError(null)
    try {
      const response = await fetch('/api/admin/reporting/recipients', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToDelete })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove recipient')
      }
      fetchRecipients()
    } catch (err: any) {
      setError(err.message)
      console.error('Error removing recipient:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-600">Laster mottakere...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📧 Rapportmottakere</h1>
          <p className="text-gray-600">Administrer hvem som mottar automatiserte systemrapporter.</p>
        </div>
        <Button onClick={fetchRecipients} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Feil:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Legg til ny mottaker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Navn</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Navn (valgfritt)"
              />
            </div>
            <div>
              <Label htmlFor="email">E-post</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="epost@domene.no"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addRecipient} 
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Legg til
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Aktive mottakere ({recipients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {recipients.length === 0 ? (
            <p className="text-gray-500">Ingen aktive mottakere.</p>
          ) : (
            <ul className="space-y-3">
              {recipients.map((recipient: any) => (
                <li 
                  key={recipient.email} 
                  className="flex justify-between items-center border rounded-lg p-3 bg-white shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {recipient.name || 'Uten navn'}
                    </p>
                    <p className="text-sm text-gray-600">{recipient.email}</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteRecipient(recipient.email)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



