'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  ArrowLeft, 
  TestTube, 
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface PromptForm {
  name: string
  description: string
  category: string
  prompt_text: string
  rules: any
}

export default function NewPrompt() {
  const router = useRouter()
  const [form, setForm] = useState<PromptForm>({
    name: '',
    description: '',
    category: 'system',
    prompt_text: '',
    rules: {}
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)

  const categories = [
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/prompts/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        setSuccess('Prompt created successfully!')
        setTimeout(() => {
          router.push('/admin/prompts')
        }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create prompt')
      }
    } catch (error) {
      console.error('Error creating prompt:', error)
      setError('Failed to create prompt')
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/prompts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_text: form.prompt_text,
          test_data: {
            navn: 'Test Bruker',
            situasjon: 'Test situasjon',
            okonomi: 'Test økonomi'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        setTestResult(result)
      } else {
        setError('Failed to test prompt')
      }
    } catch (error) {
      console.error('Error testing prompt:', error)
      setError('Failed to test prompt')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🆕 Opprett Ny Prompt
              </h1>
              <p className="text-gray-600">
                Lag en ny AI-prompt for Pengeplan 2.0 systemet
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Prompt Detaljer
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt Navn *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="nav-soknad-generator"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskrivelse
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Kort beskrivelse av promptens funksjon"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prompt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt Tekst *
                </label>
                <textarea
                  value={form.prompt_text}
                  onChange={(e) => setForm({ ...form, prompt_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  rows={12}
                  placeholder="Skriv prompt-teksten her. Bruk {{variabel}} for dynamiske verdier."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bruk {'{{variabel}}'} for dynamiske verdier som {'{{navn}}'}, {'{{situasjon}}'}, etc.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Lagrer...' : 'Lagre Prompt'}
                </button>

                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing || !form.prompt_text}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <TestTube className="h-4 w-4" />
                  {testing ? 'Tester...' : 'Test Prompt'}
                </button>
              </div>
            </form>
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Test Resultat
            </h2>

            {testResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Test Fullført</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Response time: {testResult.responseTime}ms
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Fylt Prompt:</h3>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm font-mono">
                    {testResult.prompt}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">AI Response:</h3>
                  <div className="p-3 bg-blue-50 rounded-lg text-sm">
                    {testResult.response}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Klikk "Test Prompt" for å se hvordan AI-en vil svare
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

